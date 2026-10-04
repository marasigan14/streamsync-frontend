import React, { useEffect, useState, useRef } from "react";
import ChatbotModal from "../client/ChatbotModal";
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
import leader1 from "../../assets/carlo.jpg";

import promoEarlyBird from "../../assets/promo-earlybird.jpg";
import promoWedding from "../../assets/promo-wedding.jpg";
import promoWebinar from "../../assets/promo-webinar.jpg";
import customPackageBg from "../../assets/banner1.jpg";

import equipLivestream from "../../assets/livestreampkg.jpg";
import equipProjector from "../../assets/projectorpkg.jpg";
import equipLights from "../../assets/lightspkg.jpg";
import equipCtaBg from "../../assets/banner2.jpg";

import eventIlhoon from "../../assets/past1.jpg";
import eventCorporate from "../../assets/testpicture.jpg";
import eventCooperative from "../../assets/past3.jpg";
import eventEsports from "../../assets/events/relx.jpg";
import eventConvention from "../../assets/events/korean.jpg";
import eventLandlite from "../../assets/events/landlite.jpg";
import eventGlobe from "../../assets/events/globe.jpg";
import eventsCtaBg from "../../assets/banner3.jpg";
import techsummit from "../../assets/events/techsummit.jpg"

// Displays
import tvImage from "../../assets/livestream/tvImage.jpg"
import tvImage2 from "../../assets/livestream/tvImage2.jpg"
import monitorImage from "../../assets/livestream/samsung22.jpg"
import monitorImage2 from "../../assets/livestream/asus24.jpg"
import monitorImage3 from "../../assets/livestream/dell24.jpg"
import monitorImage4 from "../../assets/livestream/dell27.jpg"

// Cameras & Capture
import lsCameras from "../../assets/livestream/camera-sony-pxw-z90.jpg"
import obsbot from "../../assets/livestream/obsbot.jpg"

// Switchers & Control
import tricaster1 from "../../assets/livestream/tricaster1.jpg"
import tricaster2 from "../../assets/livestream/tricaster2.jpg"
import switcher1 from "../../assets/livestream/bmd1.jpg"
import switcher2 from "../../assets/livestream/bmd2.jpg"
import switcher3 from "../../assets/livestream/roland.jpg"
import roland from "../../assets/livestream/roland.jpg"
import streamdeck from "../../assets/livestream/streamdeck.jpg"
import testpicture1 from "../../assets/livestream/testpicture.jpg"

// Audio & Comms
import commsets from "../../assets/livestream/commsets.jpg"
import focusrite from "../../assets/livestream/focusrite.jpg"

// Wireless & Clickers
import hollylandCosmoc1Wireless from "../../assets/livestream/hollyland-cosmoc1-wireless.jpg"
import accsoonCineview from "../../assets/livestream/accsoon-cineview.jpg"
import clickerPerfectCue from "../../assets/livestream/clicker-perfectcue.jpg"
import logitechClicker from "../../assets/livestream/logitech-clicker.jpg"

// Support & Stabilizers
import manfrottoTripod from "../../assets/livestream/manfrotto-tripod.jpg"
import manfrottoLightstand from "../../assets/livestream/manfrotto-lightstand.jpg"
import manfrottoPixieTripod from "../../assets/livestream/manfrotto-pixie-tripod.jpg"
import gimbalStabilizerDjiRs5 from "../../assets/livestream/gimbal-stabilizer-dji-rs-5.jpg"

// Power
import ups from "../../assets/livestream/ups.jpg"
import ups750 from "../../assets/livestream/ups-750.jpg"
import npfbattery from "../../assets/livestream/npfbattery.jpg"
import smallrigNpf970Charger from "../../assets/livestream/smallrig-npf970-charger.jpg"
import anker20kmahPowerbank from "../../assets/livestream/anker-20kmah-powerbank.jpg"

// Cables & Connectivity
import vention100m from "../../assets/livestream/vention100m.jpg"
import cableMiniUSB from "../../assets/livestream/cable-miniUSB.jpg"
import cableMicroUSB from "../../assets/livestream/cable-microUSB.jpg"
import cableTypeB from "../../assets/livestream/cable-typeB.jpg"
import cableTypeC from "../../assets/livestream/cable-typeC.jpg"
import cableMatters from "../../assets/livestream/cableMatters.jpg"
import hdmi1m from "../../assets/livestream/hdmi-1m.jpg"
import hdmi3m from "../../assets/livestream/hdmi-3m.jpg"
import hdmi15m from "../../assets/livestream/hdmi-15m.jpg"
import hdmi20m from "../../assets/livestream/hdmi-20m.jpg"
import sdicableShortie from "../../assets/livestream/sdicable-shortie.jpg"
import sdicable5m from "../../assets/livestream/sdicable-5m.jpg"
import sdicable10m from "../../assets/livestream/sdicable-10m.jpg"
import lancable3m from "../../assets/livestream/lancable-3m.jpg"
import lancable5m from "../../assets/livestream/lancable-5m.jpg"
import lancable20m from "../../assets/livestream/lancable-20m.jpg"
import lancable50m from "../../assets/livestream/lancable-50m.jpg"
import lancable75m from "../../assets/livestream/lancable-75m.jpg"

