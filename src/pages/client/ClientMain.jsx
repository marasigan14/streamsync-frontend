import React, { useEffect, useState } from "react";
import {
  Sun,
  Moon,
  Search,
  User,
  LogOut,
  MessageSquare,
  Target,
  Users,
  Zap,
  Award,
  Heart,
  Shield,
  Clock,
  Gift,
  Tag,
  Video,
  Camera,
  Monitor,
  Mic2,
  Mic,
  MonitorPlay,
  Radio,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Send,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import logoImage from "../../assets/livestream-logo.png";
import heroCollage from "../../assets/hero-collage.jpg";
import leader1 from "../../assets/profile.jpg";
import leader2 from "../../assets/profile.jpg";
import leader3 from "../../assets/profile.jpg";
import leader4 from "../../assets/profile.jpg";
import promoEarlyBird from "../../assets/testpic.jpg";
import promoWedding from "../../assets/testpic.jpg";
import promoWebinar from "../../assets/testpic.jpg";
import customPackageBg from "../../assets/testpicture.jpg";

import equipLivestream from "../../assets/testpicture.jpg";
import equipProjector from "../../assets/testpicture.jpg";
import equipLights from "../../assets/testpicture.jpg";
import equipCtaBg from "../../assets/testpicture.jpg";

import eventTechSummit from "../../assets/testpicture.jpg";
import eventCorporate from "../../assets/testpicture.jpg";
import eventLaunch from "../../assets/testpicture.jpg";
import eventEsports from "../../assets/testpicture.jpg";
import eventFundraiser from "../../assets/testpicture.jpg";
import eventConcert from "../../assets/testpicture.jpg";
import eventsCtaBg from "../../assets//testpicture.jpg";

const ClientMain = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "about",
        "promos",
        "services",
        "equipment",
        "events",
        "contact",
      ];
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (
          element &&
          element.offsetTop <= scrollPosition &&
          element.offsetTop + element.offsetHeight > scrollPosition
        ) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen font-['Poppins',sans-serif] relative bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300">
        {/* --- TOP NAVBAR --- */}
        <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
          <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() =>
                document
                  .getElementById("home")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              <img
                src={logoImage}
                alt="Livestream Manila Logo"
                className="w-10 h-10 object-contain"
              />
            </div>

            <div className="hidden md:flex items-center space-x-8 text-sm font-semibold">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(link.id)
                      .scrollIntoView({ behavior: "smooth" });
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

              <button
                onClick={() => navigate("/client/dashboard")}
                className="text-neutral-500 dark:text-neutral-400 hover:text-red-600 transition"
                title="Go to Dashboard"
              >
                <User size={20} />
              </button>

              <button
                onClick={handleLogout}
                className="text-neutral-500 dark:text-neutral-400 hover:text-red-600 transition"
                title="Log Out"
              >
                <LogOut size={20} />
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("contact")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="bg-[#ff0000] hover:bg-red-700 text-white text-sm font-bold py-2.5 px-6 rounded-full transition-colors"
              >
                Contact us
              </button>
            </div>
          </div>
        </nav>

        {/* --- HERO SECTION --- */}
        <section
          id="home"
          className="relative h-screen min-h-[760px] max-h-[900px] flex items-center justify-center bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${heroCollage})` }}
        >
          <div className="absolute inset-0 z-0 bg-black/58 dark:bg-black/72 transition-colors duration-300" />

          <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 text-center -mt-6 md:-mt-10">
            <h1 className="uppercase text-white font-[900] tracking-[0.12em] leading-[0.95] drop-shadow-[0_4px_18px_rgba(255,0,0,0.28)] text-[36px] sm:text-[54px] md:text-[72px] lg:text-[88px] font-['Montserrat',sans-serif]">
              LIVESTREAM MANILA
            </h1>

            <p className="text-neutral-200 font-normal leading-[1.3] mt-4 mx-auto max-w-[800px] text-[15px] sm:text-[18px] md:text-[22px] font-['Montserrat',sans-serif]">
              Your all-in-one technical support provider for your event!
              <br />
              Customer Service Satisfaction Guaranteed!
            </p>

            <div className="mt-8 flex items-center justify-center">
              <button
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="border border-red-600 text-white text-xs md:text-sm font-semibold tracking-[0.08em] uppercase px-8 py-4 rounded-lg hover:bg-red-600/20 transition font-['Montserrat',sans-serif]"
              >
                Book Now
              </button>
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 md:bottom-20 z-20 flex flex-col items-center">
            <span className="text-[10px] md:text-[11px] font-['Montserrat',sans-serif] tracking-[0.28em] uppercase text-neutral-300 mb-3">
              Scroll
            </span>

            <button
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="relative w-7 h-11 rounded-full border-2 border-slate-300/90 hover:border-red-500 transition-colors duration-300 flex items-start justify-center pt-[5px]"
              aria-label="Scroll to About section"
            >
              <span className="w-1.5 h-2.5 rounded-full bg-red-500 animate-bounce" />
            </button>
          </div>
        </section>

        {/* --- ABOUT SECTION --- */}
        <section
          id="about"
          className="py-24 border-t border-neutral-200 dark:border-neutral-900 transition-colors duration-300 font-['Poppins',sans-serif]"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black tracking-wide uppercase mb-4 text-white">
                About <span className="text-red-600">Livestream Manila</span>
              </h2>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-['Poppins',sans-serif]">
                Born from a passion for storytelling and technology, we've grown
                to become Metro Manila's trusted partner for livestream and
                event production services.
              </p>
              <div className="h-0.5 w-full bg-red-600 mx-auto mt-6"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20 items-stretch">
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-red-600"></div>
                  <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white">
                    Our Story
                  </h3>
                </div>
                <div className="space-y-4 text-neutral-300 text-sm md:text-base leading-relaxed font-['Poppins',sans-serif]">
                  <p>
                    Founded in 2015, Livestream Manila started as a small team
                    of broadcast professionals who saw the growing need for
                    high-quality livestreaming services in the Philippines. What
                    began as a passion project has evolved into a full-service
                    production company.
                  </p>
                  <p>
                    Today, we're proud to have delivered over 500 successful
                    events, from corporate conferences to concerts, weddings to
                    webinars. Our commitment to technical excellence and
                    customer satisfaction has made us the go-to choice for
                    organizations across Metro Manila.
                  </p>
                  <p>
                    We believe that every event, no matter the size, deserves
                    professional-grade production. That's why we invest in the
                    latest equipment and continuously train our team to deliver
                    exceptional results.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#121212] p-8 md:p-10 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 dark:bg-red-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <h3 className="text-lg md:text-xl font-bold uppercase tracking-wider text-red-600 mb-6 relative z-10">
                  Our Mission
                </h3>
                <div className="space-y-6 relative z-10 text-sm md:text-base font-['Poppins',sans-serif]">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0 text-red-600">
                      <Target size={18} />
                    </div>
                    <p className="text-neutral-300 leading-relaxed">
                      To democratize access to professional livestreaming
                      technology and make world-class production services
                      available to organizations of all sizes.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0 text-red-600">
                      <Users size={18} />
                    </div>
                    <p className="text-neutral-300 leading-relaxed">
                      To build lasting partnerships with our clients by
                      consistently exceeding expectations and delivering
                      measurable results.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0 text-red-600">
                      <Zap size={18} />
                    </div>
                    <p className="text-neutral-300 leading-relaxed">
                      To push the boundaries of what's possible in live
                      production, continuously innovating and adapting to new
                      technologies.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- OUR VALUES --- */}
            <div className="mt-12 md:mt-16">
              <h3 className="text-2xl md:text-3xl font-black tracking-wide uppercase text-center mb-10 text-white">
                Our Values
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Award,
                    title: "Excellence",
                    desc: "We strive for perfection in every aspect of our service delivery.",
                  },
                  {
                    icon: Heart,
                    title: "Passion",
                    desc: "Our team is genuinely passionate about creating memorable events.",
                  },
                  {
                    icon: Zap,
                    title: "Innovation",
                    desc: "We stay ahead of the curve with the latest technology and techniques.",
                  },
                  {
                    icon: Shield,
                    title: "Reliability",
                    desc: "Count on us to deliver consistent, professional results every time.",
                  },
                ].map((value, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center transition-colors duration-300"
                  >
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-600/10 flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-full bg-red-600/20 blur-xl"></div>
                      <value.icon
                        size={24}
                        className="text-red-600 relative z-10"
                      />
                    </div>

                    <h4 className="text-lg font-bold uppercase tracking-wide mb-2 text-white">
                      {value.title}
                    </h4>

                    <p className="text-neutral-400 text-xs md:text-sm leading-relaxed max-w-[220px] mx-auto">
                      {value.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* --- LEADERSHIP TEAM --- */}
            <div className="mt-16 md:mt-20">
              <h3 className="text-2xl md:text-3xl font-black tracking-wide uppercase text-center mb-10 text-white">
                Leadership Team
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    image: leader1,
                    name: "Maria Santos",
                    role: "Founder & CEO",
                    bio: "15+ years in broadcast and live production",
                  },
                  {
                    image: leader2,
                    name: "Juan Dela Cruz",
                    role: "Technical Director",
                    bio: "Former broadcast engineer with major networks",
                  },
                  {
                    image: leader3,
                    name: "Lisa Reyes",
                    role: "Creative Director",
                    bio: "Award-winning producer and content creator",
                  },
                  {
                    image: leader4,
                    name: "Mark Lim",
                    role: "Operations Manager",
                    bio: "Logistics expert ensuring flawless execution",
                  },
                ].map((leader, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center transition-colors duration-300"
                  >
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full p-[2px] bg-red-600/30">
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="w-full h-full rounded-full object-cover grayscale"
                      />
                    </div>

                    <h4 className="text-lg font-bold uppercase tracking-wide text-white mb-1">
                      {leader.name}
                    </h4>

                    <p className="text-red-600 text-xs font-bold uppercase tracking-wide mb-3">
                      {leader.role}
                    </p>

                    <p className="text-neutral-400 text-xs md:text-sm leading-relaxed max-w-[220px] mx-auto">
                      {leader.bio}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- PROMOS SECTION --- */}
        <section
          id="promos"
          className="py-24 bg-black border-t border-neutral-900 font-['Montserrat',sans-serif]"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-red-500 text-xs md:text-sm font-bold tracking-[0.16em] uppercase">
                Special Offers
              </span>
              <h2 className="text-white text-3xl md:text-4xl font-extrabold mt-2 mb-4">
                Current Promotions
              </h2>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-['Poppins',sans-serif]">
                Take advantage of our exclusive deals and make your next event
                extraordinary while saving on professional livestreaming
                services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Clock,
                  title: "Early Bird Event Package",
                  desc: "Book your event 3 months in advance and get a 15% discount on our full-service livestreaming package.",
                  code: "EARLYBIRD15",
                  date: "Dec 31, 2026",
                  image: promoEarlyBird,
                },
                {
                  icon: Gift,
                  title: "Wedding Season Special",
                  desc: "Complete wedding coverage including drone shots, multi-cam setup, and highlight reel. Save ₱10,000 when you book this month.",
                  code: "WEDDING2026",
                  date: "Aug 31, 2026",
                  image: promoWedding,
                },
                {
                  icon: Tag,
                  title: "Corporate Webinar Bundle",
                  desc: "Includes studio rental, professional lighting, multi-cam switching, and custom graphics overlay. Get 1 hour free setup time.",
                  code: "CORPSTREAM",
                  date: "Oct 15, 2026",
                  image: promoWebinar,
                },
              ].map((promo, i) => (
                <div
                  key={i}
                  className="bg-[#141414] border border-[#253147] rounded-2xl overflow-hidden shadow-[0_8px_26px_rgba(0,0,0,0.35)] font-['Poppins',sans-serif]"
                >
                  <div className="relative h-44">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/25" />
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                      Limited Time
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-7 h-7 rounded-full bg-red-600/15 text-red-500 flex items-center justify-center mt-0.5 shrink-0">
                        <promo.icon size={14} />
                      </div>
                      <h3 className="text-white text-lg font-bold leading-tight">
                        {promo.title}
                      </h3>
                    </div>

                    <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-4 min-h-[60px]">
                      {promo.desc}
                    </p>

                    <div className="bg-black border border-[#2b2b2b] rounded-lg px-4 py-3 mb-4">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">
                        Promo Code:
                      </p>
                      <p className="text-white text-base font-extrabold tracking-[0.08em]">
                        {promo.code}
                      </p>
                    </div>

                    <div className="border-t border-[#293245] pt-4 flex items-center justify-between">
                      <span className="text-xs text-neutral-500 flex items-center gap-1.5">
                        <Clock size={12} /> Valid until {promo.date}
                      </span>
                      <button
                        onClick={() =>
                          document
                            .getElementById("contact")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="text-red-500 hover:text-red-400 text-xs font-semibold"
                      >
                        Book Now →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SERVICES SECTION --- */}
        <section
          id="services"
          className="py-24 bg-black border-t border-neutral-900 font-['Montserrat',sans-serif]"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.04em] text-white mb-4">
                Our Services
              </h2>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-['Poppins',sans-serif]">
                Comprehensive livestream and production services tailored to
                your event requirements. From intimate webinars to large-scale
                conferences, we deliver excellence every time.
              </p>
              <div className="h-[2px] w-full max-w-[450px] bg-red-600 mx-auto mt-8"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-['Poppins',sans-serif]">
              {[
                {
                  icon: Video,
                  title: "LIVE EVENT STREAMING",
                  desc: "Multi-camera live streaming with real-time switching and graphics overlay.",
                  feats: [
                    "HD/4K streaming",
                    "Multi-platform distribution",
                    "Real-time graphics",
                    "Live chat moderation",
                  ],
                },
                {
                  icon: Camera,
                  title: "VIDEO PRODUCTION",
                  desc: "Full-service video production from pre-production to post-production.",
                  feats: [
                    "Script development",
                    "Professional filming",
                    "Color grading",
                    "Motion graphics",
                  ],
                },
                {
                  icon: Mic,
                  title: "AUDIO ENGINEERING",
                  desc: "Crystal-clear audio mixing and sound reinforcement for any venue.",
                  feats: [
                    "Professional mixing",
                    "Wireless systems",
                    "Recording services",
                    "Live monitoring",
                  ],
                },
                {
                  icon: MonitorPlay,
                  title: "VIRTUAL EVENTS",
                  desc: "Complete virtual event solutions with interactive features.",
                  feats: [
                    "Virtual backgrounds",
                    "Breakout rooms",
                    "Q&A management",
                    "Poll integration",
                  ],
                },
                {
                  icon: Radio,
                  title: "WEBINAR PRODUCTION",
                  desc: "Professional webinar setup and management for corporate clients.",
                  feats: [
                    "Registration system",
                    "Presentation tools",
                    "Recording & replay",
                    "Analytics",
                  ],
                },
                {
                  icon: Search,
                  title: "CONTENT CREATION",
                  desc: "Creative content production for social media and marketing.",
                  feats: [
                    "Social media videos",
                    "Promotional content",
                    "Testimonials",
                    "Training videos",
                  ],
                },
                {
                  icon: Users,
                  title: "HYBRID EVENTS",
                  desc: "Seamlessly combine in-person and virtual attendance.",
                  feats: [
                    "Dual audience support",
                    "Interactive remote tools",
                    "Multi-camera coverage",
                    "Engagement tracking",
                  ],
                },
                {
                  icon: Sparkles,
                  title: "CUSTOM SOLUTIONS",
                  desc: "Tailored packages to meet your specific event needs.",
                  feats: [
                    "Consultation",
                    "Custom workflows",
                    "Scalable solutions",
                    "Dedicated technical team",
                  ],
                },
              ].map((srv, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden bg-[#171717] border border-[#253147] rounded-2xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                >
                  <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-red-700/15 blur-2xl" />

                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-red-600/15 flex items-center justify-center text-red-500 mb-4">
                      <srv.icon size={18} />
                    </div>

                    <h3 className="text-white text-lg font-bold tracking-[0.03em] mb-2">
                      {srv.title}
                    </h3>

                    <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-4 min-h-[40px]">
                      {srv.desc}
                    </p>

                    <ul className="space-y-1.5">
                      {srv.feats.map((item, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-neutral-300 text-xs md:text-sm"
                        >
                          <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Package CTA */}
            <div className="mt-12">
              <div
                className="relative overflow-hidden rounded-2xl border border-red-600/70 min-h-[190px] flex items-center justify-center text-center px-6"
                style={{
                  backgroundImage: `url(${customPackageBg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/65"></div>

                <div className="relative z-10 max-w-3xl mx-auto px-6 text-center py-10 font-['Poppins',sans-serif]">
                  <h3 className="text-white text-2xl md:text-3xl font-extrabold uppercase tracking-[0.04em] mb-2">
                    Need a Custom Package?
                  </h3>
                  <p className="text-neutral-300 text-xs md:text-sm leading-relaxed mb-5 max-w-xl mx-auto">
                    We can create a tailored solution that perfectly fits your
                    event requirements and budget.
                  </p>

                  <button
                    onClick={() =>
                      document
                        .getElementById("contact")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="bg-[#ff0000] hover:bg-red-700 text-white text-xs font-bold tracking-[0.12em] uppercase px-6 py-2.5 rounded-lg transition-colors"
                  >
                    Contact Us For Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- EQUIPMENT SECTION --- */}
        <section
          id="equipment"
          className="py-24 bg-black border-t border-neutral-900 font-['Montserrat',sans-serif]"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.06em] text-white mb-4">
                Equipment Inventory
              </h2>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-['Poppins',sans-serif]">
                Industry-leading equipment maintained to the highest standards.
                All gear is regularly serviced and tested to ensure flawless
                performance at every event.
              </p>
              <div className="h-[2px] w-full max-w-[640px] bg-red-600 mx-auto mt-8"></div>
            </div>

            <h3 className="text-center text-2xl md:text-3xl font-extrabold uppercase tracking-[0.04em] text-white mb-8">
              Rental Packages
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 font-['Poppins',sans-serif]">
              {[
                {
                  title: "LIVESTREAM PACKAGE",
                  desc: "Cameras, TriCaster system, monitors, communication sets, and full streaming rig",
                  image: equipLivestream,
                },
                {
                  title: "PROJECTOR PACKAGE",
                  desc: "Epson projectors, screens, stands, laptop, and all accessories included",
                  image: equipProjector,
                },
                {
                  title: "LIGHTS & SOUNDS PACKAGE",
                  desc: "QSC speakers, DM3 mixer, LED lighting rig, DJ setup, and full cable run",
                  image: equipLights,
                },
              ].map((pkg, i) => (
                <div
                  key={i}
                  className="bg-[#171717] border border-[#253147] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.3)] flex flex-col justify-between"
                >
                  <div className="relative h-44">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/45"></div>
                  </div>

                  <div className="p-6 text-center flex flex-col flex-grow justify-between">
                    <div>
                      <h4 className="text-white text-lg font-bold uppercase tracking-[0.03em] leading-snug mb-2">
                        {pkg.title}
                      </h4>
                      <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-4">
                        {pkg.desc}
                      </p>
                    </div>

                    <div>
                      <button
                        onClick={() =>
                          document
                            .getElementById("contact")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="text-red-500 hover:text-red-400 font-bold text-xs mb-4 block mx-auto"
                      >
                        Contact for Quote
                      </button>

                      <button
                        onClick={() => navigate("/client-dashboard")}
                        className="w-full bg-[#ff0000] hover:bg-red-700 text-white font-extrabold tracking-[0.12em] uppercase text-xs py-2.5 rounded-xl transition-colors"
                      >
                        View Samples
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-center text-2xl md:text-3xl font-extrabold uppercase tracking-[0.04em] text-white mb-8">
              Equipment Categories
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 font-['Poppins',sans-serif]">
              {[
                {
                  icon: Camera,
                  title: "LIVESTREAM RENTAL",
                  desc: "Full broadcast-grade production equipment for live streaming events of any scale.",
                  items: [
                    "Televisions",
                    "Cameras",
                    "Obsbot Camera",
                    "TriCaster Video Production System",
                  ],
                  more: "+9 more items",
                  image: equipLivestream,
                },
                {
                  icon: Monitor,
                  title: "PROJECTOR RENTAL",
                  desc: "Complete projection solutions for presentations, seminars, and corporate events.",
                  items: [
                    "Epson Projectors",
                    "Projector Stands",
                    "Projector Screen",
                    "Laptop",
                  ],
                  more: "+3 more items",
                  image: equipProjector,
                },
                {
                  icon: Mic2,
                  title: "LIGHTS & SOUNDS",
                  desc: "Professional audio and dynamic lighting rigs that transform any venue into a stage-ready environment.",
                  items: [
                    "Mic Rack",
                    "Handheld Microphones",
                    "DM3 Audio Mixer",
                    "DJ Controller",
                  ],
                  more: "+19 more items",
                  image: equipLights,
                },
              ].map((cat, i) => (
                <div
                  key={i}
                  className="bg-[#171717] border border-[#253147] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                >
                  <div className="relative h-40">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>

                    <div className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-red-600/20 border border-red-600/35 text-red-500 flex items-center justify-center">
                      <cat.icon size={14} />
                    </div>
                  </div>

                  <div className="p-5">
                    <h4 className="text-white text-lg font-bold uppercase tracking-[0.03em] mb-2">
                      {cat.title}
                    </h4>
                    <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-3 min-h-[40px]">
                      {cat.desc}
                    </p>

                    <ul className="space-y-1.5">
                      {cat.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-neutral-300 text-xs md:text-sm"
                        >
                          <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="text-neutral-500 text-xs mt-3">{cat.more}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div
              className="relative overflow-hidden rounded-2xl border border-red-600/70 px-6 py-12 text-center"
              style={{
                backgroundImage: `url(${equipCtaBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/65"></div>
              <div className="relative z-10 max-w-3xl mx-auto font-['Poppins',sans-serif]">
                <h3 className="text-white text-2xl md:text-3xl font-extrabold uppercase tracking-[0.04em] mb-3">
                  Need a Custom Setup?
                </h3>
                <p className="text-neutral-300 text-xs md:text-sm leading-relaxed mb-5">
                  Can’t find what you’re looking for? Contact us for custom
                  equipment requests and full event production quotes.
                </p>
                <button
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-[#ff0000] hover:bg-red-700 text-white font-extrabold uppercase tracking-[0.12em] text-xs px-6 py-2.5 rounded-xl transition-colors"
                >
                  Check Availability
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- EVENTS SECTION --- */}
        <section
          id="events"
          className="py-24 bg-black border-t border-neutral-900 font-['Montserrat',sans-serif]"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.05em] text-white mb-4">
                Our Events
              </h2>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-['Poppins',sans-serif]">
                From intimate gatherings to large-scale productions, we’ve
                successfully delivered hundreds of events across Metro Manila
                and beyond.
              </p>
              <div className="h-[2px] w-full max-w-[630px] bg-red-600 mx-auto mt-8"></div>
            </div>

            {/* Upcoming */}
            <div className="mb-14 font-['Poppins',sans-serif]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-red-600 rounded"></div>
                <h3 className="text-white text-xl md:text-2xl font-extrabold uppercase tracking-[0.04em]">
                  Upcoming Events
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {[
                  {
                    tag: "CONFERENCE",
                    title: "HEALTHCARE INNOVATION SUMMIT",
                    date: "June 10, 2026",
                    location: "PICC",
                  },
                  {
                    tag: "PRIVATE EVENT",
                    title: "WEDDING LIVESTREAM",
                    date: "June 25, 2026",
                    location: "Tagaytay",
                  },
                ].map((evt, i) => (
                  <div
                    key={i}
                    className="bg-[#171717] border border-[#253147] rounded-2xl p-5 md:p-6"
                  >
                    <span className="inline-flex items-center bg-red-900/45 text-red-500 text-[10px] font-bold tracking-[0.12em] px-3 py-1 rounded-full mb-3">
                      {evt.tag}
                    </span>

                    <h4 className="text-white text-lg md:text-xl font-bold uppercase tracking-[0.03em] mb-4">
                      {evt.title}
                    </h4>

                    <div className="space-y-2 text-neutral-300 text-xs md:text-sm">
                      <p className="flex items-center gap-2">
                        <Calendar size={13} className="text-red-500" />{" "}
                        {evt.date}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin size={13} className="text-red-500" />{" "}
                        {evt.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Events */}
            <div className="mb-16 font-['Poppins',sans-serif]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-red-600 rounded"></div>
                <h3 className="text-white text-xl md:text-2xl font-extrabold uppercase tracking-[0.04em]">
                  Past Events
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    tag: "CONFERENCE",
                    title: "TECH SUMMIT 2026",
                    desc: "Three-day technology conference with multiple stages and breakout sessions.",
                    date: "March 15, 2026",
                    location: "SMX Convention Center",
                    attendees: "5,000+ attendees",
                    image: eventTechSummit,
                  },
                  {
                    tag: "CORPORATE",
                    title: "CORPORATE ANNUAL MEETING",
                    desc: "Hybrid annual shareholders meeting with live Q&A and voting.",
                    date: "February 28, 2026",
                    location: "Makati Shangri-La",
                    attendees: "500 attendees",
                    image: eventCorporate,
                  },
                  {
                    tag: "LAUNCH EVENT",
                    title: "PRODUCT LAUNCH – FASHION BRAND",
                    desc: "High-end fashion show with multi-camera livestream to global audience.",
                    date: "January 20, 2026",
                    location: "BGC Arts Center",
                    attendees: "1,200 attendees",
                    image: eventLaunch,
                  },
                  {
                    tag: "ESPORTS",
                    title: "ONLINE GAMING TOURNAMENT",
                    desc: "Multi-day esports tournament with live commentary and instant replays.",
                    date: "December 12, 2025",
                    location: "Virtual",
                    attendees: "50,000+ attendees",
                    image: eventEsports,
                  },
                  {
                    tag: "FUNDRAISER",
                    title: "CHARITY GALA FUNDRAISER",
                    desc: "Elegant charity event with live auction and entertainment.",
                    date: "November 8, 2025",
                    location: "Manila Hotel",
                    attendees: "800 attendees",
                    image: eventFundraiser,
                  },
                  {
                    tag: "CONCERT",
                    title: "MUSIC FESTIVAL",
                    desc: "Two-day music festival featuring local and international artists.",
                    date: "October 25, 2025",
                    location: "MOA Arena",
                    attendees: "12,000+ attendees",
                    image: eventConcert,
                  },
                ].map((evt, i) => (
                  <div
                    key={i}
                    className="bg-[#171717] border border-[#253147] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.32)] flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-40">
                        <img
                          src={evt.image}
                          alt={evt.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/45"></div>
                        <span className="absolute top-3 right-3 border border-red-600/70 bg-black/60 text-neutral-100 text-[10px] tracking-[0.1em] px-2.5 py-0.5 rounded-full">
                          {evt.tag}
                        </span>
                      </div>

                      <div className="p-5">
                        <h4 className="text-white text-base font-bold uppercase tracking-[0.02em] leading-snug mb-2">
                          {evt.title}
                        </h4>
                        <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-4">
                          {evt.desc}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <div className="border-t border-[#2a3345] pt-3 space-y-1.5 text-xs md:text-sm text-neutral-300">
                        <p className="flex items-center gap-2">
                          <Calendar size={13} className="text-red-500" />{" "}
                          {evt.date}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin size={13} className="text-red-500" />{" "}
                          {evt.location}
                        </p>
                        <p className="flex items-center gap-2">
                          <Users size={13} className="text-red-500" />{" "}
                          {evt.attendees}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div
              className="relative overflow-hidden rounded-2xl border border-red-600/70 px-6 py-14 text-center"
              style={{
                backgroundImage: `url(${eventsCtaBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/68"></div>

              <div className="relative z-10 max-w-3xl mx-auto font-['Poppins',sans-serif]">
                <h3 className="text-white text-2xl md:text-3xl font-extrabold uppercase tracking-[0.05em] mb-3">
                  Make Your Event Unforgettable
                </h3>
                <p className="text-neutral-300 text-xs md:text-sm leading-relaxed mb-6">
                  Let us handle your livestream production so you can focus on
                  creating amazing experiences.
                </p>

                <button
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-[#ff0000] hover:bg-red-700 text-white font-extrabold uppercase tracking-[0.12em] text-xs px-6 py-3 rounded-xl transition-colors"
                >
                  Book Your Event
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- CONTACT SECTION --- */}
        <section
          id="contact"
          className="py-24 bg-black border-t border-neutral-900 font-['Montserrat',sans-serif]"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.05em] text-white mb-4">
                Contact Us
              </h2>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-['Poppins',sans-serif]">
                Ready to elevate your next event? Get in touch with our team of
                experts to discuss your requirements and get a custom quote.
              </p>
              <div className="h-[2px] w-full max-w-[630px] bg-red-600 mx-auto mt-8"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-['Poppins',sans-serif]">
              <div className="lg:col-span-4 space-y-4">
                {[
                  {
                    icon: MapPin,
                    title: "OUR OFFICE",
                    lines: [
                      "444 Sta Felica St.",
                      "San Antonio Homes",
                      "Culiat Quezon City 1128",
                      "Philippines",
                    ],
                  },
                  {
                    icon: Phone,
                    title: "PHONE",
                    lines: ["09936742673", "09171234567"],
                  },
                  {
                    icon: Mail,
                    title: "EMAIL",
                    lines: ["lsmevents@gmail.com", "info@livestreammanila.com"],
                  },
                  {
                    icon: Clock,
                    title: "BUSINESS HOURS",
                    lines: [
                      "Monday - Friday: 9AM - 6PM",
                      "Saturday: 9AM - 1PM",
                      "Sunday: Closed",
                    ],
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-[#171717] border border-[#253147] rounded-2xl p-5"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-red-600/15 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon size={16} />
                      </div>
                      <div>
                        <h3 className="text-white text-sm md:text-base font-bold uppercase tracking-[0.03em] mb-1">
                          {item.title}
                        </h3>
                        <div className="space-y-0.5">
                          {item.lines.map((line, idx) => (
                            <p
                              key={idx}
                              className="text-neutral-400 text-xs md:text-sm leading-relaxed"
                            >
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-8 relative overflow-hidden bg-[#171717] border border-[#253147] rounded-2xl p-6 md:p-8">
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-red-700/12 blur-2xl" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <MessageSquare className="text-red-500" size={20} />
                    <h3 className="text-white text-2xl md:text-3xl font-extrabold uppercase tracking-[0.03em]">
                      Send Us a Message
                    </h3>
                  </div>

                  <div className="h-px bg-[#283247] mb-6"></div>

                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] tracking-[0.12em] text-neutral-400 uppercase mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          placeholder="Juan"
                          className="w-full bg-black border border-[#2a3345] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[0.12em] text-neutral-400 uppercase mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          placeholder="Dela Cruz"
                          className="w-full bg-black border border-[#2a3345] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] tracking-[0.12em] text-neutral-400 uppercase mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="juan@example.com"
                          className="w-full bg-black border border-[#2a3345] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[0.12em] text-neutral-400 uppercase mb-2">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          placeholder="+63 912 345 6789"
                          className="w-full bg-black border border-[#2a3345] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] tracking-[0.12em] text-neutral-400 uppercase mb-2">
                        Event Type
                      </label>
                      <input
                        type="text"
                        placeholder=""
                        className="w-full bg-black border border-[#2a3345] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] tracking-[0.12em] text-neutral-400 uppercase mb-2">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Tell us about your event..."
                        className="w-full bg-black border border-[#2a3345] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#ff0000] hover:bg-red-700 text-white font-extrabold uppercase tracking-[0.12em] text-xs py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      Send Message <Send size={15} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Chat Button */}
        <button className="fixed bottom-8 right-8 bg-[#ff0000] hover:bg-red-700 text-white p-4 rounded-full shadow-lg z-50 transition-colors">
          <MessageSquare size={24} />
        </button>

        {/* --- FOOTER --- */}
        <footer className="bg-black border-t border-neutral-900 font-['Montserrat',sans-serif]">
          <div className="max-w-7xl mx-auto px-6 pt-14">
            <iframe
              title="Livestream Manila Location"
              src="https://www.google.com/maps?q=444+Sta+Felica+St,+Quezon+City&output=embed"
              className="w-full h-[260px] md:h-[360px] rounded-sm border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="mt-12 border-t border-[#1a2233]">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 font-['Poppins',sans-serif]">
              <div>
                <img
                  src={logoImage}
                  alt="Livestream Manila Logo"
                  className="w-9 h-9 object-contain mb-3"
                />
                <p className="text-neutral-400 text-xs md:text-sm leading-relaxed max-w-sm">
                  Your all-in-one technical support provider for your event!
                  Customer Service Satisfaction Guaranteed!
                </p>
              </div>

              <div>
                <h4 className="text-red-500 text-base md:text-lg font-semibold mb-3">
                  Quick Links
                </h4>
                <ul className="space-y-1.5">
                  {[
                    { label: "Home", id: "home" },
                    { label: "About", id: "about" },
                    { label: "Promos", id: "promos" },
                    { label: "Services", id: "services" },
                    { label: "Equipment", id: "equipment" },
                    { label: "Events", id: "events" },
                    { label: "Contact", id: "contact" },
                  ].map((link) => (
                    <li key={link.id}>
                      <button
                        onClick={() =>
                          document
                            .getElementById(link.id)
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="text-neutral-400 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-red-500 text-base md:text-lg font-semibold mb-3">
                  Contact
                </h4>
                <div className="space-y-1 text-neutral-400 text-xs md:text-sm leading-relaxed">
                  <p>
                    444 Sta Felica St. San Antonio Homes Culiat Quezon City 1128
                  </p>
                  <p>09936742673</p>
                  <p>lsmevents@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-6">
              <div className="border-t border-[#1a2233] pt-5 text-center">
                <p className="text-neutral-500 text-xs">
                  © 2026 Livestream Manila. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ClientMain;