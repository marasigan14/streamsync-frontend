import React, { useState } from 'react';
import { 
  MessageSquare, RotateCcw, Save, Settings, 
  MessageCircle, Activity, Plus, Edit2, Trash2, 
  Check, X
} from 'lucide-react';

const ChatbotConfig = () => {
  // General Settings State
  const [settings, setSettings] = useState({
    enableChatbot: true,
    businessHoursMode: true,
    autoResponse: true,
    language: 'English (US)',
    conversationTone: 'Professional & Friendly',
    responseDelay: 1000,
    welcomeMessage: ''
  });

  // FAQ State
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: 'What services do you offer?',
      answer: 'We offer professional livestream services including multi-camera production, audio engineering, virtual events, webinars, and hybrid event solutions.',
      isActive: true,
    },
    {
      id: 2,
      question: 'How do I book your services?',
      answer: 'You can book our services by clicking the "Book Now" button on our website or by filling out our booking form. Our team will get back to you within 24 hours.',
      isActive: true,
    },
    {
      id: 3,
      question: 'What is your pricing?',
      answer: 'Our pricing varies based on the event type, duration, and equipment requirements. Please contact us for a customized quote tailored to your needs.',
      isActive: true,
    },
    {
      id: 4,
      question: 'Do you provide equipment rental only?',
      answer: 'Yes, we offer equipment rental services with or without operators. Contact us to discuss your specific equipment needs.',
      isActive: true,
    }
  ]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleFaq = (id) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, isActive: !faq.isActive } : faq
    ));
  };

  // Reusable Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
        checked ? 'bg-red-600' : 'bg-neutral-300 dark:bg-neutral-700'
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
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#111] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-900">
        <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
          <MessageSquare size={24} className="text-red-600" />
          <h1 className="text-xl font-bold tracking-wide">CHATBOT CONFIGURATION</h1>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
            <RotateCcw size={14} /> RESET
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-lg shadow-red-900/20">
            <Save size={14} /> SAVE CHANGES
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL CONVERSATIONS', value: '487', subtext: 'THIS MONTH', color: 'text-red-600' },
          { label: 'AVG RESPONSE TIME', value: '1.2s', subtext: 'PER MESSAGE', color: 'text-green-500' },
          { label: 'SATISFACTION RATE', value: '4.6/5', subtext: 'USER RATINGS', color: 'text-yellow-500' },
          { label: 'RESOLVED QUERIES', value: '92%', subtext: 'WITHOUT ESCALATION', color: 'text-blue-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#111] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-900 flex flex-col justify-between">
            <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2">{stat.label}</p>
            <h3 className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</h3>
            <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-600">{stat.subtext}</p>
          </div>
        ))}
      </div>

      {/* Main Settings Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: General Settings */}
        <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-900 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings size={16} className="text-red-600" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white tracking-wide">GENERAL SETTINGS</h2>
          </div>

          <div className="space-y-6">
            {/* Toggles */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-white">ENABLE CHATBOT</p>
                <p className="text-[10px] text-neutral-500 mt-1">Activate chatbot on website</p>
              </div>
              <ToggleSwitch checked={settings.enableChatbot} onChange={() => handleSettingChange('enableChatbot', !settings.enableChatbot)} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-white">BUSINESS HOURS MODE</p>
                <p className="text-[10px] text-neutral-500 mt-1">Show availability status</p>
              </div>
              <ToggleSwitch checked={settings.businessHoursMode} onChange={() => handleSettingChange('businessHoursMode', !settings.businessHoursMode)} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-white">AUTO RESPONSE</p>
                <p className="text-[10px] text-neutral-500 mt-1">Instant replies to common questions</p>
              </div>
              <ToggleSwitch checked={settings.autoResponse} onChange={() => handleSettingChange('autoResponse', !settings.autoResponse)} />
            </div>

            {/* Inputs */}
            <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 mb-2 tracking-wide">LANGUAGE</label>
                <select 
                  className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-xs text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors"
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                >
                  <option>English (US)</option>
                  <option>Tagalog</option>
                  <option>English & Tagalog</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-500 mb-2 tracking-wide">CONVERSATION TONE</label>
                <select 
                  className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-xs text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors"
                  value={settings.conversationTone}
                  onChange={(e) => handleSettingChange('conversationTone', e.target.value)}
                >
                  <option>Professional & Friendly</option>
                  <option>Casual</option>
                  <option>Formal</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-[10px] font-bold text-neutral-500 tracking-wide whitespace-nowrap">RESPONSE DELAY (MS): <span className="text-red-600">{settings.responseDelay}</span></label>
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
          <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-900">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-red-600" />
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white tracking-wide">WELCOME MESSAGE</h2>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 mb-2 tracking-wide">INITIAL GREETING</label>
              <textarea 
                rows="4"
                className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-xs text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors resize-none placeholder-neutral-400 dark:placeholder-neutral-600"
                placeholder="Enter welcome message..."
                value={settings.welcomeMessage}
                onChange={(e) => handleSettingChange('welcomeMessage', e.target.value)}
              />
            </div>
          </div>

          {/* Preview Card */}
          <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-900">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle size={16} className="text-red-600" />
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white tracking-wide">PREVIEW</h2>
            </div>

            {/* Chat Mockup */}
            <div className="bg-neutral-50 dark:bg-black rounded-xl p-4 border border-neutral-200 dark:border-neutral-800 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                  LS
                </div>
                <div>
                  <div className="bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 p-3 rounded-2xl rounded-tl-sm text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {settings.welcomeMessage || "Hello! Welcome to Livestream Manila. How can I help you today?"}
                  </div>
                  <p className="text-[8px] font-bold text-neutral-400 mt-2 uppercase">Just now</p>
                </div>
              </div>
            </div>

            <button className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold text-red-600 border border-red-600/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition">
              <Activity size={14} /> TEST CHATBOT
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Management Section */}
      <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-900">
        <div className="flex items-center gap-2 mb-6">
          <Activity size={16} className="text-red-600" />
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white tracking-wide">FAQ MANAGEMENT</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-neutral-50 dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{faq.question}</h3>
                <ToggleSwitch checked={faq.isActive} onChange={() => toggleFaq(faq.id)} />
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-5">
                {faq.answer}
              </p>
              <div className="flex items-center gap-3">
                <button className="px-4 py-1.5 text-[10px] font-bold text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition flex items-center gap-1.5">
                  <Edit2 size={10} /> EDIT
                </button>
                <button className="px-4 py-1.5 text-[10px] font-bold text-red-600 border border-red-600/30 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-1.5">
                  <Trash2 size={10} /> DELETE
                </button>
              </div>
            </div>
          ))}

          <button className="w-full py-4 mt-4 border border-dashed border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-500 rounded-xl transition flex items-center justify-center gap-2">
            <Plus size={14} /> ADD NEW FAQ
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChatbotConfig;