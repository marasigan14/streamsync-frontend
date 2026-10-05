import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient'; // Adjust this path if necessary
import {
  MessageSquare, RotateCcw, Save, Settings,
  MessageCircle, Activity, Plus, Edit2, Trash2,
  X, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';

// Adjust to match your FastAPI base URL and router prefix.
const CHATBOT_ENDPOINT = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}/chatbot`;
const SETTINGS_ID = 1;

const DEFAULT_SETTINGS = {
  enableChatbot: true,
  businessHoursMode: true,
  autoResponse: true,
  language: 'English (US)',
  conversationTone: 'Professional & Friendly',
  responseDelay: 1000,
  welcomeMessage: 'Hello! Welcome to Livestream Manila. How can I help you today?',
};

const EMPTY_FAQ_FORM = { question: '', answer: '' };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const settingsFromRow = (row) => ({
  enableChatbot: row.enable_chatbot ?? DEFAULT_SETTINGS.enableChatbot,
  businessHoursMode: row.business_hours_mode ?? DEFAULT_SETTINGS.businessHoursMode,
  autoResponse: row.auto_response ?? DEFAULT_SETTINGS.autoResponse,
  language: row.language ?? DEFAULT_SETTINGS.language,
  conversationTone: row.conversation_tone ?? DEFAULT_SETTINGS.conversationTone,
  responseDelay: row.response_delay ?? DEFAULT_SETTINGS.responseDelay,
  welcomeMessage: row.welcome_message ?? DEFAULT_SETTINGS.welcomeMessage,
});

const settingsToRow = (s) => ({
  id: SETTINGS_ID,
  enable_chatbot: s.enableChatbot,
  business_hours_mode: s.businessHoursMode,
  auto_response: s.autoResponse,
  language: s.language,
  conversation_tone: s.conversationTone,
  response_delay: Number(s.responseDelay),
  welcome_message: s.welcomeMessage,
  updated_at: new Date().toISOString(),
});

const formatResponseTime = (ms) =>
  ms == null ? '—' : `${(Number(ms) / 1000).toFixed(1)}s`;

// Defined outside the page component so it isn't re-created on every render.
const ToggleSwitch = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
      checked ? 'bg-red-600' : 'bg-neutral-800'
    }`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
        checked ? 'translate-x-4' : 'translate-x-1'
      }`}
    />
  </button>
);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const ChatbotConfig = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [savedSettings, setSavedSettings] = useState(DEFAULT_SETTINGS);
  const [stats, setStats] = useState({ conversations: null, avgResponseMs: null });
  const [faqs, setFaqs] = useState([]);

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState(EMPTY_FAQ_FORM);

  const [testing, setTesting] = useState(false);
  const [testExchange, setTestExchange] = useState(null); // { question, reply }

  const isDirty = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // -------------------------------------------------------------------------
  // Load everything from Supabase
  // -------------------------------------------------------------------------
  const fetchChatbotData = useCallback(async () => {
    setLoading(true);

    const [settingsRes, faqsRes, statsRes] = await Promise.all([
      supabase.from('chatbot_settings').select('*').eq('id', SETTINGS_ID).maybeSingle(),
      supabase.from('chatbot_faqs').select('*').order('created_at', { ascending: true }),
      supabase.rpc('chatbot_monthly_stats'),
    ]);

    if (settingsRes.error) {
      showToast(`Could not load settings: ${settingsRes.error.message}`, 'error');
    } else if (settingsRes.data) {
      const loaded = settingsFromRow(settingsRes.data);
      setSettings(loaded);
      setSavedSettings(loaded);
    }

    if (faqsRes.error) {
      showToast(`Could not load FAQs: ${faqsRes.error.message}`, 'error');
    } else {
      setFaqs(faqsRes.data ?? []);
    }

    if (!statsRes.error && statsRes.data?.[0]) {
      setStats({
        conversations: statsRes.data[0].conversations,
        avgResponseMs: statsRes.data[0].avg_response_ms,
      });
    }

    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    fetchChatbotData();
  }, [fetchChatbotData]);

  // -------------------------------------------------------------------------
  // Settings
  // -------------------------------------------------------------------------
  const handleSettingChange = (key, value) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('chatbot_settings').upsert(settingsToRow(settings));
    setSaving(false);

    if (error) {
      showToast(`Could not save settings: ${error.message}`, 'error');
      return;
    }
    setSavedSettings(settings);
    showToast('Chatbot settings saved.');
  };

  const handleReset = () => {
    setSettings(savedSettings);
    showToast('Changes discarded.');
  };

  // -------------------------------------------------------------------------
  // FAQs
  // -------------------------------------------------------------------------
  const openFaqModal = (faq = null) => {
    setEditingFaq(faq);
    setFaqForm(faq ? { question: faq.question, answer: faq.answer } : EMPTY_FAQ_FORM);
    setIsFaqModalOpen(true);
  };

  const closeFaqModal = () => {
    setIsFaqModalOpen(false);
    setEditingFaq(null);
    setFaqForm(EMPTY_FAQ_FORM);
  };

  const toggleFaq = async (faq) => {
    const nextStatus = !faq.is_active;
    const applyStatus = (status) =>
      setFaqs((prev) => prev.map((f) => (f.id === faq.id ? { ...f, is_active: status } : f)));

    applyStatus(nextStatus); // optimistic

    const { error } = await supabase
      .from('chatbot_faqs')
      .update({ is_active: nextStatus })
      .eq('id', faq.id);

    if (error) {
      applyStatus(faq.is_active); // roll back
      showToast(`Could not update FAQ: ${error.message}`, 'error');
    }
  };

  const handleSaveFaq = async (e) => {
    e.preventDefault();
    const question = faqForm.question.trim();
    const answer = faqForm.answer.trim();
    if (!question || !answer) return;

    if (editingFaq) {
      const { error } = await supabase
        .from('chatbot_faqs')
        .update({ question, answer })
        .eq('id', editingFaq.id);

      if (error) return showToast(`Could not update FAQ: ${error.message}`, 'error');

      setFaqs((prev) => prev.map((f) => (f.id === editingFaq.id ? { ...f, question, answer } : f)));
      showToast('FAQ updated.');
    } else {
      const { data, error } = await supabase
        .from('chatbot_faqs')
        .insert({ question, answer, is_active: true })
        .select()
        .single();

      if (error) return showToast(`Could not add FAQ: ${error.message}`, 'error');

      setFaqs((prev) => [...prev, data]);
      showToast('FAQ published.');
    }

    closeFaqModal();
  };

  const handleDeleteFaq = async (faq) => {
    if (!window.confirm(`Delete "${faq.question}"?`)) return;

    const { error } = await supabase.from('chatbot_faqs').delete().eq('id', faq.id);
    if (error) return showToast(`Could not delete FAQ: ${error.message}`, 'error');

    setFaqs((prev) => prev.filter((f) => f.id !== faq.id));
    showToast('FAQ deleted.');
  };

  // -------------------------------------------------------------------------
  // Test the live chatbot with the saved settings
  // -------------------------------------------------------------------------
  const handleTestChatbot = async () => {
    const question = 'What services do you offer?';
    setTesting(true);
    try {
      const res = await fetch(CHATBOT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question }),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const { reply } = await res.json();
      setTestExchange({ question, reply });
    } catch (err) {
      showToast(`Chatbot test failed: ${err.message}`, 'error');
    } finally {
      setTesting(false);
    }
  };

  // -------------------------------------------------------------------------
  // Stat cards. Satisfaction and resolved rate have no data source yet.
  // -------------------------------------------------------------------------
  const statCards = [
    {
      label: 'TOTAL CONVERSATIONS',
      value: stats.conversations ?? '—',
      subtext: 'THIS MONTH',
      color: 'text-red-600',
    },
    {
      label: 'AVG RESPONSE TIME',
      value: formatResponseTime(stats.avgResponseMs),
      subtext: 'PER MESSAGE',
      color: 'text-green-500',
    },
    {
      label: 'SATISFACTION RATE',
      value: '—',
      subtext: 'NOT TRACKED YET',
      color: 'text-yellow-500',
    },
    {
      label: 'RESOLVED QUERIES',
      value: '—',
      subtext: 'NOT TRACKED YET',
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 font-sans text-white relative">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 border ${
            toast.type === 'error'
              ? 'bg-neutral-900 text-red-400 border-red-600'
              : 'bg-red-600 text-white border-red-500'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111] p-6 rounded-2xl border border-neutral-800">
        <div className="flex items-center gap-3">
          <MessageSquare size={24} className="text-red-600" />
          <h1 className="text-xl font-bold tracking-wide uppercase">CHATBOT CONFIGURATION</h1>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleReset}
            disabled={!isDirty || saving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-neutral-300 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw size={14} /> RESET
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-lg shadow-red-900/20 uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} SAVE CHANGES
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-[#111] p-5 rounded-2xl border border-neutral-800 flex flex-col justify-between">
            <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">{stat.label}</p>
            <h3 className={`text-3xl font-black ${stat.color} mb-1`}>{loading ? '…' : stat.value}</h3>
            <p className="text-[10px] font-bold text-neutral-600 uppercase">{stat.subtext}</p>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* General settings */}
        <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings size={16} className="text-red-600" />
            <h2 className="text-sm font-bold tracking-wide uppercase">GENERAL SETTINGS</h2>
          </div>

          <div className="space-y-6">
            {[
              { key: 'enableChatbot', label: 'ENABLE CHATBOT', hint: 'Activate chatbot on website' },
              { key: 'businessHoursMode', label: 'BUSINESS HOURS MODE', hint: 'Show availability status' },
              { key: 'autoResponse', label: 'AUTO RESPONSE', hint: 'Instant replies to common questions' },
            ].map(({ key, label, hint }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">{label}</p>
                  <p className="text-[10px] text-neutral-500 mt-1">{hint}</p>
                </div>
                <ToggleSwitch
                  checked={settings[key]}
                  onChange={() => handleSettingChange(key, !settings[key])}
                />
              </div>
            ))}

            <div className="space-y-4 pt-4 border-t border-neutral-800">
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 mb-2 tracking-wide uppercase">LANGUAGE</label>
                <select
                  className="w-full bg-[#161616] border border-neutral-800 rounded-lg p-3 text-xs text-white focus:border-red-600 focus:outline-none transition-colors"
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                >
                  <option>English (US)</option>
                  <option>Tagalog</option>
                  <option>English & Tagalog</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-500 mb-2 tracking-wide uppercase">CONVERSATION TONE</label>
                <select
                  className="w-full bg-[#161616] border border-neutral-800 rounded-lg p-3 text-xs text-white focus:border-red-600 focus:outline-none transition-colors"
                  value={settings.conversationTone}
                  onChange={(e) => handleSettingChange('conversationTone', e.target.value)}
                >
                  <option>Professional & Friendly</option>
                  <option>Casual</option>
                  <option>Formal</option>
                </select>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="text-[10px] font-bold text-neutral-500 tracking-wide uppercase whitespace-nowrap">
                  RESPONSE DELAY (MS): <span className="text-red-600">{settings.responseDelay}</span>
                </label>
                <input
                  type="range"
                  min="0" max="3000" step="100"
                  value={settings.responseDelay}
                  onChange={(e) => handleSettingChange('responseDelay', Number(e.target.value))}
                  className="w-full accent-red-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Welcome message + preview */}
        <div className="space-y-6">
          <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-red-600" />
              <h2 className="text-sm font-bold tracking-wide uppercase">WELCOME MESSAGE</h2>
            </div>
            <label className="block text-[10px] font-bold text-neutral-500 mb-2 tracking-wide uppercase">INITIAL GREETING</label>
            <textarea
              rows="4"
              className="w-full bg-[#161616] border border-neutral-800 rounded-lg p-3 text-xs text-white focus:border-red-600 focus:outline-none transition-colors resize-none placeholder-neutral-600"
              placeholder="Enter welcome message..."
              value={settings.welcomeMessage}
              onChange={(e) => handleSettingChange('welcomeMessage', e.target.value)}
            />
          </div>

          <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle size={16} className="text-red-600" />
              <h2 className="text-sm font-bold tracking-wide uppercase">PREVIEW</h2>
            </div>

            <div className="bg-black rounded-xl p-4 border border-neutral-800 mb-6 space-y-4">
              <ChatBubble from="bot" label="JUST NOW">
                {settings.welcomeMessage || 'Your welcome message will appear here.'}
              </ChatBubble>
              {testExchange && (
                <>
                  <ChatBubble from="user">{testExchange.question}</ChatBubble>
                  <ChatBubble from="bot">{testExchange.reply}</ChatBubble>
                </>
              )}
            </div>

            <button
              onClick={handleTestChatbot}
              disabled={testing}
              className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold text-red-600 border border-red-900/50 rounded-lg hover:bg-red-950/20 transition uppercase tracking-wider disabled:opacity-50"
            >
              {testing ? <Loader2 size={14} className="animate-spin" /> : <Activity size={14} />} TEST CHATBOT
            </button>
            {isDirty && (
              <p className="text-[10px] text-neutral-500 mt-2 text-center">
                The test uses saved settings. Save your changes first.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* FAQ management */}
      <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800">
        <div className="flex items-center gap-2 mb-6">
          <Activity size={16} className="text-red-600" />
          <h2 className="text-sm font-bold tracking-wide uppercase">FAQ MANAGEMENT</h2>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="py-8 text-center text-xs font-bold text-neutral-500 uppercase tracking-widest">
              Loading FAQs...
            </div>
          ) : faqs.length === 0 ? (
            <div className="py-8 text-center text-xs font-bold text-neutral-500 uppercase tracking-widest">
              No FAQs yet. Add one so the chatbot has answers to work from.
            </div>
          ) : (
            faqs.map((faq) => (
              <div key={faq.id} className="bg-[#161616] border border-neutral-800 rounded-xl p-5 transition-colors hover:border-neutral-700">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-sm font-bold text-white">{faq.question}</h3>
                  <ToggleSwitch checked={faq.is_active} onChange={() => toggleFaq(faq)} />
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed mb-5">{faq.answer}</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openFaqModal(faq)}
                    className="px-4 py-1.5 text-[10px] font-bold text-neutral-400 border border-neutral-700 rounded hover:bg-neutral-800 transition flex items-center gap-1.5 uppercase"
                  >
                    <Edit2 size={10} /> EDIT
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq)}
                    className="px-4 py-1.5 text-[10px] font-bold text-red-600 border border-red-900/50 rounded hover:bg-red-950/20 transition flex items-center gap-1.5 uppercase"
                  >
                    <Trash2 size={10} /> DELETE
                  </button>
                </div>
              </div>
            ))
          )}

          <button
            onClick={() => openFaqModal()}
            className="w-full py-4 mt-4 border border-dashed border-neutral-800 text-xs font-bold text-neutral-500 hover:text-white hover:border-neutral-600 rounded-xl transition flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Plus size={14} /> ADD NEW FAQ
          </button>
        </div>
      </div>

      {/* Add / edit FAQ modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-neutral-800 rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={closeFaqModal}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-4">
              {editingFaq ? 'Edit FAQ Item' : 'Add New FAQ Item'}
            </h2>
            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Question</label>
                <input
                  required
                  type="text"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="e.g. Do you support 4K streaming?"
                  className="w-full bg-[#161616] border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Answer</label>
                <textarea
                  required
                  rows="4"
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Provide detailed answer..."
                  className="w-full bg-[#161616] border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase py-3 rounded-lg tracking-wide transition-colors"
              >
                {editingFaq ? 'Save FAQ' : 'Publish FAQ'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Small presentational helper for the preview card.
const ChatBubble = ({ from, label, children }) =>
  from === 'user' ? (
    <div className="flex justify-end">
      <div className="bg-red-600 p-3 rounded-2xl rounded-tr-sm text-xs text-white leading-relaxed max-w-[80%]">
        {children}
      </div>
    </div>
  ) : (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
        LS
      </div>
      <div>
        <div className="bg-[#161616] border border-neutral-800 p-3 rounded-2xl rounded-tl-sm text-xs text-neutral-300 leading-relaxed">
          {children}
        </div>
        {label && <p className="text-[8px] font-bold text-neutral-500 mt-2 uppercase">{label}</p>}
      </div>
    </div>
  );

export default ChatbotConfig;
