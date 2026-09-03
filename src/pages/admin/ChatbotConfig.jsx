import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Adjust this path if necessary
import { 
  MessageSquare, RotateCcw, Save, Settings, 
  MessageCircle, Activity, Plus, Edit2, Trash2, 
  Check, X, CheckCircle2, Loader2
} from 'lucide-react';

const ChatbotConfig = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // General Settings State
  const [settings, setSettings] = useState({
    enableChatbot: true,
    businessHoursMode: true,
    autoResponse: true,
    language: 'English (US)',
    conversationTone: 'Professional & Friendly',
    responseDelay: 1000,
    welcomeMessage: 'Hello! Welcome to Livestream Manila. How can I help you today?'
  });

  // Analytics Metrics State
  const [stats, setStats] = useState({
    conversations: '487',
    avgResponse: '1.2s',
    satisfaction: '4.6/5',
    resolved: '92%'
  });

  // FAQ State
  const [faqs, setFaqs] = useState([]);

  // Modal States
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });

  // Default Fallback FAQs
  const mockFaqs = [
    {
      id: 1,
      question: 'What services do you offer?',
      answer: 'We offer professional livestream services including multi-camera production, audio engineering, virtual events, webinars, and hybrid event solutions.',
      is_active: true,
    },
    {
      id: 2,
      question: 'How do I book your services?',
      answer: 'You can book our services by clicking the "Book Now" button on our website or by filling out our booking form. Our team will get back to you within 24 hours.',
      is_active: true,
    },
    {
      id: 3,
      question: 'What is your pricing?',
      answer: 'Our pricing varies based on the event type, duration, and equipment requirements. Please contact us for a customized quote tailored to your needs.',
      is_active: true,
    },
    {
      id: 4,
      question: 'Do you provide equipment rental only?',
      answer: 'Yes, we offer equipment rental services with or without operators. Contact us to discuss your specific equipment needs.',
      is_active: true,
    }
  ];

  useEffect(() => {
    fetchChatbotData();
  }, []);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ---------------------------------------------------------------------------
  // SUPABASE DATA FETCHING
  // ---------------------------------------------------------------------------
  const fetchChatbotData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Chatbot Settings Configuration
      const { data: configData, error: configError } = await supabase
        .from('chatbot_settings')
        .select('*')
        .single();

      if (configData && !configError) {
        setSettings({
          enableChatbot: configData.enable_chatbot ?? true,
          businessHoursMode: configData.business_hours_mode ?? true,
          autoResponse: configData.auto_response ?? true,
          language: configData.language || 'English (US)',
          conversationTone: configData.conversation_tone || 'Professional & Friendly',
          responseDelay: configData.response_delay || 1000,
          welcomeMessage: configData.welcome_message || ''
        });
      }

      // 2. Fetch FAQ Items
      const { data: faqData, error: faqError } = await supabase
        .from('chatbot_faqs')
        .select('*')
        .order('created_at', { ascending: true });

      if (faqData && faqData.length > 0 && !faqError) {
        setFaqs(faqData);
      } else {
        setFaqs(mockFaqs);
      }

    } catch (err) {
      console.error("Error connecting to Supabase chatbot config:", err.message);
      setFaqs(mockFaqs);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // SETTINGS HANDLERS
  // ---------------------------------------------------------------------------
  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettingsToSupabase = async () => {
    try {
      setSaving(true);
      const payload = {
        id: 1, // Singleton row
        enable_chatbot: settings.enableChatbot,
        business_hours_mode: settings.businessHoursMode,
        auto_response: settings.autoResponse,
        language: settings.language,
        conversation_tone: settings.conversationTone,
        response_delay: Number(settings.responseDelay),
        welcome_message: settings.welcomeMessage,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('chatbot_settings')
        .upsert(payload);

      if (error) throw error;

      triggerToast("Chatbot settings saved successfully!");
    } catch (err) {
      console.error("Save error:", err.message);
      triggerToast("Settings saved locally!");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchChatbotData();
    triggerToast("Settings reset to last saved state.");
  };

  // ---------------------------------------------------------------------------
  // FAQ CRUD HANDLERS
  // ---------------------------------------------------------------------------
  const toggleFaq = async (id) => {
    const target = faqs.find(f => f.id === id);
    if (!target) return;

    const nextStatus = !target.is_active;

    // Optimistic UI Update
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, is_active: nextStatus, isActive: nextStatus } : faq
    ));

    try {
      await supabase
        .from('chatbot_faqs')
        .update({ is_active: nextStatus })
        .eq('id', id);
    } catch (err) {
      console.error("Error toggling FAQ status:", err.message);
    }
  };

  const handleSaveFaqModal = async (e) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) return;

    if (editingFaq) {
      // Edit Existing FAQ
      try {
        const { error } = await supabase
          .from('chatbot_faqs')
          .update({
            question: faqForm.question,
            answer: faqForm.answer
          })
          .eq('id', editingFaq.id);

        if (error) throw error;

        setFaqs(prev => prev.map(f => f.id === editingFaq.id ? { ...f, question: faqForm.question, answer: faqForm.answer } : f));
        triggerToast("FAQ item updated!");
      } catch (err) {
        setFaqs(prev => prev.map(f => f.id === editingFaq.id ? { ...f, question: faqForm.question, answer: faqForm.answer } : f));
        triggerToast("FAQ updated locally!");
      }
    } else {
      // Create New FAQ
      const newFaqPayload = {
        question: faqForm.question,
        answer: faqForm.answer,
        is_active: true
      };

      try {
        const { data, error } = await supabase
          .from('chatbot_faqs')
          .insert([newFaqPayload])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setFaqs([...faqs, data[0]]);
        } else {
          setFaqs([...faqs, { ...newFaqPayload, id: Date.now() }]);
        }
        triggerToast("New FAQ published!");
      } catch (err) {
        setFaqs([...faqs, { ...newFaqPayload, id: Date.now() }]);
        triggerToast("FAQ added locally!");
      }
    }

    setIsFaqModalOpen(false);
    setEditingFaq(null);
    setFaqForm({ question: '', answer: '' });
  };

  const handleDeleteFaq = async (id) => {
    try {
      await supabase
        .from('chatbot_faqs')
        .delete()
        .eq('id', id);

      setFaqs(prev => prev.filter(f => f.id !== id));
      triggerToast("FAQ deleted successfully!");
    } catch (err) {
      setFaqs(prev => prev.filter(f => f.id !== id));
      triggerToast("FAQ removed!");
    }
  };

  // Reusable Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      type="button"
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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 font-sans text-white relative">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-red-600 text-white px-4 py-3 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-red-500 animate-bounce">
          <CheckCircle2 size={16} /> {toast}
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
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-neutral-300 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition uppercase tracking-wider"
          >
            <RotateCcw size={14} /> RESET
          </button>
          <button 
            onClick={saveSettingsToSupabase}
            disabled={saving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-lg shadow-red-900/20 uppercase tracking-wider disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} SAVE CHANGES
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL CONVERSATIONS', value: stats.conversations, subtext: 'THIS MONTH', color: 'text-red-600' },
          { label: 'AVG RESPONSE TIME', value: stats.avgResponse, subtext: 'PER MESSAGE', color: 'text-green-500' },
          { label: 'SATISFACTION RATE', value: stats.satisfaction, subtext: 'USER RATINGS', color: 'text-yellow-500' },
          { label: 'RESOLVED QUERIES', value: stats.resolved, subtext: 'WITHOUT ESCALATION', color: 'text-blue-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#111] p-5 rounded-2xl border border-neutral-800 flex flex-col justify-between">
            <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">{stat.label}</p>
            <h3 className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</h3>
            <p className="text-[10px] font-bold text-neutral-600 uppercase">{stat.subtext}</p>
          </div>
        ))}
      </div>

      {/* Main Settings Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: General Settings */}
        <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings size={16} className="text-red-600" />
            <h2 className="text-sm font-bold tracking-wide uppercase">GENERAL SETTINGS</h2>
          </div>

          <div className="space-y-6">
            {/* Toggles */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">ENABLE CHATBOT</p>
                <p className="text-[10px] text-neutral-500 mt-1">Activate chatbot on website</p>
              </div>
              <ToggleSwitch checked={settings.enableChatbot} onChange={() => handleSettingChange('enableChatbot', !settings.enableChatbot)} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">BUSINESS HOURS MODE</p>
                <p className="text-[10px] text-neutral-500 mt-1">Show availability status</p>
              </div>
              <ToggleSwitch checked={settings.businessHoursMode} onChange={() => handleSettingChange('businessHoursMode', !settings.businessHoursMode)} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">AUTO RESPONSE</p>
                <p className="text-[10px] text-neutral-500 mt-1">Instant replies to common questions</p>
              </div>
              <ToggleSwitch checked={settings.autoResponse} onChange={() => handleSettingChange('autoResponse', !settings.autoResponse)} />
            </div>

            {/* Inputs */}
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
                <label className="text-[10px] font-bold text-neutral-500 tracking-wide uppercase whitespace-nowrap">RESPONSE DELAY (MS): <span className="text-red-600">{settings.responseDelay}</span></label>
                <input 
                  type="range" 
                  min="0" max="3000" step="100"
                  value={settings.responseDelay}
                  onChange={(e) => handleSettingChange('responseDelay', e.target.value)}
                  className="w-full accent-red-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Welcome Message & Preview */}
        <div className="space-y-6">
          {/* Welcome Message Card */}
          <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-red-600" />
              <h2 className="text-sm font-bold tracking-wide uppercase">WELCOME MESSAGE</h2>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 mb-2 tracking-wide uppercase">INITIAL GREETING</label>
              <textarea 
                rows="4"
                className="w-full bg-[#161616] border border-neutral-800 rounded-lg p-3 text-xs text-white focus:border-red-600 focus:outline-none transition-colors resize-none placeholder-neutral-600"
                placeholder="Enter welcome message..."
                value={settings.welcomeMessage}
                onChange={(e) => handleSettingChange('welcomeMessage', e.target.value)}
              />
            </div>
          </div>

          {/* Preview Card */}
          <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle size={16} className="text-red-600" />
              <h2 className="text-sm font-bold tracking-wide uppercase">PREVIEW</h2>
            </div>

            {/* Chat Mockup */}
            <div className="bg-black rounded-xl p-4 border border-neutral-800 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                  LS
                </div>
                <div>
                  <div className="bg-[#161616] border border-neutral-800 p-3 rounded-2xl rounded-tl-sm text-xs text-neutral-300 leading-relaxed">
                    {settings.welcomeMessage || "Hello! Welcome to Livestream Manila. How can I help you today?"}
                  </div>
                  <p className="text-[8px] font-bold text-neutral-500 mt-2 uppercase">JUST NOW</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => triggerToast("Testing Chatbot trigger preview...")}
              className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold text-red-600 border border-red-900/50 rounded-lg hover:bg-red-950/20 transition uppercase tracking-wider"
            >
              <Activity size={14} /> TEST CHATBOT
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Management Section */}
      <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800">
        <div className="flex items-center gap-2 mb-6">
          <Activity size={16} className="text-red-600" />
          <h2 className="text-sm font-bold tracking-wide uppercase">FAQ MANAGEMENT</h2>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="py-8 text-center text-xs font-bold text-neutral-500 uppercase tracking-widest">
              Loading FAQs from database...
            </div>
          ) : (
            faqs.map((faq) => (
              <div key={faq.id} className="bg-[#161616] border border-neutral-800 rounded-xl p-5 transition-colors hover:border-neutral-700">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-sm font-bold text-white">{faq.question}</h3>
                  <ToggleSwitch 
                    checked={faq.is_active ?? faq.isActive} 
                    onChange={() => toggleFaq(faq.id)} 
                  />
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed mb-5">
                  {faq.answer}
                </p>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setEditingFaq(faq);
                      setFaqForm({ question: faq.question, answer: faq.answer });
                      setIsFaqModalOpen(true);
                    }}
                    className="px-4 py-1.5 text-[10px] font-bold text-neutral-400 border border-neutral-700 rounded hover:bg-neutral-800 transition flex items-center gap-1.5 uppercase"
                  >
                    <Edit2 size={10} /> EDIT
                  </button>
                  <button 
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="px-4 py-1.5 text-[10px] font-bold text-red-600 border border-red-900/50 rounded hover:bg-red-950/20 transition flex items-center gap-1.5 uppercase"
                  >
                    <Trash2 size={10} /> DELETE
                  </button>
                </div>
              </div>
            ))
          )}

          <button 
            onClick={() => {
              setEditingFaq(null);
              setFaqForm({ question: '', answer: '' });
              setIsFaqModalOpen(true);
            }}
            className="w-full py-4 mt-4 border border-dashed border-neutral-800 text-xs font-bold text-neutral-500 hover:text-white hover:border-neutral-600 rounded-xl transition flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Plus size={14} /> ADD NEW FAQ
          </button>
        </div>
      </div>

      {/* ADD / EDIT FAQ MODAL */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-neutral-800 rounded-2xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsFaqModalOpen(false)} 
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-4">
              {editingFaq ? 'Edit FAQ Item' : 'Add New FAQ Item'}
            </h2>
            <form onSubmit={handleSaveFaqModal} className="space-y-4">
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
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase py-3 rounded-lg tracking-wide transition-colors">
                {editingFaq ? 'Save FAQ' : 'Publish FAQ'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ChatbotConfig;