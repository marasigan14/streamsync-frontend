import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Home,
  CalendarPlus,
  BookOpen,
  CreditCard,
  User,
  Sun,
  Moon,
  LogOut,
  Calendar,
  Check,
  Plus,
  Sparkles,
  QrCode,
  Upload,
  AlertTriangle,
  FileText,
  Clock,
  Send,
  Save,
  Bookmark,
  MessageSquare,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import logoImage from "../../assets/livestream-logo.png";
import MyBookings from "./MyBookings";

// Displays
import tvImage from "../../assets/livestream/tvImage.jpg";
import tvImage2 from "../../assets/livestream/tvImage2.jpg";
import monitorImage from "../../assets/livestream/samsung22.jpg";
import monitorImage2 from "../../assets/livestream/asus24.jpg";
import monitorImage3 from "../../assets/livestream/dell24.jpg";
import monitorImage4 from "../../assets/livestream/dell27.jpg";

// Cameras & Capture
import lsCameras from "../../assets/livestream/camera-sony-pxw-z90.jpg";
import obsbot from "../../assets/livestream/obsbot.jpg";

// Switchers & Control
import tricaster1 from "../../assets/livestream/tricaster1.jpg";
import tricaster2 from "../../assets/livestream/tricaster2.jpg";
import switcher1 from "../../assets/livestream/bmd1.jpg";
import switcher2 from "../../assets/livestream/bmd2.jpg";
import switcher3 from "../../assets/livestream/roland.jpg";
import roland from "../../assets/livestream/roland.jpg";
import streamdeck from "../../assets/livestream/streamdeck.jpg";
import testpicture1 from "../../assets/livestream/testpicture.jpg";

// Audio & Comms
import commsets from "../../assets/livestream/commsets.jpg";
import focusrite from "../../assets/livestream/focusrite.jpg";

// Wireless & Clickers
import hollylandCosmoc1Wireless from "../../assets/livestream/hollyland-cosmoc1-wireless.jpg";
import accsoonCineview from "../../assets/livestream/accsoon-cineview.jpg";
import clickerPerfectCue from "../../assets/livestream/clicker-perfectcue.jpg";
import logitechClicker from "../../assets/livestream/logitech-clicker.jpg";

// Support & Stabilizers
import manfrottoTripod from "../../assets/livestream/manfrotto-tripod.jpg";
import manfrottoLightstand from "../../assets/livestream/manfrotto-lightstand.jpg";
import manfrottoPixieTripod from "../../assets/livestream/manfrotto-pixie-tripod.jpg";
import gimbalStabilizerDjiRs5 from "../../assets/livestream/gimbal-stabilizer-dji-rs-5.jpg";

// Power
import ups from "../../assets/livestream/ups.jpg";
import ups750 from "../../assets/livestream/ups-750.jpg";
import npfbattery from "../../assets/livestream/npfbattery.jpg";
import smallrigNpf970Charger from "../../assets/livestream/smallrig-npf970-charger.jpg";
import anker20kmahPowerbank from "../../assets/livestream/anker-20kmah-powerbank.jpg";

// Cables & Connectivity
import vention100m from "../../assets/livestream/vention100m.jpg";
import cableMiniUSB from "../../assets/livestream/cable-miniUSB.jpg";
import cableMicroUSB from "../../assets/livestream/cable-microUSB.jpg";
import cableTypeB from "../../assets/livestream/cable-typeB.jpg";
import cableTypeC from "../../assets/livestream/cable-typeC.jpg";
import cableMatters from "../../assets/livestream/cableMatters.jpg";
import hdmi1m from "../../assets/livestream/hdmi-1m.jpg";
import hdmi3m from "../../assets/livestream/hdmi-3m.jpg";
import hdmi15m from "../../assets/livestream/hdmi-15m.jpg";
import hdmi20m from "../../assets/livestream/hdmi-20m.jpg";
import sdicableShortie from "../../assets/livestream/sdicable-shortie.jpg";
import sdicable5m from "../../assets/livestream/sdicable-5m.jpg";
import sdicable10m from "../../assets/livestream/sdicable-10m.jpg";
import lancable3m from "../../assets/livestream/lancable-3m.jpg";
import lancable5m from "../../assets/livestream/lancable-5m.jpg";
import lancable20m from "../../assets/livestream/lancable-20m.jpg";
import lancable50m from "../../assets/livestream/lancable-50m.jpg";
import lancable75m from "../../assets/livestream/lancable-75m.jpg";

// Converters, Splitters & Capture Cards
import wyrestorm from "../../assets/livestream/wyrestorm.jpg";
import decimator from "../../assets/livestream/decimator.jpg";
import birddog from "../../assets/livestream/birddog.jpg";
import jtech from "../../assets/livestream/jtech.jpg";
import splitterHdmi1x4 from "../../assets/livestream/splitter-hdmi1x4.jpg";
import splitterAten1x8 from "../../assets/livestream/splitter-aten1x8.jpg";
import converterSdiHdmi from "../../assets/livestream/converter-sdi-hdmi.jpg";
import converterHdmiSdi from "../../assets/livestream/converter-hdmi-sdi.jpg";
import converterBiDirectional from "../../assets/livestream/converter-bi-directional.jpg";
import converterSdiHdmi4k from "../../assets/livestream/converter-sdi-hdmi-4k.jpg";
import lumantekEzMdPlus from "../../assets/livestream/Lumantek eZ-MD+.jpg";
import magewellCapturecard from "../../assets/livestream/magewell-capturecard.jpg";
import magewellCaptureGen2 from "../../assets/livestream/magewell-capture-gen2.jpg";
import decklink8kProG2Sm from "../../assets/livestream/decklink-8k-pro-g2-sm.jpg";
import bmdDecklinkDuo from "../../assets/livestream/bmd-decklink-duo.jpg";
import zoomh6 from "../../assets/livestream/zoomh6.jpg";
import ankerPowerport from "../../assets/livestream/anker-powerport.jpg";

// Workstations & Routers
import ssdSamsung from "../../assets/livestream/ssd-samsung.jpg";
import ugreenMulticardReaders from "../../assets/livestream/ugreen-multicard-readers.jpg";
import ugreenUsbexpansion from "../../assets/livestream/ugreen-usbexpansion.jpg";
import laptopAsusZephyus from "../../assets/livestream/laptop-asus-zephyus.jpg";
import laptopAsusRogstrix from "../../assets/livestream/laptop-asus-rogstrix.jpg";
import laptopAsusTufF15 from "../../assets/livestream/laptop-asus-tuf-f15.jpg";
import suncomm5gRouter from "../../assets/livestream/suncomm-5g-router.jpg";
import asusGamingRouter from "../../assets/livestream/asus-gaming-router.jpg";
import tplinkCpe710 from "../../assets/livestream/tplink-cpe710.jpg";
import mikrotikRouter from "../../assets/livestream/mikrotik-router.jpg";

// Storage Media
import ajapakmedia from "../../assets/livestream/ajapakmedia.jpg";
import ajakipro from "../../assets/livestream/ajakipro.jpg";

// Projector Hardware & Screens
import projector from "../../assets/projector/projector.jpg";
import projectorStand from "../../assets/projector/projectorStand.jpg";
import projectorBracket75 from "../../assets/projector/bracket75.jpg";
import projectorBracket58 from "../../assets/projector/bracket85.jpg";
import projectorBracket912 from "../../assets/projector/bracket912.jpg";
import projectorScreen75 from "../../assets/projector/7x5 projector.jpg";
import projectorScreen912 from "../../assets/projector/9x12 projector stand and screen.jpg";
import laptop from "../../assets/projector/laptop-asus-tuf-f15.jpg";
import foldingTable from "../../assets/projector/lifetime mini table.jpg";
import extensionCord1 from "../../assets/projector/extension-omni15m.jpg";
import pushCart from "../../assets/projector/pushcart-prestar.jpg";

// Lights & Audio Racks
import testpicture from "../../assets/lightsSounds/testpicture.jpg";
import herculesDjStand from "../../assets/lightsSounds/hercules-djstand.jpg";
import herculesMicStand from "../../assets/lightsSounds/hercules-micstand.jpg";
import herculesLyricStand from "../../assets/lightsSounds/hercules-lyricstand.jpg";
import herculesSpeakerStand from "../../assets/lightsSounds/hercules-speakerstand.jpg";
import herculesLightStand from "../../assets/lightsSounds/hercules-ls700b-lightstand.jpg";
import rodePsa1 from "../../assets/lightsSounds/rode-psa1plus+studioarm.jpg";
import drumThrone from "../../assets/lightsSounds/drum throne.jpg";

// Audio Mixers & Interfaces
import yamahaDm3 from "../../assets/lightsSounds/dm3.jpg";
import ddjFlx4 from "../../assets/lightsSounds/ddj-flx4.jpg";
import whirlwindPcdi from "../../assets/lightsSounds/whirlwind-pcDI-box.jpg";
import radialProD2 from "../../assets/lightsSounds/radial-pro-d2.jpg";

// Microphones & Antennas
import slxD from "../../assets/lightsSounds/slx-d.jpg";
import shureUlxd2 from "../../assets/lightsSounds/shure-ulxd2.jpg";
import shureUlxd1 from "../../assets/lightsSounds/shure-ulxd1.jpg";
import rodeNtg3 from "../../assets/lightsSounds/rode-ntg-3.jpg";
import tmAm1Boom from "../../assets/lightsSounds/tm-am1-boom.jpg";
import rodeBlimp from "../../assets/lightsSounds/rode-blimp.jpg";
import shureBattery from "../../assets/lightsSounds/shure-battery.jpg";
import shureDualDock from "../../assets/lightsSounds/shure-dualdock-charger.jpg";
import shureUa874 from "../../assets/lightsSounds/shure-ua874-antenna.jpg";
import shureAntennaDist from "../../assets/lightsSounds/shure-antenna-distribution.jpg";
import senn835 from "../../assets/lightsSounds/sennheiser-e835.jpg";
import sennG4 from "../../assets/lightsSounds/sennheiser-g4lapel.jpg";
import bphs1 from "../../assets/lightsSounds/bphs1.jpg";
import steinberg from "../../assets/lightsSounds/steinberg-ur44.jpg";

// Speakers
import qscSpeakers from "../../assets/lightsSounds/speakers-qsc-k12.2.jpg";
import qscSub from "../../assets/lightsSounds/speaker-qsc-ks118-subwoofer.jpg";

// Lighting & Atmosphere
import tigerTouch2 from "../../assets/lightsSounds/tigertouch2.jpg";
import dmx384 from "../../assets/lightsSounds/dmx-384b-lightcontroller.jpg";
import ledBarLsl16 from "../../assets/lightsSounds/ledbar-lsl-16.jpg";
import ledPar from "../../assets/lightsSounds/ledpar.jpg";
import movingHeads from "../../assets/lightsSounds/movingheads-lbl295.jpg";
import hazeMachine from "../../assets/lightsSounds/haze-machine-jojen.jpg";

// Cables
import xlrCable3m from "../../assets/lightsSounds/xlrcable-3m.jpg";
import xlrCable20m from "../../assets/lightsSounds/xlrcable-20m.jpg";
import snakeCable from "../../assets/lightsSounds/hosa-stagebox-snakecable.jpg";
import dmxCable3m from "../../assets/lightsSounds/dmxcable-3m.jpg";
import dmxCable10m from "../../assets/lightsSounds/dmxcable-10m.jpg";
import ventionFiber from "../../assets/lightsSounds/vention-fiberopticcable-100m.jpg";
import omni10gang from "../../assets/lightsSounds/omni10gang.jpg";
import omni15m from "../../assets/lightsSounds/omni15m.jpg";

const API_URL = import.meta.env.VITE_API_URL || "https://streamsync-backend-4cn7.onrender.com";

// Master inventory catalog
const equipmentCatalogs = {
  livestream: {
    title: "LIVESTREAM RENTAL",
    subtitle:
      "Full broadcast-grade production equipment for live streaming events of any scale.",
    items: [
      {
        name: "Sony Bravia 43 inches TV",
        desc: "4K HDR commercial display ideal for stage confidence, program return, and greenroom monitoring.",
        price: "₱2,500/day",
        image: tvImage,
      },
      {
        name: "TCL 55 inches TV",
        desc: "Large-format 4K display for stage multiviewers, technical directors, and client monitoring booths.",
        price: "₱2,800/day",
        image: tvImage2,
      },
      {
        name: "Samsung 22 inches monitor",
        desc: "Compact desktop display for switcher multiview feeds, graphics preview, and streaming laptops.",
        price: "₱600/day",
        image: monitorImage,
      },
      {
        name: "Asus 24 inches monitor",
        desc: "Full HD low-latency monitor for precise camera switching, multiview monitoring, and technical ops.",
        price: "₱800/day",
        image: monitorImage2,
      },
      {
        name: "Dell 24 inches monitor",
        desc: "Color-accurate IPS display for video shading, live color balancing, and graphics queuing.",
        price: "₱800/day",
        image: monitorImage3,
      },
      {
        name: "Dell 27 inches monitor",
        desc: "Spacious QHD/FHD display suited for multi-window vMix, OBS, and TriCaster interface monitoring.",
        price: "₱1,000/day",
        image: monitorImage4,
      },
      {
        name: "Sony PXW-Z90",
        desc: "Compact 4K HDR broadcast camcorder with fast hybrid autofocus, 12x optical zoom, and 3G-SDI output.",
        price: "₱3,500/day",
        image: lsCameras,
      },
      {
        name: "Obsbot Tel-air",
        desc: "AI-powered PTZ webcam camera with automated subject tracking and gesture control for solo speakers.",
        price: "₱1,500/day",
        image: obsbot,
      },
      {
        name: "Tricaster nc1 io",
        desc: "Multi-channel IP/NDI and SDI ingest/output interface module for hybrid live broadcast pipelines.",
        price: "₱12,000/day",
        image: tricaster1,
      },
      {
        name: "TriCaster tc1",
        desc: "Complete 16-channel 4K multi-camera switching, recording, streaming, and real-time graphics suite.",
        price: "₱18,000/day",
        image: tricaster2,
      },
      {
        name: "BMD Atem Studio HD",
        desc: "Broadcast live production switcher featuring 4 SDI and 4 HDMI inputs, DVE, and multi-view output.",
        price: "₱4,000/day",
        image: switcher1,
      },
      {
        name: "BMD Design Smartview 4k G3",
        desc: "Ultra HD broadcast rackmount monitor supporting 12G-SDI inputs, 3D LUTs, and on-screen tally.",
        price: "₱3,000/day",
        image: switcher2,
      },
      {
        name: "Roland xs 1-hd switcher",
        desc: "Multi-format 4-channel matrix switcher providing seamless cross-dissolve and multi-screen scaling.",
        price: "₱3,500/day",
        image: switcher3,
      },
      {
        name: "AJA Ki Pro Ultra 12g",
        desc: "Apple ProRes and Avid DNx multichannel 4K/UltraHD recorder with 12G-SDI and HDMI 2.0 connectivity.",
        price: "₱6,500/day",
        image: ajakipro,
      },
      {
        name: "AJA Pak Media 1TB",
        desc: "High-speed solid-state recording media engineered for continuous broadcast captures on AJA systems.",
        price: "₱1,000/day",
        image: ajapakmedia,
      },
      {
        name: "Hollyland Cosmo C1 Wireless Video Transmission System",
        desc: "Zero-latency wireless video transmitter and receiver set delivering uncompressed 1080p60 over 1,000 ft.",
        price: "₱2,200/day",
        image: hollylandCosmoc1Wireless,
      },
      {
        name: "Accsoon CineView SE Video Transmitter and Receiver",
        desc: "Dual-band 2.4GHz & 5GHz wireless transmission system with up to 1,200 ft range and Quad-monitoring.",
        price: "₱1,800/day",
        image: accsoonCineview,
      },
      {
        name: "Hollyland Cosmo C1 Commset",
        desc: "Full-duplex wireless crew intercom system providing crystal-clear production communication.",
        price: "₱2,500/day",
        image: commsets,
      },
      {
        name: "Perfect Cue Clicker with Dual Transmitter System",
        desc: "Industry-standard presentation remote with RF dual-transmitters, visual cue lights, and USB slide advance.",
        price: "₱2,000/day",
        image: clickerPerfectCue,
      },
      {
        name: "Zoom H6",
        desc: "Six-track portable audio field recorder with interchangeable microphone capsules and 4 XLR inputs.",
        price: "₱1,200/day",
        image: zoomh6,
      },
      {
        name: "Focusrite 18i20 4th Gen",
        desc: "Professional rackmount USB audio interface with 8 pristine preamps for master broadcast streaming audio.",
        price: "₱2,000/day",
        image: focusrite,
      },
      {
        name: "Manfrotto Heavy Duty Tripod",
        desc: "Sturdy video tripod legs with fluid head for smooth, steady panning and tilt camera moves.",
        price: "₱800/day",
        image: manfrottoTripod,
      },
      {
        name: "Manfrotto Light Stand",
        desc: "Heavy-duty telescoping stand for securely positioning key lights, fill panels, or wireless receivers.",
        price: "₱300/day",
        image: manfrottoLightstand,
      },
      {
        name: "APC C1500 Uninterrupted Power Supply",
        desc: "1500VA battery backup and surge protector preventing production power loss to broadcast gear.",
        price: "₱1,200/day",
        image: ups,
      },
      {
        name: "100 Meters Vention Fiber Optic Cable",
        desc: "High-speed active optical HDMI cable delivering loss-free 4K video across long event venue runs.",
        price: "₱600/day",
        image: vention100m,
      },
      {
        name: "DJI RS 5 Gimbal Stabilizer",
        desc: "3-axis motorized camera stabilizer for cinematic roaming shots and dynamic moving camera coverage.",
        price: "₱2,500/day",
        image: gimbalStabilizerDjiRs5,
      },
      {
        name: "Anker PowerPort 6",
        desc: "Multi-port USB charging station providing regulated power for wireless receivers, tablets, and clickers.",
        price: "₱250/day",
        image: ankerPowerport,
      },
      {
        name: "NPF Battery",
        desc: "High-capacity NP-F970 rechargeable lithium battery for monitors, LED fill panels, and wireless transmitters.",
        price: "₱200/day",
        image: npfbattery,
      },
      {
        name: "NPF Fast Charger",
        desc: "Multi-slot quick charger for rapid turnover of production NP-F batteries on long event days.",
        price: "₱200/day",
        image: smallrigNpf970Charger,
      },
      {
        name: "Mini-USB Cable",
        desc: "Durable auxiliary data and device-control interconnect cable.",
        price: "₱50/day",
        image: cableMiniUSB,
      },
      {
        name: "Micro-USB Cable",
        desc: "Standard peripheral data/power cable for legacy gear, controllers, and charging docks.",
        price: "₱50/day",
        image: cableMicroUSB,
      },
      {
        name: "USB Type B Cable",
        desc: "Reliable USB 2.0 host cable for connecting audio interfaces, DACs, and control units to PCs.",
        price: "₱50/day",
        image: cableTypeB,
      },
      {
        name: "USB Type C Cable",
        desc: "High-throughput data, power, and video interconnect cable for modern streaming capture workflows.",
        price: "₱80/day",
        image: cableTypeC,
      },
      {
        name: "Wyrestorm EX-35-H2 HDMI Extenders",
        desc: "HDBaseT point-to-point HDMI transmitter and receiver set over standard Cat6 networking runs.",
        price: "₱1,000/day",
        image: wyrestorm,
      },
      {
        name: "Decimator MD-HX with Power Adapter",
        desc: "Miniature cross-converter handling HDMI/SDI scaling, frame rate conversion, and signal distribution.",
        price: "₱1,500/day",
        image: decimator,
      },
      {
        name: "Birddog Studio NDI with Power Adapter",
        desc: "Hardware encoder/decoder converting SDI/HDMI feeds into full-bandwidth NDI streams over LAN.",
        price: "₱1,800/day",
        image: birddog,
      },
      {
        name: "Jtech Digital HDMI Splitter 1x2",
        desc: "1-in 2-out HDMI splitter supporting full 4K resolution and EDID management for multi-screen feeds.",
        price: "₱300/day",
        image: jtech,
      },
      {
        name: "Rei HDMI Splitter 1x4",
        desc: "Compact 1-in 4-out powered distribution amplifier duplicating video signals to up to 4 monitors.",
        price: "₱450/day",
        image: splitterHdmi1x4,
      },
      {
        name: "Aten 1x8 HDMI Splitter",
        desc: "Professional 8-port HDMI distribution amplifier delivering synchronized video feeds across event halls.",
        price: "₱750/day",
        image: splitterAten1x8,
      },
      {
        name: "Cable Matters USB C HDMI Adapter",
        desc: "Plug-and-play video converter for outputting clean presentation slides from USB-C laptops to switchers.",
        price: "₱200/day",
        image: cableMatters,
      },
      {
        name: "BMD SDI to HDMI Mini Converters",
        desc: "Rugged broadcast converter transforming camera SDI signals to HDMI for local displays and multiviewers.",
        price: "₱500/day",
        image: converterSdiHdmi,
      },
      {
        name: "BMD HDMI to SDI Mini Converters",
        desc: "Broadcast-grade converter converting HDMI laptop and camera outputs into professional SDI runs.",
        price: "₱500/day",
        image: converterHdmiSdi,
      },
      {
        name: "BMD Bi Directional Mini Converter",
        desc: "Simultaneous cross-converter passing SDI to HDMI and HDMI to SDI in different formats at the same time.",
        price: "₱650/day",
        image: converterBiDirectional,
      },
      {
        name: "BMD SDI to HDMI 4k Heavy Duty",
        desc: "Machined aircraft-grade aluminum video converter built for intense stage use and 4K signal integrity.",
        price: "₱850/day",
        image: converterSdiHdmi4k,
      },
      {
        name: "Samsung 970 Evo External Hard Disk 1TB",
        desc: "Ultra-fast NVMe solid-state storage in a rugged USB-C enclosure for uncompressed master program recording.",
        price: "₱500/day",
        image: ssdSamsung,
      },
      {
        name: "Stream Deck XL",
        desc: "32-key customizable LCD macro control surface for instant switcher cuts, graphics firing, and audio cues.",
        price: "₱1,200/day",
        image: streamdeck,
      },
      {
        name: "Manfrotto Pixie Tripod",
        desc: "Compact desktop mini-tripod for mounting webcams, audio recorders, or wireless receiver antennas.",
        price: "₱150/day",
        image: manfrottoPixieTripod,
      },
      {
        name: "Logitech Clicker",
        desc: "Ergonomic wireless slide clicker with red laser pointer for smooth stage presentations.",
        price: "₱250/day",
        image: logitechClicker,
      },
      {
        name: "Anker 20000 Mah Power bank",
        desc: "Heavy-duty portable external battery providing extended runtime for mobile cameras and field rigs.",
        price: "₱300/day",
        image: anker20kmahPowerbank,
      },
      {
        name: "Short SDI Cables",
        desc: "Patch-length 3G/6G-SDI cables for tidy interconnects between cameras, monitors, and converters.",
        price: "₱80/day",
        image: sdicableShortie,
      },
      {
        name: "Lumantek eZ-MD+",
        desc: "Cross-converter and down/up/cross scaler handling conversions between HDMI and SDI signals reliably.",
        price: "₱1,500/day",
        image: lumantekEzMdPlus,
      },
      {
        name: "Magewell Capture Card HDMI 4k Plus",
        desc: "Low-latency external USB 3.0 video capture card accepting up to 4K60 video inputs.",
        price: "₱1,000/day",
        image: magewellCapturecard,
      },
      {
        name: "Magewell USB Capture HDMI Gen 2",
        desc: "Industry-standard driverless USB video capture dongle for clean 1080p camera inputs into streaming software.",
        price: "₱800/day",
        image: magewellCaptureGen2,
      },
      {
        name: "UGREEN Multicard Readers",
        desc: "High-speed USB 3.0 multi-format memory card reader for rapid SD/microSD footage ingestion.",
        price: "₱150/day",
        image: ugreenMulticardReaders,
      },
      {
        name: "UGREEN USB Expansion",
        desc: "Powered multi-port USB hub ensuring stable peripheral connections to central production laptops.",
        price: "₱200/day",
        image: ugreenUsbexpansion,
      },
      {
        name: "Asus Zephyrus Dual Screen",
        desc: "Flagship dual-display workstation laptop for live video encoding, multiview, and master streaming.",
        price: "₱3,500/day",
        image: laptopAsusZephyus,
      },
      {
        name: "Asus ROG Strix G15 15 inch",
        desc: "High-performance gaming laptop with dedicated GPU for vMix production, virtual sets, and graphics.",
        price: "₱2,800/day",
        image: laptopAsusRogstrix,
      },
      {
        name: "Asus TUF 15 inch",
        desc: "Reliable production laptop optimized for secondary live recording, presentation playback, and stream backup.",
        price: "₱2,200/day",
        image: laptopAsusTufF15,
      },
      {
        name: "Suncomm 5G Router",
        desc: "High-speed 5G cellular bonded/failover SIM router providing redundant uplink bandwidth on location.",
        price: "₱1,500/day",
        image: suncomm5gRouter,
      },
      {
        name: "Asus Gaming Router",
        desc: "High-throughput Wi-Fi 6 router providing dedicated local IP networking for NDI video and tech crew ops.",
        price: "₱800/day",
        image: asusGamingRouter,
      },
      {
        name: "TP Link CPE710",
        desc: "Outdoor high-gain directional wireless bridge dish for establishing long-range line-of-sight data links.",
        price: "₱700/day",
        image: tplinkCpe710,
      },
      {
        name: "HDMI Cable (1 meter)",
        desc: "Short high-speed HDMI patch cable for video monitor and capture card interconnects.",
        price: "₱50/day",
        image: hdmi1m,
      },
      {
        name: "HDMI Cable (3 meters)",
        desc: "Standard 3m HDMI cable connecting switcher control tables to local tech monitors and laptops.",
        price: "₱80/day",
        image: hdmi3m,
      },
      {
        name: "HDMI Cable (15 meters)",
        desc: "Long high-speed HDMI run with signal repeater for stage screens and distant confidence displays.",
        price: "₱200/day",
        image: hdmi15m,
      },
      {
        name: "HDMI Cable (20 meters)",
        desc: "Heavy-gauge reinforced 20m HDMI cable for routing video feeds across medium venue stages.",
        price: "₱250/day",
        image: hdmi20m,
      },
      {
        name: "SDI Cable (5 meters)",
        desc: "Flexible high-performance 75-ohm BNC cable for connecting nearby cameras to video switchers.",
        price: "₱100/day",
        image: sdicable5m,
      },
      {
        name: "SDI Cable (10 meters)",
        desc: "Durable shielded coaxial SDI cable for routing clean digital camera signals around the control desk.",
        price: "₱150/day",
        image: sdicable10m,
      },
      {
        name: "LAN Cable (3 meters)",
        desc: "Cat6 Ethernet patch cable for local switcher, audio console, and streaming laptop connections.",
        price: "₱50/day",
        image: lancable3m,
      },
      {
        name: "LAN Cable (5 meters)",
        desc: "Standard Cat6 network cable connecting production desks to local network switches and routers.",
        price: "₱80/day",
        image: lancable5m,
      },
      {
        name: "LAN Cable (20 meters)",
        desc: "Heavy-duty Cat6 Ethernet cable for running IP networks between FOH control and stage equipment.",
        price: "₱200/day",
        image: lancable20m,
      },
      {
        name: "LAN Cable (50 meters)",
        desc: "Spool-grade Cat6 network cable for long-distance event venue network distribution and NDI streams.",
        price: "₱350/day",
        image: lancable50m,
      },
      {
        name: "LAN Cable (75 meters)",
        desc: "Extra long heavy-gauge shielded Cat6 drum for expansive outdoor and auditorium production lines.",
        price: "₱500/day",
        image: lancable75m,
      },
      {
        name: "Roland XS 1-hd",
        desc: "Compact multi-format matrix video switcher with built-in scalers on all inputs and preview outputs.",
        price: "₱3,500/day",
        image: roland,
      },
      {
        name: "BMD Decklink 8k Pro G2",
        desc: "PCIe 8-lane capture card featuring four bi-directional 12G-SDI connections for high-end ingest.",
        price: "₱4,500/day",
        image: decklink8kProG2Sm,
      },
      {
        name: "BMD Decklink Duo",
        desc: "PCIe capture card with 4 independent SDI channels configurable as capture or playback for custom rigs.",
        price: "₱3,000/day",
        image: bmdDecklinkDuo,
      },
      {
        name: "Microtik 4011b Router",
        desc: "Enterprise 10-port Gigabit router with 10Gbps SFP+ cage for mission-critical network routing and QoS.",
        price: "₱1,200/day",
        image: mikrotikRouter,
      },
      {
        name: "APC 750i UPS",
        desc: "Compact battery backup unit protecting streaming workstations and audio interfaces against voltage drops.",
        price: "₱800/day",
        image: ups750,
      },
    ],
  },
  projector: {
    title: "PROJECTOR RENTAL",
    subtitle:
      "Complete projection solutions for presentations, seminars, and corporate events.",
    items: [
      {
        id: "epson-2255u",
        name: "Epson 2255u 5k Lumens Projector",
        desc: "High-lumen Epson projector delivering sharp WUXGA full HD images even in well-lit conference and event halls.",
        price: "₱3,500/day",
        image: projector,
      },
      {
        id: "projector-stands",
        name: "Projector Stands",
        desc: "Adjustable heavy-duty tripod stands for optimal projector elevation and projection angle alignment.",
        price: "₱500/day",
        image: projectorStand,
      },
      {
        id: "projector-bracket-75-10",
        name: "Projector 7.5 x 10 Bracket",
        desc: "Heavy-duty structural mounting bracket and hardware designed for secure 7.5x10 ft screen truss hanging.",
        price: "₱800/day",
        image: projectorBracket75,
      },
      {
        id: "projector-bracket-9-12",
        name: "Projector 9 x 12 Bracket",
        desc: "Reinforced stage mounting bracket kit for securing large 9x12 ft fast-fold projection frames.",
        price: "₱1,000/day",
        image: projectorBracket912,
      },
      {
        id: "projector-screen-bracket-5-8",
        name: "Projector 5 x 8 Screen and Bracket",
        desc: "Compact matte white professional projection screen and mounting kit suitable for breakout rooms and small venues.",
        price: "₱1,500/day",
        image: projectorBracket58,
      },
      {
        id: "projector-screen-75-10",
        name: "Projector Screen 7.5 x 10",
        desc: "Matte white professional fast-fold projection screen providing high-contrast, uniform visuals for medium audiences.",
        price: "₱1,500/day",
        image: projectorScreen75,
      },
      {
        id: "projector-screen-9-12",
        name: "Projector Screen 9 x 12",
        desc: "Large-format fast-fold stage projection screen engineered for plenary halls, conventions, and ballrooms.",
        price: "₱2,200/day",
        image: projectorScreen912,
      },
      {
        id: "laptop",
        name: "Laptop",
        desc: "High-performance laptops pre-configured for smooth slide playback, video, and presentation software.",
        price: "₱2,000/day",
        image: laptop,
      },
      {
        id: "mini-folding-table",
        name: "Mini Folding Table",
        desc: "Compact, durable folding table for staging technical laptops, clicker bases, and projector controllers.",
        price: "₱300/day",
        image: foldingTable,
      },
      {
        id: "extension-cord",
        name: "Extension Cord",
        desc: "Heavy-gauge extension cords ensuring reliable power delivery to the projector and supporting equipment.",
        price: "₱200/day",
        image: extensionCord1,
      },
      {
        id: "prestar-push-cart",
        name: "Prestar Push Cart",
        desc: "Heavy-duty silenced platform trolley for safe and swift transport of sensitive AV cases and equipment on site.",
        price: "₱400/day",
        image: pushCart,
      },
    ],
  },
  lights: {
    title: "LIGHTS & SOUNDS",
    subtitle:
      "Professional audio and dynamic lighting rigs that transform any venue into a stage-ready environment.",
    items: [
      {
        name: "Yamaha DM3 Dante Digital Audio Mixer",
        desc: "Ultra-compact 16-channel digital mixing console featuring Dante networking and broadcast-ready USB audio.",
        price: "₱3,500/day",
        image: yamahaDm3,
      },
      {
        name: "Pioneer DDJ FLX-4",
        desc: "Industry-standard 2-channel DJ controller for event music programming, walk-in tracks, and stage stings.",
        price: "₱2,500/day",
        image: ddjFlx4,
      },
      {
        name: "Whirlwind pcDi Box",
        desc: 'Dual-channel passive direct box with RCA, 3.5mm, and 1/4" inputs for hum-free laptop audio direct to mixers.',
        price: "₱400/day",
        image: whirlwindPcdi,
      },
      {
        name: "Radial Pro D2",
        desc: "High-end passive stereo direct box built with custom transformers to eliminate ground loops on stage instruments.",
        price: "₱600/day",
        image: radialProD2,
      },
      {
        name: "Steinberg UR44",
        desc: "6x4 USB 2.0 audio interface with 4 D-PRE microphone preamps and latency-free DSP hardware monitoring.",
        price: "₱1,200/day",
        image: steinberg,
      },
      {
        name: "QSC k12.2 Speakers",
        desc: "2000-watt powered active 12-inch point-source loudspeaker delivering high SPL and pristine clarity.",
        price: "₱2,250/day",
        image: qscSpeakers,
      },
      {
        name: "QSC ks118 Sub",
        desc: "3600-watt direct-radiating 18-inch powered subwoofer delivering deep, chest-thumping low-end bass.",
        price: "₱3,500/day",
        image: qscSub,
      },
      {
        name: "Shure SLXD System Handheld Mics",
        desc: "Transparent 24-bit digital wireless handheld microphone system with stable RF for events and talks.",
        price: "₱1,800/day",
        image: slxD,
      },
      {
        name: "Shure ULXD System Handheld Mics",
        desc: "Tour-grade digital wireless handheld system with exceptional audio clarity and AES-256 encryption.",
        price: "₱2,500/day",
        image: shureUlxd2,
      },
      {
        name: "Shure ULXD1 System with DPA Headworn Mics",
        desc: "Premium discrete miniature headset microphone paired with ULX-D bodypack for elite stage speakers.",
        price: "₱3,000/day",
        image: shureUlxd1,
      },
      {
        name: "Sennheiser E-835 Mics",
        desc: "Durable cardioid dynamic lead vocal stage microphone with high feedback rejection.",
        price: "₱300/day",
        image: senn835,
      },
      {
        name: "Sennheiser G4 Lapel Set",
        desc: "Industry-workhorse wireless lavalier clip-on microphone system for keynotes, interviews, and panel discussions.",
        price: "₱1,500/day",
        image: sennG4,
      },
      {
        name: "Bphs1 Audio Technica",
        desc: "Broadcast stereo headset with closed-back dynamic ears and cardioid boom mic for production commentators.",
        price: "₱800/day",
        image: bphs1,
      },
      {
        name: "Rode NTG3 Boom Mic",
        desc: "Precision broadcast shotgun microphone with RF-bias technology offering warm sound and high moisture resistance.",
        price: "₱1,500/day",
        image: rodeNtg3,
      },
      {
        name: "Secondary Boom Mics",
        desc: "Directional condenser shotgun mic setup for audience reaction, backup boom, and stage ambient pickup.",
        price: "₱800/day",
        image: tmAm1Boom,
      },
      {
        name: "RODE BLIMP",
        desc: "Complete windshield and shock mounting acoustic basket system eliminating stage draft and wind rumble.",
        price: "₱600/day",
        image: rodeBlimp,
      },
      {
        name: "Shure Lithium Batteries",
        desc: "Rechargeable SB900 lithium-ion battery packs providing up to 9+ hours of continuous mic operation.",
        price: "₱200/day",
        image: shureBattery,
      },
      {
        name: "Shure Dual Battery Dock Chargers",
        desc: "Networked dual-dock charging station for real-time monitoring and recharging of Shure transmitter packs.",
        price: "₱400/day",
        image: shureDualDock,
      },
      {
        name: "Shure UA-874 Directional Antennas",
        desc: "Active directional paddle antenna with integrated RF amplifier for clean wireless reception across large venues.",
        price: "₱1,000/day",
        image: shureUa874,
      },
      {
        name: "Shure Antenna Distribution System",
        desc: "4-way active antenna splitter feeding up to 4 dual-receivers from a single pair of paddle antennas.",
        price: "₱1,200/day",
        image: shureAntennaDist,
      },
      {
        name: "Tigertouch 2 Light Controller",
        desc: "Flagship multi-touch console with motorized faders and expansive DMX universes for full concert lighting rigs.",
        price: "₱8,000/day",
        image: tigerTouch2,
      },
      {
        name: "DMX-384 Light Controller",
        desc: "Standard 19-inch rackmount DMX operator console for controlling par cans, washes, and basic moving heads.",
        price: "₱1,500/day",
        image: dmx384,
      },
      {
        name: "LED BAR lsl-16s",
        desc: "Multi-segment RGBW linear wash bar creating vibrant wall grazes, backdrop washes, and stage silhouettes.",
        price: "₱600/day",
        image: ledBarLsl16,
      },
      {
        name: "LED PAR Lumilites lps-6033",
        desc: "High-output RGBW LED par can for front stage wash, spotlighting, and atmospheric room accent uplighting.",
        price: "₱400/day",
        image: ledPar,
      },
      {
        name: "LBL-295 Moving Heads",
        desc: "High-intensity 295W beam moving head fixture producing razor-sharp aerial prism patterns and stage dynamics.",
        price: "₱1,800/day",
        image: movingHeads,
      },
      {
        name: "JOJEN Haze Machine 1000W",
        desc: "Professional continuous oil/water-based haze generator creating an even optical mist to highlight lighting beams.",
        price: "₱1,500/day",
        image: hazeMachine,
      },
      {
        name: "Mic Rack",
        desc: "Rugged flight-case rack designed for organized stage storage, transport, and charging of wireless microphones.",
        price: "₱300/day",
        image: testpicture,
      },
      {
        name: "Hercules DJ Stand",
        desc: "Foldable heavy-duty stage table stand engineered for DJ decks, laptops, and tabletop mixers.",
        price: "₱500/day",
        image: herculesDjStand,
      },
      {
        name: "Hercules Speaker Stand",
        desc: "Heavy-duty aluminum speaker tripod with Quick-N-EZ auto lock system supporting up to 45kg loads.",
        price: "₱350/day",
        image: herculesSpeakerStand,
      },
      {
        name: "Hercules MS5 33B Mic Stand",
        desc: "Professional stage microphone stand with weighted round base and Hideaway boom arm.",
        price: "₱200/day",
        image: herculesMicStand,
      },
      {
        name: "Hercules Orchestral Stand BS311B",
        desc: "Perforated aluminum sheet music and script desk stand with EZ angle adjustment for stage conductors.",
        price: "₱250/day",
        image: herculesLyricStand,
      },
      {
        name: "Hercules LS700B – Gear Up Lighting Stand",
        desc: "Heavy-duty hand-crank lighting tripod extending to 3.5m with dual T-bars for flying par cans and movers.",
        price: "₱800/day",
        image: herculesLightStand,
      },
      {
        name: "RODE PSA 1+ studio arm",
        desc: "Premium articulated desk-mount studio boom arm with silent springs for live podcast and commentator mics.",
        price: "₱400/day",
        image: rodePsa1,
      },
      {
        name: "PEARL Drum throne d-730s",
        desc: "Ergonomic round padded musician stool with double-braced tripod legs for stage performers and drummers.",
        price: "₱300/day",
        image: drumThrone,
      },
      {
        name: "XLR Cable 3 Meters",
        desc: "Balanced studio-grade oxygen-free microphone cable with genuine Neutrik connectors for clean audio paths.",
        price: "₱80/day",
        image: xlrCable3m,
      },
      {
        name: "XLR Cable 20 Meters",
        desc: "Durable heavy-jacketed balanced XLR cable for long runs from stage microphones to sub-snakes and FOH.",
        price: "₱150/day",
        image: xlrCable20m,
      },
      {
        name: "Snake Cable",
        desc: "Multi-channel stage audio snake box streamlining multi-microphone cable runs to the front-of-house mixer.",
        price: "₱800/day",
        image: snakeCable,
      },
      {
        name: "DMX Cables 3 Meters",
        desc: "True 110-ohm shielded DMX data patch cable for linking adjacent lighting fixtures without flicker.",
        price: "₱80/day",
        image: dmxCable3m,
      },
      {
        name: "DMX Cables 20 Meters",
        desc: "Long shielded DMX512 cable for routing digital lighting control signals from console to stage trusses.",
        price: "₱150/day",
        image: dmxCable10m,
      },
      {
        name: "HDMI Cables",
        desc: "High-speed active/passive video cable delivering crystal-clear digital video signal playback across displays.",
        price: "₱150/day",
        image: ventionFiber,
      },
      {
        name: "Omni 15 Meters Extension Cord",
        desc: "Heavy-duty rubber-coated 15m power cord providing safe high-wattage electricity distribution across venues.",
        price: "₱200/day",
        image: omni15m,
      },
      {
        name: "Omni 10 Gang Extension Cord",
        desc: "Surge-protected multi-outlet power distribution strip designed to power complete technical tables and rigs.",
        price: "₱250/day",
        image: omni10gang,
      },
    ],
  },
};

// Package inclusions with the 3 projector packages
const packageInclusions = {
  // --- LIVESTREAM TIERS ---
  "Livestream Basic (1-Camera)": [
    "Sony PXW-Z90",
    "BMD Atem Studio HD",
    "Asus TUF 15 inch",
    "Focusrite 18i20 4th Gen",
    "Samsung 22 inches monitor",
    "Manfrotto Heavy Duty Tripod",
    "HDMI Cable (15 meters)",
    "APC C1500 Uninterrupted Power Supply",
  ],
  "Livestream Standard (2-Camera Multi-Cam)": [
    "Sony PXW-Z90",
    "Obsbot Tel-air",
    "TriCaster tc1",
    "Sony Bravia 43 inches TV",
    "Samsung 22 inches monitor",
    "Asus 24 inches monitor",
    "Hollyland Cosmo C1 Commset",
    "Focusrite 18i20 4th Gen",
    "Manfrotto Heavy Duty Tripod",
    "Stream Deck XL",
    "APC C1500 Uninterrupted Power Supply",
  ],
  "Livestream Ultimate (3-Camera Broadcast)": [
    "Sony PXW-Z90",
    "Obsbot Tel-air",
    "TriCaster tc1",
    "Tricaster nc1 io",
    "Sony Bravia 43 inches TV",
    "TCL 55 inches TV",
    "Dell 27 inches monitor",
    "AJA Ki Pro Ultra 12g",
    "AJA Pak Media 1TB",
    "Hollyland Cosmo C1 Wireless Video Transmission System",
    "Accsoon CineView SE Video Transmitter and Receiver",
    "Hollyland Cosmo C1 Commset",
    "DJI RS 5 Gimbal Stabilizer",
    "Suncomm 5G Router",
    "APC C1500 Uninterrupted Power Supply",
  ],

  // --- PROJECTOR TIERS ---
  "Projector Package (5 x 8)": [
    "Projector 5 x 8 Screen and Bracket",
    "Epson 2255u 5k Lumens Projector",
    "Projector Stands",
    "Laptop",
    "Hollyland Cosmo C1 Wireless Video Transmission System",
    "Mini Folding Table",
    "Extension Cord",
  ],
  "Projector Package (7.5 x 10)": [
    "Projector Screen 7.5 x 10",
    "Projector 7.5 x 10 Bracket",
    "Epson 2255u 5k Lumens Projector",
    "Projector Stands",
    "Laptop",
    "Hollyland Cosmo C1 Wireless Video Transmission System",
    "Mini Folding Table",
    "Extension Cord",
  ],
  "Projector Package (9 x 12)": [
    "Projector Screen 9 x 12",
    "Projector 9 x 12 Bracket",
    "Epson 2255u 5k Lumens Projector",
    "Projector Stands",
    "Laptop",
    "Hollyland Cosmo C1 Wireless Video Transmission System",
    "Mini Folding Table",
    "Extension Cord",
  ],

  // --- LIGHTS & SOUNDS TIERS ---
  "Lights & Sounds Basic (Seminar / Acoustic)": [
    "Yamaha DM3 Dante Digital Audio Mixer",
    "QSC k12.2 Speakers",
    "Hercules Speaker Stand",
    "Shure SLXD System Handheld Mics",
    "Hercules Mic Stand",
    "Whirlwind pcDi Box",
    "LED PAR Lumilites lps-6033",
    "Omni 15 Meters Extension Cord",
  ],
  "Lights & Sounds Corporate (Full Hall Audio)": [
    "Yamaha DM3 Dante Digital Audio Mixer",
    "QSC k12.2 Speakers",
    "QSC ks118 Sub",
    "Hercules Speaker Stand",
    "Shure SLXD System Handheld Mics",
    "Shure ULXD System Handheld Mics",
    "Shure UA-874 Directional Antennas",
    "Shure Antenna Distribution System",
    "LED PAR Lumilites lps-6033",
    "LED BAR lsl-16s",
    "DMX-384 Light Controller",
    "Hercules LS700B – Gear Up Lighting Stand",
    "Snake Cable",
  ],
  "Lights & Sounds Stage Concert (Full Production)": [
    "Yamaha DM3 Dante Digital Audio Mixer",
    "Pioneer DDJ FLX-4",
    "QSC k12.2 Speakers",
    "QSC ks118 Sub",
    "Shure ULXD System Handheld Mics",
    "Shure ULXD1 System with DPA Headworn Mics",
    "Shure Dual Battery Dock Chargers",
    "Shure UA-874 Directional Antennas",
    "Shure Antenna Distribution System",
    "Tigertouch 2 Light Controller",
    "LED PAR Lumilites lps-6033",
    "LED BAR lsl-16s",
    "LBL-295 Moving Heads",
    "JOJEN Haze Machine 1000W",
    "Hercules LS700B – Gear Up Lighting Stand",
    "Snake Cable",
  ],
};

const BookingForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Authenticated user state
  const [userData, setUserData] = useState({
    id: null,
    fullName: "",
    email: "",
    initials: "--",
  });

  // Event information form state
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("Webinar");
  const [customEventType, setCustomEventType] = useState("");
  const [clientType, setClientType] = useState("Corporate");
  const [startDate, setStartDate] = useState(searchParams.get("start") || "");
  const [endDate, setEndDate] = useState(searchParams.get("end") || "");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [venue, setVenue] = useState("");
  const [venueDistance, setVenueDistance] = useState("15"); // Distance in km from Culiat, QC HQ[cite: 11]
  const [estimatedGuests, setEstimatedGuests] = useState("100");
  const [specialNotes, setSpecialNotes] = useState("");

  // Services and equipment selections
  const initialPackage = searchParams.get("package") || "Livestream Package";
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(() => {
    const defaultInclusions = packageInclusions[initialPackage] || [];
    return [initialPackage, ...defaultInclusions];
  });

  // Catalog filtering and search state
  const [showFullCatalog, setShowFullCatalog] = useState(false);
  const [catalogCategory, setCatalogCategory] = useState("All");
  const [catalogSearch, setCatalogSearch] = useState("");

  // AI Recommender modal state
  const [showAiModal, setShowAiModal] = useState(false);

  // Payment proof states
  const [paymentMethod, setPaymentMethod] = useState("maya");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [receiptError, setReceiptError] = useState("");
  const [proofSubmitted, setProofSubmitted] = useState(false);
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState(null);
  const [showReceiptLightbox, setShowReceiptLightbox] = useState(false);

  // Release memory for receipt preview
  useEffect(() => {
    if (!paymentReceipt) {
      setReceiptPreviewUrl(null);
      setShowReceiptLightbox(false);
      return;
    }
    const url = URL.createObjectURL(paymentReceipt);
    setReceiptPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [paymentReceipt]);

  // Submission statuses
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Live availability detection
  const [availabilityChecking, setAvailabilityChecking] = useState(false);
  const [availabilityConflicts, setAvailabilityConflicts] = useState([]);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);

  // Company banking accounts
  const paymentDetails = {
    gcash: {
      accountName: "Livestream Manila",
      accountNumber: "0993 674 2673",
      label: "MOBILE NUMBER",
      note: "Open GCash → Send Money → Express Send or Scan QR. Add your booking name as message.",
      qrColor: "border-blue-600",
      textColor: "text-blue-500",
      qrCode:
        "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=09936742673-GCASH-LIVESTREAMMANILA",
    },
    maya: {
      accountName: "Livestream Manila",
      accountNumber: "0993 674 2673",
      label: "MOBILE NUMBER",
      note: "Open Maya → Pay → scan QR or enter mobile number. Add your booking name as payment note.",
      qrColor: "border-emerald-500",
      textColor: "text-emerald-500",
      qrCode:
        "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=09936742673-MAYA-LIVESTREAMMANILA",
    },
    bdo: {
      accountName: "Livestream Manila Events",
      accountNumber: "0040 8888 8012",
      label: "ACCOUNT NUMBER",
      note: "Transfer via BDO Online or branch. Account type: Savings. Include your booking ID in the remarks.",
      qrColor: "border-red-600",
      textColor: "text-red-500",
      qrCode:
        "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=004088888012-BDO-LIVESTREAMMANILA",
    },
  };

  // Fetch logged in client profile
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const metadata = user.user_metadata || {};
        let fullName =
          metadata.full_name ||
          metadata.name ||
          (metadata.first_name
            ? `${metadata.first_name} ${metadata.last_name || ""}`.trim()
            : "");

        if (!fullName) {
          const { data: dbUser } = await supabase
            .from("users")
            .select("full_name")
            .eq("id", user.id)
            .maybeSingle();
          if (dbUser) fullName = dbUser.full_name;
        }

        if (!fullName) fullName = user.email?.split("@")[0] || "Client";

        let initials = "U";
        const parts = fullName.trim().split(" ").filter(Boolean);
        if (parts.length >= 2) {
          initials =
            `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        } else if (parts[0]) {
          initials = parts[0].slice(0, 2).toUpperCase();
        }

        setUserData({
          id: user.id,
          fullName,
          email: user.email || "",
          initials,
        });
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Load available services from Supabase
  const [availableServices, setAvailableServices] = useState([]);

  useEffect(() => {
    const loadServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true);

      if (!error && data) {
        setAvailableServices(data);
      }
    };

    loadServices();

    const channel = supabase
      .channel("services-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "services" },
        () => loadServices(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Pre-configured packages listing
  const availablePackages = [
    // --- LIVESTREAM TIERS ---
    {
      id: "ls-basic",
      name: "Livestream Basic (1-Camera)",
      desc: "Sony PXW-Z90, Asus TUF laptop, switcher, audio interface, and confidence monitor for webinars or single-speaker streaming.",
      price: "₱15,000 / day",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "ls-standard",
      name: "Livestream Standard (2-Camera Multi-Cam)",
      desc: "2x Broadcast cameras, BMD switcher, TriCaster system, multiview monitors, wireless commsets, and recording backup.",
      price: "₱25,000 / day",
      image:
        "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "ls-broadcast",
      name: "Livestream Ultimate (3-Camera Broadcast)",
      desc: "3x 4K cameras, TriCaster TC1 production suite, Hollyland wireless video transmitters, AJA master recorder, and bonded 5G router.",
      price: "₱35,000 / day",
      image:
        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop",
    },

    // --- PROJECTOR TIERS ---
    {
      id: "projector-package-5x8",
      name: "Projector Package (5 x 8)",
      desc: "5k Lumens Epson Projector, 5x8 screen & bracket, stand, laptop, Hollyland, mini table & extension.",
      price: "₱6,500 / day",
      image:
        "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "projector-package-75x10",
      name: "Projector Package (7.5 x 10)",
      desc: "5k Lumens Epson Projector, 7.5x10 screen & bracket, stand, laptop, Hollyland, mini table & extension.",
      price: "₱7,500 / day",
      image:
        "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "projector-package-9x12",
      name: "Projector Package (9 x 12)",
      desc: "5k Lumens Epson Projector, 9x12 screen & bracket, stand, laptop, Hollyland, mini table & extension.",
      price: "₱8,000 / day",
      image:
        "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=600&auto=format&fit=crop",
    },

    // --- LIGHTS & SOUNDS TIERS ---
    {
      id: "lsounds-acoustic",
      name: "Lights & Sounds Basic (Seminar / Acoustic)",
      desc: "2x QSC K12.2 powered speakers, Yamaha DM3 digital mixer, 2x Shure wireless mics, and basic stage uplighting.",
      price: "₱12,000 / day",
      image:
        "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "lsounds-corporate",
      name: "Lights & Sounds Corporate (Full Hall Audio)",
      desc: "QSC tops & KS118 sub, DM3 mixer, 4x Shure wireless mics, antenna distribution, and 8x LED Par cans with DMX control.",
      price: "₱18,000 / day",
      image:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "lsounds-concert",
      name: "Lights & Sounds Stage Concert (Full Production)",
      desc: "Full QSC speaker & sub rig, TigerTouch 2 lighting console, moving heads, wash bars, haze machine, and wireless mic suites.",
      price: "₱28,000 / day",
      image:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=600&auto=format&fit=crop",
    },
  ];

  // Combined inventory list
  const allCatalogItems = useMemo(() => {
    const list = [];
    if (equipmentCatalogs.livestream?.items) {
      equipmentCatalogs.livestream.items.forEach((item) => {
        list.push({ ...item, category: "Livestream & Video" });
      });
    }
    if (equipmentCatalogs.projector?.items) {
      equipmentCatalogs.projector.items.forEach((item) => {
        list.push({ ...item, category: "Projector & Screens" });
      });
    }
    if (equipmentCatalogs.lights?.items) {
      equipmentCatalogs.lights.items.forEach((item) => {
        list.push({ ...item, category: "Lights & Sounds" });
      });
    }
    return list;
  }, []);

  // Filtered inventory search
  const filteredCatalogItems = useMemo(() => {
    return allCatalogItems.filter((item) => {
      const matchesCategory =
        catalogCategory === "All" || item.category === catalogCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        item.desc.toLowerCase().includes(catalogSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allCatalogItems, catalogCategory, catalogSearch]);

  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const toggleEquipment = (name) => {
    setSelectedEquipment((prev) =>
      prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name],
    );
  };

  // Toggle package and synchronize bundled gear
  // Toggle package and synchronize bundled gear + auto-reveal catalog
  const togglePackage = (packageName) => {
    const isCurrentlySelected = selectedEquipment.includes(packageName);
    const inclusions = packageInclusions[packageName] || [];

    if (isCurrentlySelected) {
      setSelectedEquipment((prev) =>
        prev.filter(
          (item) => item !== packageName && !inclusions.includes(item),
        ),
      );
    } else {
      // Auto-open catalog para agad makita ng client ang mga kagamitan
      setShowFullCatalog(true);

      setSelectedEquipment((prev) =>
        Array.from(new Set([...prev, packageName, ...inclusions])),
      );
    }
  };

  // Number helper
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    if (typeof priceStr === "number") return priceStr;
    const cleaned = priceStr.toString().replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
  };

  // Logistics fee calculation from Culiat, QC HQ[cite: 11]
  const computeLogisticsFee = (distKm) => {
    const km = parseFloat(distKm) || 0;
    if (km <= 0) return 0;
    const baseFee = 1000; // Flat base fee for first 10 km
    if (km <= 10) return baseFee;
    return baseFee + (km - 10) * 60; // ₱60 per additional km
  };

  // Quotation calculator
  const quotationSummary = useMemo(() => {
    const servicesCost = selectedServices.reduce((sum, srvId) => {
      const srv = availableServices.find((s) => s.id === srvId);
      return sum + (srv ? parsePrice(srv.price) : 0);
    }, 0);

    const selectedPackagesList = availablePackages.filter((pkg) =>
      selectedEquipment.includes(pkg.name),
    );

    const packagesCost = selectedPackagesList.reduce(
      (sum, pkg) => sum + parsePrice(pkg.price),
      0,
    );

    const bundledInclusions = new Set();
    selectedPackagesList.forEach((pkg) => {
      const items = packageInclusions[pkg.name] || [];
      items.forEach((item) => bundledInclusions.add(item));
    });

    const individualAddons = selectedEquipment
      .filter(
        (name) =>
          !availablePackages.some((pkg) => pkg.name === name) &&
          !bundledInclusions.has(name),
      )
      .map((name) => {
        const gear = allCatalogItems.find((g) => g.name === name);
        return {
          name,
          price: gear ? parsePrice(gear.price) : 0,
        };
      });

    const individualCost = individualAddons.reduce(
      (sum, item) => sum + item.price,
      0,
    );

    const logisticsFee = computeLogisticsFee(venueDistance);
    const subtotal = servicesCost + packagesCost + individualCost;
    const discount = subtotal * 0.1; // 10% loyalty discount
    const total = subtotal - discount + logisticsFee;

    return {
      servicesCost,
      selectedPackagesList,
      individualAddons,
      subtotal,
      discount,
      logisticsFee,
      total,
    };
  }, [
    selectedServices,
    availableServices,
    selectedEquipment,
    availablePackages,
    allCatalogItems,
    venueDistance,
  ]);

  // Realtime conflict detection
  useEffect(() => {
    if (!startDate || selectedEquipment.length === 0) {
      setAvailabilityConflicts([]);
      setAvailabilityChecked(false);
      return;
    }

    const timer = setTimeout(async () => {
      setAvailabilityChecking(true);
      try {
        const params = new URLSearchParams();
        params.append("event_date", startDate);
        params.append("start_time", startTime);
        params.append("end_time", endTime);
        selectedEquipment.forEach((eq) => params.append("equipment", eq));

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const response = await fetch(
          `${API_URL}/bookings/check-availability?${params.toString()}`,
          {
            headers: session
              ? { Authorization: `Bearer ${session.access_token}` }
              : {},
          },
        );

        if (response.ok) {
          const data = await response.json();
          setAvailabilityConflicts(data.conflicts || []);
        }
        setAvailabilityChecked(true);
      } catch (err) {
        console.error("Availability check failed:", err);
      } finally {
        setAvailabilityChecking(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [startDate, startTime, endTime, selectedEquipment]);

  // AI Recommender handler
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiReasoning, setAiReasoning] = useState("");
  const [aiBasedOnHistory, setAiBasedOnHistory] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const fetchAiSuggestions = async () => {
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch(`${API_URL}/equipment-ai/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type:
            eventType === "Other"
              ? customEventType.trim() || "Other"
              : eventType,
          estimated_guests: estimatedGuests ? parseInt(estimatedGuests) : null,
          venue: venue || null,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to get AI suggestions.");
      }

      const data = await response.json();
      setAiSuggestions(data.recommended_equipment || []);
      setAiReasoning(data.reasoning || "");
      setAiBasedOnHistory(data.based_on_history);
    } catch (err) {
      setAiError(err.message || "Something went wrong getting suggestions.");
      setAiSuggestions([]);
    } finally {
      setAiLoading(false);
    }
  };

  const openAiModal = () => {
    setShowAiModal(true);
    fetchAiSuggestions();
  };

  // Booking submission handler
  const handleBookingAction = async (statusType) => {
    setErrorMessage("");
    setActionSuccess("");

    if (statusType === "submitted" || statusType === "pencil_booked") {
      if (!eventName.trim()) {
        setErrorMessage("Please enter an Event Name before proceeding.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (!startDate) {
        setErrorMessage("Please choose at least a Start Date.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (startTime >= endTime) {
        setErrorMessage("End Time must be after Start Time.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (availabilityConflicts.length > 0) {
        setErrorMessage(
          "There's a scheduling conflict with your selected date/time/equipment. Please adjust before submitting.",
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (!policyAgreed) {
        setErrorMessage("Please review and agree to the Cancellation Policy.");
        return;
      }
    }

    setSubmitting(true);

    try {
      if (statusType === "draft") {
        setActionSuccess("Draft saving isn't available yet — coming soon!");
        setSubmitting(false);
        return;
      }

      const serviceTitles = selectedServices
        .map((id) => availableServices.find((s) => s.id === id)?.title)
        .filter(Boolean);

      const resolvedEventType =
        eventType === "Other" ? customEventType.trim() || "Other" : eventType;

      const payload = {
        event_name: eventName || "Untitled Event Draft",
        event_type: resolvedEventType,
        start_date: startDate,
        end_date: endDate || startDate,
        start_time: startTime,
        end_time: endTime,
        venue: venue,
        venue_distance: parseFloat(venueDistance) || 0,
        estimated_guests: estimatedGuests ? parseInt(estimatedGuests) : null,
        special_notes: specialNotes,
        services: serviceTitles,
        equipment: selectedEquipment,
        status: statusType,
        estimated_total: quotationSummary.total,
      };

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("You must be logged in to submit a booking.");
      }

      const response = await fetch(`${API_URL}/bookings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to submit booking.");
      }

      const created = await response.json();

      let proofFailed = false;
      let proofErrorText = "";
      if (paymentReceipt || referenceNumber.trim()) {
        try {
          const form = new FormData();
          form.append("method", paymentMethod);
          form.append("payment_type", "downpayment");
          if (referenceNumber.trim())
            form.append("reference_no", referenceNumber.trim());
          if (paymentReceipt) form.append("file", paymentReceipt);

          const proofRes = await fetch(
            `${API_URL}/payments/${created.id}/proof`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${session.access_token}` },
              body: form,
            },
          );

          if (!proofRes.ok) {
            const err = await proofRes.json().catch(() => ({}));
            throw new Error(err.detail || "Proof upload failed.");
          }

          setProofSubmitted(true);
        } catch (proofErr) {
          proofFailed = true;
          proofErrorText = proofErr.message || "Unknown error";
          console.error("Payment proof upload failed:", proofErr);
        }
      }

      const baseMessage =
        statusType === "submitted"
          ? "Your booking request has been submitted! Our team will evaluate technical requirements and issue your Official Contract."
          : "Tentative dates saved! Your pencil booking has been recorded.";

      setActionSuccess(
        proofFailed
          ? `${baseMessage} However, your payment proof could not be uploaded (${proofErrorText}). Please upload it again from Billing & Payments.`
          : paymentReceipt || referenceNumber.trim()
            ? `${baseMessage} Your payment proof was submitted and is awaiting verification.`
            : baseMessage,
      );

      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(
        () => {
          navigate("/client/dashboard");
        },
        proofFailed ? 7000 : 4000,
      );
    } catch (err) {
      setErrorMessage(
        err.message || "An error occurred while saving your booking.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-['Montserrat',sans-serif] bg-[#090b10] text-white flex flex-col">
      {/* Top Navbar */}
      <header className="w-full bg-[#090b10] px-8 py-4 flex items-center justify-between border-b border-[#1b212f] sticky top-0 z-40">
        <div className="flex items-center gap-3.5">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/client-main")}
          >
            <img
              src={logoImage}
              alt="Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="text-neutral-700 text-sm">|</span>
          <span className="text-xs font-bold text-neutral-400 tracking-[0.16em] uppercase">
            Client Portal
          </span>
        </div>

        <div className="flex items-center gap-6">
                 <div className="flex items-center gap-3.5">
            <div className="text-right">
              <p className="text-xs font-bold leading-tight text-white capitalize">
                {userData.fullName || "User"}
              </p>
              <p className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                {userData.email}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#141823] border border-neutral-800 flex items-center justify-center font-bold text-xs text-red-500 shadow-inner">
              {userData.initials}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-500 transition cursor-pointer"
          >
            <LogOut size={15} />
            <span>LOGOUT</span>
          </button>
        </div>
      </header>

      <div className="h-[1.5px] w-full bg-red-600"></div>

      {/* Main Container */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto px-8 py-8 gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-60 shrink-0 space-y-2.5">
          <button
            onClick={() => navigate("/client/dashboard")}
            className="w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider bg-[#0f121a]/80 text-neutral-400 hover:text-white hover:bg-[#151924] border border-[#1b212f] transition cursor-pointer"
          >
            <Home size={17} />
            <span>Overview</span>
          </button>
          <button className="w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider bg-[#ff0000] text-white shadow-lg shadow-red-600/30 transition cursor-pointer">
            <CalendarPlus size={17} />
            <span>Book Service</span>
          </button>
          <button
            onClick={() => navigate("/client/dashboard")}
            className="w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider bg-[#0f121a]/80 text-neutral-400 hover:text-white hover:bg-[#151924] border border-[#1b212f] transition cursor-pointer"
          >
            <BookOpen size={17} />
            <span>My Bookings</span>
          </button>
          <button
            onClick={() => navigate("/client/dashboard")}
            className="w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider bg-[#0f121a]/80 text-neutral-400 hover:text-white hover:bg-[#151924] border border-[#1b212f] transition cursor-pointer"
          >
            <CreditCard size={17} />
            <span>Billing & Payments</span>
          </button>
          <button
            onClick={() => navigate("/client/dashboard")}
            className="w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider bg-[#0f121a]/80 text-neutral-400 hover:text-white hover:bg-[#151924] border border-[#1b212f] transition cursor-pointer"
          >
            <User size={17} />
            <span>My Profile</span>
          </button>
        </aside>

        {/* Central Form Container */}
        <main className="flex-1 max-w-5xl space-y-8 pb-24">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-wide text-white">
              Book a Service
            </h1>
            <p className="text-neutral-400 text-xs mt-1">
              Provide event details to generate an automated quote and lock your
              schedule.
            </p>
          </div>

          {/* Feedback Alerts */}
          {actionSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-600/60 text-emerald-400 flex items-center gap-3 text-sm">
              <CheckCircle2 size={18} />
              <span>{actionSuccess}</span>
            </div>
          )}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-600/60 text-red-400 flex items-center gap-3 text-sm">
              <AlertTriangle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Availability Conflict Alert */}
          {availabilityChecked && availabilityConflicts.length > 0 && (
            <div className="p-4 rounded-xl bg-orange-950/60 border border-orange-600/60 text-orange-400 flex items-start gap-3 text-sm">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  Scheduling conflict on {startDate} ({startTime}–{endTime})
                </p>
                <ul className="mt-1.5 space-y-1 text-xs text-orange-300">
                  {availabilityConflicts.map((c, idx) => (
                    <li key={idx}>
                      <strong>{c.equipment}</strong> is not available for this
                      time
                      {" — "}
                      {c.available_left === 0
                        ? "fully booked"
                        : `only ${c.available_left} left`}
                      .
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-orange-400/80 mt-1.5">
                  Try a different date, time, or equipment selection.
                </p>
              </div>
            </div>
          )}
          {availabilityChecking && (
            <p className="text-[11px] text-neutral-500 flex items-center gap-1.5">
              <Clock size={12} className="animate-pulse" />
              Checking availability...
            </p>
          )}

          {/* Feature Header Strip */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-[#171c2e] via-[#15142a] to-[#251322] border border-[#2c334d]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 shrink-0">
                  <Sparkles size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    Instant Automated Quotation
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
                    Select your required services and equipment to calculate
                    estimated costs with distance logistics. Once submitted, our
                    team will review technical staff requirements and issue your
                    Official Contract.
                  </p>
                  <p className="text-[11px] text-amber-400 font-semibold pt-1">
                    * Note: Pricing is subject to venue requirements & technical
                    evaluation.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openAiModal}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-lg shadow-purple-600/30 hover:scale-105 cursor-pointer"
              >
                <Sparkles size={15} />
                <span>AI Suggester</span>
              </button>
            </div>
          </div>

          {/* 1. EVENT DETAILS FORM SECTION */}
          <section className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-7 space-y-6">
            <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Calendar size={16} className="text-red-500" />
              Event Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Event Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Annual Tech Conference 2026"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
                  >
                    <option value="Webinar">Webinar</option>
                    <option value="Corporate Conference">
                      Corporate Conference
                    </option>
                    <option value="Wedding Livestream">
                      Wedding Livestream
                    </option>
                    <option value="Concert / Music Festival">
                      Concert / Music Festival
                    </option>
                    <option value="Sports / Esports Broadcast">
                      Sports / Esports Broadcast
                    </option>
                    <option value="Product Launch">Product Launch</option>
                    <option value="Other">Other (Please specify)</option>
                  </select>

                  {/* Custom Event Type Input */}
                  {eventType === "Other" && (
                    <input
                      type="text"
                      placeholder="Specify your event type (e.g. Birthday, Gala, School Play)..."
                      value={customEventType}
                      onChange={(e) => setCustomEventType(e.target.value)}
                      className="mt-2.5 w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 animate-in fade-in duration-200"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Client Type
                  </label>
                  <select
                    value={clientType}
                    onChange={(e) => setClientType(e.target.value)}
                    className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
                  >
                    <option value="Corporate">Corporate / Enterprise</option>
                    <option value="Agency">Agency / Event Organizer</option>
                    <option value="Individual">
                      Individual / Private Client
                    </option>
                    <option value="Government">Government / NGO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    End Date (Optional for multi-day)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Venue / Event Location *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PICC Plenary Hall, Pasay City"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center justify-between">
                    <span>Est. Distance (km)</span>
                    <span className="text-[9px] text-neutral-500 lowercase font-normal">
                      from Culiat HQ[cite: 11]
                    </span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 15"
                    value={venueDistance}
                    onChange={(e) => setVenueDistance(e.target.value)}
                    className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Estimated Attendees / Guests
                </label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={estimatedGuests}
                  onChange={(e) => setEstimatedGuests(e.target.value)}
                  className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
                />
              </div>
            </div>
          </section>

          {/* 2. SERVICES REQUIRED SECTION */}
          <section className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-7 space-y-5">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                Services Required
              </h2>
              <p className="text-neutral-400 text-xs mt-0.5">
                Click cards to select technical services.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableServices.map((srv) => {
                const isSelected = selectedServices.includes(srv.id);
                return (
                  <div
                    key={srv.id}
                    onClick={() => toggleService(srv.id)}
                    className={`relative rounded-xl overflow-hidden border p-4 flex flex-col justify-between transition-all cursor-pointer bg-[#0b0e14] ${
                      isSelected
                        ? "border-red-600 ring-1 ring-red-600 shadow-[0_0_15px_rgba(255,0,0,0.25)]"
                        : "border-[#1b212f] hover:border-neutral-700"
                    }`}
                  >
                    <div className="relative h-28 w-full rounded-lg overflow-hidden mb-3 bg-neutral-900">
                      <img
                        src={srv.image}
                        alt={srv.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                        {srv.badge}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white shadow">
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wide text-white mb-1">
                        {srv.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 leading-snug">
                        {srv.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 3. EQUIPMENT PACKAGES AND INVENTORY */}
          <section className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  Equipment Needed
                </h2>
                <p className="text-neutral-400 text-xs mt-0.5">
                  Pre-configured packages synchronized with individual inventory
                  lists.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowFullCatalog(!showFullCatalog)}
                className="text-xs font-bold text-red-500 hover:text-red-400 border border-red-500/40 hover:border-red-500 px-4 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>
                  {showFullCatalog ? "Hide Catalog" : "+ Browse Full Catalog"}
                </span>
                {showFullCatalog ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePackages.map((eq) => {
                const isSelected = selectedEquipment.includes(eq.name);
                return (
                  <div
                    key={eq.id}
                    onClick={() => togglePackage(eq.name)}
                    className={`relative rounded-xl overflow-hidden border p-4 flex flex-col justify-between transition-all cursor-pointer bg-[#0b0e14] ${
                      isSelected
                        ? "border-red-600 ring-1 ring-red-600 shadow-[0_0_15px_rgba(255,0,0,0.25)]"
                        : "border-[#1b212f] hover:border-neutral-700"
                    }`}
                  >
                    <div className="relative h-32 w-full rounded-lg overflow-hidden mb-3 bg-neutral-900">
                      <img
                        src={eq.image}
                        alt={eq.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white shadow">
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wide text-white mb-1">
                        {eq.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 leading-snug mb-2">
                        {eq.desc}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-red-500 font-extrabold text-xs">
                          {eq.price}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            isSelected
                              ? "bg-red-600/20 text-red-400 border border-red-600/40"
                              : "bg-[#141823] text-neutral-500"
                          }`}
                        >
                          {isSelected ? "Included ✓" : "+ Select"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
                {
                  /* Highly Visible "Browse Full Catalog / Customize Add-ons" Banner */
                }
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#171a26] via-[#1c2233] to-[#171a26] border border-red-600/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 border border-red-600/30 flex items-center justify-center shrink-0">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-white">
                        Need extra gear or custom add-ons?
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        Review included equipment from your package or add
                        individual cameras, microphones, and monitors.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowFullCatalog(!showFullCatalog)}
                    className={`shrink-0 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-md ${
                      showFullCatalog
                        ? "bg-[#0b0e14] text-neutral-300 border border-neutral-700 hover:border-white"
                        : "bg-red-600 hover:bg-red-700 text-white shadow-red-600/30 hover:scale-105"
                    }`}
                  >
                    <span>
                      {showFullCatalog
                        ? "Hide Catalog"
                        : "+ Browse Full Inventory & Add-ons"}
                    </span>
                    {showFullCatalog ? (
                      <ChevronUp size={15} />
                    ) : (
                      <ChevronDown size={15} />
                    )}
                  </button>
                </div>;
              })}
            </div>

            {/* Individual Inventory Grid */}
            {showFullCatalog && (
              <div className="mt-6 pt-6 border-t border-[#1b212f] space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-black uppercase tracking-wider text-white">
                        Individual Inventory Items
                      </h3>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-600/20 text-red-500 border border-red-600/30">
                        {filteredCatalogItems.length} Available
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Select gear to add or remove from your booking package.
                    </p>
                  </div>

                  <div className="w-full md:w-72">
                    <input
                      type="text"
                      placeholder="Search gear..."
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 transition"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {[
                    {
                      id: "All",
                      label: `All Gear (${allCatalogItems.length})`,
                    },
                    { id: "Livestream & Video", label: "Livestream & Video" },
                    { id: "Projector & Screens", label: "Projector & Screens" },
                    { id: "Lights & Sounds", label: "Lights & Sounds" },
                  ].map((cat) => {
                    const isActive = catalogCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCatalogCategory(cat.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                          isActive
                            ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                            : "bg-[#090b10] text-neutral-400 hover:text-white border border-[#1b212f] hover:border-neutral-700"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {filteredCatalogItems.length === 0 ? (
                  <div className="py-12 text-center bg-[#090b10] border border-[#1b212f] rounded-2xl">
                    <p className="text-xs text-neutral-400 font-semibold">
                      No equipment found matching "{catalogSearch}".
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setCatalogSearch("");
                        setCatalogCategory("All");
                      }}
                      className="mt-2 text-xs font-bold text-red-500 hover:text-red-400 underline cursor-pointer"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[580px] overflow-y-auto pr-2">
                    {filteredCatalogItems.map((item, idx) => {
                      const isSelected = selectedEquipment.includes(item.name);
                      return (
                        <div
                          key={item.id || `${item.name}-${idx}`}
                          onClick={() => toggleEquipment(item.name)}
                          className={`p-3.5 rounded-2xl border bg-[#0b0e14] transition-all cursor-pointer flex flex-col justify-between group ${
                            isSelected
                              ? "border-red-600 ring-1 ring-red-600 shadow-[0_0_15px_rgba(255,0,0,0.25)] bg-[#110e13]"
                              : "border-[#1b212f] hover:border-neutral-700 hover:bg-[#0e121a]"
                          }`}
                        >
                          <div className="relative h-28 w-full rounded-xl overflow-hidden mb-3 bg-neutral-900 border border-neutral-800/80">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute bottom-2 left-2 bg-[#090b10]/90 backdrop-blur-md text-[9px] font-black uppercase tracking-wider text-neutral-300 px-2 py-0.5 rounded-md border border-neutral-700/60">
                              {item.category}
                            </span>
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-red-600/40">
                                <Check size={14} />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h5
                                className="text-xs font-black uppercase text-white truncate mb-1"
                                title={item.name}
                              >
                                {item.name}
                              </h5>
                              <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                                {item.desc}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-[#1b212f]">
                              <span className="text-red-500 font-extrabold text-xs">
                                {item.price}
                              </span>
                              <span
                                className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md transition ${
                                  isSelected
                                    ? "bg-red-600/20 text-red-400 border border-red-600/40"
                                    : "bg-[#141823] text-neutral-400 group-hover:text-white"
                                }`}
                              >
                                {isSelected ? "Added ✓" : "+ Add"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* 4. INITIAL QUOTATION FOR OFFICIAL CONTRACT */}
          <section className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-[#1b212f] pb-4">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <CreditCard size={16} className="text-red-500" />
                  Initial Quotation for Official Contract
                </h2>
                <p className="text-neutral-400 text-xs mt-0.5">
                  Base cost calculation prior to event execution. Subject to
                  adjustments for on-site gear requests or program overtime
                  fees.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                  Initial Base Total
                </span>
                <span className="text-2xl font-black text-white font-mono">
                  ₱{quotationSummary.total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Itemized List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
              {/* Packages */}
              {quotationSummary.selectedPackagesList.map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-[#141924]"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 font-bold text-[9px] uppercase">
                      Package
                    </span>
                    <span className="font-semibold text-white">{pkg.name}</span>
                  </div>
                  <span className="font-mono text-neutral-300 font-bold">
                    {pkg.price}
                  </span>
                </div>
              ))}

              {/* Services */}
              {selectedServices.map((srvId) => {
                const srv = availableServices.find((s) => s.id === srvId);
                if (!srv) return null;
                return (
                  <div
                    key={srv.id}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-[#141924]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 font-bold text-[9px] uppercase">
                        Service
                      </span>
                      <span className="font-semibold text-white">
                        {srv.title}
                      </span>
                    </div>
                    <span className="font-mono text-neutral-300 font-bold">
                      ₱{parsePrice(srv.price).toLocaleString()}
                    </span>
                  </div>
                );
              })}

              {/* Add-ons */}
              {quotationSummary.individualAddons.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-[#141924]"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple-600/20 text-purple-400 font-bold text-[9px] uppercase">
                      Add-on
                    </span>
                    <span className="text-neutral-300">{item.name}</span>
                  </div>
                  <span className="font-mono text-neutral-400">
                    ₱{item.price.toLocaleString()}
                  </span>
                </div>
              ))}

              {/* Logistics Fee */}
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#141924]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-600/20 text-amber-400 font-bold text-[9px] uppercase flex items-center gap-1">
                    <MapPin size={10} /> Logistics
                  </span>
                  <span className="text-neutral-300">
                    Logistics & Vehicle Deployment ({venueDistance || 0} km from
                    Culiat QC HQ)[cite: 11]
                  </span>
                </div>
                <span className="font-mono text-neutral-300 font-bold">
                  ₱{quotationSummary.logisticsFee.toLocaleString()}
                </span>
              </div>

              {quotationSummary.subtotal === 0 && (
                <p className="text-xs text-neutral-500 py-3 text-center">
                  No packages or services selected yet.
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-[#1b212f] space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal (Hardware & Services)</span>
                <span className="font-mono font-bold text-neutral-200">
                  ₱{quotationSummary.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Loyalty Discount (10%)</span>
                <span className="font-mono font-bold">
                  - ₱{quotationSummary.discount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Logistics & Venue Delivery Fee</span>
                <span className="font-mono font-bold text-neutral-200">
                  ₱{quotationSummary.logisticsFee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#1b212f] text-sm font-black text-white">
                <span>Initial Quotation for Official Contract</span>
                <span className="text-xl text-red-500 font-mono">
                  ₱{quotationSummary.total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Overtime & On-site Additions Notice */}
            <div className="mt-3 p-3 rounded-xl bg-[#090b10] border border-[#1b212f] text-[11px] text-neutral-400 space-y-1">
              <p className="text-neutral-300 font-semibold flex items-center gap-1.5">
                <span>ℹ️</span> Billing Notice:
              </p>
              <p className="leading-relaxed">
                This is the initial contract rate. Additional charges may apply
                on the final billing statement for on-site gear requests, extra
                operational hours beyond the schedule, or crew overtime
                fees[cite: 11].
              </p>
            </div>
          </section>

          {/* 5. SPECIAL INSTRUCTIONS / NOTES */}
          <section className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-7 space-y-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Special Instructions / Notes
            </h2>
            <textarea
              rows={4}
              placeholder="Tell us about specific program sequences, physical ingress/egress schedules, or custom graphics needs..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 resize-none"
            />
          </section>

          {/* 6. DOWNPAYMENT METHODS */}
          <section className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-7 space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-600/30 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                <QrCode size={16} />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  Downpayment Methods
                </h2>
                <p className="text-neutral-400 text-xs mt-0.5">
                  Pay your downpayment to secure your booking date. QR codes are
                  linked to Livestream Manila's official accounts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("gcash")}
                className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                  paymentMethod === "gcash"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "bg-[#0b0e14] border border-[#1b212f] text-neutral-400 hover:text-white"
                }`}
              >
                GCash
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("maya")}
                className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                  paymentMethod === "maya"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "bg-[#0b0e14] border border-[#1b212f] text-neutral-400 hover:text-white"
                }`}
              >
                Maya
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("bdo")}
                className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                  paymentMethod === "bdo"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "bg-[#0b0e14] border border-[#1b212f] text-neutral-400 hover:text-white"
                }`}
              >
                BDO
              </button>
            </div>

            <div className="bg-[#0b0e14] border border-[#1b212f] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-7">
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`w-44 h-44 bg-white rounded-2xl p-2.5 flex items-center justify-center border-4 ${paymentDetails[paymentMethod].qrColor}`}
                >
                  <img
                    src={paymentDetails[paymentMethod].qrCode}
                    alt={`${paymentMethod} QR`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span
                  className={`text-[11px] font-black uppercase tracking-widest mt-2 ${paymentDetails[paymentMethod].textColor}`}
                >
                  {paymentMethod}
                </span>
                <span className="text-[10px] text-neutral-500">
                  Scan to pay
                </span>
              </div>

              <div className="flex-1 w-full space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#0e121a] border border-[#1b212f] rounded-xl p-4">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                      Account Name
                    </span>
                    <p className="text-sm font-bold text-white">
                      {paymentDetails[paymentMethod].accountName}
                    </p>
                  </div>
                  <div className="bg-[#0e121a] border border-[#1b212f] rounded-xl p-4">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                      {paymentDetails[paymentMethod].label}
                    </span>
                    <p className="text-sm font-mono font-bold text-white">
                      {paymentDetails[paymentMethod].accountNumber}
                    </p>
                  </div>
                </div>

                <div className="bg-[#0e121a] border border-[#1b212f] rounded-xl p-4">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                    How to Pay
                  </span>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {paymentDetails[paymentMethod].note}
                  </p>
                </div>
              </div>
            </div>

            {/* Minimums */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">
                Downpayment Minimums
              </span>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#0b0e14] border border-[#1b212f] rounded-xl py-3">
                  <p className="text-base font-black text-white">₱2,000</p>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase">
                    Livestream
                  </span>
                </div>
                <div className="bg-[#0b0e14] border border-[#1b212f] rounded-xl py-3">
                  <p className="text-base font-black text-white">₱500</p>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase">
                    Projector
                  </span>
                </div>
                <div className="bg-[#0b0e14] border border-[#1b212f] rounded-xl py-3">
                  <p className="text-base font-black text-white">₱1,500</p>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase">
                    Lights & Sounds
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-neutral-500 text-center pt-1">
                Downpayment is non-refundable once confirmed. Balance is due on
                the day of the event.
              </p>
            </div>

            {/* Proof form */}
            <div className="pt-2 border-t border-[#1b212f] space-y-4">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                After Paying — Attach Proof
              </span>

              {proofSubmitted && (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-600/60 text-emerald-400 flex items-start gap-3 text-sm">
                  <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Payment proof submitted</p>
                    <p className="text-xs text-emerald-300/80 mt-0.5">
                      {referenceNumber.trim()
                        ? `Reference ${referenceNumber.trim()} · `
                        : ""}
                      Awaiting verification by our team. We'll email you once
                      it's confirmed.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1.5">
                    Reference / Transaction No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1234567890"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1.5">
                    Upload Payment Screenshot
                  </label>
                  <label className="flex items-center justify-center gap-2.5 px-4 py-3 bg-[#090b10] border border-dashed border-[#242e42] hover:border-neutral-500 rounded-xl cursor-pointer transition text-xs text-neutral-400">
                    <Upload size={15} className="text-red-500" />
                    <span className="truncate">
                      {paymentReceipt ? paymentReceipt.name : "Choose File"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0] || null;
                        if (
                          file &&
                          !["image/jpeg", "image/png", "image/webp"].includes(
                            file.type,
                          )
                        ) {
                          setReceiptError(
                            "Please choose a JPG, PNG, or WEBP image.",
                          );
                          setPaymentReceipt(null);
                          e.target.value = "";
                          return;
                        }
                        if (file && file.size > 5 * 1024 * 1024) {
                          setReceiptError(
                            "Image is too large. Maximum size is 5 MB.",
                          );
                          setPaymentReceipt(null);
                          e.target.value = "";
                          return;
                        }
                        setReceiptError("");
                        setPaymentReceipt(file);
                      }}
                    />
                  </label>
                </div>
              </div>

              {receiptError && (
                <p className="text-[11px] text-red-400">{receiptError}</p>
              )}

              {paymentReceipt && receiptPreviewUrl && (
                <div className="flex items-center gap-4 p-3 bg-[#0b0e14] border border-[#1b212f] rounded-xl">
                  <button
                    type="button"
                    onClick={() => setShowReceiptLightbox(true)}
                    className="relative shrink-0 w-28 h-36 rounded-lg overflow-hidden border border-[#242e42] bg-black cursor-zoom-in group"
                    title="Click to view full image"
                  >
                    <img
                      src={receiptPreviewUrl}
                      alt="Payment proof preview"
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[10px] text-neutral-200 font-semibold py-1 text-center opacity-0 group-hover:opacity-100 transition">
                      Click to enlarge
                    </span>
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white font-semibold truncate">
                      {paymentReceipt.name}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      {(paymentReceipt.size / 1024).toFixed(0)} KB
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowReceiptLightbox(true)}
                      className="mt-2 text-[11px] font-bold text-neutral-300 hover:text-white underline cursor-pointer"
                    >
                      View full image
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPaymentReceipt(null)}
                    className="text-[11px] font-bold text-red-500 hover:text-red-400 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              <p className="text-[10px] text-neutral-500 leading-relaxed">
                Optional. If you've already paid, your proof is sent together
                with your booking request. You can also pay later once approved
                by our team.
              </p>
            </div>
          </section>

          {/* 7. CANCELLATION POLICY */}
          <section className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-7 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-600"></div>
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                Cancellation Policy
              </h2>
            </div>

            <div className="bg-[#090b10] border border-[#1e2638] rounded-xl p-5 text-xs text-neutral-400 leading-relaxed space-y-3 font-normal">
              <p>
                Cancellations made <strong>30 days or more</strong> prior to the
                event date will receive a full refund of the downpayment minus a
                10% administrative fee.
              </p>
              <p>
                Cancellations made <strong>15 to 29 days</strong> prior will
                receive a 50% refund of the downpayment.
              </p>
              <p>
                Cancellations made <strong>less than 15 days</strong> before the
                event are non-refundable. Rebooking is subject to equipment
                availability and may incur a rescheduling fee.
              </p>
              <p>
                In the event of weather emergencies or force majeure, bookings
                can be rescheduled without penalty within 90 days.
              </p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={policyAgreed}
                onChange={(e) => setPolicyAgreed(e.target.checked)}
                className="w-4 h-4 rounded bg-[#090b10] border-neutral-700 accent-red-600 cursor-pointer"
              />
              <span className="text-xs text-neutral-300 font-semibold">
                I have read and agree to the Cancellation Policy and Terms of
                Service.
              </span>
            </label>
          </section>

          {/* 8. LOYALTY DISCOUNT BANNER */}
          <div className="p-4 rounded-xl bg-[#141823] border border-red-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-red-600/30 text-red-500 flex items-center justify-center text-xs">
                ★
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Loyalty Discount Unlocked!
              </span>
            </div>
            <span className="text-xs font-black text-red-500 bg-red-950/60 border border-red-800/60 px-2 py-0.5 rounded">
              -10%
            </span>
          </div>

          {/* 9. SUBMISSION ACTIONS */}
          <section className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-400">
              Submission Options
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* SUBMIT REQUEST */}
              <div className="bg-[#121622] border border-red-600/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg shadow-red-950/20">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider">
                    <Send size={15} />
                    <span>Submit Request</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">
                    Instantly notifies the Livestream Manila production team for
                    technical crew evaluation and contract generation.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={submitting || availabilityConflicts.length > 0}
                  onClick={() => handleBookingAction("submitted")}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase tracking-widest transition cursor-pointer shadow-md shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending..." : "Submit Request"}
                </button>
              </div>

              {/* PENCIL BOOK */}
              <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-amber-600/50 transition">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
                    <Bookmark size={15} />
                    <span>Pencil Book</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">
                    Tentative reservation. Reserves calendar slots temporarily
                    while you finalize event schedules.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={submitting || availabilityConflicts.length > 0}
                  onClick={() => handleBookingAction("pencil_booked")}
                  className="w-full py-3 rounded-xl bg-[#1d1b15] hover:bg-amber-950/50 text-amber-400 border border-amber-800/60 text-xs font-extrabold uppercase tracking-widest transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Reserving..." : "Pencil Book"}
                </button>
              </div>

              {/* SAVE DRAFT */}
              <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-neutral-600 transition">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-neutral-400 font-bold text-xs uppercase tracking-wider">
                    <Save size={15} />
                    <span>Save Draft</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">
                    Save your inputted details without alerting production crew.
                    Resume anytime from your portal.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleBookingAction("draft")}
                  className="w-full py-3 rounded-xl bg-[#141924] hover:bg-[#1a2130] text-neutral-300 border border-[#242e42] text-xs font-extrabold uppercase tracking-widest transition cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Draft"}
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* AI Equipment Suggester Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0e111a] border border-[#242b3d] rounded-2xl overflow-hidden shadow-2xl text-white font-['Montserrat',sans-serif] animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-[#1c2233] flex items-center justify-between bg-[#111522]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    AI Equipment Suggester
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Powered by intelligent event analysis
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="w-8 h-8 rounded-full border border-neutral-700 bg-black/40 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              <div className="bg-[#090b10] border border-[#1c2233] rounded-xl p-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-3">
                  <span>📈</span> Event Analysis
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">
                      Event Type
                    </span>
                    <span className="text-xs font-bold text-white truncate block">
                      {eventType === "Other"
                        ? customEventType || "Other"
                        : eventType}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">
                      Attendees
                    </span>
                    <span className="text-xs font-bold text-white block">
                      {estimatedGuests || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">
                      Data Source
                    </span>
                    <span className="text-xs font-bold text-white block">
                      {aiBasedOnHistory ? "Past Events" : "General"}
                    </span>
                  </div>
                </div>
              </div>

              {aiLoading && (
                <div className="text-center py-6 text-neutral-400 text-xs">
                  Analyzing your event details...
                </div>
              )}

              {aiError && !aiLoading && (
                <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-4 text-xs text-red-400">
                  {aiError}
                </div>
              )}

              {!aiLoading && !aiError && aiReasoning && (
                <div className="bg-[#090b10] border border-[#1c2233] rounded-xl p-4 space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
                    AI Recommendation
                  </span>
                  <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                    {aiReasoning}
                  </p>
                </div>
              )}

              {!aiLoading && !aiError && aiSuggestions.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
                    Recommended Equipment
                  </span>

                  <div className="space-y-2">
                    {aiSuggestions.map((itemName) => {
                      const isAdded = selectedEquipment.includes(itemName);
                      return (
                        <div
                          key={itemName}
                          className="p-3.5 bg-[#090b10] border border-[#1c2233] rounded-xl flex items-center justify-between gap-4"
                        >
                          <h4 className="text-xs font-black uppercase text-white">
                            {itemName}
                          </h4>
                          <button
                            type="button"
                            onClick={() => toggleEquipment(itemName)}
                            className={`px-4 py-2 rounded-lg text-[11px] font-extrabold uppercase tracking-wider transition cursor-pointer shrink-0 ${
                              isAdded
                                ? "bg-emerald-600 text-white"
                                : "bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/30"
                            }`}
                          >
                            {isAdded ? "Added ✓" : "Add"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!aiLoading &&
                !aiError &&
                aiSuggestions.length === 0 &&
                aiReasoning === "" && (
                  <p className="text-xs text-neutral-500 text-center py-4">
                    No suggestions available — try filling in more event details
                    first.
                  </p>
                )}

              <p className="text-[10px] text-neutral-500 italic">
                💡 Suggestions are based on your event details
                {aiBasedOnHistory ? " and similar past bookings" : ""}. You can
                always customize further.
              </p>
            </div>

            <div className="p-4 border-t border-[#1c2233] flex justify-end bg-[#0b0e16]">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-lg shadow-red-600/30"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {showReceiptLightbox && receiptPreviewUrl && (
        <div
          className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setShowReceiptLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setShowReceiptLightbox(false)}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/60 border border-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X size={16} />
          </button>
          <img
            src={receiptPreviewUrl}
            alt="Payment proof full preview"
            className="max-h-full max-w-full rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 bg-[#ff0000] hover:bg-red-700 text-white p-4 rounded-full shadow-[0_0_18px_rgba(255,0,0,0.45)] transition-all z-50 cursor-pointer">
        <MessageSquare size={24} />
      </button>
    </div>
  );
};

export default BookingForm;
