import React, { useEffect, useState } from "react";
import {
  Sun, Moon, Search, User, LogOut, MessageSquare, Target, Users, Zap, Award, Heart, Shield,
  Clock, Gift, Tag, ArrowRight, Video, Camera, Mic, MonitorPlay, Radio, Film, Sparkles,
  MapPin, Calendar, Phone, Mail, Send
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

// 1. IMPORT THE IMAGE HERE
import heroCollage from '../assets/hero-collage.jpg';

const Home = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState("home");

  // Check if a user is securely logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "promos", "services", "equipment", "events", "contact"];
      const scrollPosition = window.scrollY + 150; 

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && element.offsetTop + element.offsetHeight > scrollPosition) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle HTML document class toggle for Tailwind Dark Mode
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Promos", id: "promos" },
    { name: "Services", id: "services" },
    { name: "Equipment", id: "equipment" },
    { name: "Events", id: "events" },
    { name: "Contact", id: "contact" },
  ];

  return (
    // FAILSAFE ADDED HERE: Forces the dark class into the React tree
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen font-sans relative bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300">
        
        {/* --- TOP NAVBAR --- */}
        <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
          <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
            
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => document.getElementById('home').scrollIntoView({ behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center font-black text-xl tracking-tighter text-white">
                LM
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8 text-sm font-semibold">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(link.id).scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`transition-all ${activeSection === link.id ? "text-red-600 border-b-2 border-red-600 pb-1" : "text-neutral-500 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"}`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-5">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition">
                <Search size={20} />
              </button>

              {session ? (
                <>
                  <button onClick={() => navigate("/client/dashboard")} className="text-neutral-500 dark:text-neutral-400 hover:text-red-600 transition" title="Go to Dashboard">
                    <User size={20} />
                  </button>
                  <button onClick={handleLogout} className="text-neutral-500 dark:text-neutral-400 hover:text-red-600 transition" title="Log Out">
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <button onClick={() => navigate("/login")} className="text-sm font-medium text-neutral-500 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition">
                  Login
                </button>
              )}

              <button 
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#ff0000] hover:bg-red-700 text-white text-sm font-bold py-2.5 px-6 rounded-full transition-colors"
              >
                Contact us
              </button>
            </div>
          </div>
        </nav>

        {/* --- HERO SECTION --- */}
        {/* 2. UPDATE THE STYLE PROP HERE */}
        <section 
          id="home" 
          className="relative h-screen flex items-center justify-center bg-cover bg-center" 
          style={{ backgroundImage: `url(${heroCollage})` }}
        >
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70 bg-gradient-to-t from-neutral-50 dark:from-black via-transparent to-transparent z-0 transition-colors duration-300"></div>
          <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto mt-20">
            <h1 className="text-5xl md:text-7xl lg:text-[90px] font-black tracking-widest uppercase mb-6 text-white drop-shadow-2xl">Livestream Manila</h1>
            <p className="text-lg md:text-2xl text-neutral-100 font-light mb-10 max-w-3xl mx-auto drop-shadow-md">
              Your all-in-one technical support provider for your event!<br />Customer Service Satisfaction Guaranteed!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto bg-[#ff0000] hover:bg-red-700 text-white font-bold py-4 px-10 rounded-lg tracking-wider transition-colors shadow-lg shadow-red-600/30">
                EXPLORE SERVICES
              </button>
              <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white hover:bg-white/20 text-white font-bold py-4 px-10 rounded-lg tracking-wider transition-all">
                CONTACT US
              </button>
            </div>
          </div>
        </section>

        {/* --- ABOUT SECTION --- */}
        <section id="about" className="py-24 border-t border-neutral-200 dark:border-neutral-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black tracking-wide uppercase mb-4 text-neutral-900 dark:text-white">About <span className="text-red-600">Livestream Manila</span></h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
                Born from a passion for storytelling and technology, we've grown to become Metro Manila's trusted partner for livestream and event production services.
              </p>
              <div className="h-0.5 w-24 bg-red-600 mx-auto mt-6"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20 items-stretch">
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-red-600"></div>
                  <h3 className="text-2xl font-bold uppercase tracking-wider text-neutral-900 dark:text-white">Our Story</h3>
                </div>
                <div className="space-y-5 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  <p>Founded in 2015, Livestream Manila started as a small team of broadcast professionals who saw the growing need for high-quality livestreaming services in the Philippines.</p>
                  <p>Today, we're proud to have delivered over 500 successful events. Our commitment to technical excellence has made us the go-to choice across Metro Manila.</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#121212] p-8 md:p-10 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 dark:bg-red-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <h3 className="text-xl font-bold uppercase tracking-wider text-red-600 mb-8 relative z-10">Our Mission</h3>
                <div className="space-y-8 relative z-10 text-sm">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0 text-red-600"><Target size={20} /></div>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">To democratize access to professional livestreaming technology.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0 text-red-600"><Users size={20} /></div>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">To build lasting partnerships with our clients by consistently exceeding expectations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- LEADERSHIP / PROMOS SECTION --- */}
        <section id="promos" className="py-24 bg-white dark:bg-[#0a0a0a] border-t border-neutral-200 dark:border-neutral-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black tracking-widest uppercase text-neutral-900 dark:text-white">StreamSync Team</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
              {[
                { name: "JOASH MARASIGAN", role: "Project Lead", exp: "System Architecture & UI/UX" },
                { name: "CHARLES", role: "Backend Developer", exp: "Database Integration & Logic" },
                { name: "GENETH", role: "Systems Analyst", exp: "Process Workflows" },
                { name: "VICTOR", role: "Database Administrator", exp: "Data Security & Modeling" },
                { name: "JULIE", role: "Quality Assurance", exp: "Testing & Validation" },
                { name: "SHANEL", role: "Documentation", exp: "Technical Writing & QA" }
              ].map((member, i) => (
                <div key={i} className="bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center hover:border-red-600/30 dark:hover:border-red-900/50 transition-colors shadow-sm dark:shadow-none">
                  <div className="w-24 h-24 mx-auto rounded-full bg-neutral-200 dark:bg-neutral-800 mb-5 relative overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${member.name.replace(' ', '+')}&background=7f1d1d&color=fff`} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-bold tracking-wider text-neutral-900 dark:text-white">{member.name}</h3>
                  <p className="text-xs font-bold text-red-600 uppercase mb-3">{member.role}</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">{member.exp}</p>
                </div>
              ))}
            </div>

            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-red-600 text-xs font-bold tracking-widest uppercase">Special Offers</span>
              <h2 className="text-4xl font-black tracking-wide mt-2 mb-4 text-neutral-900 dark:text-white">Current Promotions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Clock, title: "Early Bird Event", code: "EARLYBIRD15", date: "Dec 31, 2026" },
                { icon: Gift, title: "Wedding Season", code: "WEDDING2026", date: "Aug 31, 2026" },
                { icon: Tag, title: "Webinar Bundle", code: "CORPSTREAM", date: "Oct 15, 2026" }
              ].map((promo, i) => (
                <div key={i} className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden group shadow-md dark:shadow-none transition-colors duration-300">
                  <div className="h-48 bg-neutral-100 dark:bg-neutral-900 relative transition-colors duration-300">
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#121212] to-transparent z-10 transition-colors duration-300"></div>
                    <div className="absolute top-4 right-4 z-20 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Limited Time</div>
                  </div>
                  <div className="p-8 pt-0 relative z-20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600">
                        <promo.icon size={16} />
                      </div>
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{promo.title}</h3>
                    </div>
                    <div className="bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 mb-6 mt-4 transition-colors duration-300">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Promo Code</p>
                      <p className="text-lg font-bold tracking-widest text-neutral-900 dark:text-white">{promo.code}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 pt-5 transition-colors duration-300">
                      <span className="text-[11px] text-neutral-600 dark:text-neutral-50 flex items-center gap-1.5"><Clock size={12} /> Valid until {promo.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SERVICES SECTION --- */}
        <section id="services" className="py-24 border-t border-neutral-200 dark:border-neutral-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black tracking-wide uppercase mb-4 text-neutral-900 dark:text-white">Our Services</h2>
              <div className="h-0.5 w-24 bg-red-600 mx-auto mt-6"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Video, title: "LIVE EVENT STREAMING", feats: ["HD/4K streaming", "Multi-platform distribution", "Live chat"] },
                { icon: Camera, title: "VIDEO PRODUCTION", feats: ["Script development", "Professional filming", "Color grading"] },
                { icon: Mic, title: "AUDIO ENGINEERING", feats: ["Professional mixing", "Wireless systems", "Live monitoring"] },
                { icon: MonitorPlay, title: "VIRTUAL EVENTS", feats: ["Virtual backgrounds", "Breakout rooms", "Q&A management"] },
                { icon: Radio, title: "WEBINAR PRODUCTION", feats: ["Registration system", "Presentation tools", "Analytics"] },
                { icon: Sparkles, title: "CUSTOM SOLUTIONS", feats: ["Consultation", "Custom workflows", "Scalable solutions"] }
              ].map((srv, i) => (
                <div key={i} className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 hover:border-red-600/30 dark:hover:border-red-900/50 shadow-md dark:shadow-none transition-colors duration-300">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 text-red-600 rounded-xl flex items-center justify-center mb-6"><srv.icon size={24} /></div>
                  <h3 className="text-lg font-bold tracking-wider mb-3 text-neutral-900 dark:text-white">{srv.title}</h3>
                  <ul className="space-y-2 mt-4">
                    {srv.feats.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- EQUIPMENT INVENTORY SECTION --- */}
        <section id="equipment" className="py-24 bg-white dark:bg-[#0a0a0a] border-t border-neutral-200 dark:border-neutral-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-4xl font-black tracking-wide uppercase mb-4 text-neutral-900 dark:text-white">Equipment Inventory</h2>
              <div className="h-0.5 w-24 bg-red-600 mx-auto mt-6"></div>
            </div>
            <h3 className="text-xl font-bold uppercase tracking-widest text-center mb-10 text-neutral-900 dark:text-white">Rental Packages</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
              {[
                { title: "Livestream Package", desc: "Cameras, TriCaster system, monitors, communication sets." },
                { title: "Projector Package", desc: "Epson projectors, screens, stands, laptop, and accessories." },
                { title: "Lights & Sounds Package", desc: "QSC speakers, DM3 mixer, LED lighting rig, DJ setup." }
              ].map((pkg, i) => (
                <div key={i} className="bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col hover:border-red-600/30 dark:hover:border-red-900/50 transition-colors shadow-sm dark:shadow-none">
                  <div className="h-48 bg-neutral-200 dark:bg-neutral-900 relative transition-colors duration-300"></div>
                  <div className="p-8 relative z-20 flex flex-col items-center text-center flex-grow">
                    <h4 className="text-base font-bold tracking-widest mb-3 uppercase text-neutral-900 dark:text-white">{pkg.title}</h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed flex-grow">{pkg.desc}</p>
                    <button className="w-full bg-[#ff0000] hover:bg-red-700 text-white font-bold py-3 rounded-lg text-xs tracking-wider transition-colors">VIEW SAMPLES</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- EVENTS SECTION --- */}
        <section id="events" className="py-24 border-t border-neutral-200 dark:border-neutral-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-4xl font-black tracking-wide uppercase mb-4 text-neutral-900 dark:text-white">Our Events</h2>
              <div className="h-0.5 w-24 bg-red-600 mx-auto mt-6"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[
                { title: "Tech Summit 2026", type: "Conference", loc: "SMX Convention Center" },
                { title: "Corporate Meeting", type: "Corporate", loc: "Makati Shangri-La" },
                { title: "Product Launch", type: "Launch Event", loc: "BGC Arts Center" }
               ].map((evt, i) => (
                 <div key={i} className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden group shadow-md dark:shadow-none transition-colors duration-300">
                    <div className="h-48 relative bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center transition-colors duration-300">
                      <span className="bg-black/60 dark:bg-black/50 px-3 py-1 rounded text-xs text-white">{evt.type}</span>
                    </div>
                    <div className="p-8">
                       <h4 className="text-sm font-bold uppercase text-neutral-900 dark:text-white">{evt.title}</h4>
                       <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-2 flex items-center gap-2"><MapPin size={12} className="text-red-600"/> {evt.loc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* --- CONTACT US SECTION --- */}
        <section id="contact" className="py-24 bg-white dark:bg-[#0a0a0a] border-t border-neutral-200 dark:border-neutral-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-black tracking-wide uppercase mb-4 text-neutral-900 dark:text-white">Contact Us</h2>
              <div className="h-0.5 w-24 bg-red-600 mx-auto mt-6"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              <div className="space-y-4">
                 <div className="bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex items-start gap-4 transition-colors duration-300"><MapPin className="text-red-600 shrink-0" size={18} /><div><h4 className="text-sm font-bold uppercase text-neutral-900 dark:text-white">Our Office</h4><p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">444 Sta Felica St.<br/>Quezon City</p></div></div>
                 <div className="bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex items-start gap-4 transition-colors duration-300"><Phone className="text-red-600 shrink-0" size={18} /><div><h4 className="text-sm font-bold uppercase text-neutral-900 dark:text-white">Phone</h4><p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">09936742673</p></div></div>
                 <div className="bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex items-start gap-4 transition-colors duration-300"><Mail className="text-red-600 shrink-0" size={18} /><div><h4 className="text-sm font-bold uppercase text-neutral-900 dark:text-white">Email</h4><p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">info@livestreammanila.com</p></div></div>
              </div>
              <div className="lg:col-span-2 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 transition-colors duration-300">
                 <div className="flex items-center gap-3 mb-8"><MessageSquare className="text-red-600" size={20} /><h3 className="text-xl font-bold uppercase text-neutral-900 dark:text-white">Send Us A Message</h3></div>
                 <form className="space-y-4">
                    <input type="text" placeholder="Your Name" className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors duration-300" />
                    <textarea rows="4" placeholder="Tell us about your event..." className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors duration-300 resize-none"></textarea>
                    <button className="w-full bg-[#ff0000] hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">Send Message <Send size={16} /></button>
                 </form>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Chat Button */}
        <button className="fixed bottom-8 right-8 bg-[#ff0000] hover:bg-red-700 text-white p-4 rounded-full shadow-lg z-50 transition-colors">
          <MessageSquare size={24} />
        </button>

        {/* --- FOOTER --- */}
        <footer className="bg-neutral-100 dark:bg-black border-t border-neutral-200 dark:border-neutral-900 pt-16 pb-8 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 text-center text-xs text-neutral-500">
             <p>© 2026 Livestream Manila. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;