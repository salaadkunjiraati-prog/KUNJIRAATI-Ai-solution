import React, { useState, useEffect } from 'react';
import { 
  Home, 
  MessageSquare, 
  Camera, 
  LineChart, 
  History as HistoryIcon, 
  Calculator as CalcIcon, 
  Info, 
  Crown,
  MessageCircle,
  Menu,
  X,
  Plus,
  Minus,
  Divide,
  X as Multiply,
  Equal,
  Trash2,
  Upload,
  ArrowLeft,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { solveMathProblem } from './services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { 
  LineChart as ReLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// --- Types ---
type Language = 'so' | 'en';
type Page = 'home' | 'assistant' | 'scanner' | 'graph' | 'history' | 'calculator' | 'features' | 'pro';

const translations = {
  so: {
    solveMath: "Xaliye Xisaabta",
    solveDesc: "Ku xali xisaab kasta AI casri ah.",
    getPro: "HEL PRO",
    solveButton: "Solve Math",
    scanButton: "Scan Math",
    calcButton: "Calculator",
    graphButton: "Graph Plotter",
    history: "History",
    recentHistory: "Taariikhda dhow",
    viewAll: "Arag dhamaan",
    assistantTitle: "Chat AI Math",
    assistantPlaceholder: "Gali xisaabtaada halkan...",
    scannerTitle: "Math Scanner",
    scannerDesc: "Sawir ka qaad ama Upload garee",
    scannerSub: "Algebra, Calculus, Geometry...",
    solveNow: "Xali Hadda",
    graphTitle: "Graph Plotter",
    graphLabel: "Gali Equation (sida: x * x + 3)",
    historyTitle: "History",
    clearAll: "Tirtir dhamaan",
    emptyHistory: "Taariikhdu waa maran tahay.",
    calcTitle: "Scientific Calculator",
    featuresTitle: "App Features",
    upgradePro: "Upgrade to Pro",
    proTitle: "KUNJIRAATI Pro",
    proDesc: "Hel awooda buuxda ee AI Math Assistant.",
    activatePro: "Activate Pro",
    contactAdmin: "Contact Admin",
    howToActivate: "Sida loo hawlgeliyo:",
    step1: "1. Dir $0.5 via EVC-PLUS",
    step2: "2. Lambarka: 619403795",
    step3: "3. WhatsApp u dir proof-ka lacagta.",
    activationCode: "Activation Code",
    codePlaceholder: "Gali code-ka halkan...",
    errorInvalidCode: "Code-ka waa qalad, fadlan hubi ama la xirir admin-ka.",
    successPro: "You are PRO!",
    successDesc: "Waad ku mahadsan tahay isticmaalka KUNJIRAATI-AI Solution Pro. Dhammaan features-ka waa kuu furan yihiin.",
    activeLifetime: "Status: Active Lifetime",
    home: "Home",
    features: "Features",
    pro: "Get Pro",
    aiChat: "Chat AI Math",
    scan: "Scan",
    calc: "Calc",
    graph: "Graph",
    whatsapp: "WhatsApp"
  },
  en: {
    solveMath: "Math Solver",
    solveDesc: "Solve any math with advanced AI.",
    getPro: "GET PRO",
    solveButton: "Solve Math",
    scanButton: "Scan Math",
    calcButton: "Calculator",
    graphButton: "Graph Plotter",
    history: "History",
    recentHistory: "Recent History",
    viewAll: "View All",
    assistantTitle: "Chat AI Math",
    assistantPlaceholder: "Enter your math here...",
    scannerTitle: "Math Scanner",
    scannerDesc: "Take a photo or Upload",
    scannerSub: "Algebra, Calculus, Geometry...",
    solveNow: "Solve Now",
    graphTitle: "Graph Plotter",
    graphLabel: "Enter Equation (e.g., x * x + 3)",
    historyTitle: "History",
    clearAll: "Clear All",
    emptyHistory: "History is empty.",
    calcTitle: "Scientific Calculator",
    featuresTitle: "App Features",
    upgradePro: "Upgrade to Pro",
    proTitle: "KUNJIRAATI Pro",
    proDesc: "Get the full power of AI Math Assistant.",
    activatePro: "Activate Pro",
    contactAdmin: "Contact Admin",
    howToActivate: "How to activate:",
    step1: "1. Send $0.5 via EVC-PLUS",
    step2: "2. Number: 619403795",
    step3: "3. Send proof to WhatsApp.",
    activationCode: "Activation Code",
    codePlaceholder: "Enter code here...",
    errorInvalidCode: "Code is wrong, please check or contact admin.",
    successPro: "You are PRO!",
    successDesc: "Thank you for using KUNJIRAATI-AI Solution Pro. All features are open.",
    activeLifetime: "Status: Active Lifetime",
    home: "Home",
    features: "Features",
    pro: "Get Pro",
    aiChat: "Chat AI Math",
    scan: "Scan",
    calc: "Calc",
    graph: "Graph",
    whatsapp: "WhatsApp"
  }
};

interface HistoryItem {
  id: string;
  type: 'chat' | 'scan' | 'graph';
  question: string;
  answer: string;
  timestamp: number;
  image?: string;
}

// --- Constants ---
const LOGO_URL = null; // Use the designed math books logo as default

// --- Components ---

const Logo = ({ className, customLogo }: { className?: string, customLogo?: string | null }) => {
  const [error, setError] = useState(false);

  if (customLogo || (!error && LOGO_URL)) {
    return (
      <div className={cn("relative overflow-hidden rounded-2xl", className)}>
        <img 
          src={customLogo || LOGO_URL} 
          alt="K-Ai Logo" 
          className="w-full h-full object-contain drop-shadow-2xl"
          referrerPolicy="no-referrer"
          onError={() => setError(true)}
        />
      </div>
    );
  }

  // Designed Fallback - Professional Math Books Logo
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-2xl group", className)}>
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
      
      {/* Decorative Particles */}
      <div className="absolute top-2 left-2 w-1 h-1 bg-white/40 rounded-full animate-pulse" />
      <div className="absolute bottom-4 right-3 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse delay-700" />
      <div className="absolute top-1/2 right-2 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-300" />

      <div className="relative flex flex-col items-center justify-center">
        {/* Book Stack Container */}
        <div className="relative flex flex-col items-center">
          {/* Bottom Book */}
          <div className="w-10 h-2.5 bg-white/20 rounded-sm border border-white/30 transform translate-y-1 scale-95 opacity-50" />
          
          {/* Middle Book */}
          <div className="w-11 h-3 bg-white/30 rounded-sm border border-white/40 transform translate-y-0.5 scale-100 opacity-70" />
          
          {/* Top Book (Main) */}
          <div className="relative w-12 h-14 bg-white/10 backdrop-blur-md rounded-md border border-white/40 shadow-xl flex flex-col items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
            {/* Book Spine Detail */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-white/20 to-transparent border-r border-white/10" />
            
            {/* Math Symbols on Cover */}
            <div className="flex flex-col items-center gap-0.5 opacity-90">
              <div className="flex gap-1">
                <Plus size={8} className="text-white/80" />
                <Minus size={8} className="text-white/80" />
              </div>
              <div className="w-6 h-[1px] bg-white/30 my-0.5" />
              <div className="flex gap-1">
                <Multiply size={8} className="text-white/80" />
                <Divide size={8} className="text-white/80" />
              </div>
              <div className="mt-1 font-bold text-[10px] text-white drop-shadow-sm">Σ</div>
            </div>

            {/* Glowing Core */}
            <div className="absolute inset-0 bg-blue-400/10 blur-xl animate-pulse pointer-events-none" />
          </div>
        </div>

        {/* Brand Text */}
        <div className="mt-1.5 flex flex-col items-center">
          <span className="text-[9px] font-black tracking-[0.15em] text-white uppercase drop-shadow-md">
            K-Ai
          </span>
          <div className="h-[1px] w-4 bg-gradient-to-r from-transparent via-white/50 to-transparent mt-0.5" />
        </div>
      </div>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
    </div>
  );
};

const GlassCard = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <motion.div 
    whileHover={onClick ? { scale: 1.02 } : {}}
    whileTap={onClick ? { scale: 0.98 } : {}}
    onClick={onClick}
    className={cn("glass p-6", className, onClick && "cursor-pointer")}
  >
    {children}
  </motion.div>
);

