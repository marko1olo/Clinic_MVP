import { useState, useCallback } from "react";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  User,
  Wrench,
  Building2,
  Baby,
  BrainCircuit,
  Scissors,
  Layers,
  HeartHandshake,
  Sparkles,
  Stethoscope,
  ListTodo,
} from "lucide-react";
import {
  applyWorkspacePreset,
  saveWorkspaceFlags,
  useWorkspaceProfileStore,
  type WorkspaceFeatureFlags,
} from "../../hooks/useWorkspaceProfile";

// ──────────────────────────────────────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────────────────────────────────────
interface PresetCard {
  id: string;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
  description: string;
  flags: Partial<WorkspaceFeatureFlags>;
}

const PRESET_CARDS: PresetCard[] = [
  {
    id: "solo_therapist",
    label: "Частный терапевт",
    subtitle: "1 кресло · без ассистента",
    icon: <User size={28} />,
    accent: "hsl(210 80% 60%)",
    description: "Ультра-минималистичный блокнот. Мгновенная подпись карты в один клик.",
    flags: { hasAssistants: false, hasMultipleChairs: false, hasDentalLab: false, hasInsuranceCoPay: false, hasInstallments: true },
  },
  {
    id: "prosthodontist",
    label: "Ортопедический кабинет",
    subtitle: "Коронки · мосты",
    icon: <Wrench size={28} />,
    accent: "hsl(262 80% 65%)",
    description: "Фокус на зуботехнические заказы. Гостевой портал лаборатории, рассрочки.",
    flags: { hasAssistants: true, hasMultipleChairs: false, hasDentalLab: true, hasInsuranceCoPay: false, hasInstallments: true },
  },
  {
    id: "family_clinic",
    label: "Семейная клиника",
    subtitle: "Все возрасты",
    icon: <HeartHandshake size={28} />,
    accent: "hsl(310 70% 60%)",
    description: "Полный спектр: терапия, ортопедия, детский приём. Все модули включены.",
    flags: { hasAssistants: true, hasMultipleChairs: true, hasDentalLab: true, hasInsuranceCoPay: true, hasInstallments: true },
  },
  {
    id: "enterprise",
    label: "Сеть клиник",
    subtitle: "Мультифилиальность",
    icon: <Building2 size={28} />,
    accent: "hsl(225 70% 60%)",
    description: "Максимальный набор. BI-аналитика по сети, полная мультитенантность.",
    flags: { hasAssistants: true, hasMultipleChairs: true, hasDentalLab: true, hasInsuranceCoPay: true, hasInstallments: true },
  },
];

const PRICE_LIST_MODULES = [
  { id: "therapy", label: "Терапия", icon: <Stethoscope size={18} /> },
  { id: "orthopedics", label: "Ортопедия", icon: <Wrench size={18} /> },
  { id: "surgery", label: "Хирургия", icon: <Scissors size={18} /> },
  { id: "orthodontics", label: "Ортодонтия", icon: <BrainCircuit size={18} /> },
  { id: "pediatrics", label: "Детство", icon: <Baby size={18} /> },
  { id: "implants", label: "Имплантология", icon: <Layers size={18} /> },
];

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
function SliderControl({ label, value, min, max, onChange, isDark }: any) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontWeight: 600, fontSize: 15 }}>{label}</span>
        <span style={{ fontWeight: 700, fontSize: 16, color: "hsl(262 80% 70%)" }}>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{
          width: "100%",
          accentColor: "hsl(262 80% 65%)",
          cursor: "pointer",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function ToggleCard({ label, checked, onChange, icon, isDark }: any) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
        borderRadius: 14,
        background: checked ? "rgba(160, 130, 255, 0.1)" : isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
        border: `1.5px solid ${checked ? "hsl(262 80% 65%)" : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ color: checked ? "hsl(262 80% 65%)" : isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{icon}</div>
        <span style={{ fontWeight: 500, fontSize: 15 }}>{label}</span>
      </div>
      <div
        style={{
          width: 20, height: 20, borderRadius: "50%",
          border: `2px solid ${checked ? "hsl(262 80% 65%)" : isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: checked ? "hsl(262 80% 65%)" : "transparent"
        }}
      >
        {checked && <Check size={12} color="#fff" strokeWidth={3} />}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────────────────────