// Converters, Splitters & Capture Cards
import wyrestorm from "../../assets/livestream/wyrestorm.jpg"
import decimator from "../../assets/livestream/decimator.jpg"
import birddog from "../../assets/livestream/birddog.jpg"
import jtech from "../../assets/livestream/jtech.jpg"
import splitterHdmi1x4 from "../../assets/livestream/splitter-hdmi1x4.jpg"
import splitterAten1x8 from "../../assets/livestream/splitter-aten1x8.jpg"
import converterSdiHdmi from "../../assets/livestream/converter-sdi-hdmi.jpg"
import converterHdmiSdi from "../../assets/livestream/converter-hdmi-sdi.jpg"
import converterBiDirectional from "../../assets/livestream/converter-bi-directional.jpg"
import converterSdiHdmi4k from "../../assets/livestream/converter-sdi-hdmi-4k.jpg"
import lumantekEzMdPlus from "../../assets/livestream/Lumantek eZ-MD+.jpg"
import magewellCapturecard from "../../assets/livestream/magewell-capturecard.jpg"
import magewellCaptureGen2 from "../../assets/livestream/magewell-capture-gen2.jpg"
import decklink8kProG2Sm from "../../assets/livestream/decklink-8k-pro-g2-sm.jpg"
import bmdDecklinkDuo from "../../assets/livestream/bmd-decklink-duo.jpg"
import zoomh6 from "../../assets/livestream/zoomh6.jpg"
import ankerPowerport from "../../assets/livestream/anker-powerport.jpg"

// IT & Storage
import ssdSamsung from "../../assets/livestream/ssd-samsung.jpg"
import ugreenMulticardReaders from "../../assets/livestream/ugreen-multicard-readers.jpg"
import ugreenUsbexpansion from "../../assets/livestream/ugreen-usbexpansion.jpg"
import laptopAsusZephyus from "../../assets/livestream/laptop-asus-zephyus.jpg"
import laptopAsusRogstrix from "../../assets/livestream/laptop-asus-rogstrix.jpg"
import laptopAsusTufF15 from "../../assets/livestream/laptop-asus-tuf-f15.jpg"
import suncomm5gRouter from "../../assets/livestream/suncomm-5g-router.jpg"
import asusGamingRouter from "../../assets/livestream/asus-gaming-router.jpg"
import tplinkCpe710 from "../../assets/livestream/tplink-cpe710.jpg"
import mikrotikRouter from "../../assets/livestream/mikrotik-router.jpg"

// Media
import ajapakmedia from "../../assets/livestream/ajapakmedia.jpg"
import ajakipro from "../../assets/livestream/ajakipro.jpg"

import projector from "../../assets/projector/projector.jpg"
import projectorStand from "../../assets/projector/projectorStand.jpg"
import projectorBracket75 from "../../assets/projector/bracket75.jpg"
import projectorBracket912 from "../../assets/projector/bracket912.jpg"
import projectorScreen75 from "../../assets/projector/7x5 projector.jpg"
import projectorScreen912 from "../../assets/projector/9x12 projector stand and screen.jpg"
import laptop from "../../assets/projector/laptop-asus-tuf-f15.jpg"
import foldingTable from "../../assets/projector/lifetime mini table.jpg"
import extensionCord1 from "../../assets/projector/extension-omni15m.jpg"
import pushCart from "../../assets/projector/pushcart-prestar.jpg"


// Racks, Stands & Accessories
import testpicture from "../../assets/lightsSounds/testpicture.jpg"
import herculesDjStand from "../../assets/lightsSounds/hercules-djstand.jpg"
import herculesMicStand from "../../assets/lightsSounds/hercules-micstand.jpg"
import herculesLyricStand from "../../assets/lightsSounds/hercules-lyricstand.jpg"
import herculesSpeakerStand from "../../assets/lightsSounds/hercules-speakerstand.jpg"
import herculesLightStand from "../../assets/lightsSounds/hercules-ls700b-lightstand.jpg"
import rodePsa1 from "../../assets/lightsSounds/rode-psa1plus+studioarm.jpg"
import drumThrone from "../../assets/lightsSounds/drum throne.jpg"

// Audio Mixers & Interfaces
import yamahaDm3 from "../../assets/lightsSounds/dm3.jpg"
import ddjFlx4 from "../../assets/lightsSounds/ddj-flx4.jpg"
import whirlwindPcdi from "../../assets/lightsSounds/whirlwind-pcDI-box.jpg"
import radialProD2 from "../../assets/lightsSounds/radial-pro-d2.jpg"

// Microphones & Antennas
import slxD from "../../assets/lightsSounds/slx-d.jpg"
import shureUlxd2 from "../../assets/lightsSounds/shure-ulxd2.jpg"
import shureUlxd1 from "../../assets/lightsSounds/shure-ulxd1.jpg"
import rodeNtg3 from "../../assets/lightsSounds/rode-ntg-3.jpg"
import tmAm1Boom from "../../assets/lightsSounds/tm-am1-boom.jpg"
import rodeBlimp from "../../assets/lightsSounds/rode-blimp.jpg"
import shureBattery from "../../assets/lightsSounds/shure-battery.jpg"
import shureDualDock from "../../assets/lightsSounds/shure-dualdock-charger.jpg"
import shureUa874 from "../../assets/lightsSounds/shure-ua874-antenna.jpg"
import shureAntennaDist from "../../assets/lightsSounds/shure-antenna-distribution.jpg"
import senn835 from "../../assets/lightsSounds/sennheiser-e835.jpg"
import sennG4 from "../../assets/lightsSounds/sennheiser-g4lapel.jpg"
import bphs1 from "../../assets/lightsSounds/bphs1.jpg"
import steinberg from "../../assets/lightsSounds/steinberg-ur44.jpg"

// Speakers
import qscSpeakers from "../../assets/lightsSounds/speakers-qsc-k12.2.jpg"
import qscSub from "../../assets/lightsSounds/speaker-qsc-ks118-subwoofer.jpg"

// Lighting & FX
import tigerTouch2 from "../../assets/lightsSounds/tigertouch2.jpg"
import dmx384 from "../../assets/lightsSounds/dmx-384b-lightcontroller.jpg"
import ledBarLsl16 from "../../assets/lightsSounds/ledbar-lsl-16.jpg"
import ledPar from "../../assets/lightsSounds/ledpar.jpg"
import movingHeads from "../../assets/lightsSounds/movingheads-lbl295.jpg"
import hazeMachine from "../../assets/lightsSounds/haze-machine-jojen.jpg"