const IconButton = ({ icon: Icon, label, onClick, active, className }: { icon: any, label: string, onClick: () => void, active?: boolean, className?: string }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center gap-1 p-2 transition-all duration-300",
      active ? "text-blue-400 scale-110" : "text-white/60 hover:text-white",
      className
    )}
  >
    <Icon size={24} />
    <span className="text-[10px] uppercase tracking-wider font-medium">{label}</span>
  </button>
);

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [lang, setLang] = useState<Language>('so');
  const [isPro, setIsPro] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  const t = translations[lang];

  // Load history, lang, and logo from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kunjiraati_history');
    if (saved) setHistory(JSON.parse(saved));
    const proStatus = localStorage.getItem('kunjiraati_pro');
    if (proStatus === 'true') setIsPro(true);
    const savedLang = localStorage.getItem('kunjiraati_lang') as Language;
    if (savedLang) setLang(savedLang);
    const savedLogo = localStorage.getItem('kunjiraati_logo');
    if (savedLogo) setCustomLogo(savedLogo);
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCustomLogo(base64String);
        localStorage.setItem('kunjiraati_logo', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleLang = () => {
    const newLang = lang === 'so' ? 'en' : 'so';
    setLang(newLang);
    localStorage.setItem('kunjiraati_lang', newLang);
  };

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    const newHistory = [newItem, ...history];
    setHistory(newHistory);
    localStorage.setItem('kunjiraati_history', JSON.stringify(newHistory));
  };

  const navigate = (page: Page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/252619403795?text=Fadlan%20la%20xirir%20Admin-ka%20KUNJIRAATI-AI', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-black/10 border-b border-white/10">
        <div className="flex items-center gap-2">
          <button onClick={openWhatsApp} className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs font-bold glow-green">
            <MessageCircle size={18} />
            <span className="hidden sm:inline">{t.whatsapp}</span>
          </button>
          
          {/* Modern Language Switcher */}
          <div className="flex items-center glass p-1 rounded-full border border-white/10 shadow-lg">
            <button 
              onClick={() => { setLang('so'); localStorage.setItem('kunjiraati_lang', 'so'); }}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black transition-all duration-300 flex items-center gap-1",
                lang === 'so' ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.6)] scale-105" : "text-white/40 hover:text-white/80"
              )}
            >
              {lang === 'so' && <div className="w-1 h-1 rounded-full bg-white animate-pulse" />}
              SO
            </button>
            <button 
              onClick={() => { setLang('en'); localStorage.setItem('kunjiraati_lang', 'en'); }}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black transition-all duration-300 flex items-center gap-1",
                lang === 'en' ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.6)] scale-105" : "text-white/40 hover:text-white/80"
              )}
            >
              {lang === 'en' && <div className="w-1 h-1 rounded-full bg-white animate-pulse" />}
              EN
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('home')}>
          <Logo className="w-8 h-8" customLogo={customLogo} />
          <h1 className="font-bold text-lg tracking-tight">KUNJIRAATI-AI</h1>
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2 glass rounded-lg">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Side Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl p-8 pt-24 flex flex-col gap-6"
          >
            <button onClick={() => navigate('home')} className="text-2xl font-semibold flex items-center gap-4"><Home /> {t.home}</button>
            <button onClick={() => navigate('features')} className="text-2xl font-semibold flex items-center gap-4"><Info /> {t.features}</button>
            <button onClick={() => navigate('history')} className="text-2xl font-semibold flex items-center gap-4"><HistoryIcon /> {t.history}</button>
            <button onClick={() => navigate('pro')} className="text-2xl font-semibold flex items-center gap-4 text-yellow-400"><Crown /> {t.pro}</button>
            <div className="mt-auto p-6 glass rounded-2xl">
              <p className="text-sm text-white/60 mb-2">Support & Activation</p>
              <p className="font-mono text-lg">619403795</p>
              <button onClick={openWhatsApp} className="mt-4 w-full py-3 bg-green-600 rounded-xl font-bold flex items-center justify-center gap-2">
                <MessageCircle size={20} /> WhatsApp Admin
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && <HomePage key="home" navigate={navigate} isPro={isPro} t={t} customLogo={customLogo} lang={lang} setLang={setLang} />}
          {currentPage === 'assistant' && <AssistantPage key="assistant" navigate={navigate} addToHistory={addToHistory} t={t} lang={lang} />}
          {currentPage === 'scanner' && <ScannerPage key="scanner" navigate={navigate} addToHistory={addToHistory} t={t} lang={lang} />}
          {currentPage === 'graph' && <GraphPage key="graph" navigate={navigate} addToHistory={addToHistory} t={t} />}
          {currentPage === 'history' && <HistoryPage key="history" history={history} setHistory={setHistory} navigate={navigate} t={t} />}
          {currentPage === 'calculator' && <CalculatorPage key="calculator" navigate={navigate} t={t} />}
          {currentPage === 'features' && <FeaturesPage key="features" navigate={navigate} t={t} lang={lang} />}
          {currentPage === 'pro' && <ProPage key="pro" isPro={isPro} setIsPro={setIsPro} t={t} handleLogoUpload={handleLogoUpload} customLogo={customLogo} />}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 z-50 glass h-16 flex items-center justify-around px-4 shadow-2xl">
        <IconButton icon={Home} label={t.home} onClick={() => navigate('home')} active={currentPage === 'home'} />
        <IconButton icon={MessageSquare} label={t.aiChat} onClick={() => navigate('assistant')} active={currentPage === 'assistant'} />
        <IconButton icon={Camera} label={t.scan} onClick={() => navigate('scanner')} active={currentPage === 'scanner'} />
        <IconButton icon={CalcIcon} label={t.calc} onClick={() => navigate('calculator')} active={currentPage === 'calculator'} />
        <IconButton icon={LineChart} label={t.graph} onClick={() => navigate('graph')} active={currentPage === 'graph'} />
      </nav>
    </div>
  );
}