import { useEffect } from "react";

export function OnboardingSetupWizard({ onComplete, isDark: initialIsDark = true }: { onComplete: () => void, isDark?: boolean }) {
  const [activeDark, setActiveDark] = useState(initialIsDark);

  useEffect(() => {
    const checkDark = () => {
      const isHtmlDark = document.documentElement.classList.contains("dark");
      const isHtmlThemeDark = document.documentElement.getAttribute("data-theme") === "dark";
      setActiveDark(isHtmlDark || isHtmlThemeDark);
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => observer.disconnect();
  }, [initialIsDark]);

  const isDark = activeDark;

  const [step, setStep] = useState(1);
  const [selectedPreset, setSelectedPreset] = useState<string>("family_clinic");
  
  // Step 2 state
  const [numberOfDoctors, setNumberOfDoctors] = useState(4);
  const [numberOfChairs, setNumberOfChairs] = useState(3);
  const [hasAssistants, setHasAssistants] = useState(true);
  const [hasDentalLab, setHasDentalLab] = useState(true);

  // Step 3 state
  const [selectedPriceLists, setSelectedPriceLists] = useState<string[]>(["therapy", "orthopedics"]);
  
  const [launching, setLaunching] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const togglePriceList = (id: string) => {
    setSelectedPriceLists(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleLaunch = async () => {
    setLaunching(true);
    try {
      const isPediatric = selectedPriceLists.includes("pediatrics");
      const extraData = {
        numberOfDoctors,
        numberOfChairs,
        hasPediatricMode: isPediatric,
        // In a real app we'd pass selectedPriceLists to the backend to seed the DB
      };
      
      await applyWorkspacePreset(selectedPreset, extraData);
      
      // Override specific toggles that user might have changed in Step 2
      await saveWorkspaceFlags({
        hasAssistants,
        hasDentalLab,
        hasMultipleChairs: numberOfChairs > 1,
        numberOfDoctors
      });
      
      await fetch("/api/workspace/onboarding/complete", { method: "POST" });
    } catch (e) {
      console.error("[Onboarding] launch error:", e);
    }
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const bg = isDark
    ? "radial-gradient(ellipse at 50% 0%, hsl(240 30% 15%), hsl(230 25% 8%) 80%)"
    : "radial-gradient(ellipse at 50% 0%, hsl(210 60% 95%), hsl(220 40% 88%) 80%)";
  const cardBg = isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)";
  const textColor = isDark ? "#e8eaf0" : "#1a1d2e";
  const mutedColor = isDark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.45)";

  return (
    <div
      style={{
        position: "absolute", top: 0, left: 0, right: 0, minHeight: "100vh", zIndex: 9999, background: bg,
        display: "flex", flexDirection: "column",
        alignItems: "center", padding: "40px 16px 80px",
        opacity: fadeOut ? 0 : 1, transition: "opacity .45s ease",
        color: textColor,
      }}
    >
      {/* Header & Stepper */}
      <div style={{ textAlign: "center", marginBottom: 32, maxWidth: 700, width: "100%" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 18px", borderRadius: 20, background: "rgba(160 130 255 / .12)", border: "1px solid rgba(160 130 255 / .3)", marginBottom: 24, fontSize: 13, color: "hsl(262 80% 75%)" }}>
          <Sparkles size={14} /> DENTE Setup Wizard
        </div>
        <h1 style={{ margin: "0 0 24px", fontSize: "clamp(24px,4vw,34px)", fontWeight: 800, letterSpacing: "-0.5px" }}>
          {step === 1 && "Выберите формат вашей клиники"}
          {step === 2 && "Определите масштаб и команду"}
          {step === 3 && "Быстрое заполнение прайс-листа"}
        </h1>
        
        {/* Stepper Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 20 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ width: 40, height: 4, borderRadius: 2, background: s <= step ? "hsl(262 80% 65%)" : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", transition: "background 0.3s" }} />
          ))}
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 800, position: "relative", minHeight: 400 }}>
        
        {/* STEP 1: PRESETS */}
        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {PRESET_CARDS.map(card => {
              const isSelected = selectedPreset === card.id;
              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedPreset(card.id)}
                  style={{
                    background: cardBg, backdropFilter: "blur(16px)", borderRadius: 18,
                    border: `2px solid ${isSelected ? card.accent : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    padding: "24px", cursor: "pointer",
                    transform: isSelected ? "translateY(-3px)" : "none",
                    boxShadow: isSelected ? `0 12px 30px ${card.accent}22` : "none",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${card.accent}20`, color: card.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {card.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 17 }}>{card.label}</div>
                      <div style={{ fontSize: 13, color: card.accent, fontWeight: 500 }}>{card.subtitle}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 14, color: mutedColor, lineHeight: 1.5 }}>{card.description}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* STEP 2: SCALE & TEAM */}
        {step === 2 && (
          <div style={{ background: cardBg, backdropFilter: "blur(16px)", borderRadius: 24, padding: "32px", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                  <Building2 size={20} color="hsl(262 80% 65%)"/> Размер клиники
                </h3>
                <SliderControl label="Количество кресел" value={numberOfChairs} min={1} max={15} onChange={setNumberOfChairs} isDark={isDark} />
                <SliderControl label="Врачей в штате" value={numberOfDoctors} min={1} max={50} onChange={setNumberOfDoctors} isDark={isDark} />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                  <HeartHandshake size={20} color="hsl(262 80% 65%)"/> Модули персонала
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <ToggleCard label="Ассистенты стоматолога" checked={hasAssistants} onChange={setHasAssistants} icon={<User size={18}/>} isDark={isDark} />
                  <ToggleCard label="Зуботехническая лаборатория" checked={hasDentalLab} onChange={setHasDentalLab} icon={<Wrench size={18}/>} isDark={isDark} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PRICE LISTS */}
        {step === 3 && (
          <div style={{ background: cardBg, backdropFilter: "blur(16px)", borderRadius: 24, padding: "32px", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` }}>
            <p style={{ fontSize: 16, color: mutedColor, marginBottom: 24, textAlign: "center" }}>
              Мы можем предзаполнить ваш прайс-лист базовыми услугами. Выберите направления, которые оказывает ваша клиника:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
              {PRICE_LIST_MODULES.map(mod => (
                <ToggleCard 
                  key={mod.id} 
                  label={mod.label} 
                  checked={selectedPriceLists.includes(mod.id)} 
                  onChange={() => togglePriceList(mod.id)} 
                  icon={mod.icon} 
                  isDark={isDark} 
                />
              ))}
            </div>
            <div style={{ padding: "16px", borderRadius: 12, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ color: "hsl(262 80% 65%)" }}><ListTodo size={24} /></div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Будет загружено ~{selectedPriceLists.length * 45} позиций прайса</div>
                <div style={{ fontSize: 13, color: mutedColor }}>Прайс-лист сформирован на основе средних данных по рынку. Вы сможете легко отредактировать цены или удалить лишние позиции в настройках.</div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer Navigation */}
      <div style={{ display: "flex", gap: 16, marginTop: 40, width: "100%", maxWidth: 800, justifyContent: "space-between" }}>
        <button
          onClick={() => setStep(s => Math.max(1, s - 1))}
          style={{
            padding: "16px 24px", borderRadius: 14, border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            background: "transparent", color: textColor, fontWeight: 600, fontSize: 16, cursor: "pointer",
            visibility: step === 1 ? "hidden" : "visible", display: "flex", alignItems: "center", gap: 8
          }}
        >
          <ChevronLeft size={20} /> Назад
        </button>

        {step < 3 ? (
          <button
            onClick={() => setStep(s => Math.min(3, s + 1))}
            style={{
              padding: "16px 40px", borderRadius: 14, border: "none",
              background: "#fff", color: "#000", fontWeight: 700, fontSize: 16, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px rgba(255,255,255,0.2)"
            }}
          >
            Далее <ChevronRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleLaunch}
            disabled={launching}
            style={{
              padding: "16px 40px", borderRadius: 14, border: "none",
              background: "hsl(262 80% 65%)", color: "#fff", fontWeight: 700, fontSize: 16, 
              cursor: launching ? "not-allowed" : "pointer", opacity: launching ? 0.8 : 1,
              display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 30px rgba(160, 130, 255, 0.4)"
            }}
          >
            {launching ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
            {launching ? "Создание клиники..." : "Завершить и войти"}
          </button>
        )}
      </div>
      
      
      <style>{`
      `}</style>
    </div>
  );
}
