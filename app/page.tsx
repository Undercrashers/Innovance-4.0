"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Film,
  Ticket,
  Mic,
  Users,
  Star,
  Camera,
  Music,
  Info,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sparkles,
  Award,
  Zap,
  TrendingUp,
  Menu,
  X,
  ArrowLeft,
  Bell,
  CheckCircle,
  User,
  School,
  Phone,
  Mail,
  Hash,
  Copy,
  Check,
} from "lucide-react";

const AnimationStyles = () => (
  <style>{`
    @keyframes float {
      0% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(10deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
    @keyframes spotlight {
      0% { opacity: 0.5; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); }
      100% { opacity: 0.5; transform: scale(1); }
    }
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    .animate-float-delayed {
      animation: float 8s ease-in-out infinite;
      animation-delay: 2s;
    }
    .spotlight-beam {
      background: radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%);
      animation: spotlight 4s ease-in-out infinite;
    }
    .animate-marquee {
      animation: marquee 30s linear infinite;
    }
    .animate-spin-slow {
      animation: spin-slow 3s linear infinite;
    }
  `}</style>
);

const RevealOnScroll = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 cubic-bezier(0.17, 0.55, 0.55, 1) transform ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-12 scale-95"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const SectionTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <RevealOnScroll className="text-center mb-12 relative z-10">
    <h2 className="text-4xl md:text-6xl font-black text-red-700 uppercase tracking-tighter transform -rotate-2 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-yellow-300 inline-block px-4 py-2 border-4 border-black hover:scale-105 transition-transform duration-300">
      {title}
    </h2>
    {subtitle && (
      <div className="block mt-4">
        <p className="text-xl md:text-2xl font-bold text-teal-800 bg-white inline-block px-3 py-1 border-2 border-black shadow-[4px_4px_0px_#000] rotate-1">
          {subtitle}
        </p>
      </div>
    )}
  </RevealOnScroll>
);

const RetroCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-6 hover:shadow-[12px_12px_0px_#d97706] hover:-translate-y-2 transition-all duration-300 ${className}`}
  >
    {children}
  </div>
);

const NavLink = ({
  href,
  children,
  mobile = false,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void;
}) => (
  <a
    href={href}
    onClick={(e) => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
    }}
    className={`${
      mobile
        ? "block w-full py-4 text-center text-xl hover:bg-yellow-200"
        : "relative group px-4 py-2 font-bold text-lg uppercase tracking-wider cursor-pointer"
    }`}
  >
    <span className="relative z-10">{children}</span>
    {!mobile && (
      <span className="absolute bottom-0 left-0 w-full h-0 bg-yellow-400 group-hover:h-full transition-all duration-200 -z-0 ease-in-out opacity-50"></span>
    )}
  </a>
);

// --- NEW: Registration Page Component ---

interface InputFieldProps {
  label: string;
  icon: React.ComponentType<{ size: number }>;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  options?: string[] | null;
}

const InputField = ({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  options = null,
}: InputFieldProps) => (
  <div className="mb-6 relative">
    <label className="block font-black uppercase text-sm mb-2 text-gray-800 tracking-wider">
      {label} <span className="text-red-600">*</span>
    </label>
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-600 transition-colors pointer-events-none">
        <Icon size={20} />
      </div>

      {options ? (
        <select
          value={value}
          onChange={onChange}
          className="w-full bg-yellow-50 border-4 border-black px-4 py-3 pl-10 font-bold text-black focus:outline-none focus:border-red-600 focus:bg-white shadow-[4px_4px_0px_rgba(0,0,0,0.1)] focus:shadow-[4px_4px_0px_#dc2626] transition-all appearance-none cursor-pointer"
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-white border-4 border-black px-4 py-3 pl-10 font-bold text-black placeholder-gray-400 focus:outline-none focus:border-red-600 focus:bg-yellow-50 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] focus:shadow-[4px_4px_0px_#dc2626] transition-all"
        />
      )}

      {options && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black">
          <ChevronDown size={20} />
        </div>
      )}
    </div>
  </div>
);

const generateTicketId = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const RegistrationForm = ({ onBack }: { onBack: () => void }) => {
  interface FormDataType {
    fullName: string;
    rollNumber: string;
    email: string;
    phone: string;
    university: string;
    gender: string;
  }

  interface RegistrationDetailsType extends FormDataType {
    uniqueId: string;
    timestamp: string;
  }

  const [formData, setFormData] = useState<FormDataType>({
    fullName: "",
    rollNumber: "",
    email: "",
    phone: "",
    university: "",
    gender: "",
  });
  const [registrationDetails, setRegistrationDetails] =
    useState<RegistrationDetailsType | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check Local Storage on Mount
  useEffect(() => {
    const savedRegistration = localStorage.getItem("innovance_reg_v1");
    if (savedRegistration) {
      setRegistrationDetails(JSON.parse(savedRegistration));
    }
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = () => {
    if (registrationDetails?.uniqueId) {
      // Create a temporary text area to copy from (for iframe compatibility)
      const textArea = document.createElement("textarea");
      textArea.value = registrationDetails.uniqueId;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy", err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (Object.values(formData).every((val) => val !== "")) {
      // 1. Generate 4-digit ID
      const uniqueId = generateTicketId();

      // 2. Prepare payload
      const finalData: RegistrationDetailsType = {
        ...formData,
        uniqueId,
        timestamp: new Date().toISOString(),
      };

      // 3. Send to backend API
      fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.error || "Registration failed");
            });
          }
          return response.json();
        })
        .then((data) => {
          // Save to localStorage AND MongoDB Atlas via API
          localStorage.setItem("innovance_reg_v1", JSON.stringify(finalData));
          setRegistrationDetails(finalData);
        })
        .catch((errorObj) => {
          console.error("Registration error:", errorObj);
          setError(
            errorObj.message || "Registration failed. Please try again.",
          );
        });
    } else {
      setError("Oye! Fill all the details first!");
    }
  };

  if (registrationDetails) {
    return (
      <div className="min-h-screen bg-[#fdf6e3] flex items-center justify-center p-4">
        <div className="max-w-xl w-full text-center animate-in zoom-in duration-500">
          <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_#000] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-4 bg-red-600 border-b-4 border-black"></div>
            <div className="absolute bottom-0 left-0 w-full h-4 bg-red-600 border-t-4 border-black"></div>

            <div className="bg-teal-400 w-24 h-24 rounded-full flex items-center justify-center border-4 border-black mx-auto mb-6 shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
              <CheckCircle size={48} className="text-black" />
            </div>

            <h2 className="text-4xl font-black text-red-700 uppercase mb-2">
              Registration Successful!
            </h2>
            <p className="text-gray-600 font-bold mb-6">
              Welcome to the show, {registrationDetails.fullName}!
            </p>

            <div className="bg-yellow-100 p-6 border-4 border-dashed border-black mb-8 relative">
              <p className="text-sm font-black uppercase text-gray-500 mb-2">
                Your Unique Payment ID
              </p>

              <div className="flex items-center justify-center gap-3">
                <span className="text-5xl font-black tracking-widest text-black">
                  {registrationDetails.uniqueId}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="bg-black text-white p-2 hover:bg-red-600 transition-colors border-2 border-transparent hover:border-black"
                  title="Copy ID"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
              <p className="text-xs font-bold text-red-600 mt-2 uppercase animate-pulse">
                {copied ? "Copied to Clipboard!" : "Copy this ID for Payment"}
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-left mb-8">
              <h4 className="font-bold text-blue-800 flex items-center gap-2">
                <Info size={18} /> Payment Procedure
              </h4>
              <p className="text-sm text-blue-900 mt-1">
                We have sent the payment details and procedure to your email
                address <strong>{registrationDetails.email}</strong>. Please use
                the ID above when completing your payment.
              </p>
            </div>

            <button
              onClick={onBack}
              className="w-full bg-black text-white px-8 py-3 font-black uppercase hover:bg-teal-600 transition-colors border-2 border-transparent hover:border-black shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:translate-y-1 hover:shadow-none"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf6e3] font-sans relative overflow-x-hidden pb-20">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <div className="max-w-2xl mx-auto px-4 pt-12 relative z-10">
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 font-bold text-gray-600 hover:text-black hover:-translate-x-1 transition-all"
        >
          <ArrowLeft size={20} /> Back to Kahani
        </button>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-red-700 uppercase tracking-tighter drop-shadow-[2px_2px_0px_#000] mb-2">
            Ticket Counter
          </h1>
          <p className="text-lg font-bold bg-yellow-300 inline-block text-gray-600 px-4 py-1 border-2 border-black rotate-1">
            Fill details correctly, no retakes allowed!
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border-4 border-black p-6 md:p-10 shadow-[12px_12px_0px_#14b8a6] relative"
        >
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-100 border-3 border-red-600 p-4 rounded-lg">
              <p className="text-red-800 font-bold text-center">{error}</p>
            </div>
          )}

          {/* Decorative Screw Heads */}
          <div className="absolute top-2 left-2 w-3 h-3 border-2 border-black rounded-full bg-gray-300 flex items-center justify-center">
            <div className="w-full h-[1px] bg-black rotate-45"></div>
          </div>
          <div className="absolute top-2 right-2 w-3 h-3 border-2 border-black rounded-full bg-gray-300 flex items-center justify-center">
            <div className="w-full h-[1px] bg-black rotate-45"></div>
          </div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border-2 border-black rounded-full bg-gray-300 flex items-center justify-center">
            <div className="w-full h-[1px] bg-black rotate-45"></div>
          </div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-2 border-black rounded-full bg-gray-300 flex items-center justify-center">
            <div className="w-full h-[1px] bg-black rotate-45"></div>
          </div>

          <div className="space-y-2">
            <InputField
              label="Full Name"
              icon={User}
              placeholder="e.g. Ananya Sharma"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Roll Number"
                icon={Hash}
                placeholder="e.g. 2105123"
                value={formData.rollNumber}
                onChange={(e) => handleChange("rollNumber", e.target.value)}
              />
              <InputField
                label="Gender"
                icon={Users}
                options={["Male", "Female"]}
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              />
            </div>

            <InputField
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="name@university.edu"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <InputField
              label="Phone Number"
              icon={Phone}
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />

            <InputField
              label="Hostel"
              icon={School}
              placeholder="e.g. Queens Castle 2"
              value={formData.university}
              onChange={(e) => handleChange("university", e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-red-600 text-white text-xl py-4 font-black uppercase tracking-widest border-4 border-black shadow-[6px_6px_0px_#000] hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] hover:bg-red-700 transition-all flex items-center justify-center gap-3"
          >
            Confirm Seat <Ticket size={24} />
          </button>

          <p className="text-center text-xs text-gray-500 font-bold mt-4 uppercase">
            * By clicking confirm, you agree to bring your own laptop and
            charger.
          </p>
        </form>
      </div>
    </div>
  );
};

const hiddenSpeakers = [
  {
    title: "MEGA STAR ENTRY",
    subtitle: "Thalaiva of Tech",
    tagline: "Mass Ka Baap!",
    desc: "Wait for the BGM...",
    color: "bg-yellow-400",
    textColor: "text-red-700",
    icon: <Star size={80} className="animate-spin-slow" />,
  },
  {
    title: "ROWDY BABY",
    subtitle: "Coding Asuran",
    tagline: "Vera Level Expert",
    desc: "Loading... 99%",
    color: "bg-red-600",
    textColor: "text-yellow-400",
    icon: <Zap size={80} className="animate-pulse" />,
  },
  {
    title: "SUPREME STAR",
    subtitle: "Mystery Nayagan",
    tagline: "Picture Abhi Baaki Hai",
    desc: "Coming Soon to Screens",
    color: "bg-black",
    textColor: "text-white",
    icon: <Users size={80} />,
  },
];

const features = [
  {
    icon: <Zap size={32} />,
    title: "Hands-on Action",
    desc: "No drama, only karma. Practical workshops.",
    color: "bg-orange-100",
  },
  {
    icon: <Users size={32} />,
    title: "Solid Networking",
    desc: "Meet the 'Bhai's of the industry.",
    color: "bg-purple-100",
  },
  {
    icon: <Sparkles size={32} />,
    title: "Interactive Sessions",
    desc: "Sawaal jawaab, masti aur gyaan.",
    color: "bg-yellow-100",
  },
  {
    icon: <Award size={32} />,
    title: "Asli Certification",
    desc: "Degree dikhao, job paao (almost).",
    color: "bg-teal-100",
  },
  {
    icon: <TrendingUp size={32} />,
    title: "Discover Trends",
    desc: "Future ka trailer aaj hi dekho.",
    color: "bg-red-100",
  },
  {
    icon: <Mic size={32} />,
    title: "Expert Speakers",
    desc: "Dialogues that hit hard.",
    color: "bg-indigo-100",
  },
];

const faqs = [
  {
    q: "When will Innovance 4.0 release?",
    a: "The grand premiere is scheduled for January 24, 2026! Mark your calendars.",
  },
  {
    q: "Kitne ka ticket hai bhaiya?",
    a: "Discounted rates for early birds! Check the Box Office section below.",
  },
  {
    q: "Do I need to be a coding wizard?",
    a: "Bilkul nahi! Beginners are welcome. Hum sikhayenge.",
  },
  {
    q: "Will there be food?",
    a: "Haanji! Full meals included. Bhookhe pet bhajan na hoye gopala.",
  },
  {
    q: "Can I bring my laptop?",
    a: "Yes, it is your weapon for the day. Don't leave home without it.",
  },
];

const schedule = {
  day1: [
    {
      time: "10:15 AM",
      title: "Music aur Dance Performance",
      location: "Main Stage",
      type: "Performance",
    },
    {
      time: "11:30 AM",
      title: "Speaker Session",
      location: "Auditorium",
      type: "Keynote",
    },
    {
      time: "01:00 PM",
      title: "Ideathon Problem Statement Briefing",
      location: "Auditorium",
      type: "Workshop",
    },
    {
      time: "01:30 PM",
      title: "Lunch Break",
      location: "Cafeteria",
      type: "Break",
    },
    {
      time: "03:00 PM - 06:00 PM",
      title: "Entrepreneurship Round Table (Tech Kalesh)",
      location: "Conference Hall",
      type: "EMUN",
    },
  ],
  day2: [
    {
      time: "10:15 AM",
      title: "Guest Speaker Session",
      location: "Auditorium",
      type: "Keynote",
    },
    {
      time: "12:00 PM",
      title: "Pitching - Pehla Half",
      location: "Main Stage",
      type: "Presentation",
    },
    {
      time: "01:30 PM",
      title: "Lunch Break",
      location: "Cafeteria",
      type: "Break",
    },
    {
      time: "03:00 PM",
      title: "Pitching - Doosra Half",
      location: "Main Stage",
      type: "Presentation",
    },
    {
      time: "05:00 PM",
      title: "Music aur Dance Performance",
      location: "Main Stage",
      type: "Performance",
    },
    {
      time: "06:00 PM",
      title: "Prize Distribution aur Felicitation",
      location: "Main Stage",
      type: "Ceremony",
    },
  ],
};

// Video Modal Component - Moved outside to prevent remounting
const VideoModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl bg-black border-4 border-red-600 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            key="youtube-trailer"
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/SHnmj1OM9uk"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Innovance 4.0 Trailer"
            loading="lazy"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 transition-colors z-10 border-2 border-white rounded"
            aria-label="Close video"
          >
            <X size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function InnovanceBollywood() {
  const [currentView, setCurrentView] = useState("home"); // "home" | "register"
  const [activeDay, setActiveDay] = useState<"day1" | "day2">("day1");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const targetDate = new Date("2026-01-24T00:00:00");

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleGetTicket = () => {
    window.location.href =
      "https://payments.billdesk.com/bdcollect/bd/kiitereg/19154";
  };

  if (currentView === "register") {
    return (
      <>
        <AnimationStyles />
        <RegistrationForm onBack={() => setCurrentView("home")} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf6e3] font-sans text-black overflow-x-hidden selection:bg-red-500 selection:text-white relative">
      <AnimationStyles />
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />

      <div className="fixed inset-0 pointer-events-none opacity-5 z-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <Music className="absolute top-20 left-10 text-yellow-500 opacity-20 w-16 h-16 animate-float" />
        <Star className="absolute top-1/2 right-20 text-red-500 opacity-20 w-12 h-12 animate-float-delayed" />
        <Camera className="absolute bottom-20 left-1/3 text-teal-500 opacity-10 w-24 h-24 animate-float" />
      </div>

      {/* --- Marquee --- */}
      <div className="bg-red-600 text-white py-2 border-b-4 border-black overflow-hidden whitespace-nowrap relative z-40">
        <div className="animate-marquee inline-block font-bold uppercase tracking-widest text-sm md:text-base px-8">
          ★ IOT LAB PRESENTS ★ INNOVANCE 4.0 ★ THE BIGGEST TECH BLOCKBUSTER ★
          RELEASING JANUARY 24, 2026 ★ HOUSEFULL SOON ★ RESERVE YOUR SEATS NOW ★
          ADMISSIONS OPEN ★ DON'T MISS THE SHOW ★
        </div>
        <div className="animate-marquee inline-block font-bold uppercase tracking-widest text-sm md:text-base px-8">
          ★ IOT LAB PRESENTS ★ INNOVANCE 4.0 ★ THE BIGGEST TECH BLOCKBUSTER ★
          RELEASING JANUARY 24, 2026 ★ HOUSEFULL SOON ★ RESERVE YOUR SEATS NOW ★
          ADMISSIONS OPEN ★ DON'T MISS THE SHOW ★
        </div>
      </div>

      {/* --- Navbar --- */}
      <nav className="bg-yellow-400 border-b-4 border-black sticky top-0 z-40 px-4 py-3 md:py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setCurrentView("home")}
          >
            <img
              src="/apple-touch-icon.png"
              alt="Innovance"
              className="w-8 h-8 md:w-10 md:h-10 group-hover:rotate-12 transition-transform"
            />
            <span className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-red-700 drop-shadow-[2px_2px_0px_#fff]">
              Innovance Talkies
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 items-center">
            <NavLink href="#about">Kahani</NavLink>
            <NavLink href="#speakers">Star Cast</NavLink>
            <NavLink href="#schedule">Showtime</NavLink>
            <NavLink href="#tickets" onClick={handleGetTicket}>
              Box Office
            </NavLink>
            <button
              onClick={handleGetTicket}
              className="bg-black text-white px-6 py-2 font-bold uppercase hover:bg-red-600 hover:scale-105 transition-transform border-2 border-transparent hover:border-black shadow-[4px_4px_0px_#7f1d1d]"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-black p-1 border-2 border-black bg-white shadow-[3px_3px_0px_#000] active:shadow-none active:translate-y-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-yellow-400 border-b-4 border-black border-t-4 flex flex-col shadow-2xl animate-in slide-in-from-top-5">
            <NavLink mobile href="#about">
              Kahani (About)
            </NavLink>
            <NavLink mobile href="#speakers">
              Star Cast (Speakers)
            </NavLink>
            <NavLink mobile href="#schedule">
              Showtime (Schedule)
            </NavLink>
            <button
              onClick={handleGetTicket}
              className="block w-full py-4 text-center text-xl hover:bg-yellow-200 font-bold uppercase tracking-wider"
            >
              Box Office (Tickets)
            </button>
          </div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative py-20 px-4 overflow-hidden border-b-4 border-black bg-[#99f6e4]">
        {/* Spotlight Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl spotlight-beam pointer-events-none z-0 mix-blend-overlay"></div>

        {/* Background Elements */}
        <div className="absolute top-10 left-10 text-yellow-500 opacity-20 transform -rotate-12 animate-pulse">
          <Star size={120} fill="currentColor" />
        </div>
        <div className="absolute bottom-10 right-10 text-pink-500 opacity-20 transform rotate-12 animate-pulse delay-75">
          <Star size={150} fill="currentColor" />
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <RevealOnScroll className="flex-1 text-center md:text-left">
            <div className="inline-block bg-black text-white px-4 py-1 font-mono text-sm mb-4 transform -rotate-2">
              EST. 2026 • IOT LAB PRESENTS
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-red-600 leading-[0.9] mb-4 drop-shadow-[6px_6px_0px_#000]">
              INNOVANCE <br />
              <span
                className="text-yellow-500 text-7xl md:text-9xl stroke-black stroke-2"
                style={{ WebkitTextStroke: "3px black" }}
              >
                4.0
              </span>
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold text-teal-900 mb-8 bg-white inline-block px-4 py-2 border-4 border-black transform rotate-1 shadow-[6px_6px_0px_rgba(0,0,0,0.2)]">
              "When Tech meets Tadka"
            </h2>

            <p className="text-xl md:text-2xl mb-8 font-medium max-w-lg mx-auto md:mx-0">
              Tech, Kalesh, and Code! Join the biggest blockbuster event of the
              year.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={handleGetTicket}
                className="bg-red-600 text-white text-xl px-8 py-4 font-black uppercase border-4 border-black shadow-[8px_8px_0px_#000] hover:translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all flex items-center justify-center gap-2 group"
              >
                <Ticket className="group-hover:rotate-12 transition-transform" />{" "}
                Get Ticket
              </button>
              <button
                onClick={() => setIsVideoOpen(true)}
                className="bg-yellow-400 text-black text-xl px-8 py-4 font-black uppercase border-4 border-black shadow-[8px_8px_0px_#000] hover:translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all flex items-center justify-center gap-2"
              >
                <Camera /> Watch Trailer
              </button>
            </div>
          </RevealOnScroll>

          <RevealOnScroll
            delay={200}
            className="flex-1 w-full max-w-md relative"
          >
            <div className="bg-black p-2 pb-12 rotate-3 shadow-[15px_15px_0px_rgba(0,0,0,0.2)] hover:rotate-0 transition-transform duration-500">
              {/* Placeholder for the team image, styled like a polaroid */}
              <div className="bg-gray-200 aspect-[4/3] flex items-center justify-center overflow-hidden relative group">
                <img
                  src="/iotcardlead.jpeg"
                  alt="IOT Card Lead"
                  className="w-full h-full object-cover ml-5 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="z-10 text-center p-4"></div>
              </div>
              <div className="text-white text-center font-handwriting text-2xl mt-4">
                Our Heroes & Heroines
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </header>

      {/* --- Stats / About Section (Who Are We) --- */}
      <section
        id="about"
        className="py-20 bg-yellow-50 relative border-b-4 border-black"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <RevealOnScroll>
              <SectionTitle title="KAHANI AB TAK..." subtitle="Who Are We?" />
              <p className="text-xl leading-relaxed font-medium mb-6">
                Empowered by technology, the{" "}
                <span className="font-bold">IOT LAB</span> student-faculty team
                tackles social challenges. Humara goal simple hai:{" "}
                <span className="bg-yellow-200 px-1 font-bold">
                  Har member ka unique talent use karke creative problem solving
                  karna.
                </span>
              </p>
              <a
                href="#"
                className="text-red-600 font-black text-lg hover:underline decoration-4 underline-offset-4 hover:text-red-800 transition-colors"
              >
                READ FULL SCRIPT &rarr;
              </a>
            </RevealOnScroll>

            <div className="grid grid-cols-2 gap-4">
              <RevealOnScroll delay={100} className="h-full">
                <RetroCard className="bg-pink-200 rotate-1 h-full flex flex-col justify-center items-center">
                  <h3 className="text-5xl font-black mb-2">100%</h3>
                  <p className="font-bold text-sm uppercase text-center">
                    Entertainment Guarantee
                  </p>
                </RetroCard>
              </RevealOnScroll>
              <RevealOnScroll delay={200} className="h-full">
                <RetroCard className="bg-teal-200 -rotate-1 h-full flex flex-col justify-center items-center">
                  <h3 className="text-5xl font-black mb-2">20+</h3>
                  <p className="font-bold text-sm uppercase text-center">
                    Blockbuster Events
                  </p>
                </RetroCard>
              </RevealOnScroll>
              <RevealOnScroll delay={300} className="h-full">
                <RetroCard className="bg-orange-200 -rotate-2 h-full flex flex-col justify-center items-center">
                  <h3 className="text-5xl font-black mb-2">400+</h3>
                  <p className="font-bold text-sm uppercase text-center">
                    Audience Members
                  </p>
                </RetroCard>
              </RevealOnScroll>
              <RevealOnScroll delay={400} className="h-full">
                <RetroCard className="bg-purple-200 rotate-2 h-full flex flex-col justify-center items-center">
                  <h3 className="text-5xl font-black mb-2">30+</h3>
                  <p className="font-bold text-sm uppercase text-center">
                    Hit Projects
                  </p>
                </RetroCard>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* --- Features (Why Attend) --- */}
      <section className="py-20 bg-[#cffafe] border-b-4 border-black pattern-dots pattern-black pattern-bg-transparent pattern-size-4 pattern-opacity-10">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="KYUN AAYEIN?" subtitle="Why Watch This Show?" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <RevealOnScroll key={idx} delay={idx * 100}>
                <RetroCard
                  className={`${feature.color} text-center group h-full`}
                >
                  <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-transparent group-hover:border-white transition-all group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-medium text-gray-800">{feature.desc}</p>
                </RetroCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* --- Speakers (Star Cast) - HIDDEN / REVEAL STYLE --- */}
      <section
        id="speakers"
        className="py-20 bg-black text-white border-b-4 border-white relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <RevealOnScroll>
              <h2 className="text-5xl md:text-7xl font-black text-yellow-400 uppercase tracking-tighter drop-shadow-[4px_4px_0px_#ef4444]">
                Star Cast
              </h2>
              <p className="text-xl mt-4 text-gray-300 font-bold uppercase tracking-widest bg-red-600 inline-block px-4 py-1 transform rotate-1 animate-pulse">
                Top Secret Reveal Soon!
              </p>
            </RevealOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hiddenSpeakers.map((speaker, idx) => (
              <RevealOnScroll key={idx} delay={idx * 150}>
                <div className="relative group perspective h-full">
                  {/* Poster Effect */}
                  <div
                    className={`relative ${speaker.color} ${speaker.textColor} border-4 border-white p-2 h-full transition-transform transform group-hover:-translate-y-2 shadow-[8px_8px_0px_#fff]`}
                  >
                    {/* Inner Frame */}
                    <div className="border-4 border-black border-double h-full p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                      {/* Decorative Corner Triangles */}
                      <div className="absolute top-0 left-0 w-12 h-12 border-t-8 border-l-8 border-black"></div>
                      <div className="absolute top-0 right-0 w-12 h-12 border-t-8 border-r-8 border-black"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-8 border-l-8 border-black"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-8 border-r-8 border-black"></div>

                      <div className="mb-6 opacity-80 scale-110">
                        {speaker.icon}
                      </div>

                      <h4 className="text-lg font-bold bg-black text-white px-2 mb-2 uppercase tracking-widest">
                        {speaker.subtitle}
                      </h4>

                      <h3 className="text-4xl md:text-5xl font-black uppercase leading-[0.9] mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                        {speaker.title}
                      </h3>

                      <div className="bg-white/90 text-black font-black text-xl px-4 py-2 mt-4 rotate-2 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
                        {speaker.tagline}
                      </div>

                      <p className="mt-6 font-mono font-bold text-sm tracking-widest opacity-80 animate-pulse">
                        {speaker.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* --- Schedule (Showtime) --- */}
      <section
        id="schedule"
        className="py-20 bg-red-50 border-b-4 border-black"
      >
        <div className="max-w-4xl mx-auto px-4">
          <SectionTitle title="SHOW TIMINGS" subtitle="Don't be late!" />

          <RevealOnScroll>
            <div className="flex justify-center gap-4 mb-12">
              <button
                onClick={() => setActiveDay("day1")}
                className={`px-8 py-3 text-xl font-black uppercase border-4 border-black shadow-[4px_4px_0px_#000] transition-all ${
                  activeDay === "day1"
                    ? "bg-red-500 text-white translate-x-[2px] translate-y-[2px] shadow-none"
                    : "bg-white hover:bg-red-100"
                }`}
              >
                Day 1
              </button>
              <button
                onClick={() => setActiveDay("day2")}
                className={`px-8 py-3 text-xl font-black uppercase border-4 border-black shadow-[4px_4px_0px_#000] transition-all ${
                  activeDay === "day2"
                    ? "bg-red-500 text-white translate-x-[2px] translate-y-[2px] shadow-none"
                    : "bg-white hover:bg-red-100"
                }`}
              >
                Day 2
              </button>
            </div>
          </RevealOnScroll>

          <div className="space-y-6">
            {schedule[activeDay].map((item, idx) => (
              <RevealOnScroll key={idx} delay={idx * 100}>
                <div className="bg-white border-4 border-black p-6 flex flex-col md:flex-row gap-6 items-center shadow-[6px_6px_0px_#000] hover:bg-yellow-50 transition-colors group">
                  <div className="bg-black text-yellow-400 w-full md:w-32 py-4 text-center font-black text-xl border-2 border-yellow-400 border-dashed group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                    {item.time.split(" ")[0]} <br />{" "}
                    <span className="text-sm">{item.time.split(" ")[1]}</span>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <span className="inline-block bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 mb-2 border border-black uppercase">
                      {item.type}
                    </span>
                    <h3 className="text-2xl font-black text-red-700 uppercase mb-1">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 font-bold">
                      <MapPin size={16} /> {item.location}
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* --- Pricing (Ticket Khidki) --- */}
      <section
        id="tickets"
        className="py-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-teal-600 border-b-4 border-black"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <RevealOnScroll>
            <h2 className="text-5xl md:text-6xl font-black text-white uppercase drop-shadow-[4px_4px_0px_#000] mb-12">
              Box Office
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <div className="max-w-md mx-auto relative group">
              {/* Ticket Shape */}
              <div className="bg-yellow-100 p-8 border-4 border-black relative shadow-[10px_10px_0px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300">
                {/* Hot Badge */}
                <div className="absolute -top-6 -right-6 bg-red-600 text-white w-20 h-20 rounded-full flex items-center justify-center font-black rotate-12 border-4 border-white shadow-lg animate-bounce z-10">
                  HOT!
                </div>

                {/* Cutouts */}
                <div className="absolute top-1/2 -left-4 w-8 h-8 bg-teal-600 rounded-full border-r-4 border-black"></div>
                <div className="absolute top-1/2 -right-4 w-8 h-8 bg-teal-600 rounded-full border-l-4 border-black"></div>

                <div className="border-4 border-dashed border-gray-400 p-6">
                  <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-6 gap-4">
                    <div className="text-left">
                      <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase">
                        Balcony Seat
                      </span>
                      <h3 className="text-xl md:text-4xl font-black mt-2">
                        REGULAR
                      </h3>
                    </div>
                    <div className="text-center md:text-right w-full md:w-auto">
                      <span className="block text-xs md:text-sm font-bold line-through text-gray-500">
                        ₹499
                      </span>
                      <span className="block text-3xl sm:text-4xl md:text-5xl font-black text-red-600">
                        ₹200
                      </span>
                    </div>
                  </div>

                  <ul className="text-left space-y-3 mb-8 font-medium">
                    <li className="flex items-center gap-2">
                      <Star
                        size={16}
                        className="text-yellow-500 fill-current"
                      />
                      Exclusive Speaker Sessions
                    </li>
                    <li className="flex items-center gap-2">
                      <Star
                        size={16}
                        className="text-yellow-500 fill-current"
                      />
                      Entrepeneurial Roundtable
                    </li>
                    <li className="flex items-center gap-2">
                      <Star
                        size={16}
                        className="text-yellow-500 fill-current"
                      />
                      Ideathon
                    </li>
                    <li className="flex items-center gap-2">
                      <Star
                        size={16}
                        className="text-yellow-500 fill-current"
                      />
                      Startup Showcase (WhySchool)
                    </li>
                    <li className="flex items-center gap-2">
                      <Star
                        size={16}
                        className="text-yellow-500 fill-current"
                      />
                      Prize Pool: ₹50,000
                    </li>
                    <li className="flex items-center gap-2">
                      <Star
                        size={16}
                        className="text-yellow-500 fill-current"
                      />
                      Many Other Incentives
                    </li>
                    <li className="flex items-center gap-2">
                      <Star
                        size={16}
                        className="text-yellow-500 fill-current"
                      />
                      Incubation Offer
                    </li>
                    <li className="flex items-center gap-2">
                      <Star
                        size={16}
                        className="text-yellow-500 fill-current"
                      />
                      Participation Certificate
                    </li>
                    <li className="flex items-center gap-2">
                      <Star
                        size={16}
                        className="text-yellow-500 fill-current"
                      />
                      Hot Samosas & Chai
                    </li>
                  </ul>

                  <button
                    onClick={handleGetTicket}
                    className="w-full bg-black text-white text-xl py-3 font-black uppercase hover:bg-red-600 transition-colors"
                  >
                    Book Ticket Now
                  </button>
                  <p className="text-xs text-center mt-3 text-gray-500">
                    Non-refundable (No money back guarantee)
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="py-20 bg-yellow-50 border-b-4 border-black">
        <div className="max-w-3xl mx-auto px-4">
          <SectionTitle title="SAWAAL JAWAB" subtitle="Poochta Hai Bharat" />

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <RevealOnScroll key={idx} delay={idx * 100}>
                <div className="border-4 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-6 py-4 flex justify-between items-center bg-white hover:bg-gray-50 font-bold text-lg md:text-xl transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <span className="bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm border-2 border-black">
                        Q
                      </span>
                      {faq.q}
                    </span>
                    {openFaq === idx ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 py-4 bg-yellow-100 border-t-4 border-black font-medium text-gray-800 flex items-start gap-3 animate-in slide-in-from-top-2">
                      <span className="bg-teal-600 text-white w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full text-sm border-2 border-black mt-1">
                        A
                      </span>
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer / Countdown --- */}
      <footer className="bg-black text-white py-16 text-center border-b-[20px] border-red-600 relative overflow-hidden">
        {/* Film reel effect borders */}
        <div className="absolute top-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMCIgeT0iNSIgZmlsbD0id2hpdGUiIC8+PC9zdmc+')] opacity-20"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-5xl font-black mb-2 text-yellow-400">
              ULTI GINTI SHURU!
            </h2>
            <p className="text-xl mb-4">
              Get ready for the premiere on January 24, 2026!
            </p>
            <p className="text-lg mb-12 text-gray-400">
              Reserve your spots before the house is full!
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
              {[
                { label: "Days", val: timeLeft.days },
                { label: "Hours", val: timeLeft.hours },
                { label: "Minutes", val: timeLeft.minutes },
                { label: "Seconds", val: timeLeft.seconds },
              ].map((time, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="bg-gray-800 text-white text-4xl md:text-6xl font-mono p-4 rounded-lg border-2 border-gray-600 w-24 md:w-32 mb-2 shadow-[0px_0px_20px_rgba(255,255,255,0.2)] animate-pulse">
                    {String(time.val).padStart(2, "0")}
                  </div>
                  <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-red-500">
                    {time.label}
                  </span>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6 opacity-60 text-sm">
            <div className="flex gap-4">
              <a
                href="#"
                className="hover:text-yellow-400 hover:scale-125 transition-all"
              >
                <Music size={20} />
              </a>
              <a
                href="#"
                className="hover:text-yellow-400 hover:scale-125 transition-all"
              >
                <Camera size={20} />
              </a>
              <a
                href="#"
                className="hover:text-yellow-400 hover:scale-125 transition-all"
              >
                <Info size={20} />
              </a>
            </div>
            <p>© 2026 IOT LAB. Directed by Tech Team.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