// --- Page Components ---

function HomePage({ navigate, isPro, t, customLogo, lang, setLang }: { navigate: (p: Page) => void, isPro: boolean, t: any, customLogo: string | null, lang: Language, setLang: (l: Language) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* App Cover / Logo Section */}
      <div className="relative w-full h-48 rounded-3xl overflow-hidden glass glow-blue">
        <Logo className="w-full h-full object-cover opacity-80" customLogo={customLogo} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
          <h2 className="text-3xl font-bold tracking-tight">{t.solveMath}</h2>
          <p className="text-white/80 text-sm">{t.solveDesc}</p>
        </div>
      </div>

      {/* Modern Language Selection Section */}
      <div className="flex items-center justify-between glass p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
            <MessageSquare size={20} />
          </div>
          <span className="font-bold text-sm">Language / Luqadda</span>
        </div>
        <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => { setLang('so'); localStorage.setItem('kunjiraati_lang', 'so'); }}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
              lang === 'so' ? "bg-blue-600 text-white shadow-lg" : "text-white/40 hover:text-white/60"
            )}
          >
            Somali
          </button>
          <button 
            onClick={() => { setLang('en'); localStorage.setItem('kunjiraati_lang', 'en'); }}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
              lang === 'en' ? "bg-blue-600 text-white shadow-lg" : "text-white/40 hover:text-white/60"
            )}
          >
            English
          </button>
        </div>
      </div>

      {!isPro && (
        <GlassCard onClick={() => navigate('pro')} className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500 rounded-lg text-black">
                <Crown size={20} />
              </div>
              <div>
                <h3 className="font-bold">{t.proTitle}</h3>
                <p className="text-xs text-white/70">Unlock all AI features</p>
              </div>
            </div>
            <span className="text-xs font-bold bg-yellow-500 text-black px-2 py-1 rounded">{t.getPro}</span>
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-2 gap-4">
        <GlassCard onClick={() => navigate('assistant')} className="flex flex-col items-center gap-3 text-center py-8 hover:bg-blue-500/10 transition-colors">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <MessageSquare size={28} />
          </div>
          <span className="font-semibold">{t.solveButton}</span>
        </GlassCard>
        
        <GlassCard onClick={() => navigate('scanner')} className="flex flex-col items-center gap-3 text-center py-8 hover:bg-purple-500/10 transition-colors">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
            <Camera size={28} />
          </div>
          <span className="font-semibold">{t.scanButton}</span>
        </GlassCard>

        <GlassCard onClick={() => navigate('calculator')} className="flex flex-col items-center gap-3 text-center py-8 hover:bg-emerald-500/10 transition-colors">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CalcIcon size={28} />
          </div>
          <span className="font-semibold">{t.calcButton}</span>
        </GlassCard>

        <GlassCard onClick={() => navigate('graph')} className="flex flex-col items-center gap-3 text-center py-8 hover:bg-pink-500/10 transition-colors">
          <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
            <LineChart size={28} />
          </div>
          <span className="font-semibold">{t.graphButton}</span>
        </GlassCard>
      </div>

      <GlassCard onClick={() => navigate('history')} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HistoryIcon className="text-white/60" />
          <span className="font-medium">{t.recentHistory}</span>
        </div>
        <div className="text-white/40">{t.viewAll}</div>
      </GlassCard>
    </motion.div>
  );
}

