"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Heart,
  Users,
  Coins,
  MessageSquare,
  Loader2,
  Play,
  Search,
  X,
  UserCheck,
  GraduationCap,
  Home,
} from "lucide-react";
import { templates, type SimulationTemplate } from "@/lib/templates";

const PERSONALITY_OPTIONS: Record<string, Array<{ value: string; label: string; desc: string; emoji: string }>> = {
  is_kariyer: [
    { value: "Otoriter ve Sert", label: "Otoriter ve Sert", desc: "Kurallara bağlıdır, hiyerarşiyi ön planda tutar.", emoji: "🔴" },
    { value: "Anlayışlı ve Mantıklı", label: "Anlayışlı ve Mantıklı", desc: "Performansa, verilere ve argümanlara değer verir.", emoji: "🟢" },
    { value: "Pasif-Agresif / İğneleyici", label: "Pasif-Agresif / İğneleyici", desc: "Laf sokarak veya dolaylı yollarla baskı kurar.", emoji: "🟡" },
    { value: "Manipülatif ve Egoist", label: "Manipülatif ve Egoist", desc: "Sorumluluktan kaçar, suçluluk psikolojisi yaratır.", emoji: "🟣" },
    { value: "Yoğun ve Dikkatsiz", label: "Yoğun ve Dikkatsiz", desc: "Zamanı azdır, kestirip atmaya ve dinlememeye eğilimlidir.", emoji: "🟠" },
  ],
  flort_iliski: [
    { value: "Soğuk ve Mesafeli", label: "Soğuk ve Mesafeli", desc: "Duygularını pek yansıtmaz, geç yazar ve mesafeyi korur.", emoji: "❄️" },
    { value: "Duygusal ve Hassas", label: "Duygusal ve Hassas", desc: "Çabuk kırılır, her kelimeden derin anlamlar çıkarır.", emoji: "❤️" },
    { value: "İlgisiz / Kararsız", label: "İlgisiz / Kararsız", desc: "Gelgitli davranır, tam olarak ne istediğini belli etmez.", emoji: "🌪️" },
    { value: "Kıskanç ve Koruyucu", label: "Kıskanç ve Koruyucu", desc: "Sahiplenici ve şüpheci yaklaşır, sorgular.", emoji: "🔥" },
    { value: "Anlayışlı ve Açık Sözlü", label: "Anlayışlı ve Açık Sözlü", desc: "Dürüstçe konuşur, empati yapmaya hazırdır.", emoji: "💬" },
  ],
  aile_arkadas: [
    { value: "Alıngan ve Hassas", label: "Alıngan ve Hassas", desc: "Hemen gücenir, mağdur rolü oynamayı sever.", emoji: "🥺" },
    { value: "Otoriter ve Baskıcı", label: "Otoriter ve Baskıcı", desc: "Kendi doğrularını dayatır, sınırlarınıza müdahale eder.", emoji: "🛡️" },
    { value: "Pasif-Agresif", label: "Pasif-Agresif", desc: "Sessiz kalarak veya imalarla ceza vermeye çalışır.", emoji: "🤫" },
    { value: "Destekleyici ve Sevgi Dolu", label: "Destekleyici ve Sevgi Dolu", desc: "İyi niyetlidir ama istemeden sınırları aşar.", emoji: "🌟" },
    { value: "Geleneksel / Israrcı", label: "Geleneksel / Israrcı", desc: "Kabul etmesi zordur, ısrarla kendi dediğini yaptırmak ister.", emoji: "👵" },
  ],
  para_pazarlik: [
    { value: "Para Göz ve Katı", label: "Para Göz ve Katı", desc: "Taviz vermez, kuruşu kuruşuna pazarlık eder.", emoji: "💰" },
    { value: "Uzlaşmacı ve Esnek", label: "Uzlaşmacı ve Esnek", desc: "Masada anlaşma zemini arar, yapıcıdır.", emoji: "🤝" },
    { value: "Profesyonel ve Mesafeli", label: "Profesyonel ve Mesafeli", desc: "Tamamen resmi ve kurumsal kurallarla ilerler.", emoji: "👔" },
    { value: "Israrcı ve Zorlayıcı", label: "Israrcı ve Zorlayıcı", desc: "Kendi teklifini kabul ettirene kadar baskı yapar.", emoji: "🔨" },
  ],
  zor_mesajlar: [
    { value: "Otoriter ve Sert", label: "Otoriter ve Sert", desc: "Baskıcı ve net kuralları olan bir tarzı vardır.", emoji: "🔴" },
    { value: "Anlayışlı ve Mantıklı", label: "Anlayışlı ve Mantıklı", desc: "Mantıklı yaklaşıldığında yapıcı yanıt verir.", emoji: "🟢" },
    { value: "Pasif-Agresif / İğneleyici", label: "Pasif-Agresif / İğneleyici", desc: "İmalarla konuşmayı zorlaştırır.", emoji: "🟡" },
    { value: "Soğuk ve Mesafeli", label: "Soğuk ve Mesafeli", desc: "İletişimi asgari düzeyde tutar.", emoji: "❄️" },
    { value: "Duygusal ve Hassas", label: "Duygusal ve Hassas", desc: "Alınganlık gösterir.", emoji: "❤️" },
  ],
  egitim_okul: [
    { value: "Otoriter / Sert Hoca", label: "Otoriter / Sert Hoca", desc: "Kurallara bağlıdır, mazeret kabul etmez ve oldukça mesafelidir.", emoji: "👨‍🏫" },
    { value: "Anlayışlı ve Yapıcı", label: "Anlayışlı ve Yapıcı", desc: "Öğrencilere değer verir, mantıklı akademik itirazları dinler.", emoji: "👩‍🎓" },
    { value: "Gamsız / Sorumsuz Arkadaş", label: "Gamsız / Sorumsuz Arkadaş", desc: "Grup ödevlerinde sorumluluk almaz, mesajları çok geç yanıtlar.", emoji: "😴" },
    { value: "Rekabetçi ve Hırslı", label: "Rekabetçi ve Hırslı", desc: "Sadece yüksek not odaklıdır, yoğun bir başarı baskısı kurar.", emoji: "📈" },
  ],
  gunluk_yasam: [
    { value: "Gürültücü / İnatçı", label: "Gürültücü / İnatçı", desc: "Rahatsızlık verdiğini kesinlikle kabul etmez, hemen savunmaya geçer.", emoji: "🔊" },
    { value: "Yoğun / İşi Geciktiren", label: "Yoğun / İşi Geciktiren", desc: "Sürekli işi erteler, bahaneler üretir ve telefonları açmaz.", emoji: "🔧" },
    { value: "Anlayışlı / Uzlaşmacı", label: "Anlayışlı / Uzlaşmacı", desc: "Komşuluk ilişkilerine değer verir, sorunu uzlaşarak çözmek ister.", emoji: "🤝" },
    { value: "Pasif-Agresif Komşu", label: "Pasif-Agresif Komşu", desc: "Sorunları doğrudan konuşmaz, kapıya imalı notlar bırakır.", emoji: "📝" },
  ],
};