// Cables
import xlrCable3m from "../../assets/lightsSounds/xlrcable-3m.jpg"
import xlrCable20m from "../../assets/lightsSounds/xlrcable-20m.jpg"
import snakeCable from "../../assets/lightsSounds/hosa-stagebox-snakecable.jpg"
import dmxCable3m from "../../assets/lightsSounds/dmxcable-3m.jpg"
import dmxCable10m from "../../assets/lightsSounds/dmxcable-10m.jpg"
import ventionFiber from "../../assets/lightsSounds/vention-fiberopticcable-100m.jpg"

import omni10gang from "../../assets/lightsSounds/omni10gang.jpg"
import omni15m from "../../assets/lightsSounds/omni15m.jpg"

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
  const [expandedDesc, setExpandedDesc] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  // --- CHATBOT ---
  const [chatPosition, setChatPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

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

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDrag, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDrag);
      window.removeEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDrag);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    // Support both mouse and touch events
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    
    dragStart.current = {
      x: clientX - chatPosition.x,
      y: clientY - chatPosition.y,
    };
  };

  const handleDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

    // Prevent dragging outside window bounds
    const newX = Math.min(Math.max(0, clientX - dragStart.current.x), window.innerWidth - 60);
    const newY = Math.min(Math.max(0, clientY - dragStart.current.y), window.innerHeight - 60);

    setChatPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const equipmentCatalogs = {
  livestream: {
    title: "LIVESTREAM RENTAL",
    subtitle: "Full broadcast-grade production equipment for live streaming events of any scale.",
    items: [
      { name: "Sony Bravia 43 inches TV", desc: "4K HDR commercial display ideal for stage confidence, program return, and greenroom monitoring.", price: "₱2,500/day", image: tvImage },
      { name: "TCL 55 inches TV", desc: "Large-format 4K display for stage multiviewers, technical directors, and client monitoring booths.", price: "₱2,800/day", image: tvImage2 },
      { name: "Samsung 22 inches monitor", desc: "Compact desktop display for switcher multiview feeds, graphics preview, and streaming laptops.", price: "₱600/day", image: monitorImage },
      { name: "Asus 24 inches monitor", desc: "Full HD low-latency monitor for precise camera switching, multiview monitoring, and technical ops.", price: "₱800/day", image: monitorImage2 },
      { name: "Dell 24 inches monitor", desc: "Color-accurate IPS display for video shading, live color balancing, and graphics queuing.", price: "₱800/day", image: monitorImage3 },
      { name: "Dell 27 inches monitor", desc: "Spacious QHD/FHD display suited for multi-window vMix, OBS, and TriCaster interface monitoring.", price: "₱1,000/day", image: monitorImage4 },
      { name: "Sony PXW-Z90", desc: "Compact 4K HDR broadcast camcorder with fast hybrid autofocus, 12x optical zoom, and 3G-SDI output.", price: "₱3,500/day", image: lsCameras },
      { name: "Obsbot Tel-air", desc: "AI-powered PTZ webcam camera with automated subject tracking and gesture control for solo speakers.", price: "₱1,500/day", image: obsbot },
      { name: "Tricaster nc1 io", desc: "Multi-channel IP/NDI and SDI ingest/output interface module for hybrid live broadcast pipelines.", price: "₱12,000/day", image: tricaster1 },
      { name: "TriCaster tc1", desc: "Complete 16-channel 4K multi-camera switching, recording, streaming, and real-time graphics suite.", price: "₱18,000/day", image: tricaster2 },
      { name: "BMD Atem Studio HD", desc: "Broadcast live production switcher featuring 4 SDI and 4 HDMI inputs, DVE, and multi-view output.", price: "₱4,000/day", image: switcher1 },
      { name: "BMD Design Smartview 4k G3", desc: "Ultra HD broadcast rackmount monitor supporting 12G-SDI inputs, 3D LUTs, and on-screen tally.", price: "₱3,000/day", image: switcher2 },
      { name: "Roland xs 1-hd switcher", desc: "Multi-format 4-channel matrix switcher providing seamless cross-dissolve and multi-screen scaling.", price: "₱3,500/day", image: switcher3 },
      { name: "AJA Ki Pro Ultra 12g", desc: "Apple ProRes and Avid DNx multichannel 4K/UltraHD recorder with 12G-SDI and HDMI 2.0 connectivity.", price: "₱6,500/day", image: ajakipro },
      { name: "AJA Pak Media 1TB", desc: "High-speed solid-state recording media engineered for continuous broadcast captures on AJA systems.", price: "₱1,000/day", image: ajapakmedia },
      { name: "Hollyland Cosmo C1 Wireless Video Transmission System", desc: "Zero-latency wireless video transmitter and receiver set delivering uncompressed 1080p60 over 1,000 ft.", price: "₱2,200/day", image: hollylandCosmoc1Wireless },
      { name: "Accsoon CineView SE Video Transmitter and Receiver", desc: "Dual-band 2.4GHz & 5GHz wireless transmission system with up to 1,200 ft range and Quad-monitoring.", price: "₱1,800/day", image: accsoonCineview },
      { name: "Hollyland Cosmo C1 Commset", desc: "Full-duplex wireless crew intercom system providing crystal-clear production communication.", price: "₱2,500/day", image: commsets },
      { name: "Perfect Cue Clicker with Dual Transmitter System", desc: "Industry-standard presentation remote with RF dual-transmitters, visual cue lights, and USB slide advance.", price: "₱2,000/day", image: clickerPerfectCue },
      { name: "Zoom H6", desc: "Six-track portable audio field recorder with interchangeable microphone capsules and 4 XLR inputs.", price: "₱1,200/day", image: zoomh6 },
      { name: "Focusrite 18i20 4th Gen", desc: "Professional rackmount USB audio interface with 8 pristine preamps for master broadcast streaming audio.", price: "₱2,000/day", image: focusrite },
      { name: "Manfrotto Heavy Duty Tripod", desc: "Sturdy video tripod legs with fluid head for smooth, steady panning and tilt camera moves.", price: "₱800/day", image: manfrottoTripod },
      { name: "Manfrotto Light Stand", desc: "Heavy-duty telescoping stand for securely positioning key lights, fill panels, or wireless receivers.", price: "₱300/day", image: manfrottoLightstand },
      { name: "APC C1500 Uninterrupted Power Supply", desc: "1500VA battery backup and surge protector preventing production power loss to broadcast gear.", price: "₱1,200/day", image: ups },
      { name: "100 Meters Vention Fiber Optic Cable", desc: "High-speed active optical HDMI cable delivering loss-free 4K video across long event venue runs.", price: "₱600/day", image: vention100m },
      { name: "DJI RS 5 Gimbal Stabilizer", desc: "3-axis motorized camera stabilizer for cinematic roaming shots and dynamic moving camera coverage.", price: "₱2,500/day", image: gimbalStabilizerDjiRs5 },
      { name: "Anker PowerPort 6", desc: "Multi-port USB charging station providing regulated power for wireless receivers, tablets, and clickers.", price: "₱250/day", image: ankerPowerport },
      { name: "NPF Battery", desc: "High-capacity NP-F970 rechargeable lithium battery for monitors, LED fill panels, and wireless transmitters.", price: "₱200/day", image: npfbattery },
      { name: "NPF Fast Charger", desc: "Multi-slot quick charger for rapid turnover of production NP-F batteries on long event days.", price: "₱200/day", image: smallrigNpf970Charger },
      { name: "Mini-USB Cable", desc: "Durable auxiliary data and device-control interconnect cable.", price: "₱50/day", image: cableMiniUSB },
      { name: "Micro-USB Cable", desc: "Standard peripheral data/power cable for legacy gear, controllers, and charging docks.", price: "₱50/day", image: cableMicroUSB },
      { name: "USB Type B Cable", desc: "Reliable USB 2.0 host cable for connecting audio interfaces, DACs, and control units to PCs.", price: "₱50/day", image: cableTypeB },
      { name: "USB Type C Cable", desc: "High-throughput data, power, and video interconnect cable for modern streaming capture workflows.", price: "₱80/day", image: cableTypeC },
      { name: "Wyrestorm EX-35-H2 HDMI Extenders", desc: "HDBaseT point-to-point HDMI transmitter and receiver set over standard Cat6 networking runs.", price: "₱1,000/day", image: wyrestorm },
      { name: "Decimator MD-HX with Power Adapter", desc: "Miniature cross-converter handling HDMI/SDI scaling, frame rate conversion, and signal distribution.", price: "₱1,500/day", image: decimator },
      { name: "Birddog Studio NDI with Power Adapter", desc: "Hardware encoder/decoder converting SDI/HDMI feeds into full-bandwidth NDI streams over LAN.", price: "₱1,800/day", image: birddog },
      { name: "Jtech Digital HDMI Splitter 1x2", desc: "1-in 2-out HDMI splitter supporting full 4K resolution and EDID management for multi-screen feeds.", price: "₱300/day", image: jtech },
      { name: "Rei HDMI Splitter 1x4", desc: "Compact 1-in 4-out powered distribution amplifier duplicating video signals to up to 4 monitors.", price: "₱450/day", image: splitterHdmi1x4 },
      { name: "Aten 1x8 HDMI Splitter", desc: "Professional 8-port HDMI distribution amplifier delivering synchronized video feeds across event halls.", price: "₱750/day", image: splitterAten1x8 },
      { name: "Cable Matters USB C HDMI Adapter", desc: "Plug-and-play video converter for outputting clean presentation slides from USB-C laptops to switchers.", price: "₱200/day", image: cableMatters },
      { name: "BMD SDI to HDMI Mini Converters", desc: "Rugged broadcast converter transforming camera SDI signals to HDMI for local displays and multiviewers.", price: "₱500/day", image: converterSdiHdmi },
      { name: "BMD HDMI to SDI Mini Converters", desc: "Broadcast-grade converter converting HDMI laptop and camera outputs into professional SDI runs.", price: "₱500/day", image: converterHdmiSdi },
      { name: "BMD Bi Directional Mini Converter", desc: "Simultaneous cross-converter passing SDI to HDMI and HDMI to SDI in different formats at the same time.", price: "₱650/day", image: converterBiDirectional },
      { name: "BMD SDI to HDMI 4k Heavy Duty", desc: "Machined aircraft-grade aluminum video converter built for intense stage use and 4K signal integrity.", price: "₱850/day", image: converterSdiHdmi4k },
      { name: "Samsung 970 Evo External Hard Disk 1TB", desc: "Ultra-fast NVMe solid-state storage in a rugged USB-C enclosure for uncompressed master program recording.", price: "₱500/day", image: ssdSamsung },
      { name: "Stream Deck XL", desc: "32-key customizable LCD macro control surface for instant switcher cuts, graphics firing, and audio cues.", price: "₱1,200/day", image: streamdeck },
      { name: "Manfrotto Pixie Tripod", desc: "Compact desktop mini-tripod for mounting webcams, audio recorders, or wireless receiver antennas.", price: "₱150/day", image: manfrottoPixieTripod },
      { name: "Logitech Clicker", desc: "Ergonomic wireless slide clicker with red laser pointer for smooth stage presentations.", price: "₱250/day", image: logitechClicker },
      { name: "Anker 20000 Mah Power bank", desc: "Heavy-duty portable external battery providing extended runtime for mobile cameras and field rigs.", price: "₱300/day", image: anker20kmahPowerbank },
      { name: "Short SDI Cables", desc: "Patch-length 3G/6G-SDI cables for tidy interconnects between cameras, monitors, and converters.", price: "₱80/day", image: sdicableShortie },
      { name: "Lumantek eZ-MD+", desc: "Cross-converter and down/up/cross scaler handling conversions between HDMI and SDI signals reliably.", price: "₱1,500/day", image: lumantekEzMdPlus },
      { name: "Magewell Capture Card HDMI 4k Plus", desc: "Low-latency external USB 3.0 video capture card accepting up to 4K60 video inputs.", price: "₱1,000/day", image: magewellCapturecard },
      { name: "Magewell USB Capture HDMI Gen 2", desc: "Industry-standard driverless USB video capture dongle for clean 1080p camera inputs into streaming software.", price: "₱800/day", image: magewellCaptureGen2 },
      { name: "UGREEN Multicard Readers", desc: "High-speed USB 3.0 multi-format memory card reader for rapid SD/microSD footage ingestion.", price: "₱150/day", image: ugreenMulticardReaders },
      { name: "UGREEN USB Expansion", desc: "Powered multi-port USB hub ensuring stable peripheral connections to central production laptops.", price: "₱200/day", image: ugreenUsbexpansion },
      { name: "Asus Zephyrus Dual Screen", desc: "Flagship dual-display workstation laptop for live video encoding, multiview, and master streaming.", price: "₱3,500/day", image: laptopAsusZephyus },
      { name: "Asus ROG Strix G15 15 inch", desc: "High-performance gaming laptop with dedicated GPU for vMix production, virtual sets, and graphics.", price: "₱2,800/day", image: laptopAsusRogstrix },
      { name: "Asus TUF 15 inch", desc: "Reliable production laptop optimized for secondary live recording, presentation playback, and stream backup.", price: "₱2,200/day", image: laptopAsusTufF15 },
      { name: "Suncomm 5G Router", desc: "High-speed 5G cellular bonded/failover SIM router providing redundant uplink bandwidth on location.", price: "₱1,500/day", image: suncomm5gRouter },
      { name: "Asus Gaming Router", desc: "High-throughput Wi-Fi 6 router providing dedicated local IP networking for NDI video and tech crew ops.", price: "₱800/day", image: asusGamingRouter },
      { name: "TP Link CPE710", desc: "Outdoor high-gain directional wireless bridge dish for establishing long-range line-of-sight data links.", price: "₱700/day", image: tplinkCpe710 },
      { name: "HDMI Cable (1 meter)", desc: "Short high-speed HDMI patch cable for video monitor and capture card interconnects.", price: "₱50/day", image: hdmi1m },
      { name: "HDMI Cable (3 meters)", desc: "Standard 3m HDMI cable connecting switcher control tables to local tech monitors and laptops.", price: "₱80/day", image: hdmi3m },
      { name: "HDMI Cable (15 meters)", desc: "Long high-speed HDMI run with signal repeater for stage screens and distant confidence displays.", price: "₱200/day", image: hdmi15m },
      { name: "HDMI Cable (20 meters)", desc: "Heavy-gauge reinforced 20m HDMI cable for routing video feeds across medium venue stages.", price: "₱250/day", image: hdmi20m },
      { name: "SDI Cable (5 meters)", desc: "Flexible high-performance 75-ohm BNC cable for connecting nearby cameras to video switchers.", price: "₱100/day", image: sdicable5m },
      { name: "SDI Cable (10 meters)", desc: "Durable shielded coaxial SDI cable for routing clean digital camera signals around the control desk.", price: "₱150/day", image: sdicable10m },
      { name: "LAN Cable (3 meters)", desc: "Cat6 Ethernet patch cable for local switcher, audio console, and streaming laptop connections.", price: "₱50/day", image: lancable3m },
      { name: "LAN Cable (5 meters)", desc: "Standard Cat6 network cable connecting production desks to local network switches and routers.", price: "₱80/day", image: lancable5m },
      { name: "LAN Cable (20 meters)", desc: "Heavy-duty Cat6 Ethernet cable for running IP networks between FOH control and stage equipment.", price: "₱200/day", image: lancable20m },
      { name: "LAN Cable (50 meters)", desc: "Spool-grade Cat6 network cable for long-distance event venue network distribution and NDI streams.", price: "₱350/day", image: lancable50m },
      { name: "LAN Cable (75 meters)", desc: "Extra long heavy-gauge shielded Cat6 drum for expansive outdoor and auditorium production lines.", price: "₱500/day", image: lancable75m },
      { name: "Roland XS 1-hd", desc: "Compact multi-format matrix video switcher with built-in scalers on all inputs and preview outputs.", price: "₱3,500/day", image: roland },
      { name: "BMD Decklink 8k Pro G2", desc: "PCIe 8-lane capture card featuring four bi-directional 12G-SDI connections for high-end ingest.", price: "₱4,500/day", image: decklink8kProG2Sm },
      { name: "BMD Decklink Duo", desc: "PCIe capture card with 4 independent SDI channels configurable as capture or playback for custom rigs.", price: "₱3,000/day", image: bmdDecklinkDuo },
      { name: "Microtik 4011b Router", desc: "Enterprise 10-port Gigabit router with 10Gbps SFP+ cage for mission-critical network routing and QoS.", price: "₱1,200/day", image: mikrotikRouter },
      { name: "APC 750i UPS", desc: "Compact battery backup unit protecting streaming workstations and audio interfaces against voltage drops.", price: "₱800/day", image: ups750 },
    ]
  },
  projector: {
    title: "PROJECTOR RENTAL",
    subtitle: "Complete projection solutions for presentations, seminars, and corporate events.",
    items: [
      { name: "Epson 2255u 5k Lumnes Projector", desc: "High-lumen Epson projector delivering sharp WUXGA full HD images even in well-lit conference and event halls.", price: "₱3,500/day", image: projector },
      { name: "Projector Stands", desc: "Adjustable heavy-duty tripod stands for optimal projector elevation and projection angle alignment.", price: "₱500/day", image: projectorStand },
      { name: "Projector 7.5 x 10 Bracket", desc: "Heavy-duty structural mounting bracket and hardware designed for secure 7.5x10 ft screen truss hanging.", price: "₱800/day", image: projectorBracket75 },
      { name: "Projector 9 x 12 Bracket", desc: "Reinforced stage mounting bracket kit for securing large 9x12 ft fast-fold projection frames.", price: "₱1,000/day", image: projectorBracket912 },
      { name: "Projector Screen 7.5 x 10", desc: "Matte white professional fast-fold projection screen providing high-contrast, uniform visuals for medium audiences.", price: "₱1,500/day", image: projectorScreen75 },
      { name: "Projector Screen 9 x 12", desc: "Large-format fast-fold stage projection screen engineered for plenary halls, conventions, and ballrooms.", price: "₱2,200/day", image: projectorScreen912 },
      { name: "Laptop", desc: "High-performance laptops pre-configured for smooth slide playback, video, and presentation software.", price: "₱2,000/day", image: laptop },
      { name: "Mini Folding Table", desc: "Compact, durable folding table for staging technical laptops, clicker bases, and projector controllers.", price: "₱300/day", image: foldingTable },
      { name: "Extension Cord", desc: "Heavy-gauge extension cords ensuring reliable power delivery to the projector and supporting equipment.", price: "₱200/day", image: extensionCord1 },
      { name: "Prestar Push Cart", desc: "Heavy-duty silenced platform trolley for safe and swift transport of sensitive AV cases and equipment on site.", price: "₱400/day", image: pushCart },
    ]
  },
  lights: {
    title: "LIGHTS & SOUNDS",
    subtitle: "Professional audio and dynamic lighting rigs that transform any venue into a stage-ready environment.",
    items: [
      // --- AUDIO: Mixers, Controllers & DI ---
      { name: "Yamaha DM3 Dante Digital Audio Mixer", desc: "Ultra-compact 16-channel digital mixing console featuring Dante networking and broadcast-ready USB audio.", price: "₱3,500/day", image: yamahaDm3 },
      { name: "Pioneer DDJ FLX-4", desc: "Industry-standard 2-channel DJ controller for event music programming, walk-in tracks, and stage stings.", price: "₱2,500/day", image: ddjFlx4 },
      { name: "Whirlwind pcDi Box", desc: "Dual-channel passive direct box with RCA, 3.5mm, and 1/4\" inputs for hum-free laptop audio direct to mixers.", price: "₱400/day", image: whirlwindPcdi },
      { name: "Radial Pro D2", desc: "High-end passive stereo direct box built with custom transformers to eliminate ground loops on stage instruments.", price: "₱600/day", image: radialProD2 },
      { name: "Steinberg UR44", desc: "6x4 USB 2.0 audio interface with 4 D-PRE microphone preamps and latency-free DSP hardware monitoring.", price: "₱1,200/day", image: steinberg },

      // --- AUDIO: Speakers & Subs ---
      { name: "QSC k12.2 Speakers", desc: "2000-watt powered active 12-inch point-source loudspeaker delivering high SPL and pristine clarity.", price: "₱2,250/day", image: qscSpeakers },
      { name: "QSC ks118 Sub", desc: "3600-watt direct-radiating 18-inch powered subwoofer delivering deep, chest-thumping low-end bass.", price: "₱3,500/day", image: qscSub },

      // --- AUDIO: Microphones & Wireless Systems ---
      { name: "Shure SLXD System Handheld Mics", desc: "Transparent 24-bit digital wireless handheld microphone system with stable RF for events and talks.", price: "₱1,800/day", image: slxD },
      { name: "Shure ULXD System Handheld Mics", desc: "Tour-grade digital wireless handheld system with exceptional audio clarity and AES-256 encryption.", price: "₱2,500/day", image: shureUlxd2 },
      { name: "Shure ULXD1 System with DPA Headworn Mics", desc: "Premium discrete miniature headset microphone paired with ULX-D bodypack for elite stage speakers.", price: "₱3,000/day", image: shureUlxd1 },
      { name: "Sennheiser E-835 Mics", desc: "Durable cardioid dynamic lead vocal stage microphone with high feedback rejection.", price: "₱300/day", image: senn835 },
      { name: "Sennheiser G4 Lapel Set", desc: "Industry-workhorse wireless lavalier clip-on microphone system for keynotes, interviews, and panel discussions.", price: "₱1,500/day", image: sennG4 },
      { name: "Bphs1 Audio Technica", desc: "Broadcast stereo headset with closed-back dynamic ears and cardioid boom mic for production commentators.", price: "₱800/day", image: bphs1 },
      { name: "Rode NTG3 Boom Mic", desc: "Precision broadcast shotgun microphone with RF-bias technology offering warm sound and high moisture resistance.", price: "₱1,500/day", image: rodeNtg3 },
      { name: "Secondary Boom Mics", desc: "Directional condenser shotgun mic setup for audience reaction, backup boom, and stage ambient pickup.", price: "₱800/day", image: tmAm1Boom },
      { name: "RODE BLIMP", desc: "Complete windshield and shock mounting acoustic basket system eliminating stage draft and wind rumble.", price: "₱600/day", image: rodeBlimp },

      // --- AUDIO: Wireless Accessories ---
      { name: "Shure Lithium Batteries", desc: "Rechargeable SB900 lithium-ion battery packs providing up to 9+ hours of continuous mic operation.", price: "₱200/day", image: shureBattery },
      { name: "Shure Dual Battery Dock Chargers", desc: "Networked dual-dock charging station for real-time monitoring and recharging of Shure transmitter packs.", price: "₱400/day", image: shureDualDock },
      { name: "Shure UA-874 Directional Antennas", desc: "Active directional paddle antenna with integrated RF amplifier for clean wireless reception across large venues.", price: "₱1,000/day", image: shureUa874 },
      { name: "Shure Antenna Distribution System", desc: "4-way active antenna splitter feeding up to 4 dual-receivers from a single pair of paddle antennas.", price: "₱1,200/day", image: shureAntennaDist },

      // --- LIGHTING: Controllers & Fixtures ---
      { name: "Tigertouch 2 Light Controller", desc: "Flagship multi-touch console with motorized faders and expansive DMX universes for full concert lighting rigs.", price: "₱8,000/day", image: tigerTouch2 },
      { name: "DMX-384 Light Controller", desc: "Standard 19-inch rackmount DMX operator console for controlling par cans, washes, and basic moving heads.", price: "₱1,500/day", image: dmx384 },
      { name: "LED BAR lsl-16s", desc: "Multi-segment RGBW linear wash bar creating vibrant wall grazes, backdrop washes, and stage silhouettes.", price: "₱600/day", image: ledBarLsl16 },
      { name: "LED PAR Lumilites lps-6033", desc: "High-output RGBW LED par can for front stage wash, spotlighting, and atmospheric room accent uplighting.", price: "₱400/day", image: ledPar },
      { name: "LBL-295 Moving Heads", desc: "High-intensity 295W beam moving head fixture producing razor-sharp aerial prism patterns and stage dynamics.", price: "₱1,800/day", image: movingHeads },
      { name: "JOJEN Haze Machine 1000W", desc: "Professional continuous oil/water-based haze generator creating an even optical mist to highlight lighting beams.", price: "₱1,500/day", image: hazeMachine },

      // --- STANDS & MOUNTS ---
      { name: "Mic Rack", desc: "Rugged flight-case rack designed for organized stage storage, transport, and charging of wireless microphones.", price: "₱300/day", image: testpicture },
      { name: "Hercules DJ Stand", desc: "Foldable heavy-duty stage table stand engineered for DJ decks, laptops, and tabletop mixers.", price: "₱500/day", image: herculesDjStand },
      { name: "Hercules Speaker Stand", desc: "Heavy-duty aluminum speaker tripod with Quick-N-EZ auto lock system supporting up to 45kg loads.", price: "₱350/day", image: herculesSpeakerStand },
      { name: "Hercules MS5 33B Mic Stand", desc: "Professional stage microphone stand with weighted round base and Hideaway boom arm.", price: "₱200/day", image: herculesMicStand },
      { name: "Hercules Orchestral Stand BS311B", desc: "Perforated aluminum sheet music and script desk stand with EZ angle adjustment for stage conductors.", price: "₱250/day", image: herculesLyricStand },
      { name: "Hercules LS700B – Gear Up Lighting Stand", desc: "Heavy-duty hand-crank lighting tripod extending to 3.5m with dual T-bars for flying par cans and movers.", price: "₱800/day", image: herculesLightStand },
      { name: "RODE PSA 1+ studio arm", desc: "Premium articulated desk-mount studio boom arm with silent springs for live podcast and commentator mics.", price: "₱400/day", image: rodePsa1 },
      { name: "PEARL Drum throne d-730s", desc: "Ergonomic round padded musician stool with double-braced tripod legs for stage performers and drummers.", price: "₱300/day", image: drumThrone },

      // --- CABLES & POWER ---
      { name: "XLR Cable 3 Meters", desc: "Balanced studio-grade oxygen-free microphone cable with genuine Neutrik connectors for clean audio paths.", price: "₱80/day", image: xlrCable3m },
      { name: "XLR Cable 20 Meters", desc: "Durable heavy-jacketed balanced XLR cable for long runs from stage microphones to sub-snakes and FOH.", price: "₱150/day", image: xlrCable20m },
      { name: "Snake Cable", desc: "Multi-channel stage audio snake box streamlining multi-microphone cable runs to the front-of-house mixer.", price: "₱800/day", image: snakeCable },
      { name: "DMX Cables 3 Meters", desc: "True 110-ohm shielded DMX data patch cable for linking adjacent lighting fixtures without flicker.", price: "₱80/day", image: dmxCable3m },
      { name: "DMX Cables 20 Meters", desc: "Long shielded DMX512 cable for routing digital lighting control signals from console to stage trusses.", price: "₱150/day", image: dmxCable10m },
      { name: "HDMI Cables", desc: "High-speed active/passive video cable delivering crystal-clear digital video signal playback across displays.", price: "₱150/day", image: ventionFiber },
      { name: "Omni 15 Meters Extension Cord", desc: "Heavy-duty rubber-coated 15m power cord providing safe high-wattage electricity distribution across venues.", price: "₱200/day", image: omni15m },
      { name: "Omni 10 Gang Extension Cord", desc: "Surge-protected multi-outlet power distribution strip designed to power complete technical tables and rigs.", price: "₱250/day", image: omni10gang },
    ]
  },
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
                onClick={() => navigate("/client/booking")} // Changed this line
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

            {/* --- OWNER 
            <div className="mt-16 md:mt-20">
              <h3 className="text-2xl md:text-3xl font-black tracking-wide uppercase text-center mb-10 text-white">
                OWNED BY 
              </h3>

              <div className="flex justify-center">
                {[
                  {
                    image: leader1,
                    name: "Carlos S. Garcia",
                    role: "Founder & CEO",
                    bio: "Tech Enthusiast - Events Management",
                  },
                ].map((leader, i) => (
                  <div
                    key={i}
                    className="w-full max-w-sm bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-red-600/50 hover:shadow-[0_12px_30px_rgba(255,0,0,0.12)] cursor-pointer"
                  >
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full p-[2px] bg-red-600/30">
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="w-full h-full rounded-full object-cover"
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
            </div> --- */}
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
                onClick={(e) => {
                  e.stopPropagation(); // Prevents clicking issues with the parent div
                  if (session) {
                    navigate("/client/booking");
                  } else {
                    alert("Please sign in or create an account to book this promo.");
                    navigate("/login");
                  }
                }}
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

            {/* BANNER 1 */}
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
            tag: "PRIVATE",
            title: "TNT BOOTCAMP",
            date: "October 21, 2026",
            location: "Restricted",
          },
          {
            tag: "PRIVATE",
            title: "TNT SAYAOKE",
            date: "October 26, 2026",
            location: "Restricted",
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
            tag: "CONCERT",
            title: "Jung Il-hoon's Art Class Concert",
            desc: "Il-hoons first concert in the Philippines.",
            date: "July 22, 2026",
            location: "SM Skydome ",
            attendees: "5,000+ attendees",
            image: eventIlhoon,
          },
          {
            tag: "CONFERENCE",
            title: "ASEAN Tech Summit 2026",
            desc: "ASEAN Tech Summit for this year.",
            date: "July 28-29, 2026",
            location: "Prohibited",
            attendees: "Prohibited",
            image: techsummit,
          },
          {
            tag: "ASSEMBLY",
            title: "Batangas Electric Cooperative Assembly",
            desc: "7 Location Livestreaming done for Batangas Electric Cooperative.",
            date: "April 06, 2026",
            location: "Different parts of Batangas",
            attendees: "1,000+ attendees",
            image: eventCooperative,
          },
          {
            tag: "ESPORTS",
            title: "ONLINE GAMING TOURNAMENT",
            desc: "Multi-day esports tournament with live commentary and instant replays.",
            date: "July 08, 2026",
            location: "UP Technohub",
            attendees: "100+ attendees",
            image: eventEsports,
          },
          {
            tag: "CONFERENCE",
            title: "LANDLITE CONFERENCE",
            desc: "Prohibited",
            date: "June 27, 2026",
            location: "Parañaque",
            attendees: "100 onsite 200 online",
            image: eventLandlite,
          },
          {
            tag: "CONVENTION",
            title: "KOREAN BUSINESS CONVENTION PHILIPPINES",
            desc: "Prohibited.",
            date: "June 24-26, 2026",
            location: "Alabang",
            attendees: "200 online attendees",
            image: eventConvention,
          },
          {
            tag: "AWARDING",
            title: "GLOBE BUSINESS PARTNERS AWARDS",
            desc: "Globe business partners awarding day.",
            date: "May 14, 2026",
            location: "Taguig City",
            attendees: "150 online attendees",
            image: eventGlobe,
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
                  className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setPreviewImage(prod.image)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121722] via-transparent to-black/20 pointer-events-none" />

                {isCameras && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded pointer-events-none">
                    4 MODELS
                  </span>
                )}
              </div>

              {/* Text & Action Area */}
              <div className="p-3.5 flex flex-col flex-1 justify-between bg-[#121722]">
                <div>
                  <h4 className="font-extrabold uppercase text-white text-[12px] tracking-wide mb-1 truncate" title={prod.name}>
                    {prod.name}
                  </h4>

                  {/* Expandable Description */}
                  <p className={`text-neutral-400 text-[11px] leading-relaxed transition-all duration-200 ${
                    expandedDesc[prod.name] ? "" : "line-clamp-2"
                  }`}>
                    {prod.desc}
                  </p>

                  {/* See more / See less button */}
                  {prod.desc && prod.desc.length > 70 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedDesc((prev) => ({
                          ...prev,
                          [prod.name]: !prev[prod.name],
                        }));
                      }}
                      className="text-[10px] font-bold text-red-500 hover:text-red-400 mt-1 cursor-pointer transition-colors block"
                    >
                      {expandedDesc[prod.name] ? "See less ↑" : "See more ↓"}
                    </button>
                  )}
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

        {previewImage && (
          <div 
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative flex items-center justify-center max-w-5xl w-full h-full">
              <button 
                className="absolute top-4 right-4 md:top-8 md:right-8 text-white text-4xl hover:text-red-500 transition-colors z-10 cursor-pointer"
                onClick={() => setPreviewImage(null)}
              >
                &times;
              </button>
              <img 
                src={previewImage} 
                alt="Preview" 
                className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl"
                onClick={(e) => e.stopPropagation()} 
              />
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

       {/* --- FLOATING CHAT BUTTON --- */}
        <div 
          className="fixed z-[999] bg-[#ff0000] hover:bg-red-700 text-white p-4 rounded-full shadow-[0_4px_14px_rgba(255,0,0,0.4)] transition-colors cursor-grab active:cursor-grabbing flex items-center justify-center"
          style={{ 
            left: `${chatPosition.x}px`, 
            top: `${chatPosition.y}px`,
            width: '60px',
            height: '60px'
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onClick={(e) => {
            // Prevent opening chat if the user was just dragging it
            if (isDragging) e.preventDefault();
            else {
              console.log("Open Chatbot Modal!");
              // ADD YOUR CHATBOT TOGGLE STATE HERE: setIsChatOpen(true);
            }
          }}
        >
          <MessageSquare size={24} />
        </div>

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