function AssistantPage({ navigate, addToHistory, t, lang }: { navigate: (p: Page) => void, addToHistory: (i: any) => void, t: any, lang: Language }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string, image?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPendingImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !pendingImage) || loading) return;
    
    const userMsg = input;
    const currentImage = pendingImage;
    
    setInput('');
    setPendingImage(null);
    setMessages(prev => [...prev, { role: 'user', content: userMsg || (lang === 'so' ? "Sawirka xali" : "Solve this image"), image: currentImage || undefined }]);
    setLoading(true);

    try {
      const base64 = currentImage ? currentImage.split(',')[1] : undefined;
      const result = await solveMathProblem(userMsg || "Solve this math problem step-by-step.", base64);
      setMessages(prev => [...prev, { role: 'ai', content: result || '' }]);
      addToHistory({ type: 'chat', question: userMsg || "Image Problem", answer: result || '', image: currentImage || undefined });
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: t.errorInvalidCode || "Error occurred." }]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-[calc(100vh-180px)]"
    >
      {/* Chat AI Math Header */}
      <div className="flex items-center justify-between mb-6 glass p-4 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('home')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              CHAT AI MATH
            </h2>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Advanced Math Solver</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-white/60 uppercase">Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-hide">
        {messages.length === 0 && (
          <div className="text-center py-12 space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-2xl transform rotate-3">
                <MessageSquare size={40} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Welcome to Chat AI Math</h3>
              <p className="text-white/60 text-sm max-w-[250px] mx-auto">
                {lang === 'so' 
                  ? "Gali xisaab kasta ama soo geli sawir si aad u hesho xal talaabo-talaabo ah." 
                  : "Enter any math problem or upload a photo to get a step-by-step solution."}
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-2 max-w-[280px] mx-auto">
              {['Solve 3x + 5 = 20', 'Derivative of x² + 3x', 'Area of circle with r=5'].map((example) => (
                <button 
                  key={example}
                  onClick={() => setInput(example)}
                  className="text-xs glass p-3 rounded-xl hover:bg-white/5 transition-colors text-left border border-white/5"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
            <span className="text-[10px] font-bold text-white/30 uppercase mb-1 px-2">
              {msg.role === 'user' ? 'User' : 'AI Assistant'}
            </span>
            <div className={cn(
              "max-w-[90%] p-4 rounded-2xl shadow-xl relative group/msg",
              msg.role === 'user' ? "bg-blue-600 text-white rounded-tr-none" : "glass rounded-tl-none border border-white/10"
            )}>
              {msg.image && (
                <div className="mb-3 rounded-xl overflow-hidden border border-white/10 max-h-48">
                  <img src={msg.image} alt="Problem" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
              
              {msg.role === 'ai' && (
                <button 
                  onClick={() => copyToClipboard(msg.content, i)}
                  className="absolute top-2 right-2 p-1.5 glass rounded-lg opacity-0 group-hover/msg:opacity-100 transition-opacity"
                  title="Copy Solution"
                >
                  {copiedId === i ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold text-white/30 uppercase mb-1 px-2">AI Assistant</span>
            <div className="glass p-4 rounded-2xl rounded-tl-none border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {pendingImage && (
        <div className="mb-2 relative w-20 h-20 rounded-xl overflow-hidden border-2 border-blue-500 shadow-lg animate-in fade-in zoom-in duration-300">
          <img src={pendingImage} alt="Pending" className="w-full h-full object-cover" />
          <button 
            onClick={() => setPendingImage(null)}
            className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
        <div className="relative flex items-center gap-2 glass p-2 rounded-2xl border border-white/10">
          <label className="p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-white/60 hover:text-white">
            <ImageIcon size={20} />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.assistantPlaceholder}
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-white/30 px-2 py-3"
          />
          <button 
            onClick={handleSend}
            disabled={(!input.trim() && !pendingImage) || loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white p-3 rounded-xl transition-all shadow-lg active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ScannerPage({ navigate, addToHistory, t, lang }: { navigate: (p: Page) => void, addToHistory: (i: any) => void, t: any, lang: Language }) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSolve = async () => {
    if (!image || loading) return;
    setLoading(true);
    try {
      const base64 = image.split(',')[1];
      const solution = await solveMathProblem("Solve this math problem from the image step-by-step.", base64);
      setResult(solution || '');
      addToHistory({ type: 'scan', question: "Image Problem", answer: solution || '', image });
    } catch (err) {
      setResult(lang === 'so' ? "Waan ka xumahay, sawirka lama aqrin karo. Fadlan isku day sawir cad." : "Sorry, the image could not be read. Please try a clearer photo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('home')} className="p-2 glass rounded-lg"><ArrowLeft size={20} /></button>
        <h2 className="text-xl font-bold">{t.scannerTitle}</h2>
      </div>

      {!image ? (
        <div className="space-y-4">
          <label className="block">
            <div className="glass border-dashed border-2 border-white/20 h-64 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 transition-colors">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400">
                <Camera size={32} />
              </div>
              <div className="text-center">
                <p className="font-bold">{t.scannerDesc}</p>
                <p className="text-sm text-white/40">{t.scannerSub}</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </div>
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative rounded-2xl overflow-hidden glass aspect-video">
            <img src={image} alt="Target" className="w-full h-full object-contain" />
            <button 
              onClick={() => setImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white"
            >
              <Trash2 size={20} />
            </button>
          </div>

          {!result && (
            <button 
              onClick={handleSolve}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold shadow-lg glow-blue flex items-center justify-center gap-2"
            >
              {loading ? "Solving..." : t.solveNow}
              {!loading && <CheckCircle2 size={20} />}
            </button>
          )}

          {result && (
            <GlassCard className="space-y-4">
              <h3 className="font-bold text-lg border-b border-white/10 pb-2">Solution</h3>
              <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {result}
                </ReactMarkdown>
              </div>
              <button onClick={() => setImage(null)} className="w-full py-3 glass rounded-xl text-sm font-medium">{lang === 'so' ? "Scan Another" : "Scan Another"}</button>
            </GlassCard>
          )}
        </div>
      )}
    </motion.div>
  );
}

function GraphPage({ navigate, addToHistory, t }: { navigate: (p: Page) => void, addToHistory: (i: any) => void, t: any }) {
  const [equation, setEquation] = useState('x * x');
  const [data, setData] = useState<any[]>([]);

  const generateData = () => {
    const newData = [];
    try {
      // Simple evaluator for x^2 style equations
      const fn = equation.replace(/x\^2/g, 'x*x').replace(/\^/g, '**');
      for (let x = -10; x <= 10; x += 0.5) {
        // Safe eval-ish approach for plotting
        const y = eval(fn.replace(/x/g, `(${x})`));
        newData.push({ x, y });
      }
      setData(newData);
    } catch (e) {
      console.error("Invalid equation");
    }
  };

  useEffect(() => {
    generateData();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('home')} className="p-2 glass rounded-lg"><ArrowLeft size={20} /></button>
        <h2 className="text-xl font-bold">{t.graphTitle}</h2>
      </div>

      <GlassCard className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">{t.graphLabel}</label>
          <div className="flex gap-2">
            <div className="flex-1 glass px-4 py-3 rounded-xl flex items-center gap-2">
              <span className="text-blue-400 font-bold italic">y =</span>
              <input 
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
                className="bg-transparent flex-1 focus:outline-none font-mono"
              />
            </div>
            <button onClick={generateData} className="p-3 bg-blue-600 rounded-xl"><CheckCircle2 size={24} /></button>
          </div>
        </div>

        <div className="h-64 w-full bg-black/20 rounded-2xl p-4">
          <ResponsiveContainer width="100%" height="100%">
            <ReLineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="x" stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <Tooltip 
                contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: '#60a5fa' }}
              />
              <Line type="monotone" dataKey="y" stroke="#60a5fa" strokeWidth={3} dot={false} animationDuration={1000} />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setEquation('x * x')} className="glass py-3 rounded-xl text-sm">y = x²</button>
        <button onClick={() => setEquation('Math.sin(x)')} className="glass py-3 rounded-xl text-sm">y = sin(x)</button>
        <button onClick={() => setEquation('x * x * x')} className="glass py-3 rounded-xl text-sm">y = x³</button>
        <button onClick={() => setEquation('Math.abs(x)')} className="glass py-3 rounded-xl text-sm">y = |x|</button>
      </div>
    </motion.div>
  );
}

function HistoryPage({ history, setHistory, navigate, t }: { history: HistoryItem[], setHistory: any, navigate: (p: Page) => void, t: any }) {
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('kunjiraati_history');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('home')} className="p-2 glass rounded-lg"><ArrowLeft size={20} /></button>
          <h2 className="text-xl font-bold">{t.historyTitle}</h2>
        </div>
        <button onClick={clearHistory} className="text-red-400 text-sm font-medium">{t.clearAll}</button>
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            <HistoryIcon size={48} className="mx-auto mb-4 opacity-20" />
            <p>{t.emptyHistory}</p>
          </div>
        ) : (
          history.map((item) => (
            <GlassCard key={item.id} className="space-y-2">
              <div className="flex items-center justify-between text-xs text-white/40">
                <span className="uppercase tracking-widest font-bold">{item.type}</span>
                <span>{new Date(item.timestamp).toLocaleDateString()}</span>
              </div>
              <p className="font-bold line-clamp-1">{item.question}</p>
              <p className="text-sm text-white/60 line-clamp-2">{item.answer}</p>
            </GlassCard>
          ))
        )}
      </div>
    </motion.div>
  );
}

function CalculatorPage({ navigate, t }: { navigate: (p: Page) => void, t: any }) {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleDigit = (digit: string) => {
    if (display === '0') setDisplay(digit);
    else setDisplay(display + digit);
  };

  const handleOp = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      const result = eval(equation + display);
      setDisplay(result.toString());
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  const CalcButton = ({ children, onClick, className, variant = 'default' }: { children: React.ReactNode, onClick: () => void, className?: string, variant?: 'default' | 'op' | 'action' }) => (
    <button 
      onClick={onClick}
      className={cn(
        "h-16 rounded-2xl text-xl font-bold transition-all active:scale-90",
        variant === 'default' && "glass text-white",
        variant === 'op' && "bg-blue-600 text-white shadow-lg glow-blue",
        variant === 'action' && "bg-white/10 text-white/60",
        className
      )}
    >
      {children}
    </button>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('home')} className="p-2 glass rounded-lg"><ArrowLeft size={20} /></button>
        <h2 className="text-xl font-bold">{t.calcTitle}</h2>
      </div>

      <div className="glass p-6 rounded-3xl space-y-2 text-right">
        <div className="text-sm text-white/40 h-6 font-mono">{equation}</div>
        <div className="text-4xl font-bold overflow-hidden font-mono">{display}</div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <CalcButton onClick={clear} variant="action">AC</CalcButton>
        <CalcButton onClick={() => setDisplay((parseFloat(display) * -1).toString())} variant="action">+/-</CalcButton>
        <CalcButton onClick={() => setDisplay((parseFloat(display) / 100).toString())} variant="action">%</CalcButton>
        <CalcButton onClick={() => handleOp('/')} variant="op">÷</CalcButton>

        <CalcButton onClick={() => handleDigit('7')}>7</CalcButton>
        <CalcButton onClick={() => handleDigit('8')}>8</CalcButton>
        <CalcButton onClick={() => handleDigit('9')}>9</CalcButton>
        <CalcButton onClick={() => handleOp('*')} variant="op">×</CalcButton>

        <CalcButton onClick={() => handleDigit('4')}>4</CalcButton>
        <CalcButton onClick={() => handleDigit('5')}>5</CalcButton>
        <CalcButton onClick={() => handleDigit('6')}>6</CalcButton>
        <CalcButton onClick={() => handleOp('-')} variant="op">−</CalcButton>

        <CalcButton onClick={() => handleDigit('1')}>1</CalcButton>
        <CalcButton onClick={() => handleDigit('2')}>2</CalcButton>
        <CalcButton onClick={() => handleDigit('3')}>3</CalcButton>
        <CalcButton onClick={() => handleOp('+')} variant="op">+</CalcButton>

        <CalcButton onClick={() => handleDigit('0')} className="col-span-2">0</CalcButton>
        <CalcButton onClick={() => handleDigit('.')}>.</CalcButton>
        <CalcButton onClick={calculate} variant="op">=</CalcButton>
      </div>
    </motion.div>
  );
}

function FeaturesPage({ navigate, t, lang }: { navigate: (p: Page) => void, t: any, lang: Language }) {
  const features = [
    { icon: MessageSquare, title: t.aiChat, desc: lang === 'so' ? "Weydii xisaab kasta, hel jawaab step-by-step ah." : "Ask any math question, get step-by-step answers." },
    { icon: Camera, title: t.scan, desc: lang === 'so' ? "Sawir ka qaad xisaabta, AI ayaana kuu xalinaya." : "Take a photo of math, AI will solve it for you." },
    { icon: LineChart, title: t.graph, desc: lang === 'so' ? "Gali equation, arag graph-ka iyo coordinates-ka." : "Enter an equation, see the graph and coordinates." },
    { icon: CalcIcon, title: t.calcButton, desc: lang === 'so' ? "Qalab xisaabeed dhameystiran oo scientific ah." : "Complete scientific math tool." },
    { icon: HistoryIcon, title: t.history, desc: lang === 'so' ? "Dhammaan xisaabaadkaagii hore hal meel ku kaydi." : "Save all your previous math in one place." },
    { icon: Crown, title: "Pro System", desc: lang === 'so' ? "Hel features dheeraad ah iyo xawaare sare." : "Get extra features and high speed." },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('home')} className="p-2 glass rounded-lg"><ArrowLeft size={20} /></button>
        <h2 className="text-xl font-bold">{t.featuresTitle}</h2>
      </div>

      <div className="space-y-4">
        {features.map((f, i) => (
          <GlassCard key={i} className="flex gap-4 items-start">
            <div className="p-3 bg-white/10 rounded-xl text-blue-400">
              <f.icon size={24} />
            </div>
            <div>
              <h3 className="font-bold">{f.title}</h3>
              <p className="text-sm text-white/60">{f.desc}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <button 
        onClick={() => navigate('pro')}
        className="w-full py-4 bg-yellow-500 text-black font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2"
      >
        <Crown size={20} /> {t.upgradePro}
      </button>
    </motion.div>
  );
}

function ProPage({ isPro, setIsPro, t, handleLogoUpload, customLogo }: { isPro: boolean, setIsPro: any, t: any, handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void, customLogo: string | null }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleActivate = () => {
    // Simple mock activation for demo - in real app would check Firebase
    if (code === 'KUNJIRAATI2026') {
      setIsPro(true);
      setSuccess(true);
      setError('');
      localStorage.setItem('kunjiraati_pro', 'true');
    } else {
      setError(t.errorInvalidCode);
    }
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/252619403795?text=Fadlan%20la%20xirir%20Admin-ka%20KUNJIRAATI-AI', '_blank');
  };

  if (isPro) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="relative mx-auto w-24 h-24">
          <Logo className="w-full h-full glow-purple animate-pulse" customLogo={customLogo} />
          <div className="absolute -top-2 -right-2 bg-yellow-500 text-black p-1.5 rounded-full shadow-lg">
            <Crown size={16} />
          </div>
        </div>
        <h2 className="text-3xl font-bold">{t.successPro}</h2>
        <p className="text-white/60">{t.successDesc}</p>
        
        <div className="space-y-4">
          <GlassCard className="bg-green-500/10 border-green-500/30">
            <p className="text-green-400 font-medium">{t.activeLifetime}</p>
          </GlassCard>

          <div className="pt-8 border-t border-white/10">
            <h3 className="text-lg font-bold mb-4">App Customization</h3>
            <label className="flex flex-col items-center gap-3 p-6 glass rounded-2xl cursor-pointer hover:bg-white/5 transition-colors border-dashed border-2 border-white/10">
              <Upload className="text-blue-400" size={32} />
              <span className="font-semibold">Upload Your Logo</span>
              <span className="text-xs text-white/40">PNG, JPG or SVG</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <Logo className="w-24 h-24 mx-auto glow-blue mb-2" customLogo={customLogo} />
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">{t.proTitle}</h2>
          <p className="text-white/60">{t.proDesc}</p>
        </div>
      </div>

      <GlassCard className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-400" size={20} />
            <span>Unlimited AI Solving</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-400" size={20} />
            <span>Advanced Graphing</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-400" size={20} />
            <span>Image Problem Solving</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-400" size={20} />
            <span>Faster AI Responses</span>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10">
          <p className="text-sm text-white/40 mb-4">{t.howToActivate}</p>
          <div className="bg-white/5 p-4 rounded-xl space-y-2">
            <p className="text-sm">{t.step1}</p>
            <p className="text-sm">{t.step2}</p>
            <p className="text-sm">{t.step3}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold text-white/40">{t.activationCode}</label>
            <input 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t.codePlaceholder}
              className="w-full glass px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button 
            onClick={handleActivate}
            className="w-full py-4 bg-yellow-500 text-black font-bold rounded-xl shadow-lg hover:bg-yellow-400 transition-colors"
          >
            {t.activatePro}
          </button>

          <button 
            onClick={openWhatsApp}
            className="w-full py-4 glass text-green-400 font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} /> {t.contactAdmin}
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
