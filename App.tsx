import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { ViewState, Profile, Connection, Wish } from './types';
import { Input } from './components/Input';
import { Button } from './components/Button';
import * as api from './services/api';
import { Check, LogOut, Loader2, Sparkles, Link as LinkIcon, Lock, Activity, Shield, ArrowRight, Trash2, HeartCrack, BarChart3, MoreVertical, X, Edit2, Zap, Moon, Send, Globe, Heart, Users, UserPlus, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TRANSLATIONS ---

const translations = {
  en: {
    admin: "Admin",
    signIn: "Sign In",
    getStarted: "Get Started",
    tagline: "The Health Connection",
    heroTitle: "Care for your",
    heroTitleHighlight: "favorite person.",
    heroDesc: "A minimalist sanctuary for friends, family, and partners. No feed, no likes, no noise. Just daily health wishes and habits to build a healthier life together.",
    createAccount: "Create Free Account",
    private: "Private & Encrypted",
    realtime: "Real-time Sync",
    partnerCard: "My Person",
    online: "Online",
    exampleWish1: "Don't forget to take your meds!",
    exampleWish2: "Go for a walk outside.",
    completed: "Completed",
    featuresTitle: "Less Noise. More Care.",
    featuresDesc: "Social media isolates us. Carelink brings you closer to the people who matter most with intentional limits.",
    dailyReset: "Daily Reset",
    dailyResetDesc: "Wishes disappear at midnight. No hoarding history, just being present today.",
    finiteLimits: "Finite Limits",
    finiteLimitsDesc: "Max 10 wishes a day. Scarcity creates value. Make every wish count.",
    privacy: "Radical Privacy",
    privacyDesc: "Only two people exist in this universe: You and your loved one.",
    step1: "Sign Up",
    step1Desc: "Create a private profile. No phone number required, just email.",
    step2: "Connect",
    step2Desc: "Share your username with a parent, child, or friend to link accounts.",
    step3: "Care",
    step3Desc: "Send daily wishes, track habits, and watch your shared health journey grow.",
    footer: "Built for better connections.",
    
    // Auth
    welcomeBack: "Welcome Back",
    createAccTitle: "Create Account",
    beginJourney: "Begin your journey of shared care.",
    emailLabel: "Email",
    passLabel: "Password",
    haveAcc: "Already have an account?",
    noAcc: "Don't have an account?",
    backHome: "Back to Home",
    authError: "Authentication Error",
    loginError: "Invalid login credentials",
    
    // Onboarding
    setUsername: "Set your Username",
    setUsernameDesc: "This is how your family or friend will find you.",
    continue: "Continue",
    
    // Connect
    connectTitle: "Connect with Someone",
    connectDesc: "Enter their username to start sharing wishes.",
    partnerUsername: "Their username",
    connectError: "Connection failed",
    
    // Dashboard
    yourProfile: "Your Profile",
    connectedTo: "Connected to",
    notConnected: "Not connected",
    connectNow: "Connect Now",
    connectPromptTitle: "Welcome to Carelink!",
    connectPromptDesc: "To start sharing wishes and tracking habits, connect with a partner, family member, or friend.",
    connectButton: "Find Connection",
    editProfile: "Edit Username",
    totalWishes: "Total Wishes",
    completionRate: "Completion Rate",
    quote: "Small acts, when multiplied by millions of people, can transform the world.",
    sendWishTitle: "Send a Wish",
    sendWishDesc: "Send a healthy thought to",
    placeholder: "Eat some fruit, do 10 minutes exercise...",
    dailyLimit: "daily",
    send: "Send",
    forYou: "For You",
    noWishesReceived: "No wishes received today yet.",
    sentByYou: "Sent by You",
    sent: "sent",
    noWishesSent: "You haven't sent any wishes today.",
    activity: "Activity (7 Days)",
    streak: "Keep the streak alive!",
    logout: "Logout",
    unlink: "Unlink Account",
    unlinkConfirm: "Are you sure you want to disconnect? This cannot be undone.",
    unlinkError: "Failed to disconnect",
    deleteError: "Failed to delete wish",
    updateUserTitle: "Update Username",
    updateUserDesc: "Change your public username. Your connection will see this update immediately.",
    saveChanges: "Save Changes"
  },
  zh: {
    admin: "管理员",
    signIn: "登录",
    getStarted: "开始使用",
    tagline: "健康连接",
    heroTitle: "关爱你最",
    heroTitleHighlight: "在乎的人。",
    heroDesc: "为家人、朋友和伴侣打造的极简港湾。没有动态流，没有点赞，没有噪音。只有日常的健康愿望和习惯，共同建立更健康的生活。",
    createAccount: "创建免费账户",
    private: "私密且加密",
    realtime: "实时同步",
    partnerCard: "关心的人",
    online: "在线",
    exampleWish1: "记得按时吃药哦！",
    exampleWish2: "出去散散步吧。",
    completed: "已完成",
    featuresTitle: "少一点噪音，多一点关心。",
    featuresDesc: "社交媒体让我们疏远。Carelink 用有意的限制让你与重要的人更亲近。",
    dailyReset: "每日重置",
    dailyResetDesc: "愿望在午夜消失。不堆积历史，只专注于当下。",
    finiteLimits: "有限额度",
    finiteLimitsDesc: "每天最多10个愿望。稀缺创造价值。让每一个愿望都有意义。",
    privacy: "极致隐私",
    privacyDesc: "在这个宇宙中只有两个人：你和你关心的人。",
    step1: "注册",
    step1Desc: "创建一个私密档案。不需要手机号，只需邮箱。",
    step2: "连接",
    step2Desc: "与父母、孩子或朋友分享你的用户名以连接账户。",
    step3: "关怀",
    step3Desc: "发送日常愿望，追踪习惯，见证你们共同的健康成长。",
    footer: "为更好的连接而构建。",
    
    // Auth
    welcomeBack: "欢迎回来",
    createAccTitle: "创建账户",
    beginJourney: "开启你们的共同关怀之旅。",
    emailLabel: "邮箱",
    passLabel: "密码",
    haveAcc: "已有账户？",
    noAcc: "还没有账户？",
    backHome: "返回首页",
    authError: "认证错误",
    loginError: "登录凭证无效",
    
    // Onboarding
    setUsername: "设置用户名",
    setUsernameDesc: "你的亲友将通过此名称找到你。",
    continue: "继续",
    
    // Connect
    connectTitle: "建立连接",
    connectDesc: "输入对方的用户名开始分享愿望。",
    partnerUsername: "对方的用户名",
    connectError: "连接失败",
    
    // Dashboard
    yourProfile: "你的资料",
    connectedTo: "已连接到",
    notConnected: "未连接",
    connectNow: "立即连接",
    connectPromptTitle: "欢迎来到 Carelink！",
    connectPromptDesc: "要开始分享愿望和追踪习惯，请连接一位伴侣、家人或朋友。",
    connectButton: "寻找连接",
    editProfile: "修改用户名",
    totalWishes: "愿望总数",
    completionRate: "完成率",
    quote: "微小的行动，乘以数百万人，可以改变世界。",
    sendWishTitle: "发送愿望",
    sendWishDesc: "发送一个健康的提醒给",
    placeholder: "吃点水果，做10分钟运动...",
    dailyLimit: "每日",
    send: "发送",
    forYou: "收到的",
    noWishesReceived: "今天还没有收到愿望。",
    sentByYou: "发出的",
    sent: "条",
    noWishesSent: "你今天还没有发送愿望。",
    activity: "活跃度 (7天)",
    streak: "保持连续记录！",
    logout: "退出登录",
    unlink: "断开连接",
    unlinkConfirm: "你确定要断开连接吗？此操作无法撤销。",
    unlinkError: "断开连接失败",
    deleteError: "删除愿望失败",
    updateUserTitle: "更新用户名",
    updateUserDesc: "更改你的公开用户名。对方将立即看到此更新。",
    saveChanges: "保存更改"
  },
  tw: {
    admin: "管理員",
    signIn: "登入",
    getStarted: "開始使用",
    tagline: "健康連結",
    heroTitle: "關愛你最",
    heroTitleHighlight: "在乎的人。",
    heroDesc: "為家人、朋友和伴侶打造的極簡港灣。沒有動態牆，沒有點讚，沒有噪音。只有日常的健康願望和習慣，共同建立更健康的生活。",
    createAccount: "創建免費賬戶",
    private: "私密且加密",
    realtime: "即時同步",
    partnerCard: "關心的人",
    online: "在線",
    exampleWish1: "記得按時吃藥哦！",
    exampleWish2: "出去散散步吧。",
    completed: "已完成",
    featuresTitle: "少一點噪音，多一點關心。",
    featuresDesc: "社交媒體讓我們疏遠。Carelink 用有意的限制讓你與重要的人更親近。",
    dailyReset: "每日重置",
    dailyResetDesc: "願望在午夜消失。不堆積歷史，只專注於當下。",
    finiteLimits: "有限額度",
    finiteLimitsDesc: "每天最多10個願望。稀缺創造價值。讓每一個願望都有意義。",
    privacy: "極致隱私",
    privacyDesc: "在這個宇宙中只有兩個人：你和你關心的人。",
    step1: "註冊",
    step1Desc: "創建一個私密檔案。不需要手機號，只需信箱。",
    step2: "連接",
    step2Desc: "與父母、孩子或朋友分享你的用戶名以連接賬戶。",
    step3: "關懷",
    step3Desc: "發送日常願望，追蹤習慣，見證你們共同的健康成長。",
    footer: "為更好的連結而構建。",
    
    // Auth
    welcomeBack: "歡迎回來",
    createAccTitle: "創建賬戶",
    beginJourney: "開啟你們的共同關懷之旅。",
    emailLabel: "信箱",
    passLabel: "密碼",
    haveAcc: "已有賬戶？",
    noAcc: "還沒有賬戶？",
    backHome: "返回首頁",
    authError: "認證錯誤",
    loginError: "登入憑證無效",
    
    // Onboarding
    setUsername: "設置用戶名",
    setUsernameDesc: "你的親友將通過此名稱找到你。",
    continue: "繼續",
    
    // Connect
    connectTitle: "建立連結",
    connectDesc: "輸入對方的用戶名開始分享願望。",
    partnerUsername: "對方的用戶名",
    connectError: "連接失敗",
    
    // Dashboard
    yourProfile: "你的資料",
    connectedTo: "已連接到",
    notConnected: "未連接",
    connectNow: "立即連接",
    connectPromptTitle: "歡迎來到 Carelink！",
    connectPromptDesc: "要開始分享願望和追蹤習慣，請連接一位伴侶、家人或朋友。",
    connectButton: "尋找連接",
    editProfile: "修改用戶名",
    totalWishes: "願望總數",
    completionRate: "完成率",
    quote: "微小的行動，乘以數百萬人，可以改變世界。",
    sendWishTitle: "發送願望",
    sendWishDesc: "發送一個健康的提醒給",
    placeholder: "吃點水果，做10分鐘運動...",
    dailyLimit: "每日",
    send: "發送",
    forYou: "收到的",
    noWishesReceived: "今天還沒有收到願望。",
    sentByYou: "發出的",
    sent: "條",
    noWishesSent: "你今天還沒有發送願望。",
    activity: "活躍度 (7天)",
    streak: "保持連續記錄！",
    logout: "登出",
    unlink: "斷開連接",
    unlinkConfirm: "你確定要斷開連接嗎？此操作無法撤銷。",
    unlinkError: "斷開連接失敗",
    deleteError: "刪除願望失敗",
    updateUserTitle: "更新用戶名",
    updateUserDesc: "更改你的公開用戶名。對方將立即看到此更新。",
    saveChanges: "保存更改"
  },
  no: {
    admin: "Admin",
    signIn: "Logg inn",
    getStarted: "Kom i gang",
    tagline: "Helseforbindelsen",
    heroTitle: "Ta vare på",
    heroTitleHighlight: "din kjære.",
    heroDesc: "Et minimalistisk fristed for venner, familie og partnere. Ingen feed, ingen likes, ingen støy. Bare daglige helseønsker og vaner for å bygge et sunnere liv sammen.",
    createAccount: "Lag gratis konto",
    private: "Privat og kryptert",
    realtime: "Sanntidssynkronisering",
    partnerCard: "Min person",
    online: "Pålogget",
    exampleWish1: "Ikke glem å ta medisinen din!",
    exampleWish2: "Gå en tur ut.",
    completed: "Fullført",
    featuresTitle: "Mindre støy. Mer omsorg.",
    featuresDesc: "Sosiale medier isolerer oss. Carelink bringer deg nærmere de som betyr mest med bevisste grenser.",
    dailyReset: "Daglig nullstilling",
    dailyResetDesc: "Ønsker forsvinner ved midnatt. Ingen historikk, bare vær til stede i dag.",
    finiteLimits: "Begrensede antall",
    finiteLimitsDesc: "Maks 10 ønsker per dag. Knapphet skaper verdi. Gjør hvert ønske tellende.",
    privacy: "Radikal personvern",
    privacyDesc: "Bare to personer eksisterer i dette universet: Du og din kjære.",
    step1: "Registrer deg",
    step1Desc: "Lag en privat profil. Ingen telefonnummer nødvendig, bare e-post.",
    step2: "Koble til",
    step2Desc: "Del brukernavnet ditt med en forelder, et barn eller en venn for å koble sammen kontoer.",
    step3: "Bry deg",
    step3Desc: "Send daglige ønsker, spor vaner og se deres felles helsereise vokse.",
    footer: "Bygget for bedre forbindelser.",
    
    // Auth
    welcomeBack: "Velkommen tilbake",
    createAccTitle: "Opprett konto",
    beginJourney: "Start reisen med delt omsorg.",
    emailLabel: "E-post",
    passLabel: "Passord",
    haveAcc: "Har du allerede en konto?",
    noAcc: "Har du ikke en konto?",
    backHome: "Tilbake til hjem",
    authError: "Autentiseringsfeil",
    loginError: "Ugyldig brukernavn eller passord",
    
    // Onboarding
    setUsername: "Velg brukernavn",
    setUsernameDesc: "Slik vil familien eller vennen din finne deg.",
    continue: "Fortsett",
    
    // Connect
    connectTitle: "Koble til noen",
    connectDesc: "Skriv inn brukernavnet deres for å dele ønsker.",
    partnerUsername: "Deres brukernavn",
    connectError: "Tilkobling mislyktes",
    
    // Dashboard
    yourProfile: "Din profil",
    connectedTo: "Koblet til",
    notConnected: "Ikke tilkoblet",
    connectNow: "Koble til nå",
    connectPromptTitle: "Velkommen til Carelink!",
    connectPromptDesc: "Koble deg til en partner, et familiemedlem eller en venn for å dele ønsker.",
    connectButton: "Finn tilkobling",
    editProfile: "Endre brukernavn",
    totalWishes: "Totale ønsker",
    completionRate: "Fullføringsgrad",
    quote: "Små handlinger, multiplisert med millioner av mennesker, kan forandre verden.",
    sendWishTitle: "Send et ønske",
    sendWishDesc: "Send en sunn tanke til",
    placeholder: "Spis litt frukt, gjør 10 minutter trening...",
    dailyLimit: "daglig",
    send: "Send",
    forYou: "Til deg",
    noWishesReceived: "Ingen ønsker mottatt i dag ennå.",
    sentByYou: "Sendt av deg",
    sent: "sendt",
    noWishesSent: "Du har ikke sendt noen ønsker i dag.",
    activity: "Aktivitet (7 dager)",
    streak: "Hold rekken i live!",
    logout: "Logg ut",
    unlink: "Koble fra konto",
    unlinkConfirm: "Er du sikker på at du vil koble fra? Dette kan ikke angres.",
    unlinkError: "Kunne ikke koble fra",
    deleteError: "Kunne ikke slette ønske",
    updateUserTitle: "Oppdater brukernavn",
    updateUserDesc: "Endre ditt offentlige brukernavn. Forbindelsen din vil se dette umiddelbart.",
    saveChanges: "Lagre endringer"
  }
};

type Language = 'en' | 'zh' | 'tw' | 'no';

// --- SHARED UI COMPONENTS ---

const CustomLogo = ({ className = "h-8 w-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 88.9L46.4 85.3C33.6 72.5 25.1 64 25.1 53.5C25.1 44.9 31.6 38.4 40.2 38.4C44.9 38.4 49.4 40.6 52.3 44.1L50 46.8L47.7 44.1C50.6 40.6 55.1 38.4 59.8 38.4C68.4 38.4 74.9 44.9 74.9 53.5C74.9 64 66.4 72.5 53.6 85.3L50 88.9Z" 
      fill="#FF6B9D" stroke="none" transform="scale(1.2) translate(-8, -10)" />
    <path d="M50 88.9L46.4 85.3C33.6 72.5 25.1 64 25.1 53.5C25.1 44.9 31.6 38.4 40.2 38.4C44.9 38.4 49.4 40.6 52.3 44.1L50 46.8L47.7 44.1C50.6 40.6 55.1 38.4 59.8 38.4C68.4 38.4 74.9 44.9 74.9 53.5C74.9 64 66.4 72.5 53.6 85.3L50 88.9Z" 
      fill="rgba(255, 182, 193, 0.7)" stroke="none" transform="scale(0.8) translate(30, 15)" />
  </svg>
);

const ModernBackground = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-slate-50">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-200/40 blur-[120px] animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-200/40 blur-[120px] animate-pulse delay-1000" />
    <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-emerald-200/30 blur-[100px] animate-pulse delay-700" />
  </div>
);

const GlassCard = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50 rounded-2xl ${className}`}>
    {children}
  </div>
);

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children?: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
           <h3 className="font-bold text-slate-800">{title}</h3>
           <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X className="h-4 w-4 text-slate-500"/></button>
        </div>
        <div className="p-6">
           {children}
        </div>
      </motion.div>
    </div>
  );
};

const LanguageSwitcher = ({ current, setLang }: { current: Language, setLang: (l: Language) => void }) => (
  <div className="flex items-center gap-1 bg-white/50 border border-white rounded-full p-1 shadow-sm">
    {(['en', 'zh', 'tw', 'no'] as Language[]).map((lang) => (
      <button
        key={lang}
        onClick={() => setLang(lang)}
        className={`px-2 py-1 text-xs font-bold rounded-full transition-all ${
          current === lang 
          ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-md' 
          : 'text-slate-500 hover:text-sky-600 hover:bg-sky-50'
        }`}
      >
        {lang.toUpperCase()}
      </button>
    ))}
  </div>
);

// --- VIEW COMPONENTS ---

const LandingView = ({ setView, lang, setLang }: { setView: (v: ViewState) => void, lang: Language, setLang: (l: Language) => void }) => {
  const txt = translations[lang];

  return (
    <div className="min-h-screen text-slate-800 relative overflow-x-hidden font-sans">
      <ModernBackground />
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-white/60 border-b border-white/40 supports-[backdrop-filter]:bg-white/40">
        <div className="flex items-center gap-2 text-rose-500 font-bold text-xl tracking-tight cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
          <CustomLogo className="h-8 w-8" />
          Carelink
        </div>
        <div className="flex items-center gap-3">
           <LanguageSwitcher current={lang} setLang={setLang} />
           <button 
              onClick={() => setView('ADMIN_LOGIN')} 
              className="hidden sm:block text-sm font-medium text-slate-500 hover:text-sky-600 transition-colors px-3 py-2"
            >
              {txt.admin}
           </button>
           <Button variant="outline" className="border-sky-200 text-sky-600 hover:bg-sky-50 hover:border-sky-300 rounded-full" onClick={() => setView('AUTH')}>
             {txt.signIn}
           </Button>
           <Button className="shadow-lg shadow-sky-500/20 bg-gradient-to-r from-sky-500 to-emerald-500 border-none hover:scale-105 transition-transform rounded-full" onClick={() => setView('AUTH')}>
             {txt.getStarted}
           </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-bold tracking-wide uppercase shadow-sm">
              <Sparkles className="h-3 w-3" /> {txt.tagline}
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              {txt.heroTitle} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-sky-500 to-emerald-500 animate-pulse">{txt.heroTitleHighlight}</span>
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {txt.heroDesc}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button 
                onClick={() => setView('AUTH')} 
                className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 shadow-xl shadow-sky-500/30 hover:-translate-y-1 transition-transform"
              >
                {txt.createAccount}
              </Button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 text-slate-400 text-sm font-medium">
               <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-sky-400"/> {txt.private}</div>
               <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-emerald-400"/> {txt.realtime}</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
             <div className="absolute inset-0 bg-gradient-to-tr from-sky-200/50 via-rose-200/50 to-emerald-200/50 rounded-full blur-3xl animate-pulse" />
             <GlassCard className="relative p-6 max-w-sm mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-500 border-white/60">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-100 to-emerald-100 flex items-center justify-center text-sky-600 font-bold border border-white">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                         <p className="font-bold text-slate-800">{txt.partnerCard}</p>
                         <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                           <span className="block h-2 w-2 rounded-full bg-emerald-500"></span> {txt.online}
                         </p>
                      </div>
                   </div>
                   <CustomLogo className="h-6 w-6 animate-bounce" />
                </div>
                <div className="space-y-3">
                   <div className="bg-gradient-to-r from-rose-50 to-white p-4 rounded-2xl border border-rose-100 shadow-sm">
                      <p className="text-rose-900 font-medium text-sm">"{txt.exampleWish1}"</p>
                      <div className="mt-2 flex justify-end">
                         <span className="text-[10px] bg-white px-2 py-1 rounded-full text-rose-600 font-bold shadow-sm border border-rose-100 flex items-center gap-1">
                           <Check className="h-3 w-3" /> {txt.completed}
                         </span>
                      </div>
                   </div>
                   <div className="bg-white/50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-slate-600 font-medium text-sm">"{txt.exampleWish2}"</p>
                   </div>
                </div>
             </GlassCard>
          </motion.div>
        </div>
      </header>

      {/* Philosophy Section */}
      <section className="py-24 bg-white/50 relative overflow-hidden">
         <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-16">
            <div className="space-y-4">
               <h2 className="text-3xl md:text-5xl font-bold text-slate-900">{txt.featuresTitle}</h2>
               <p className="text-slate-500 text-lg max-w-2xl mx-auto">{txt.featuresDesc}</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               <div className="p-8 rounded-3xl bg-white border border-rose-100 shadow-xl shadow-rose-100/20 hover:-translate-y-2 transition-transform">
                  <div className="bg-rose-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500">
                     <Moon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">{txt.dailyReset}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{txt.dailyResetDesc}</p>
               </div>
               <div className="p-8 rounded-3xl bg-white border border-sky-100 shadow-xl shadow-sky-100/20 hover:-translate-y-2 transition-transform">
                  <div className="bg-sky-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 text-sky-500">
                     <Activity className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">{txt.finiteLimits}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{txt.finiteLimitsDesc}</p>
               </div>
               <div className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-xl shadow-emerald-100/20 hover:-translate-y-2 transition-transform">
                  <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500">
                     <Lock className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">{txt.privacy}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{txt.privacyDesc}</p>
               </div>
            </div>
         </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6">
         <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 relative">
               <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-sky-200 via-emerald-200 to-rose-200"></div>
               
               {[
                  { step: "01", title: txt.step1, desc: txt.step1Desc, color: "text-sky-500", border: "border-sky-50" },
                  { step: "02", title: txt.step2, desc: txt.step2Desc, color: "text-emerald-500", border: "border-emerald-50" },
                  { step: "03", title: txt.step3, desc: txt.step3Desc, color: "text-rose-500", border: "border-rose-50" }
               ].map((item, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.2 }}
                     className="relative text-center space-y-4"
                  >
                     <div className={`h-20 w-20 mx-auto bg-white border-4 ${item.border} rounded-full flex items-center justify-center text-2xl font-bold ${item.color} shadow-lg relative z-10`}>
                        {item.step}
                     </div>
                     <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
                     <p className="text-slate-500">{item.desc}</p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      <footer className="py-12 text-center text-slate-400 text-sm bg-white border-t border-slate-100">
        <div className="flex items-center justify-center gap-2 mb-4">
           <CustomLogo className="h-5 w-5" />
           <span className="font-medium text-slate-600">Carelink</span>
        </div>
        <p>&copy; {new Date().getFullYear()} Carelink Inc. {txt.footer}</p>
      </footer>
    </div>
  );
};

const AuthView = ({ 
  isSignUp, 
  setIsSignUp, 
  email, 
  setEmail, 
  password, 
  setPassword, 
  onSubmit, 
  loading, 
  error, 
  onBack,
  lang 
}: any) => {
  const txt = translations[lang];
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <ModernBackground />
      <GlassCard className="p-8 w-full max-w-md mx-auto space-y-6">
        <div className="text-center">
          <div className="bg-sky-50 h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-sky-50/50">
            <CustomLogo className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">{isSignUp ? txt.createAccTitle : txt.welcomeBack}</h2>
          <p className="text-slate-500 text-sm mt-2">{txt.beginJourney}</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input 
            type="email" 
            label={txt.emailLabel}
            placeholder="you@example.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            autoFocus
          />
          <Input 
            type="password" 
            label={txt.passLabel}
            placeholder="••••••••" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          {error && (
             <motion.div 
               initial={{ opacity: 0, y: -10 }} 
               animate={{ opacity: 1, y: 0 }} 
               className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-2"
             >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                   <span className="font-bold block">{txt.authError}</span>
                   {error === "Invalid login credentials" ? txt.loginError : error}
                </div>
             </motion.div>
          )}
          <Button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:shadow-lg hover:shadow-sky-500/30 transition-all rounded-xl" isLoading={loading}>
            {isSignUp ? txt.step1 : txt.signIn}
          </Button>
        </form>
        <div className="text-center text-sm text-slate-600">
          {isSignUp ? txt.haveAcc : txt.noAcc}{' '}
          <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-sky-600 font-bold hover:underline">
            {isSignUp ? txt.signIn : txt.step1}
          </button>
        </div>
        <div className="text-center mt-4">
           <button type="button" onClick={onBack} className="text-slate-400 text-sm hover:text-slate-600 flex items-center justify-center gap-1 mx-auto">
             <ArrowRight className="h-3 w-3 rotate-180" /> {txt.backHome}
           </button>
        </div>
      </GlassCard>
    </div>
  );
};

const OnboardingView = ({ username, setUsername, onSubmit, loading, error, onLogout, lang }: any) => {
  const txt = translations[lang];
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <ModernBackground />
      <GlassCard className="p-8 w-full max-w-md mx-auto space-y-6">
         <h2 className="text-2xl font-bold text-slate-800 text-center">{txt.setUsername}</h2>
         <p className="text-slate-500 text-center text-sm">{txt.setUsernameDesc}</p>
         <form onSubmit={onSubmit} className="space-y-4">
           <Input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} required />
           {error && <div className="text-red-500 text-sm text-center">{error}</div>}
           <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" isLoading={loading}>{txt.continue}</Button>
         </form>
         <Button variant="outline" className="w-full" onClick={onLogout}>{txt.logout}</Button>
      </GlassCard>
    </div>
  );
};

const ConnectView = ({ partnerName, setPartnerName, onSubmit, loading, error, myUsername, onLogout, lang }: any) => {
  const txt = translations[lang];
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <ModernBackground />
      <GlassCard className="p-8 w-full max-w-md mx-auto space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="bg-sky-100 p-4 rounded-full mb-4 animate-bounce">
            <LinkIcon className="h-6 w-6 text-sky-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">{txt.connectTitle}</h2>
          <p className="text-slate-500 text-sm mt-1">Hello, <span className="font-semibold text-emerald-600">{myUsername}</span>.</p>
          <p className="text-slate-500 mt-2">{txt.connectDesc}</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input placeholder={txt.partnerUsername} value={partnerName} onChange={e => setPartnerName(e.target.value)} required />
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error === "User not found" ? txt.connectError : error}</div>}
          <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white" isLoading={loading}>{txt.step2}</Button>
        </form>
        <Button variant="outline" className="w-full" onClick={onLogout}>{txt.logout}</Button>
      </GlassCard>
    </div>
  );
};

const DashboardView = ({ 
  profile, 
  partnerProfile, 
  wishes, 
  stats, 
  remaining, 
  wishInput, 
  setWishInput, 
  onSendWish, 
  onToggleWish, 
  onDeleteWish, 
  onLogout, 
  onDelink, 
  loading, 
  error,
  menuOpen,
  setMenuOpen,
  onUpdateUsername,
  onGoToConnect,
  lang,
  setLang
}: any) => {
  const txt = translations[lang];
  const [showEdit, setShowEdit] = useState(false);
  const [newUsername, setNewUsername] = useState(profile?.username || '');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      await onUpdateUsername(newUsername);
      setShowEdit(false);
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleSendAndAnimate = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSendWish(e);
    if (!error && wishInput.trim()) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }
  };

  const myWishes = wishes.filter((w: Wish) => w.sender_id === profile?.id);
  const partnerWishes = wishes.filter((w: Wish) => w.sender_id === partnerProfile?.id);

  return (
    <div className="min-h-screen relative flex flex-col font-sans text-slate-800">
      <ModernBackground />
      
      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-40 border-b border-white/50">
        <div className="flex items-center gap-2 font-bold text-rose-500 text-lg">
          <CustomLogo className="h-6 w-6" />
          <span className="hidden sm:inline">Carelink</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher current={lang} setLang={setLang} />
          <div className="relative">
             <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-white rounded-full transition-colors">
                <MoreVertical className="h-5 w-5 text-slate-600"/>
             </button>
             {menuOpen && (
               <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                  <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                     <LogOut className="h-4 w-4"/> {txt.logout}
                  </button>
                  {partnerProfile && (
                    <>
                      <div className="h-px bg-slate-100 my-1"/>
                      <button onClick={onDelink} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <HeartCrack className="h-4 w-4"/> {txt.unlink}
                      </button>
                    </>
                  )}
               </div>
             )}
          </div>
        </div>
      </nav>

      {/* Main Content - 3 Column Layout */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 lg:p-8 grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Error Notification Area */}
        {error && (
           <div className="lg:col-span-12 mb-4">
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-4">
                 <AlertCircle className="h-5 w-5 shrink-0" />
                 <span className="font-medium text-sm">{error}</span>
              </div>
           </div>
        )}

        {/* LEFT COLUMN: Stats & Profile (3 cols) */}
        <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
           <GlassCard className="p-5 space-y-4 border-l-4 border-l-emerald-400">
               <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-2">{txt.yourProfile}</h3>
               
               <div className="flex flex-col items-center text-center gap-2 pb-4 border-b border-slate-100">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-200">
                     {profile?.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                     <p className="font-bold text-slate-800 text-xl">{profile?.username}</p>
                     <p className="text-xs text-slate-500">
                       {txt.connectedTo} <span className="font-medium text-sky-500">{partnerProfile ? partnerProfile.username : txt.notConnected}</span>
                     </p>
                  </div>
               </div>
               
               <button 
                  onClick={() => setShowEdit(true)} 
                  className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                >
                  <Edit2 className="h-3 w-3"/> {txt.editProfile}
               </button>
           </GlassCard>

           <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
             <GlassCard className="p-4 flex flex-col items-center justify-center text-center">
                <div className="bg-sky-100 p-3 rounded-full text-sky-600 mb-2"><Heart className="h-5 w-5 fill-sky-600/20"/></div>
                <p className="text-2xl font-bold text-slate-800">{partnerProfile ? stats.total : '-'}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{txt.totalWishes}</p>
             </GlassCard>
             
             <GlassCard className="p-4 flex flex-col items-center justify-center text-center">
                <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mb-2"><Activity className="h-5 w-5"/></div>
                <p className="text-2xl font-bold text-slate-800">{partnerProfile ? `${stats.completion}%` : '-'}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{txt.completionRate}</p>
             </GlassCard>
           </div>

           <div className="hidden lg:block p-6 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-2xl shadow-xl shadow-sky-500/20 text-center text-white">
              <p className="text-sm font-medium italic opacity-90">"{txt.quote}"</p>
           </div>
        </div>

        {/* CENTER COLUMN: Core Functionality (6 cols) */}
        <div className="lg:col-span-6 space-y-8 order-1 lg:order-2">
           
           {/* Create Wish Card OR Connect Prompt */}
           {!partnerProfile ? (
             <GlassCard className="p-8 text-center space-y-6 py-12 border-dashed border-2 border-slate-300">
                <div className="bg-sky-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                   <UserPlus className="h-8 w-8 text-sky-600" />
                </div>
                <div>
                   <h3 className="text-2xl font-bold text-slate-800 mb-2">{txt.connectPromptTitle}</h3>
                   <p className="text-slate-500 max-w-md mx-auto">{txt.connectPromptDesc}</p>
                </div>
                <Button onClick={onGoToConnect} className="px-8 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full shadow-lg shadow-sky-200">
                   {txt.connectButton}
                </Button>
             </GlassCard>
           ) : (
             <div className="relative">
              <AnimatePresence>
                {isAnimating && (
                   <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: 0, x: 0 }}
                      animate={{ 
                         opacity: [0, 1, 1, 0], 
                         scale: [0.5, 1.2, 0.8], 
                         y: -400, 
                         x: 200,
                         rotate: 15
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute z-50 pointer-events-none left-1/2 top-1/2"
                   >
                     <div className="bg-gradient-to-tr from-rose-400 to-sky-500 p-4 rounded-full shadow-2xl shadow-rose-500/50">
                        <Send className="h-8 w-8 text-white" />
                     </div>
                   </motion.div>
                )}
              </AnimatePresence>

              <GlassCard className="p-6 md:p-8 border-t-4 border-t-rose-400 shadow-2xl shadow-rose-900/5">
                <div className="text-center mb-6 space-y-2">
                  <div className="inline-flex items-center justify-center p-2 bg-rose-50 text-rose-500 rounded-full mb-2">
                     <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">{txt.sendWishTitle}</h3>
                  <p className="text-slate-500 text-sm">{txt.sendWishDesc} <span className="font-semibold text-sky-500">{partnerProfile.username}</span>.</p>
                </div>
                
                <form onSubmit={handleSendAndAnimate} className="space-y-4">
                  <textarea
                    rows={2}
                    className="w-full px-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-rose-200 focus:border-rose-400 outline-none transition-all text-lg resize-none text-center placeholder:text-slate-400 shadow-inner"
                    placeholder={txt.placeholder}
                    value={wishInput}
                    onChange={e => setWishInput(e.target.value)}
                    disabled={remaining <= 0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if(wishInput.trim() && remaining > 0) handleSendAndAnimate(e);
                      }
                    }}
                  />
                  <div className="flex items-center justify-between gap-4">
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-100 px-4 py-2 rounded-full uppercase tracking-wide">
                        <span className={`${remaining === 0 ? 'text-red-500' : 'text-emerald-500'} text-sm`}>{remaining}</span> / 10 {txt.dailyLimit}
                     </div>
                     <Button type="submit" disabled={!wishInput.trim() || remaining <= 0} isLoading={loading} className="px-8 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 shadow-lg shadow-sky-500/20 w-full sm:w-auto font-bold tracking-wide">
                       {txt.send} <ArrowRight className="h-4 w-4 ml-2" />
                     </Button>
                  </div>
                </form>
              </GlassCard>
           </div>
           )}

           {/* Wishes Feed */}
           {partnerProfile && (
           <div className="grid gap-6">
              
              {/* Partner's Wishes (Received) */}
              <div className="space-y-4">
                 <div className="flex items-center gap-3 px-2">
                    <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xs">{partnerProfile.username.charAt(0).toUpperCase()}</div>
                    <h4 className="font-bold text-slate-700 text-lg">{txt.forYou}</h4>
                    <span className="text-xs bg-sky-50 text-sky-600 px-3 py-1 rounded-full font-bold ml-auto">{partnerWishes.length}</span>
                 </div>
                 
                 <div className="space-y-3">
                   {partnerWishes.length === 0 && (
                     <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/30">
                        <p className="text-slate-400 text-sm">{txt.noWishesReceived}</p>
                     </div>
                   )}
                   {partnerWishes.map((wish: Wish) => (
                      <motion.div 
                        key={wish.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => onToggleWish(wish)}
                        className={`group relative overflow-hidden p-6 rounded-2xl border cursor-pointer transition-all ${
                          wish.is_completed 
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white border-transparent shadow-lg shadow-emerald-500/20' 
                          : 'bg-white border-white hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100/50'
                        }`}
                      >
                         <div className="flex items-center justify-between gap-4 relative z-10">
                            <p className={`text-lg font-medium leading-relaxed ${wish.is_completed ? 'text-white' : 'text-slate-800'}`}>{wish.content}</p>
                            <div className={`shrink-0 h-8 w-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                               wish.is_completed ? 'border-white bg-white/20' : 'border-slate-200 group-hover:border-sky-300'
                            }`}>
                               {wish.is_completed && <Check className="h-5 w-5 text-white" />}
                            </div>
                         </div>
                      </motion.div>
                   ))}
                 </div>
              </div>

              {/* My Wishes (Sent) */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                 <div className="flex items-center gap-3 px-2 opacity-80">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">Me</div>
                    <h4 className="font-bold text-slate-600 text-sm uppercase tracking-wide">{txt.sentByYou}</h4>
                    <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold ml-auto">{myWishes.length} {txt.sent}</span>
                 </div>

                 <div className="space-y-3">
                    {myWishes.map((wish: Wish) => (
                       <motion.div 
                         key={wish.id}
                         layout
                         className="flex items-center justify-between p-4 rounded-xl bg-white/40 border border-white hover:bg-white transition-colors shadow-sm group"
                       >
                          <div className="flex items-center gap-3">
                             <div className={`h-2 w-2 rounded-full ${wish.is_completed ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                             <span className={`${wish.is_completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>{wish.content}</span>
                          </div>
                          <div className="flex items-center gap-3">
                             {wish.is_completed && <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{txt.completed}</span>}
                             <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteWish(wish.id); }} 
                                className="text-slate-300 hover:text-rose-500 transition-colors p-1.5 rounded-full hover:bg-rose-50 group-hover:text-slate-400"
                                title="Delete"
                             >
                                <Trash2 className="h-4 w-4" />
                             </button>
                          </div>
                       </motion.div>
                    ))}
                    {myWishes.length === 0 && (
                       <p className="text-center text-slate-400 text-xs py-4">{txt.noWishesSent}</p>
                    )}
                 </div>
              </div>

           </div>
           )}
        </div>

        {/* RIGHT COLUMN: Charts (3 cols) */}
        <div className="lg:col-span-3 space-y-4 order-3 lg:order-3">
           <GlassCard className="p-6 flex flex-col justify-between h-auto min-h-[250px] sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                  <div className="bg-emerald-100 p-2 rounded-full text-emerald-600"><BarChart3 className="h-4 w-4"/></div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{txt.activity}</p>
              </div>
              
              {partnerProfile ? (
              <div className="flex items-end gap-2 h-40 w-full justify-between">
                 {stats.chart.map((d: any, i: number) => {
                   const maxCount = Math.max(...stats.chart.map((s:any) => s.count), 5); 
                   const heightPercentage = Math.max(4, (d.count / maxCount) * 100);
                   
                   return (
                   <div key={i} className="relative group flex-1 flex flex-col items-center gap-2">
                      <div className="w-full relative flex items-end justify-center h-full">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercentage}%` }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={`w-full max-w-[12px] lg:max-w-[16px] rounded-full transition-colors duration-300 ${
                                d.count > 0 
                                ? 'bg-gradient-to-t from-sky-300 to-emerald-400 hover:from-sky-400 hover:to-emerald-500' 
                                : 'bg-slate-100'
                            }`}
                          />
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none transition-all z-10 whitespace-nowrap">
                             {d.count}
                          </div>
                      </div>
                      <span className="text-[9px] font-medium text-slate-400 uppercase">{d.day.substring(0, 1)}</span>
                   </div>
                 )})}
              </div>
              ) : (
                <div className="h-40 w-full flex items-center justify-center text-slate-400 text-sm">
                   -
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                 <p className="text-xs text-slate-400">{txt.streak}</p>
              </div>
           </GlassCard>
        </div>

      </main>

      {/* Edit Username Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title={txt.updateUserTitle}>
         <form onSubmit={handleUpdate} className="space-y-4">
            <p className="text-sm text-slate-500">{txt.updateUserDesc}</p>
            <Input 
              value={newUsername} 
              onChange={e => setNewUsername(e.target.value)} 
              placeholder="New username"
              required
            />
            {editError && <p className="text-red-500 text-sm">{editError}</p>}
            <Button type="submit" isLoading={editLoading} className="w-full bg-emerald-600">{txt.saveChanges}</Button>
         </form>
      </Modal>
    </div>
  );
};

const AdminView = ({ onBack, onLogin, user, setUser, pass, setPass, profiles, error, loading, onClearAll, onRefresh }: any) => {
   if (!profiles) {
      return (
         <div className="min-h-screen relative flex items-center justify-center p-4">
            <ModernBackground />
            <GlassCard className="p-8 w-full max-w-sm mx-auto space-y-6 bg-slate-900/90 border-slate-700 text-white">
               <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Lock className="h-5 w-5"/> Admin Access</h2>
               <form onSubmit={onLogin} className="space-y-4">
                  <div>
                     <label className="text-slate-400 text-xs uppercase font-bold">Username</label>
                     <input className="w-full bg-slate-800 text-white p-2 rounded mt-1 border border-slate-600 focus:border-emerald-500 outline-none" value={user} onChange={e => setUser(e.target.value)} />
                  </div>
                  <div>
                     <label className="text-slate-400 text-xs uppercase font-bold">Password</label>
                     <input type="password" className="w-full bg-slate-800 text-white p-2 rounded mt-1 border border-slate-600 focus:border-emerald-500 outline-none" value={pass} onChange={e => setPass(e.target.value)} />
                  </div>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <Button variant="primary" className="w-full bg-emerald-600 hover:bg-emerald-500 border-none">Login</Button>
               </form>
               <button onClick={onBack} className="mt-4 text-slate-500 text-sm w-full text-center hover:text-slate-300">Exit Admin</button>
            </GlassCard>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-emerald-50/20 text-slate-800">
         <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
         <div className="font-bold flex items-center gap-2"><Shield className="h-5 w-5"/> Carelink Admin</div>
         <button onClick={onBack} className="text-xs font-bold uppercase bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded transition-colors">Logout</button>
         </header>
         <main className="p-8 max-w-7xl mx-auto">
         <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div>
                  <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
                  <p className="text-slate-500">Overview of all registered profiles</p>
            </div>
            <div className="flex gap-3">
               <Button onClick={onClearAll} variant="danger" className="bg-red-600 hover:bg-red-700">Clear All Wishes</Button>
               <Button onClick={onRefresh} isLoading={loading} variant="primary" className="bg-slate-900 text-white hover:bg-slate-800">Refresh Data</Button>
            </div>
         </div>
         
         <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 border-b border-slate-200">
               <tr>
                  <th className="p-5 font-bold text-slate-700 uppercase text-xs tracking-wider">ID</th>
                  <th className="p-5 font-bold text-slate-700 uppercase text-xs tracking-wider">Username</th>
                  <th className="p-5 font-bold text-slate-700 uppercase text-xs tracking-wider">Role</th>
                  <th className="p-5 font-bold text-slate-700 uppercase text-xs tracking-wider">Joined</th>
               </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
               {profiles.length === 0 && (
                  <tr>
                     <td colSpan={4} className="p-12 text-center text-slate-400">
                        No users found.
                     </td>
                  </tr>
               )}
               {profiles.map((p: Profile) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                     <td className="p-5 font-mono text-xs text-slate-500">{p.id}</td>
                     <td className="p-5 font-medium text-slate-900">{p.username}</td>
                     <td className="p-5"><span className="bg-blue-50 text-blue-700 border border-blue-100 text-xs px-2 py-1 rounded-full font-medium">{p.role}</span></td>
                     <td className="p-5 text-slate-500">{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
               ))}
               </tbody>
            </table>
         </div>
         </main>
      </div>
   );
};

// --- MAIN CONTROLLER ---

const App: React.FC = () => {
  // State
  const [initializing, setInitializing] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<ViewState>('LANDING');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<Language>('en');

  // Data
  const [profile, setProfile] = useState<Profile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<Profile | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [historyWishes, setHistoryWishes] = useState<Wish[]>([]);

  // Forms
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [partnerUsernameInput, setPartnerUsernameInput] = useState('');
  const [wishInput, setWishInput] = useState('');

  // Admin
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminProfiles, setAdminProfiles] = useState<Profile[] | null>(null);

  // Initialize
  useEffect(() => {
    let mounted = true;
    const initialize = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (mounted && initialSession) {
          setSession(initialSession);
          await loadUserData(initialSession.user.id);
        } else {
          setInitializing(false);
        }
      } catch (err) {
        console.error("Initialization failed:", err);
        if (mounted) setInitializing(false);
      }
    };
    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;
      if (event === 'SIGNED_OUT') {
        setSession(null); setProfile(null); setConnection(null); setPartnerProfile(null);
        setWishes([]); setHistoryWishes([]); setView('LANDING'); setInitializing(false);
      } else if (event === 'SIGNED_IN' && currentSession) {
        setSession(currentSession);
      }
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      const userProfile = await api.getProfile(userId);
      if (!userProfile) {
        setView('ONBOARDING');
        return;
      }
      
      setProfile(userProfile);
      
      // Try fetching connection but don't block Dashboard access if it fails or returns null
      try {
        const conn = await api.getConnection(userId);
        if (conn) {
          setConnection(conn);
          // With new 2-row logic, conn.user_id IS the current user
          const partnerId = conn.partner_id;
          try {
             const partner = await api.getProfile(partnerId);
             if (partner) setPartnerProfile(partner);
          } catch (e) { console.error("Partner load error", e); }
          await refreshWishes(userId, partnerId);
        } else {
          // Explicitly clear connection data if no connection found
          setConnection(null);
          setPartnerProfile(null);
          setWishes([]);
          setHistoryWishes([]);
        }
      } catch (e) {
        console.error("Connection check failed", e);
      }

      // Always go to DASHBOARD if profile exists, regardless of connection status
      setView('DASHBOARD');
      
    } catch (err: any) {
      console.error("Critical User Load Error:", err);
      // Stay on AUTH view to show error, do NOT redirect to LANDING
      setError(err.message || "Failed to load profile");
    } finally {
      setInitializing(false);
      setLoading(false); 
    }
  };

  const refreshWishes = async (userId: string, partnerId: string) => {
    try {
      const allWishes = await api.getPairWishes(userId, partnerId);
      setHistoryWishes(allWishes);
      const today = new Date().toDateString();
      const todays = allWishes.filter((w: Wish) => new Date(w.created_at).toDateString() === today);
      todays.sort((a: Wish, b: Wish) => Number(a.is_completed) - Number(b.is_completed));
      setWishes(todays);
    } catch (err) { console.error(err); }
  };

  // Handlers
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
        if (error) throw error;
        if (data.session) await loadUserData(data.session.user.id);
        else { alert("Account created! Log in."); setIsSignUp(false); setLoading(false); }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
        if (error) throw error;
        if (data.session) await loadUserData(data.session.user.id);
      }
    } catch (err: any) { 
        console.error("Auth error", err);
        setError(err.message); 
        setLoading(false); 
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setLoading(true); setError(null);
    try {
      const newProfile = await api.createProfile(session.user.id, usernameInput);
      setProfile(newProfile);
      // Go directly to Dashboard after creating profile
      setView('DASHBOARD');
    } catch (err: any) { setError(err.message.includes('unique') ? 'Username taken' : err.message); } finally { setLoading(false); }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !profile) return;
    setLoading(true); setError(null);
    try {
      const partner = await api.findProfileByUsername(partnerUsernameInput);
      if (!partner) throw new Error("User not found");
      if (partner.id === profile.id) throw new Error("Cannot connect to yourself");
      
      // Removed frontend pre-check to allow DB constraints to handle unique connections
      
      await api.createConnection(profile.id, partner.id);
      await loadUserData(session.user.id);
    } catch (err: any) { 
        // Handle Postgres Unique Violation (23505)
        if (err.code === '23505') {
            let msg = "You or the other user is already connected to someone.";
            if (lang === 'zh' || lang === 'tw') {
                msg = "您或对方已与其他用户建立连接。";
            } else if (lang === 'no') {
                msg = "Du eller den andre brukeren er allerede koblet til noen.";
            }
            setError(msg);
        } else {
            setError(err.message); 
        }
    } finally { setLoading(false); }
  };

  const handleSendWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !partnerProfile) return;
    const myCount = wishes.filter(w => w.sender_id === profile.id).length;
    if (myCount >= 10) { setError("Daily limit reached"); return; }
    setLoading(true);
    try {
      await api.sendWish(profile.id, partnerProfile.id, wishInput);
      setWishInput('');
      refreshWishes(profile.id, partnerProfile.id);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleToggleWish = async (wish: Wish) => {
    const newWishes = wishes.map(w => w.id === wish.id ? { ...w, is_completed: !w.is_completed } : w);
    setWishes(newWishes);
    try { await api.toggleWishCompletion(wish.id, wish.is_completed); }
    catch (e) { if(profile && partnerProfile) refreshWishes(profile.id, partnerProfile.id); }
  };

  const handleDeleteWish = async (id: string) => {
    if(!confirm("Delete this wish?")) return;
    
    // Optimistic Update
    const prevWishes = [...wishes];
    setWishes(wishes.filter(w => w.id !== id));
    setHistoryWishes(historyWishes.filter(w => w.id !== id));

    try {
      await api.deleteWish(id);
    } catch (e:any) { 
        console.error(e);
        // Revert on failure
        setWishes(prevWishes);
        setHistoryWishes(historyWishes); // In a real app we'd deep copy history too
        setError(translations[lang].deleteError || "Failed to delete wish");
    }
  };

  const handleDelink = async () => {
    if(!profile) return;
    const confirmMsg = translations[lang].unlinkConfirm || "Are you sure you want to disconnect?";
    if(!confirm(confirmMsg)) return;
    
    setLoading(true);
    setError(null);
    try {
       await api.deleteConnection(profile.id);
       // Manually clear state to update UI immediately
       setConnection(null); setPartnerProfile(null); setWishes([]); setHistoryWishes([]);
       setView('DASHBOARD');
       setMenuOpen(false);
    } catch (e:any) { 
        console.error(e);
        // Show error more prominently
        setError((translations[lang].unlinkError || "Failed to unlink") + ": " + e.message); 
    } finally { 
        setLoading(false);
    }
  };

  const handleUpdateUsername = async (newUsername: string) => {
     if(!profile) return;
     const updated = await api.updateProfile(profile.id, { username: newUsername });
     setProfile(updated);
  };

  // Admin
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser === 'admin' && adminPass === '3303') { fetchAdminData(); }
    else { setError('Invalid credentials'); }
  };
  const fetchAdminData = async () => {
     setLoading(true);
     try { const data = await api.getAllProfiles(); setAdminProfiles(data || []); }
     catch(e) { setError("Fetch failed"); } finally { setLoading(false); }
  };
  const handleAdminClear = async () => {
     if(!confirm("DELETE ALL WISHES?")) return;
     try { await api.deleteAllWishes(); alert("Cleared"); } catch(e:any) { alert(e.message); }
  };

  // Stats
  const calculateStats = () => {
     if (!profile) return { total: 0, completion: 0, chart: [] };
     const total = historyWishes.length;
     const completed = historyWishes.filter(w => w.is_completed).length;
     const completion = total === 0 ? 0 : Math.round((completed / total) * 100);
     const days = [...Array(7)].map((_, i) => {
        const d = new Date(); d.setDate(d.getDate() - i); return d.toDateString();
     }).reverse();
     const chart = days.map(day => ({
        day: day.split(' ')[0],
        count: historyWishes.filter(w => new Date(w.created_at).toDateString() === day).length
     }));
     return { total, completion, chart };
  };

  if (initializing) return (
     <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <ModernBackground /><Loader2 className="animate-spin text-rose-500 h-10 w-10"/>
     </div>
  );

  return (
     <>
       {view === 'LANDING' && <LandingView setView={setView} lang={lang} setLang={setLang} />}
       {view === 'AUTH' && (
          <AuthView 
             isSignUp={isSignUp} setIsSignUp={setIsSignUp}
             email={authEmail} setEmail={setAuthEmail}
             password={authPassword} setPassword={setAuthPassword}
             onSubmit={handleAuth} loading={loading} error={error}
             onBack={() => setView('LANDING')}
             lang={lang}
          />
       )}
       {view === 'ONBOARDING' && (
          <OnboardingView 
             username={usernameInput} setUsername={setUsernameInput}
             onSubmit={handleCreateProfile} loading={loading} error={error}
             onLogout={async () => { await supabase.auth.signOut(); }}
             lang={lang}
          />
       )}
       {view === 'CONNECT' && (
          <ConnectView 
             partnerName={partnerUsernameInput} setPartnerName={setPartnerUsernameInput}
             myUsername={profile?.username}
             onSubmit={handleConnect} loading={loading} error={error}
             onLogout={async () => { await supabase.auth.signOut(); }}
             lang={lang}
          />
       )}
       {view === 'DASHBOARD' && (
          <DashboardView 
             profile={profile} partnerProfile={partnerProfile} wishes={wishes}
             stats={calculateStats()} remaining={10 - wishes.filter(w => w.sender_id === profile?.id).length}
             wishInput={wishInput} setWishInput={setWishInput}
             onSendWish={handleSendWish} onToggleWish={handleToggleWish} onDeleteWish={handleDeleteWish}
             onLogout={async () => { await supabase.auth.signOut(); }} onDelink={handleDelink}
             loading={loading} error={error}
             menuOpen={menuOpen} setMenuOpen={setMenuOpen}
             onUpdateUsername={handleUpdateUsername}
             onGoToConnect={() => setView('CONNECT')}
             lang={lang}
             setLang={setLang}
          />
       )}
       {(view === 'ADMIN_LOGIN' || view === 'ADMIN_DASHBOARD') && (
          <AdminView 
             onBack={() => { setView('LANDING'); setAdminProfiles(null); }}
             onLogin={handleAdminLogin}
             user={adminUser} setUser={setAdminUser}
             pass={adminPass} setPass={setAdminPass}
             profiles={adminProfiles} error={error} loading={loading}
             onClearAll={handleAdminClear} onRefresh={fetchAdminData}
          />
       )}
     </>
  );
};

export default App;