export function QuickStartGrid() {
  const router = useRouter();
  
  // Navigation & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState<number>(6);
  
  // Simulation Launch State
  const [selectedTemplate, setSelectedTemplate] = useState<SimulationTemplate | null>(null);
  const [chosenPersonality, setChosenPersonality] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Infinite Scroll trigger on scroll down
  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 150
      ) {
        setVisibleCount((prev) => Math.min(prev + 6, filteredTemplates.length));
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredTemplates.length]);

  // Reset visibleCount when filters change
  useEffect(() => {
    setVisibleCount(6);
  }, [selectedCategory, searchQuery]);

  function handleLaunchWizard() {
    if (!selectedTemplate || !chosenPersonality) return;
    router.push(
      `/simulations/new?template=${selectedTemplate.id}&personality=${encodeURIComponent(
        chosenPersonality
      )}`
    );
  }

  function handleCardClick(template: SimulationTemplate) {
    setSelectedTemplate(template);
    setChosenPersonality(template.context.otherPersonPersonality || "");
  }

  function getCategoryIcon(category: string) {
    switch (category) {
      case "is_kariyer":
        return <Briefcase size={16} className="text-blue-400" />;
      case "flort_iliski":
        return <Heart size={16} className="text-pink-400" />;
      case "aile_arkadas":
        return <Users size={16} className="text-purple-400" />;
      case "para_pazarlik":
        return <Coins size={16} className="text-emerald-400" />;
      case "egitim_okul":
        return <GraduationCap size={16} className="text-cyan-400" />;
      case "gunluk_yasam":
        return <Home size={16} className="text-amber-400" />;
      default:
        return <MessageSquare size={16} className="text-indigo-400" />;
    }
  }

  function getCategoryLabel(category: string) {
    switch (category) {
      case "is_kariyer":
        return "İş / Kariyer";
      case "flort_iliski":
        return "Flört / İlişki";
      case "aile_arkadas":
        return "Aile / Arkadaş";
      case "para_pazarlik":
        return "Para / Pazarlık";
      case "egitim_okul":
        return "Eğitim / Okul";
      case "gunluk_yasam":
        return "Günlük Yaşam / Komşuluk";
      default:
        return "Zor Mesajlar";
    }
  }

  function getDifficultyStyle(difficulty: "Kolay" | "Orta" | "Zor") {
    switch (difficulty) {
      case "Kolay":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Orta":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Zor":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    }
  }

  const categoryTabs = [
    { id: "all", label: "Tümü" },
    { id: "is_kariyer", label: "İş / Kariyer" },
    { id: "flort_iliski", label: "Flört" },
    { id: "aile_arkadas", label: "Aile / Arkadaş" },
    { id: "para_pazarlik", label: "Para / Pazarlık" },
    { id: "egitim_okul", label: "Eğitim / Okul" },
    { id: "gunluk_yasam", label: "Günlük Yaşam" },
    { id: "zor_mesajlar", label: "Zor Mesajlar" },
  ];

  const currentCategoryKey = selectedTemplate?.category || "zor_mesajlar";
  const personalityOptions = PERSONALITY_OPTIONS[currentCategoryKey] || PERSONALITY_OPTIONS.zor_mesajlar;

  return (
    <div className="space-y-6">
      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition duration-200 border ${
                selectedCategory === tab.id
                  ? "bg-violet-400 border-violet-400 text-slate-950"
                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs">
          <Search size={14} className="text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Senaryolarda ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-slate-200 placeholder-slate-400 outline-none md:w-48"
          />
        </div>
      </div>

      {/* Templates Grid with dynamic scrolling visibility */}
      {filteredTemplates.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] py-12 text-center">
          <p className="text-slate-400 text-sm">Aradığın kritere uygun senaryo bulunamadı.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.slice(0, visibleCount).map((template) => (
            <button
              key={template.id}
              onClick={() => handleCardClick(template)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-violet-950/20"
            >
              {/* Top row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-300">
                  {getCategoryIcon(template.category)}
                  <span>{getCategoryLabel(template.category)}</span>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getDifficultyStyle(
                    template.difficulty
                  )}`}
                >
                  {template.difficulty}
                </span>
              </div>

              {/* Content */}
              <div className="mt-5 flex-1">
                <h3 className="text-lg font-bold text-white transition group-hover:text-violet-200">
                  {template.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-400 group-hover:text-slate-300">
                  {template.description}
                </p>
              </div>

              {/* Bottom row */}
              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-xs font-semibold">
                <span className="text-slate-500 group-hover:text-slate-400">
                  Muhatap: {template.context.otherPerson}
                </span>
                <div className="flex items-center gap-1.5 text-violet-300 transition group-hover:text-violet-100">
                  <Play size={12} fill="currentColor" />
                  <span>Hemen Prova Et</span>
                </div>
              </div>

              {/* Glow overlay */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-500/10 blur-[50px] transition-all duration-500 group-hover:bg-violet-500/20 group-hover:blur-[60px]" />
            </button>
          ))}
        </div>
      )}

      {/* Manual / Scroll indicator */}
      {filteredTemplates.length > visibleCount && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setVisibleCount((prev) => Math.min(prev + 6, filteredTemplates.length))}
            className="rounded-full bg-white/5 border border-white/10 px-6 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition duration-200"
          >
            Aşağı kaydır veya Daha Fazla Yükle
          </button>
        </div>
      )}

      {/* Personality selection modal dialog */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-[2rem] border border-white/10 bg-slate-900 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <button
              onClick={() => setSelectedTemplate(null)}
              className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-400">
                <UserCheck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedTemplate.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Karşı tarafın ({selectedTemplate.context.otherPerson}) karakter tipini seçip detayları ayarlayın.
                </p>
              </div>
            </div>

            {/* Personality List */}
            <div className="mt-6 max-h-[320px] overflow-y-auto pr-1 space-y-2">
              {personalityOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setChosenPersonality(opt.value)}
                  className={`w-full flex items-start gap-3 rounded-2xl border p-3.5 text-left transition duration-200 ${
                    chosenPersonality === opt.value
                      ? "bg-violet-400/15 border-violet-400 shadow-md shadow-violet-950/20"
                      : "bg-white/[0.02] border-white/5 hover:bg-white/5"
                  }`}
                >
                  <span className="text-xl mt-0.5">{opt.emoji}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{opt.label}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Start Button */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="flex-1 rounded-2xl border border-white/10 py-3.5 text-xs font-bold text-slate-300 hover:bg-white/5 transition"
              >
                İptal
              </button>
              <button
                onClick={handleLaunchWizard}
                disabled={!chosenPersonality}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-violet-300 py-3.5 text-xs font-black text-slate-950 hover:bg-violet-200 transition disabled:opacity-50"
              >
                <Play size={14} fill="currentColor" />
                <span>Detayları Ayarla</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
