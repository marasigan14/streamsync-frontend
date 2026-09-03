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
  X,
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
import eventsCtaBg from "../../assets/testpicture.jpg";

const ClientMain = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState("home");

  // Modals & Cart State
  const [openSample, setOpenSample] = useState(null);
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const [availabilityModalPkg, setAvailabilityModalPkg] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 8, 1));
  const [activeCategoryModal, setActiveCategoryModal] = useState(null);
  const [cart, setCart] = useState([]);

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

  useEffect(() => {
    async function fetchBookings() {
      if (!availabilityModalPkg) return;
      const { data, error } = await supabase
        .from('bookings')
        .select('start_date, end_date')
        .eq('package_name', availabilityModalPkg.title);

      if (!error && data) {
        const booked = [];
        data.forEach(b => {
          let curr = new Date(b.start_date);
          let end = new Date(b.end_date);
          while (curr <= end) {
            booked.push(curr.toISOString().split('T')[0]);
            curr.setDate(curr.getDate() + 1);
          }
        });
        setBookedDates(booked);
      }
    }
    fetchBookings();
  }, [availabilityModalPkg]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const equipmentCatalogs = {
    livestream: {
      title: "LIVESTREAM RENTAL",
      subtitle: "Full broadcast-grade production equipment for live streaming events of any scale.",
      items: [
        { name: "Televisions", desc: "Large-format displays for audience viewing, stage confidence, and production monitoring at events.", price: "₱2,500/day", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=600&auto=format&fit=crop" },
        { name: "Cameras", desc: "Professional broadcast-grade cameras delivering crisp, high-definition footage for livestream events.", price: "₱2,500/day", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop" },
        { name: "Obsbot Camera", desc: "AI-powered robotic camera with auto-tracking for hands-free speaker and presenter coverage.", price: "₱2,500/day", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop" },
        { name: "TriCaster Video Production System", desc: "Industry-leading all-in-one live production system - switching, streaming, recording, and graphics in one unit.", price: "₱15,000/day", image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop" },
        { name: "TriCaster Controller", desc: "Dedicated hardware control surface for the TriCaster system, enabling fast and precise live switching.", price: "₱5,000/day", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop" },
        { name: "Switcher", desc: "Multi-input video switcher for seamless camera cuts, transitions, and live production control.", price: "₱4,000/day", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop" },
        { name: "Recorder", desc: "High-quality video recorder for capturing the full broadcast output as a master archive file.", price: "₱2,000/day", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop" },
        { name: "Communication Sets", desc: "Intercom headsets and belt packs for seamless crew communication throughout the production.", price: "₱500/day", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=600&auto=format&fit=crop" },
        { name: "Monitors", desc: "Color-accurate production monitors for camera operators and the director to review the live feed.", price: "₱1,500/day", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop" },
        { name: "Stream Bag", desc: "Organized carry bag housing the complete mobile streaming kit for rapid deployment at any venue.", price: "₱600/day", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop" },
        { name: "Audio Bag", desc: "Protective bag for audio gear - wireless receivers, microphones, and accessories neatly organized.", price: "₱300/day", image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=600&auto=format&fit=crop" },
        { name: "Camera Stand / Tripod", desc: "Heavy-duty fluid head tripods and stands for stable, smooth camera movements during live events.", price: "₱800/day", image: "https://images.unsplash.com/photo-1500634245200-e524567574fb?q=80&w=600&auto=format&fit=crop" },
        { name: "UPS", desc: "Uninterruptible Power Supply units providing backup power to protect critical equipment during outages.", price: "₱1,500/day", image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600&auto=format&fit=crop" },
      ]
    },
    projector: {
      title: "PROJECTOR RENTAL",
      subtitle: "Complete projection solutions for presentations, seminars, and corporate events.",
      items: [
        { name: "Epson Projectors", desc: "High-lumen Epson projectors delivering sharp, vivid images even in well-lit conference and event halls.", price: "₱3,500/day", image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=600&auto=format&fit=crop" },
        { name: "Projector Stands", desc: "Adjustable heavy-duty stands for optimal projector placement and angle in any venue layout.", price: "₱500/day", image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600&auto=format&fit=crop" },
        { name: "Projector Screen", desc: "Matte white projection screens in various sizes for crisp, uniform image display at events.", price: "₱1,500/day", image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop" },
        { name: "Laptop", desc: "High-performance laptops pre-configured for smooth slide playback, video, and presentation software.", price: "₱2,000/day", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop" },
        { name: "Mini Folding Table", desc: "Compact folding tables for positioning the projector and laptop at the correct throw distance.", price: "₱300/day", image: "https://images.unsplash.com/photo-1530685433978-7ef0019b0352?q=80&w=600&auto=format&fit=crop" },
        { name: "Extension Cord", desc: "Heavy-gauge extension cords ensuring reliable power delivery to the projector and supporting equipment.", price: "₱200/day", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop" },
        { name: "Projector Box / Case", desc: "Foam-padded hard cases for safe transport and storage of projectors during deployment.", price: "Included", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop" },
      ]
    },
    lights: {
      title: "LIGHTS & SOUNDS",
      subtitle: "Professional audio and dynamic lighting rigs that transform any venue into a stage-ready environment.",
      items: [
        { name: "Mic Rack", desc: "Organized rack for storing microphones and audio processors during transport and stage setup.", price: "₱100/day", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop" },
        { name: "Handheld Microphones", desc: "Reliable wireless and wired handheld microphones for presenters, performers, and public speakers.", price: "₱300/day", image: "https://images.unsplash.com/photo-1520523839896-541243729227?q=80&w=600&auto=format&fit=crop" },
        { name: "DM3 Audio Mixer", desc: "Advanced multi-channel digital mixing console offering professional multichannel audio control for live events.", price: "₱2,500/day", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop" },
        { name: "DJ Controller", desc: "Full-featured digital DJ controller for precise mixing, transitions, and music playback at events.", price: "₱3,000/day", image: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=600&auto=format&fit=crop" },
        { name: "DJ Stand", desc: "Adjustable sturdy stand for professional DJ consoles and audio gear arrangement.", price: "₱500/day", image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600&auto=format&fit=crop" },
        { name: "QSC Speakers", desc: "Industry-standard high-output active loudspeakers delivering powerful, crystal-clear audio to any venue.", price: "₱4,500/day", image: "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=600&auto=format&fit=crop" },
        { name: "QSC Sub-Woofer", desc: "High-powered subwoofers providing deep, impactful bass response ideal for concerts and high-energy events.", price: "₱3,500/day", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop" },
        { name: "Speaker Stand", desc: "Heavy-duty speaker stands elevating speakers to optimize sound distribution across the audience.", price: "₱500/day", image: "https://images.unsplash.com/photo-1500634245200-e524567574fb?q=80&w=600&auto=format&fit=crop" },
        { name: "Mic Stands", desc: "Adjustable floor-standing microphone stands designed for flexible performer and speaker positioning.", price: "₱300/day", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop" },
        { name: "Light Stands", desc: "Sturdy telescoping light stands for mounting lighting fixtures at correct heights and angles.", price: "₱300/day", image: "https://images.unsplash.com/photo-1500634245200-e524567574fb?q=80&w=600&auto=format&fit=crop" },
        { name: "Lyrics Stands", desc: "Dedicated music stands for displaying lyrics, cue cards, or scripts for performers.", price: "₱200/day", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop" },
        { name: "Tigertouch Light Controller", desc: "High-performance multi-touch lighting console for programming complex fixtures, chases, and stage lights.", price: "₱8,000/day", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop" },
        { name: "LED Bar", desc: "Vibrant multi-color LED wash bars for creating dynamic wall uplighting and creative stage accent effects.", price: "₱1,500/day", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop" },
        { name: "LED Par", desc: "Powerful LED par cans for versatile stage lighting, wash effects, and broad color coverage.", price: "₱800/day", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop" },
        { name: "Shure Headworn Microphones", desc: "Shure comfortable headworn microphones offering hands-free vocal clarity for presenters and performers.", price: "₱1,500/day", image: "https://images.unsplash.com/photo-1520523839896-541243729227?q=80&w=600&auto=format&fit=crop" },
        { name: "DMX Light Controller", desc: "Professional live lighting console for programming cues, static chases, and intricate stage lighting evolution.", price: "₱3,500/day", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop" },
        { name: "XLR Cables", desc: "Professional-grade XLR cables ensuring noise-free and reliable audio signal transmission.", price: "₱200/day", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop" },
        { name: "HDMI Cables", desc: "High-speed HDMI cables delivering crystal-clear video signal playback across monitors and displays.", price: "₱200/day", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop" },
        { name: "Power Cables", desc: "Heavy-duty power distribution cables safely supplying electricity to all audio and lighting gear.", price: "₱150/day", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop" },
        { name: "Snake Cable", desc: "Multi-channel stage audio snake box streamlining complex multi-microphone cable runs.", price: "₱500/day", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop" },
        { name: "LAN Cables", desc: "Reliable networking cables facilitating high-speed data transmission for switchers and streaming gear.", price: "₱150/day", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop" },
        { name: "Extension Cords", desc: "Durable electrical extension cords for safely powering audio and lighting equipment throughout the venue.", price: "₱200/day", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop" },
        { name: "DMX Cables", desc: "Specialized DMX data cables ensuring precise digital lighting signal transmission from lighting controllers and fixtures.", price: "₱150/day", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop" },
      ]
    }
  };

  const addToCart = (item) => {
    if (!cart.some(i => i.name === item.name)) {
      setCart([...cart, item]);
    }
  };

  const removeFromCart = (itemName) => {
    setCart(cart.filter(i => i.name !== itemName));
  };

  const proceedToBooking = () => {
    setActiveCategoryModal(null);
    const itemNames = cart.map(i => i.name).join(",");
    navigate(`/client/booking?equipment=${encodeURIComponent(itemNames)}`);
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

              {session ? (
                <>
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
                </>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-medium text-neutral-500 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
                >
                  Login
                </button>
              )}

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
                    className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-red-600/50 hover:shadow-[0_12px_30px_rgba(255,0,0,0.12)] cursor-pointer"
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
                    className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-red-600/50 hover:shadow-[0_12px_30px_rgba(255,0,0,0.12)] cursor-pointer"
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
                  className="group relative bg-[#141414] border border-[#253147] rounded-2xl overflow-hidden font-['Poppins',sans-serif] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-red-600/60 hover:shadow-[0_12px_32px_rgba(255,0,0,0.18)] cursor-pointer"
                >
                  {/* Image container with scale & dark overlay adjustment */}
                  <div className="relative h-44 overflow-hidden bg-neutral-900">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors duration-300" />
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      Limited Time
                    </span>
                  </div>

                  <div className="p-6">
                    {/* Header: Icon scale + Title color shift */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-red-600/15 text-red-500 border border-red-600/20 flex items-center justify-center mt-0.5 shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-red-600/30 group-hover:border-red-500/50">
                        <promo.icon size={15} className="transition-transform duration-300 group-hover:rotate-6" />
                      </div>
                      <h3 className="text-white text-lg font-bold leading-tight transition-colors duration-300 group-hover:text-red-500">
                        {promo.title}
                      </h3>
                    </div>

                    <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-4 min-h-[60px] transition-colors duration-200 group-hover:text-neutral-300">
                      {promo.desc}
                    </p>

                    {/* Promo Code box */}
                    <div className="bg-black border border-[#2b2b2b] rounded-lg px-4 py-3 mb-4 transition-all duration-300 group-hover:border-red-600/40">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">
                        Promo Code:
                      </p>
                      <p className="text-white text-base font-extrabold tracking-[0.08em] transition-colors duration-300 group-hover:text-red-400">
                        {promo.code}
                      </p>
                    </div>

                    <div className="border-t border-[#293245] pt-4 flex items-center justify-between">
                      <span className="text-xs text-neutral-500 flex items-center gap-1.5 transition-colors duration-200 group-hover:text-neutral-400">
                        <Clock size={12} className="text-red-500" /> Valid until {promo.date}
                      </span>
                      <button
                        onClick={() =>
                          document
                            .getElementById("contact")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="text-red-500 hover:text-red-400 text-xs font-semibold inline-flex items-center gap-1 transition-transform duration-200 group-hover:translate-x-1 cursor-pointer"
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
                  className="group relative overflow-hidden bg-[#171717] border border-[#253147] rounded-2xl p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-red-600/60 hover:shadow-[0_12px_32px_rgba(255,0,0,0.18)] cursor-pointer"
                >
                  {/* Subtle red ambient blur glow */}
                  <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-red-700/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="relative z-10">
                    {/* Icon container with bounce/scale */}
                    <div className="w-11 h-11 rounded-xl bg-red-600/15 border border-red-600/20 flex items-center justify-center text-red-500 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-red-600/30 group-hover:border-red-500/50">
                      <srv.icon size={19} className="transition-transform duration-300 group-hover:rotate-6" />
                    </div>

                    {/* Title color shift */}
                    <h3 className="text-white text-lg font-bold tracking-[0.03em] mb-2 transition-colors duration-300 group-hover:text-red-500">
                      {srv.title}
                    </h3>

                    <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-4 min-h-[40px] transition-colors duration-200 group-hover:text-neutral-300">
                      {srv.desc}
                    </p>

                    {/* Feature list bullets with subtle ping on hover */}
                    <ul className="space-y-1.5">
                      {srv.feats.map((item, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-neutral-300 text-xs md:text-sm transition-colors duration-200 group-hover:text-neutral-200"
                        >
                          <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 transition-transform duration-200 group-hover:scale-125"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Package CTA with hover glow */}
            <div className="mt-12">
              <div
                className="group/cta relative overflow-hidden rounded-2xl border border-red-600/70 min-h-[190px] flex items-center justify-center text-center px-6 transition-all duration-300 hover:border-red-500 hover:shadow-[0_10px_35px_rgba(255,0,0,0.22)]"
                style={{
                  backgroundImage: `url(${customPackageBg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/65 group-hover/cta:bg-black/55 transition-colors duration-300"></div>

                <div className="relative z-10 max-w-3xl mx-auto px-6 text-center py-10 font-['Poppins',sans-serif]">
                  <h3 className="text-white text-2xl md:text-3xl font-extrabold uppercase tracking-[0.04em] mb-2 transition-colors duration-300 group-hover/cta:text-red-50">
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
                    className="bg-[#ff0000] hover:bg-red-700 text-white text-xs font-bold tracking-[0.12em] uppercase px-7 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-950/40 cursor-pointer"
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

            {(() => {
              const rentalPackages = [
                {
                  id: "livestream",
                  title: "LIVESTREAM PACKAGE",
                  desc: "Cameras, TriCaster system, monitors, communication sets, and full streaming rig",
                  image: equipLivestream,
                  modalTitle: "LIVESTREAM PACKAGE IN ACTION",
                  modalSub: "Multi-cam live broadcast to YouTube & Facebook with real-time graphics",
                  modalBody: "Multi-camera TriCaster production used at conferences, seminars, corporate events, and live broadcasts across the Philippines.",
                  tags: ["Corporate Conference", "Seminar / Forum", "Product Launch", "Awards Night", "Virtual Event"],
                  samples: [
                    { label: "Corporate Conference", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop", caption: "Multi-cam live broadcast setup with presentation feed integration" },
                    { label: "Film & Production Crew", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop", caption: "Professional camera crew deployed for large-scale event coverage" },
                    { label: "Live Event Broadcast", image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1000&auto=format&fit=crop", caption: "Camera operator capturing presenter footage for simultaneous streaming" },
                    { label: "Audience Coverage", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop", caption: "Wide audience shots integrated into the live stream production" },
                  ],
                },
                {
                  id: "projector",
                  title: "PROJECTOR PACKAGE",
                  desc: "Epson projectors, screens, stands, laptop, and all accessories included",
                  image: equipProjector,
                  modalTitle: "PROJECTOR PACKAGE IN ACTION",
                  modalSub: "Speaker presenting slides to a full auditorium via high-lumen Epson projector",
                  modalBody: "High-lumen Epson projection systems used at conferences, seminars, weddings, and training workshops across Metro Manila.",
                  tags: ["Conference / Seminar", "Wedding Reception", "Training Workshop", "Graduation Ceremony", "Church Service"],
                  samples: [
                    { label: "Conference Presentation", image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop", caption: "Speaker presenting slides to a full auditorium via high-lumen Epson projector" },
                    { label: "Seminar & Forum", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1000&auto=format&fit=crop", caption: "Panel discussion projected for large-venue audience visibility" },
                    { label: "Wedding Ceremony", image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop", caption: "Live feed of the altar projected on screens for all guests to see" },
                    { label: "Church & Worship Service", image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1000&auto=format&fit=crop", caption: "Song lyrics and scripture projected during Sunday worship gatherings" },
                  ],
                },
                {
                  id: "lights",
                  title: "LIGHTS & SOUNDS PACKAGE",
                  desc: "QSC speakers, DM3 mixer, LED lighting rig, DJ setup, and full cable run",
                  image: equipLights,
                  modalTitle: "LIGHTS & SOUNDS PACKAGE IN ACTION",
                  modalSub: "QSC main speakers and LED stage lighting at a full-capacity concert event",
                  modalBody: "QSC audio, DM3 mixing, DJ setup, and DMX LED lighting deployed at concerts, parties, worship nights, and corporate galas.",
                  tags: ["Concert / Show", "Worship Night", "Corporate Gala", "DJ Party / Prom", "Awards Ceremony"],
                  samples: [
                    { label: "Live Concert", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop", caption: "QSC main speakers and LED stage lighting at a full-capacity concert event" },
                    { label: "Worship Night", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop", caption: "Atmospheric LED wash and QSC audio for a large worship gathering" },
                    { label: "Stage Production", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop", caption: "Full lights and sounds rig deployed for a multi-act stage production" },
                    { label: "Music Festival Crowd", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop", caption: "Crowd-facing LED bars and subwoofer bass delivering an immersive experience" },
                  ],
                },
              ];

              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 items-stretch font-['Poppins',sans-serif]">
                  {rentalPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="group relative h-full bg-[#171717] border border-[#253147] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-red-600 hover:shadow-[0_14px_34px_rgba(255,0,0,0.15)] flex flex-col"
                    >
                      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-red-700/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />

                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/45 group-hover:bg-black/30 transition-colors duration-300" />

                        <button
                          onClick={() => {
                            setOpenSample(pkg);
                            setActiveSampleIndex(0);
                          }}
                          className="absolute top-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full border border-neutral-500/70 bg-black/60 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-red-500 hover:text-red-400"
                        >
                          View Event Samples
                        </button>
                      </div>

                      <div className="relative z-10 p-6 text-center flex flex-col flex-1 justify-between">
                        <div>
                          <h4 className="text-white text-lg md:text-xl font-bold uppercase tracking-[0.03em] leading-snug mb-3 transition-colors duration-300 group-hover:text-red-500">
                            {pkg.title}
                          </h4>

                          <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-6">
                            {pkg.desc}
                          </p>
                        </div>

                        <div>
                          <button
                            onClick={() => {
                              setAvailabilityModalPkg(pkg);
                              setStartDate(null);
                              setEndDate(null);
                            }}
                            className="text-red-500 hover:text-red-400 font-bold text-xs mb-4 block mx-auto cursor-pointer"
                          >
                            Contact for Quote
                          </button>

                          <button
                            onClick={() => {
                              setAvailabilityModalPkg(pkg);
                              setStartDate(null);
                              setEndDate(null);
                            }}
                            className="w-full bg-[#ff0000] hover:bg-red-700 text-white font-extrabold tracking-[0.12em] uppercase text-xs py-3 rounded-xl transition-colors cursor-pointer"
                          >
                            Check Availability
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            <h3 className="text-center text-2xl md:text-3xl font-extrabold uppercase tracking-[0.04em] text-white mb-8">
              Equipment Categories
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-stretch font-['Poppins',sans-serif]">
              {[
                {
                  id: "livestream",
                  icon: Camera,
                  title: "LIVESTREAM RENTAL",
                  desc: "Full broadcast-grade production equipment for live streaming events of any scale.",
                  items: ["Televisions", "Cameras", "Obsbot Camera", "TriCaster Video Production System"],
                  more: "+9 more items",
                  image: equipLivestream,
                },
                {
                  id: "projector",
                  icon: Monitor,
                  title: "PROJECTOR RENTAL",
                  desc: "Complete projection solutions for presentations, seminars, and corporate events.",
                  items: ["Epson Projectors", "Projector Stands", "Projector Screen", "Laptop"],
                  more: "+3 more items",
                  image: equipProjector,
                },
                {
                  id: "lights",
                  icon: Mic2,
                  title: "LIGHTS & SOUNDS",
                  desc: "Professional audio and dynamic lighting rigs that transform any venue into a stage-ready environment.",
                  items: ["Mic Rack", "Handheld Microphones", "DM3 Audio Mixer", "DJ Controller"],
                  more: "+19 more items",
                  image: equipLights,
                },
              ].map((cat, i) => (
                <div
                  key={i}
                  onClick={() => setActiveCategoryModal(cat.id)}
                  className="group relative h-full bg-[#171717] border border-[#253147] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-red-600 hover:shadow-[0_14px_34px_rgba(255,0,0,0.15)] flex flex-col cursor-pointer"
                >
                  <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-red-700/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />

                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/35 transition-colors duration-300"></div>

                    <div className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-red-600/20 border border-red-600/35 text-red-500 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-red-600/30">
                      <cat.icon size={14} />
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h4 className="text-white text-lg font-bold uppercase tracking-[0.03em] mb-2 transition-colors duration-300 group-hover:text-red-500">
                      {cat.title}
                    </h4>
                    <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-3">
                      {cat.desc}
                    </p>

                    <ul className="space-y-1.5 mb-3">
                      {cat.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-neutral-300 text-xs md:text-sm">
                          <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="text-neutral-500 text-xs mt-auto">{cat.more}</p>
                    <span className="mt-4 text-center bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">
                      Browse Equipment →
                    </span>
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
                  Can’t find what you’re looking for? Contact us for custom equipment
                  requests and full event production quotes.
                </p>
                <button
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-[#ff0000] hover:bg-red-700 text-white font-extrabold uppercase tracking-[0.12em] text-xs px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
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

    {/* Upcoming Events */}
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
            className="group relative bg-[#171717] border border-[#253147] rounded-2xl p-5 md:p-6 overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-red-600/60 hover:shadow-[0_12px_30px_rgba(255,0,0,0.15)] cursor-pointer"
          >
            {/* Ambient hover glow */}
            <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-red-600/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <span className="relative z-10 inline-flex items-center bg-red-900/40 text-red-500 text-[10px] font-bold tracking-[0.12em] px-3 py-1 rounded-full mb-3 border border-red-800/30 group-hover:border-red-600/50 group-hover:bg-red-950/60 transition-all duration-300">
              {evt.tag}
            </span>

            {/* Title Color Shift */}
            <h4 className="relative z-10 text-white text-lg md:text-xl font-bold uppercase tracking-[0.03em] mb-4 transition-colors duration-300 group-hover:text-red-500">
              {evt.title}
            </h4>

            {/* Icon Scale Animations */}
            <div className="relative z-10 space-y-2 text-neutral-300 text-xs md:text-sm">
              <p className="flex items-center gap-2 transition-colors duration-200 group-hover:text-neutral-200">
                <Calendar
                  size={13}
                  className="text-red-500 shrink-0 transition-transform duration-300 group-hover:scale-125"
                />{" "}
                {evt.date}
              </p>
              <p className="flex items-center gap-2 transition-colors duration-200 group-hover:text-neutral-200">
                <MapPin
                  size={13}
                  className="text-red-500 shrink-0 transition-transform duration-300 group-hover:scale-125"
                />{" "}
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
            className="group relative bg-[#171717] border border-[#253147] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.32)] flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-red-600/60 hover:shadow-[0_14px_34px_rgba(255,0,0,0.18)] cursor-pointer"
          >
            {/* Top Image + Tag */}
            <div>
              <div className="relative h-44 overflow-hidden bg-neutral-900">
                {/* Image scale zoom on card hover */}
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                {/* Overlay brightness adjustment */}
                <div className="absolute inset-0 bg-black/45 group-hover:bg-black/30 transition-colors duration-300"></div>

                <span className="absolute top-3 right-3 border border-red-600/70 bg-black/60 backdrop-blur-xs text-neutral-100 text-[10px] tracking-[0.1em] px-2.5 py-0.5 rounded-full group-hover:border-red-500 group-hover:bg-black/80 transition-all duration-300">
                  {evt.tag}
                </span>
              </div>

              {/* Title & Description */}
              <div className="p-5">
                <h4 className="text-white text-base font-bold uppercase tracking-[0.02em] leading-snug mb-2 transition-colors duration-300 group-hover:text-red-500">
                  {evt.title}
                </h4>
                <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-4 transition-colors duration-200 group-hover:text-neutral-300">
                  {evt.desc}
                </p>
              </div>
            </div>

            {/* Bottom Meta & Icons */}
            <div className="p-5 pt-0">
              <div className="border-t border-[#2a3345] pt-3 space-y-1.5 text-xs md:text-sm text-neutral-300 transition-colors duration-200 group-hover:text-neutral-200">
                <p className="flex items-center gap-2">
                  <Calendar
                    size={13}
                    className="text-red-500 shrink-0 transition-transform duration-300 group-hover:scale-125"
                  />{" "}
                  {evt.date}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin
                    size={13}
                    className="text-red-500 shrink-0 transition-transform duration-300 group-hover:scale-125"
                  />{" "}
                  {evt.location}
                </p>
                <p className="flex items-center gap-2">
                  <Users
                    size={13}
                    className="text-red-500 shrink-0 transition-transform duration-300 group-hover:scale-125"
                  />{" "}
                  {evt.attendees}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* CTA Card with Button Hover */}
    <div
      className="group relative overflow-hidden rounded-2xl border border-red-600/70 px-6 py-14 text-center transition-all duration-300 hover:border-red-500 hover:shadow-[0_10px_35px_rgba(255,0,0,0.22)]"
      style={{
        backgroundImage: `url(${eventsCtaBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/68 group-hover:bg-black/55 transition-colors duration-300"></div>

      <div className="relative z-10 max-w-3xl mx-auto font-['Poppins',sans-serif]">
        <h3 className="text-white text-2xl md:text-3xl font-extrabold uppercase tracking-[0.05em] mb-3 transition-colors duration-300 group-hover:text-red-50">
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
          className="bg-[#ff0000] hover:bg-red-700 text-white font-extrabold uppercase tracking-[0.12em] text-xs px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-950/40 cursor-pointer"
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
      {/* Contact Cards (Left Column) */}
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
            className="group relative bg-[#171717] border border-[#253147] rounded-2xl p-5 overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-red-600/60 hover:shadow-[0_10px_26px_rgba(255,0,0,0.15)] cursor-pointer"
          >
            {/* Ambient Red Glow on hover */}
            <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-red-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative z-10 flex items-start gap-3.5">
              {/* Icon Container with subtle scale on hover */}
              <div className="w-10 h-10 rounded-xl bg-red-600/15 text-red-500 border border-red-600/20 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-110 group-hover:bg-red-600/30 group-hover:border-red-500/50">
                <item.icon size={17} className="transition-transform duration-300 group-hover:rotate-6" />
              </div>
              <div>
                {/* Title Color Shift */}
                <h3 className="text-white text-sm md:text-base font-bold uppercase tracking-[0.03em] mb-1 transition-colors duration-300 group-hover:text-red-500">
                  {item.title}
                </h3>
                <div className="space-y-0.5">
                  {item.lines.map((line, idx) => (
                    <p
                      key={idx}
                      className="text-neutral-400 text-xs md:text-sm leading-relaxed transition-colors duration-200 group-hover:text-neutral-300"
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

      {/* Form Container (Right Column) */}
      <div className="lg:col-span-8 group/form relative overflow-hidden bg-[#171717] border border-[#253147] rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-red-600/40 hover:shadow-[0_14px_34px_rgba(0,0,0,0.4)]">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-red-700/12 blur-2xl transition-all duration-500 group-hover/form:bg-red-700/20 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-600/30 text-red-500 flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
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
                  className="w-full bg-black border border-[#2a3345] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-[11px] tracking-[0.12em] text-neutral-400 uppercase mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Dela Cruz"
                  className="w-full bg-black border border-[#2a3345] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all duration-200"
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
                  className="w-full bg-black border border-[#2a3345] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-[11px] tracking-[0.12em] text-neutral-400 uppercase mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+63 912 345 6789"
                  className="w-full bg-black border border-[#2a3345] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.12em] text-neutral-400 uppercase mb-2">
                Event Type
              </label>
              <input
                type="text"
                placeholder="e.g. Corporate Conference, Concert, Wedding"
                className="w-full bg-black border border-[#2a3345] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.12em] text-neutral-400 uppercase mb-2">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about your event..."
                className="w-full bg-black border border-[#2a3345] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all duration-200 resize-none"
              />
            </div>

            {/* Submit Button with Hover Lift and Arrow Movement */}
            <button
              type="submit"
              className="group/btn w-full bg-[#ff0000] hover:bg-red-700 text-white font-extrabold uppercase tracking-[0.12em] text-xs py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/30 hover:shadow-red-700/40 hover:-translate-y-0.5"
            >
              <span>Send Message</span>
              <Send
                size={15}
                className="transition-transform duration-200 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5"
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
       {/* --- E-COMMERCE CATEGORY SHOPPING MODAL (EXACT 100% ZOOM FIT) --- */}
{activeCategoryModal && equipmentCatalogs[activeCategoryModal] && (
  <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
    <div className="w-full max-w-6xl h-[92vh] max-h-[850px] bg-[#0c1017] border border-[#20293a] rounded-2xl overflow-hidden relative font-['Poppins',sans-serif] shadow-2xl text-white flex flex-col">
      
      {/* 1. Header (Fixed, hindi naiipit) */}
      <div className="px-6 py-4 border-b border-[#1c2436] flex items-center justify-between bg-[#0e131d] shrink-0">
        <div>
          <button
            type="button"
            onClick={() => setActiveCategoryModal(null)}
            className="text-[11px] font-semibold text-neutral-400 hover:text-white uppercase tracking-wider mb-1 flex items-center gap-1.5 cursor-pointer transition"
          >
            ← BACK TO CATEGORIES
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide text-white">
              {equipmentCatalogs[activeCategoryModal].title}
            </h2>
          </div>
          <p className="text-neutral-400 text-xs mt-0.5">
            {equipmentCatalogs[activeCategoryModal].subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveCategoryModal(null)}
          className="w-8 h-8 rounded-full border border-neutral-700 bg-black/40 text-neutral-300 hover:text-white hover:border-red-500 transition flex items-center justify-center cursor-pointer text-xs"
        >
          ✕
        </button>
      </div>

      {/* 2. Scrollable Body: Ito lang ang mag-iiscroll sa 100% zoom */}
      <div className="p-4 md:p-6 overflow-y-auto flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-max">
        {equipmentCatalogs[activeCategoryModal].items.map((prod, idx) => {
          const isInCart = cart.some((i) => i.name === prod.name);
          const isCameras = prod.name.toLowerCase() === "cameras";

          return (
            <div
              key={idx}
              className={`bg-[#121722] border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                isInCart
                  ? "border-red-600 shadow-[0_0_14px_rgba(255,0,0,0.3)] ring-1 ring-red-600"
                  : "border-[#20293a] hover:border-neutral-600"
              }`}
            >
              {/* Product Image */}
              <div className="relative h-32 w-full bg-black overflow-hidden shrink-0">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121722] via-transparent to-black/20" />

                {isCameras && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">
                    4 MODELS
                  </span>
                )}
              </div>

              {/* Text & Action Area */}
              <div className="p-3.5 flex flex-col flex-1 justify-between bg-[#121722]">
                <div>
                  <h4 className="font-extrabold uppercase text-white text-[12px] tracking-wide mb-1 truncate">
                    {prod.name}
                  </h4>
                  <p className="text-neutral-400 text-[11px] leading-relaxed line-clamp-2 min-h-[32px]">
                    {prod.desc}
                  </p>
                </div>

                <div className="mt-3">
                  <span className="text-red-500 font-extrabold text-[12px] tracking-wide block mb-2.5">
                    {prod.price}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isInCart) {
                        removeFromCart(prod.name);
                      } else {
                        addToCart(prod);
                      }
                    }}
                    className={`w-full py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                      isCameras
                        ? "border border-red-900/60 text-red-500 bg-red-950/20 hover:bg-red-900/30"
                        : isInCart
                        ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                        : "bg-[#161c28] hover:bg-[#1d2536] text-neutral-300 hover:text-white border border-[#242e42]"
                    }`}
                  >
                    {isCameras
                      ? "VIEW CAMERA OPTIONS →"
                      : isInCart
                      ? "ADDED TO CART ✓"
                      : "+ ADD TO CART"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Footer Bar (Fixed sa bottom, laging litaw sa 100% zoom) */}
      <div className="px-6 py-3.5 border-t border-[#1c2436] bg-[#0e131d] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <div className="text-xs text-neutral-300">
          <span className="text-red-500 font-bold">{cart.length}</span> item(s) selected in cart
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveCategoryModal(null)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 hover:text-white transition text-xs font-bold uppercase cursor-pointer"
          >
            CONTINUE BROWSING
          </button>
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={proceedToBooking}
            className={`w-full sm:w-auto px-7 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
              cart.length > 0
                ? "bg-[#ff0000] hover:bg-red-700 text-white shadow-lg shadow-red-600/30"
                : "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700"
            }`}
          >
            PROCEED TO BOOKING →
          </button>
        </div>
      </div>

    </div>
  </div>
)}
        {/* --- SAMPLE MODAL --- */}
        {openSample && (
          <div className="fixed inset-0 z-[90] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-[#171717] border border-[#253147] rounded-2xl overflow-hidden relative font-['Poppins',sans-serif] shadow-2xl">
              <button
                onClick={() => setOpenSample(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full border border-neutral-500/60 bg-black/35 text-neutral-200 hover:text-white hover:border-red-500 transition flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>

              <div className="relative h-56 md:h-64">
                <img
                  src={openSample.samples[activeSampleIndex]?.image || openSample.image}
                  alt={openSample.samples[activeSampleIndex]?.label || openSample.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <div className="absolute inset-0 bg-black/55" />

                <div className="absolute left-6 bottom-6 z-10 pr-6">
                  <span className="inline-block bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-widest">
                    Package
                  </span>
                  <h3 className="text-white text-xl md:text-3xl font-extrabold uppercase tracking-wide">
                    {openSample.modalTitle}
                  </h3>
                  <p className="text-neutral-300 text-xs md:text-sm mt-1">
                    {openSample.samples[activeSampleIndex]?.caption || openSample.modalSub}
                  </p>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <p className="text-neutral-300 text-xs md:text-sm leading-relaxed mb-6">
                  {openSample.modalBody}
                </p>

                <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500 mb-2 font-bold">
                  Best For
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {openSample.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full border border-red-600/60 text-red-500 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500 mb-3 font-bold">
                  Event Samples
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {openSample.samples.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSampleIndex(idx)}
                      className={`relative rounded-xl overflow-hidden border transition-all duration-200 text-left cursor-pointer ${
                        activeSampleIndex === idx
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-[#2a3345] hover:border-red-500/70"
                      }`}
                    >
                      <img src={sample.image} alt={sample.label} className="w-full h-16 object-cover" />
                      <div className="absolute inset-0 bg-black/40" />
                      <span className="absolute bottom-1 left-2 right-2 text-[10px] text-white font-semibold truncate">
                        {sample.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 pt-2 border-t border-[#253147]">
                  <button
                    onClick={() => {
                      const pkgToOpen = openSample;
                      setOpenSample(null);
                      setAvailabilityModalPkg(pkgToOpen);
                      setStartDate(null);
                      setEndDate(null);
                    }}
                    className="bg-[#ff0000] hover:bg-red-700 text-white font-extrabold uppercase tracking-[0.12em] text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    Check Availability
                  </button>
                  <button
                    onClick={() => setOpenSample(null)}
                    className="px-6 py-3 rounded-xl border border-[#3a4458] text-neutral-300 hover:text-white hover:border-red-500 transition text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- AVAILABILITY CALENDAR MODAL --- */}
        {availabilityModalPkg && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-[#0c0f17] border border-[#253147] rounded-2xl overflow-hidden relative font-['Poppins',sans-serif] shadow-2xl text-white">
              
              <div className="p-6 border-b border-[#253147] flex items-center justify-between">
                <div>
                  <span className="text-red-500 text-[10px] font-bold uppercase tracking-[0.2em]">Availability</span>
                  <h3 className="text-xl md:text-2xl font-extrabold uppercase tracking-wide mt-0.5">
                    {availabilityModalPkg.title}
                  </h3>
                </div>
                <button
                  onClick={() => setAvailabilityModalPkg(null)}
                  className="w-9 h-9 rounded-full border border-neutral-700 bg-black/40 text-neutral-300 hover:text-white hover:border-red-500 transition flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 text-center text-xs font-bold uppercase tracking-wider border-b border-[#253147]">
                <div className={`py-3.5 border-b-2 ${!endDate ? "border-red-600 text-white" : "border-transparent text-neutral-400"}`}>
                  1 · Start Date {startDate ? `(${startDate})` : ""}
                </div>
                <div className={`py-3.5 border-b-2 ${startDate ? "border-red-600 text-white" : "border-transparent text-neutral-600"}`}>
                  2 · End Date(s) {endDate ? `(${endDate})` : ""}
                </div>
              </div>

              <div className="p-6">
                <p className="text-center text-xs text-neutral-400 mb-6 uppercase tracking-wider">
                  {!startDate ? "Click one date as your event start" : "Optionally add end date(s) — Click a date to select"}
                </p>

                <div className="flex items-center justify-between mb-6 px-4">
                  <button 
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                    className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center hover:border-red-500 transition text-neutral-400 hover:text-white cursor-pointer"
                  >
                    ⟨
                  </button>
                  <h4 className="font-bold uppercase tracking-wider text-sm">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h4>
                  <button 
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                    className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center hover:border-red-500 transition text-neutral-400 hover:text-white cursor-pointer"
                  >
                    ⟩
                  </button>
                </div>

                <div className="grid grid-cols-7 text-center text-[11px] font-bold text-neutral-500 mb-3 uppercase tracking-wider">
                  <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-6">
                  {(() => {
                    const year = currentMonth.getFullYear();
                    const month = currentMonth.getMonth();
                    const firstDay = new Date(year, month, 1).getDay();
                    const totalDays = new Date(year, month + 1, 0).getDate();
                    const days = [];

                    for (let i = 0; i < firstDay; i++) {
                      days.push(<div key={`empty-${i}`} />);
                    }

                    for (let d = 1; d <= totalDays; d++) {
                      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                      const isBooked = bookedDates.includes(dateStr);
                      const isStart = startDate === dateStr;
                      const isEnd = endDate === dateStr;

                      let btnStyle = "bg-[#141824] border-[#253147] text-white hover:border-red-500 cursor-pointer";
                      if (isBooked) btnStyle = "bg-red-950/20 border-red-900/40 text-neutral-600 cursor-not-allowed";
                      if (isStart) btnStyle = "bg-white text-black font-bold border-white cursor-pointer";
                      if (isEnd) btnStyle = "bg-red-600 text-white font-bold border-red-600 cursor-pointer";

                      days.push(
                        <button
                          key={dateStr}
                          disabled={isBooked}
                          onClick={() => {
                            if (!startDate || (startDate && endDate)) {
                              setStartDate(dateStr);
                              setEndDate(null);
                            } else if (startDate && !endDate) {
                              if (dateStr < startDate) {
                                setStartDate(dateStr);
                              } else {
                                setEndDate(dateStr);
                              }
                            }
                          }}
                          className={`h-11 rounded-xl border text-sm font-semibold flex items-center justify-center transition-all ${btnStyle}`}
                        >
                          {d}
                        </button>
                      );
                    }
                    return days;
                  })()}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-neutral-400 mb-6 border-t border-[#253147] pt-4">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-950 border border-red-800" /> Booked</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-white" /> Start</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600" /> End Date(s)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#141824] border border-[#253147]" /> Available</span>
                </div>

                <div className="bg-[#141824] border border-[#253147] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-neutral-300">
                    <span className="text-neutral-500 block text-[10px] uppercase tracking-wider">Selected Range</span>
                    <span className="font-bold">{startDate || "Select a start date"} {endDate ? `→ ${endDate}` : ""}</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {startDate ? (
                      <button
                        onClick={() => {
                          const params = new URLSearchParams({
                            package: availabilityModalPkg.title,
                            start: startDate,
                            ...(endDate ? { end: endDate } : {})
                          });
                          navigate(`/client/booking?${params.toString()}`);
                        }}
                        className="w-full sm:w-auto bg-[#ff0000] hover:bg-red-700 text-white font-extrabold uppercase tracking-[0.12em] text-xs px-6 py-3 rounded-xl transition-colors shadow-lg shadow-red-600/30 cursor-pointer"
                      >
                        Continue to Booking →
                      </button>
                    ) : (
                      <button
                        onClick={() => setAvailabilityModalPkg(null)}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl border border-neutral-700 text-neutral-300 hover:text-white transition text-xs font-bold uppercase cursor-pointer"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Floating Chat Button */}
        <button className="fixed bottom-8 right-8 bg-[#ff0000] hover:bg-red-700 text-white p-4 rounded-full shadow-lg z-50 transition-colors cursor-pointer">
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
                        className="text-neutral-400 hover:text-white transition-colors text-sm cursor-pointer"
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