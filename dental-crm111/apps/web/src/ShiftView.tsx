// @ts-nocheck
﻿import {
  AlertTriangle,
  Building2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  CreditCard,
  FileText,
  History,
  ImageIcon,
  MessageSquare,
  Phone,
  UserCheck,
  Gauge,
  Calendar,
  Info
} from "lucide-react";
import { useState, useMemo } from "react";
import { formatShortDate, money, minutesLabel, patientInsightRiskLabels } from "./AppHelpers";
import { generateDentalInvoiceHtml } from "./utils/pdfGenerator";
import { unifiedPdfGenerator } from "./utils/unifiedPdfGenerator";
import { formatTime } from "./utils/dateFormatter";
import { HotkeyTooltip } from "./components/onboarding/HotkeyTooltip";
import { workloadStateLabels } from "./workspaceUiLabels";
import { ActionIcon } from "./workspaceShell";

export function ShiftView({
  activePatient,
  activePatientHasCallablePhone,
  activePatientCallablePhone,
  visibleRecommendedActions,
  recommendedActionPriorityLabels,
  staffRoleLabels,
  selectedWorkspaceRole,
  activeRoleQueue,
  activeRolePolicy,
  activeRoleWritableSections,
  viewLabels,
  activeRoleRestrictedSections,
  dashboard,
  activeQueueRole,
  shiftWarnings,
  warningSeverityLabels,
  openScheduleWarning,
  setError,
  mostLoadedResource,
  setSelectedPatientId,
  activeDoctor
}: any) {
  const doctorTodayAppointments = useMemo(() => {
    if (!dashboard || !dashboard.appointments || !activeDoctor) return [];
    return dashboard.appointments
      .filter((app: any) => app.doctorUserId === activeDoctor.id)
      .sort((a: any, b: any) => a.startsAt.localeCompare(b.startsAt));
  }, [dashboard, activeDoctor]);

  const [showDetails, setShowDetails] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showOtherQueues, setShowOtherQueues] = useState(false);
  return (
    <>

        <section className="shift-hero" id="shift">
<<<<<<< HEAD
            <div className="now-card">
              <p className="eyebrow">РЎРµР№С‡Р°СЃ РІ СЂР°Р±РѕС‚Рµ</p>
=======
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="now-card">
              <p className="eyebrow">Сейчас в работе</p>
>>>>>>> gitlab/main
              {activePatient ? (
                <>
                  <div className="patient-hero">
                    <div className="avatar">{activePatient.fullName.slice(0, 1)}</div>
                    <div>
                      <h2>{activePatient.fullName}</h2>
<<<<<<< HEAD
                      <p>{activePatient.phone ?? "С‚РµР»РµС„РѕРЅ РЅРµ СѓРєР°Р·Р°РЅ"}</p>
                    </div>
                  </div>
                  <div className="hero-actions">
                    <HotkeyTooltip hotkey="Alt + N" description="Р‘С‹СЃС‚СЂС‹Р№ СЃС‚Р°СЂС‚ РїСЂРёРµРјР°">
                      <button className="primary-button" type="button" onClick={() => { window.location.hash = "visit"; }}>
                        <ClipboardCheck aria-hidden="true" /> РќР°С‡Р°С‚СЊ РїСЂРёРµРј
                      </button>
                    </HotkeyTooltip>
                    <HotkeyTooltip hotkey="Alt + I" description="РџРµСЂРµР№С‚Рё Рє СЃРЅРёРјРєР°Рј РїР°С†РёРµРЅС‚Р°">
                      <button className="secondary-button" type="button" onClick={() => { window.location.hash = "imaging"; }}>
                        <ImageIcon aria-hidden="true" /> РЎРЅРёРјРєРё
                      </button>
                    </HotkeyTooltip>
                    <HotkeyTooltip hotkey="Ctrl + P" description="РЎС„РѕСЂРјРёСЂРѕРІР°С‚СЊ СЃРјРµС‚Сѓ (PDF)">
                      <button className="secondary-button" type="button" onClick={() => {
                        unifiedPdfGenerator.generateFinancialEstimate({
                          patientName: activePatient.name,
                          date: new Date().toLocaleDateString("ru-RU"),
                          items: [
                            { name: "РљРѕРЅСЃСѓР»СЊС‚Р°С†РёСЏ", quantity: 1, price: 1500, total: 1500 },
                            { name: "РљР›РљРў", quantity: 1, price: 3000, total: 3000 },
                            { name: "РРјРїР»Р°РЅС‚Р°С†РёСЏ (1 СЌС‚Р°Рї)", quantity: 1, price: 45000, total: 45000 }
                          ],
                          totalAmount: 49500,
                          discount: 0,
                          finalAmount: 49500
                        });
                      }}>
                        <ClipboardCheck aria-hidden="true" /> РЎРјРµС‚Р° (PDF)
                      </button>
                    </HotkeyTooltip>
=======
                      <p>{activePatient.phone ?? "телефон не указан"}</p>
                    </div>
                  </div>
                  <div className="hero-actions">
                    <button className="primary-button" type="button" onClick={() => { window.location.hash = "visit"; }}>
                      <ClipboardCheck aria-hidden="true" /> Открыть прием
                    </button>
                    <button className="secondary-button" type="button" onClick={() => { window.location.hash = "imaging"; }}>
                      <ImageIcon aria-hidden="true" /> Снимки
                    </button>
>>>>>>> gitlab/main
                    <button
                      className="secondary-button"
                      type="button"
                      aria-describedby={!activePatientHasCallablePhone ? "shift-call-guidance" : undefined}
<<<<<<< HEAD
                      aria-disabled={!activePatientHasCallablePhone}
                      title={activePatientHasCallablePhone ? "РџРѕР·РІРѕРЅРёС‚СЊ РїР°С†РёРµРЅС‚Сѓ" : "Р’ РєР°СЂС‚РѕС‡РєРµ РїР°С†РёРµРЅС‚Р° РЅРµС‚ С‚РµР»РµС„РѕРЅР°"}
                      style={{ opacity: !activePatientHasCallablePhone ? 0.6 : 1 }}
                      onClick={() => {
                        if (!activePatientHasCallablePhone) {
                          setError("Р’ РєР°СЂС‚РѕС‡РєРµ РїР°С†РёРµРЅС‚Р° РЅРµС‚ С‚РµР»РµС„РѕРЅР°. Р”РѕР±Р°РІСЊС‚Рµ РЅРѕРјРµСЂ РІ СЂР°Р·РґРµР»Рµ В«РџР°С†РёРµРЅС‚С‹В», С‡С‚РѕР±С‹ РїРѕР·РІРѕРЅРёС‚СЊ.");
=======
                      disabled={!activePatientHasCallablePhone}
                      title={activePatientHasCallablePhone ? "Позвонить пациенту" : "В карточке пациента нет телефона"}
                      onClick={() => {
                        if (!activePatientHasCallablePhone) {
                          setError("В карточке пациента нет телефона. Добавьте номер в разделе «Пациенты», чтобы позвонить.");
>>>>>>> gitlab/main
                          return;
                        }
                        window.location.href = `tel:${activePatientCallablePhone}`;
                      }}
                    >
<<<<<<< HEAD
                      <Phone aria-hidden="true" /> РџРѕР·РІРѕРЅРёС‚СЊ
                    </button>
                  </div>
                  
                  {/* Compact Status Tracker */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px', background: 'var(--slate-50)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--slate-200)', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-500)' }}>РЎС‚Р°С‚СѓСЃ:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                      <span style={{ color: 'var(--teal)', fontWeight: 600 }}>1. Р—Р°РїРёСЃСЊ</span>
                      <span style={{ color: 'var(--slate-300)' }}>в†’</span>
                      <span style={{ color: dashboard.activeVisit ? 'var(--teal)' : 'var(--slate-400)', fontWeight: dashboard.activeVisit ? 600 : 400 }}>2. Р­РњРљ</span>
                      <span style={{ color: 'var(--slate-300)' }}>в†’</span>
                      <span style={{ color: 'var(--slate-400)' }}>3. РћРїР»Р°С‚Р°</span>
                    </div>
                  </div>
=======
                      <Phone aria-hidden="true" /> Позвонить
                    </button>
                  </div>
                  {!activePatientHasCallablePhone ? (
                    <p className="hero-call-guidance" id="shift-call-guidance" role="status" aria-live="polite">
                      В карточке пациента нет телефона. Откройте «Пациенты» и добавьте номер, чтобы кнопка звонка стала активной.
                    </p>
                  ) : null}
                </>
              ) : (
                <div style={{ padding: "20px 0", color: "#6b7280", fontSize: "15px" }}>
                  Нет активного приема. Выберите пациента или запланируйте запись в расписании.
                </div>
              )}
            </div>

            {/* РАСПИСАНИЕ НА СЕГОДНЯ */}
            <div className="today-schedule-box" style={{ background: "var(--paper-strong)", border: "1px solid var(--line)", borderRadius: "8px", boxShadow: "var(--shadow)", padding: "18px" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "700", color: "var(--slate-800)", display: "flex", alignItems: "center", gap: "8px" }}>
                <ClipboardCheck size={16} color="var(--teal)" /> Расписание приемов на сегодня
              </h3>
              {doctorTodayAppointments.length > 0 ? (
                <div className="today-schedule-list" style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "280px", overflowY: "auto", paddingRight: "4px" }}>
                  {doctorTodayAppointments.map((app: any) => {
                    const patient = dashboard.patients.find((p: any) => p.id === app.patientId);
                    const isCurrent = activePatient && activePatient.id === app.patientId;
                    
                    const timeStart = new Date(app.startsAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
                    const timeEnd = new Date(app.endsAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

                    const statusLabels: Record<string, string> = {
                      planned: "запланирован",
                      confirmed: "подтвержден",
                      arrived: "ожидает",
                      in_treatment: "на приеме",
                      completed: "завершен",
                      cancelled: "отменен",
                      no_show: "не пришел"
                    };

                    return (
                      <div 
                        key={app.id} 
                        className={`today-schedule-item status-${app.status} ${isCurrent ? "current-active" : ""}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          border: isCurrent ? "2px solid var(--teal)" : "1px solid var(--line)",
                          borderRadius: "8px",
                          background: isCurrent ? "rgba(13, 148, 136, 0.05)" : "var(--paper-light)",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                        onClick={() => {
                          if (patient) {
                            setSelectedPatientId(patient.id);
                            window.location.hash = "visit";
                          }
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 }}>
                          <span style={{ fontSize: "11px", fontWeight: "800", color: "var(--slate-500)" }}>
                            {timeStart} – {timeEnd}
                          </span>
                          <strong style={{ fontSize: "13px", color: "var(--slate-800)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {patient ? patient.fullName : "Неизвестный пациент"}
                          </strong>
                          <span style={{ fontSize: "11px", color: "var(--slate-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {app.reason || "плановый осмотр"}
                          </span>
                        </div>
                        <span className={`visit-document-badge status-${app.status === "in_treatment" || app.status === "completed" || app.status === "confirmed" ? "signed" : "draft"}`} style={{ fontSize: "9px", fontWeight: "800", textTransform: "uppercase", padding: "2px 6px", borderRadius: "4px", whiteSpace: "nowrap" }}>
                          {statusLabels[app.status] || app.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ fontSize: "12px", color: "var(--slate-500)", margin: 0 }}>
                  Сегодня у вас нет запланированных приемов.
                </p>
              )}
            </div>
          </div>
>>>>>>> gitlab/main

                  {!activePatientHasCallablePhone ? (
                    <p className="hero-call-guidance" id="shift-call-guidance" role="status" aria-live="polite" style={{ marginTop: '12px' }}>
                      Р’ РєР°СЂС‚РѕС‡РєРµ РїР°С†РёРµРЅС‚Р° РЅРµС‚ С‚РµР»РµС„РѕРЅР°. РћС‚РєСЂРѕР№С‚Рµ В«РџР°С†РёРµРЅС‚С‹В» Рё РґРѕР±Р°РІСЊС‚Рµ РЅРѕРјРµСЂ, С‡С‚РѕР±С‹ РєРЅРѕРїРєР° Р·РІРѕРЅРєР° СЃС‚Р°Р»Р° Р°РєС‚РёРІРЅРѕР№.
                    </p>
                  ) : null}
                </>
              ) : (
                <div style={{ padding: "20px 0", color: "#6b7280", fontSize: "15px" }}>
                  РќРµС‚ Р°РєС‚РёРІРЅРѕРіРѕ РїСЂРёРµРјР°. Р’С‹Р±РµСЂРёС‚Рµ РїР°С†РёРµРЅС‚Р° РёР»Рё Р·Р°РїР»Р°РЅРёСЂСѓР№С‚Рµ Р·Р°РїРёСЃСЊ РІ СЂР°СЃРїРёСЃР°РЅРёРё.
                </div>
              )}
            </div>

            {/* Р РђРЎРџРРЎРђРќРР• РќРђ РЎР•Р“РћР”РќРЇ */}
            <div className="today-schedule-box">
              <h3>
                <ClipboardCheck size={16} color="var(--teal)" /> Р Р°СЃРїРёСЃР°РЅРёРµ РїСЂРёРµРјРѕРІ РЅР° СЃРµРіРѕРґРЅСЏ
              </h3>
              {doctorTodayAppointments.length > 0 ? (
                <div className="today-schedule-list" style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "280px", overflowY: "auto", paddingRight: "4px" }}>
                  {doctorTodayAppointments.map((app: any) => {
                    const patient = dashboard.patients.find((p: any) => p.id === app.patientId);
                    const isCurrent = activePatient && activePatient.id === app.patientId;
                    
                    const timeStart = new Date(app.startsAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
                    const timeEnd = new Date(app.endsAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

<<<<<<< HEAD
                    const statusLabels: Record<string, string> = {
                      planned: "Р·Р°РїР»Р°РЅРёСЂРѕРІР°РЅ",
                      confirmed: "РїРѕРґС‚РІРµСЂР¶РґРµРЅ",
                      arrived: "РѕР¶РёРґР°РµС‚",
                      in_treatment: "РЅР° РїСЂРёРµРјРµ",
                      completed: "Р·Р°РІРµСЂС€РµРЅ",
                      cancelled: "РѕС‚РјРµРЅРµРЅ",
                      no_show: "РЅРµ РїСЂРёС€РµР»"
                    };

                    return (
                      <div 
                        key={app.id} 
                        className={`today-schedule-item ${isCurrent ? "current-active" : ""}`}
                        style={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          alignItems: "flex-start", 
                          padding: "12px", 
                          background: isCurrent ? "var(--teal-50, #f0fdfa)" : "var(--white, #fff)", 
                          border: isCurrent ? "1px solid var(--teal-200, #99f6e4)" : "1px solid var(--slate-200, #e2e8f0)", 
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                        onClick={() => {
                          if (patient) {
                            setSelectedPatientId(patient.id);
                            window.location.hash = "visit";
                          }
                        }}
                      >
                        <div className="today-schedule-item-info" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span className="today-schedule-time" style={{ fontSize: "12px", fontWeight: 600, color: "var(--slate-500, #64748b)" }}>
                            {timeStart} вЂ“ {timeEnd}
                          </span>
                          <strong className="today-schedule-name" style={{ fontSize: "14px", color: "var(--slate-900, #0f172a)" }}>
                            {patient ? patient.fullName : "РќРµРёР·РІРµСЃС‚РЅС‹Р№ РїР°С†РёРµРЅС‚"}
                          </strong>
                          <span className="today-schedule-reason" style={{ fontSize: "13px", color: "var(--slate-600, #475569)" }}>
                            {app.reason || "РїР»Р°РЅРѕРІС‹Р№ РѕСЃРјРѕС‚СЂ"}
                          </span>
                        </div>
                        <span style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          background: app.status === "in_treatment" ? "#dcfce7" : app.status === "planned" ? "#f1f5f9" : "#fef3c7",
                          color: app.status === "in_treatment" ? "#166534" : app.status === "planned" ? "#475569" : "#b45309"
                        }}>
                          {statusLabels[app.status] || app.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="today-schedule-empty">
                  РЎРµРіРѕРґРЅСЏ Сѓ РІР°СЃ РЅРµС‚ Р·Р°РїР»Р°РЅРёСЂРѕРІР°РЅРЅС‹С… РїСЂРёРµРјРѕРІ.
                </p>
              )}
            </div>
        </section>

        {/* Removed care path tracker */}

        <div className="shift-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginTop: '16px' }}>
          <>
            <section className="role-focus-strip" aria-label="Р¤РѕРєСѓСЃ С‚РµРєСѓС‰РµР№ СЂРѕР»Рё">
              <div>
                <UserCheck aria-hidden="true" />
                <div>
                  <p className="eyebrow">Р¤РѕРєСѓСЃ: {staffRoleLabels[selectedWorkspaceRole]}</p>
                  <h2>{activeRoleQueue?.title ?? activeRolePolicy?.title ?? "Р Р°Р±РѕС‡Р°СЏ РѕС‡РµСЂРµРґСЊ"}</h2>
                  <p>{activeRoleQueue?.nextAction ?? activeRolePolicy?.requiresApprovalFor[0] ?? "РћС‚РєСЂС‹С‚СЊ СЃРјРµРЅСѓ Рё РїСЂРѕРІРµСЂРёС‚СЊ РѕС‡РµСЂРµРґСЊ"}</p>
                </div>
              </div>
              <div className="role-focus-meta flex flex-wrap gap-2 justify-start mt-2" aria-label="Р”РѕСЃС‚СѓРїС‹ С‚РµРєСѓС‰РµР№ СЂРѕР»Рё">
                <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-bold border border-slate-200">{activeRoleQueue?.openItems ?? 0} РѕС‚РєСЂС‹С‚Рѕ</span>
                {activeRolePolicy ? <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-bold border border-slate-200">РЎС‚Р°СЂС‚: {viewLabels[activeRolePolicy.defaultSection]}</span> : null}
                {activeRoleWritableSections.slice(0, 3).map((section: any) => (
                  <span key={section} className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-bold border border-slate-200">РїРёС€РµС‚: {viewLabels[section]}</span>
                ))}
                {activeRoleRestrictedSections[0] ? <span className="bg-rose-50 text-rose-700 px-2 py-1 rounded-full text-xs font-bold border border-rose-200">РѕРіСЂР°РЅРёС‡РµРЅРѕ: {viewLabels[activeRoleRestrictedSections[0]]}</span> : null}
              </div>
            </section>

            <section className="shift-intelligence" aria-label="РћРїРµСЂР°С†РёРѕРЅРЅС‹Р№ РєРѕРЅС‚СЂРѕР»СЊ СЃРјРµРЅС‹">
=======
        <div className="shift-details-toggle">
          <button
            className="text-button shift-details-btn"
            type="button"
            aria-expanded={showDetails}
            onClick={() => setShowDetails((v) => !v)}
          >
            {showDetails ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
            {showDetails ? "Скрыть детали смены" : "Показать детали смены"}
          </button>
        </div>

        {showDetails && (
          <>
            <section className="role-focus-strip" aria-label="Фокус текущей роли">
              <div>
                <UserCheck aria-hidden="true" />
                <div>
                  <p className="eyebrow">Фокус: {staffRoleLabels[selectedWorkspaceRole]}</p>
                  <h2>{activeRoleQueue?.title ?? activeRolePolicy?.title ?? "Рабочая очередь"}</h2>
                  <p>{activeRoleQueue?.nextAction ?? activeRolePolicy?.requiresApprovalFor[0] ?? "Открыть смену и проверить очередь"}</p>
                </div>
              </div>
              <div className="role-focus-meta" aria-label="Доступы текущей роли">
                <span>{activeRoleQueue?.openItems ?? 0} открыто</span>
                {activeRolePolicy ? <span>Старт: {viewLabels[activeRolePolicy.defaultSection]}</span> : null}
                {activeRoleWritableSections.slice(0, 3).map((section: any) => (
                  <span key={section}>пишет: {viewLabels[section]}</span>
                ))}
                {activeRoleRestrictedSections[0] ? <span>ограничено: {viewLabels[activeRoleRestrictedSections[0]]}</span> : null}
              </div>
            </section>

            <section className="shift-intelligence" aria-label="Операционный контроль смены">
>>>>>>> gitlab/main
              <div className="analytics-toggle-container" style={{ gridColumn: "1 / -1" }}>
                <button
                  className="secondary-button"
                  type="button"
                  aria-expanded={showAnalytics}
                  onClick={() => setShowAnalytics((v) => !v)}
                  style={{ minHeight: "30px", padding: "0 12px", fontSize: "12px" }}
                >
<<<<<<< HEAD
                  {showAnalytics ? "РЎРєСЂС‹С‚СЊ Р°РЅР°Р»РёС‚РёРєСѓ" : "РџРѕРєР°Р·Р°С‚СЊ Р°РЅР°Р»РёС‚РёРєСѓ"}
=======
                  {showAnalytics ? "Скрыть аналитику" : "Показать аналитику"}
>>>>>>> gitlab/main
                </button>
              </div>

              {showAnalytics && (
                <>
                  <article className="mode-fit-card">
                    <div className="mode-fit-head">
                      <Building2 aria-hidden="true" />
                      <div>
<<<<<<< HEAD
                        <p className="eyebrow">Р РµР¶РёРј РєР»РёРЅРёРєРё</p>
=======
                        <p className="eyebrow">Режим клиники</p>
>>>>>>> gitlab/main
                        <h2>{dashboard.shiftIntelligence.modeFit.title}</h2>
                      </div>
                      <strong>{dashboard.shiftIntelligence.modeFit.fitScore}%</strong>
                    </div>
                    <p>{dashboard.shiftIntelligence.modeFit.lowFrictionNextStep}</p>
                    <div className="mode-fit-list">
                      {(dashboard.shiftIntelligence.modeFit.blockers.length
                        ? dashboard.shiftIntelligence.modeFit.blockers
                        : dashboard.shiftIntelligence.modeFit.upgrades
                      ).map((item: any) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </article>

                  <article className="mode-fit-card resource-focus-card">
                    <div className="mode-fit-head">
                      <Gauge aria-hidden="true" />
                      <div>
<<<<<<< HEAD
                        <p className="eyebrow">Р—Р°РіСЂСѓР·РєР°</p>
                        <h2>{mostLoadedResource?.title ?? "РќРµС‚ СЂРµСЃСѓСЂСЃРѕРІ"}</h2>
=======
                        <p className="eyebrow">Загрузка</p>
                        <h2>{mostLoadedResource?.title ?? "Нет ресурсов"}</h2>
>>>>>>> gitlab/main
                      </div>
                      <strong>{mostLoadedResource ? `${mostLoadedResource.utilizationPercent}%` : "0%"}</strong>
                    </div>
                    {mostLoadedResource ? (
                      <>
                        <p>
<<<<<<< HEAD
                          {minutesLabel(mostLoadedResource.bookedMinutes)} В· {mostLoadedResource.appointmentCount} Р·Р°РїРёСЃРµР№ В·{" "}
                          {workloadStateLabels[mostLoadedResource.state as keyof typeof workloadStateLabels]}
                        </p>
                        <div className="load-meter" aria-label={`Р—Р°РіСЂСѓР·РєР° ${mostLoadedResource.utilizationPercent}%`}>
=======
                          {minutesLabel(mostLoadedResource.bookedMinutes)} · {mostLoadedResource.appointmentCount} записей ·{" "}
                          {workloadStateLabels[mostLoadedResource.state as keyof typeof workloadStateLabels]}
                        </p>
                        <div className="load-meter" aria-label={`Загрузка ${mostLoadedResource.utilizationPercent}%`}>
>>>>>>> gitlab/main
                          <span style={{ width: `${Math.min(100, mostLoadedResource.utilizationPercent)}%` }} />
                        </div>
                        <div className="mode-fit-list">
                          {mostLoadedResource.flags.slice(0, 3).map((flag: any) => (
                            <span key={flag}>{flag}</span>
                          ))}
                        </div>
                      </>
                    ) : (
<<<<<<< HEAD
                      <p>Р’СЂР°С‡РµР№ Рё РєСЂРµСЃРµР» РїРѕРєР° РЅРµС‚ РІ РЅР°СЃС‚СЂРѕР№РєР°С….</p>
=======
                      <p>Врачей и кресел пока нет в настройках.</p>
>>>>>>> gitlab/main
                    )}
                  </article>
                </>
              )}

<<<<<<< HEAD
              {dashboard.shiftIntelligence.roleQueues.length > 0 ? (
                <>
                  <div className="role-queue-header-row">
                    <h3>Р—Р°РґР°С‡Рё РїРѕ СЂРѕР»СЏРј</h3>
                    {dashboard.shiftIntelligence.roleQueues.length > 1 && (
                      <button
                        className="text-button toggle-queues-btn"
                        type="button"
                        onClick={() => setShowOtherQueues((v) => !v)}
                      >
                        {showOtherQueues ? "РЎРєСЂС‹С‚СЊ РґСЂСѓРіРёРµ СЂРѕР»Рё" : "РџРѕРєР°Р·Р°С‚СЊ РґСЂСѓРіРёРµ СЂРѕР»Рё"}
                      </button>
                    )}
                  </div>

                  <div className="role-queue-grid">
                    {dashboard.shiftIntelligence.roleQueues
                      .filter((q: any) => q.role === activeQueueRole || showOtherQueues)
                      .map((queue: any) => (
                        <article className={`role-queue-card ${queue.role === activeQueueRole ? "active" : ""}`} key={queue.role}>
                          <div>
                            <UserCheck aria-hidden="true" />
                            <span>{staffRoleLabels[queue.role]}</span>
                          </div>
                          <h3>{queue.title}</h3>
                          <p>{queue.nextAction}</p>
                          <strong>{queue.openItems}</strong>
                          <small>{queue.blockedBy[0] ?? queue.automationHint}</small>
                        </article>
                      ))}
                  </div>
                </>
              ) : null}

              {/* Removed shift warning list */}
            </section>
          </>
        </div>
=======
              <div className="role-queue-header-row">
                <h3>Задачи по ролям</h3>
                {dashboard.shiftIntelligence.roleQueues.length > 1 && (
                  <button
                    className="text-button toggle-queues-btn"
                    type="button"
                    onClick={() => setShowOtherQueues((v) => !v)}
                  >
                    {showOtherQueues ? "Скрыть другие роли" : "Показать другие роли"}
                  </button>
                )}
              </div>

              <div className="role-queue-grid">
                {dashboard.shiftIntelligence.roleQueues
                  .filter((q: any) => q.role === activeQueueRole || showOtherQueues)
                  .map((queue: any) => (
                    <article className={`role-queue-card ${queue.role === activeQueueRole ? "active" : ""}`} key={queue.role}>
                      <div>
                        <UserCheck aria-hidden="true" />
                        <span>{staffRoleLabels[queue.role]}</span>
                      </div>
                      <h3>{queue.title}</h3>
                      <p>{queue.nextAction}</p>
                      <strong>{queue.openItems}</strong>
                      <small>{queue.blockedBy[0] ?? queue.automationHint}</small>
                    </article>
                  ))}
              </div>

              <div className="shift-warning-list">
                {shiftWarnings.slice(0, 4).map((warning: any) => (
                  <article className={`shift-warning warning-${warning.severity}`} key={warning.id}>
                    <AlertTriangle aria-hidden="true" />
                    <div>
                      <span>{warningSeverityLabels[warning.severity]} · {staffRoleLabels[warning.ownerRole]}</span>
                      <h3>{warning.title}</h3>
                      <p>{warning.detail}</p>
                    </div>
                    <button className="text-button" type="button" onClick={() => openScheduleWarning(warning)}>
                      {warning.actionLabel}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
>>>>>>> gitlab/main
    </>
  );
}

export function PatientCockpit({
  activePatient,
  activePatientInsight,
  dashboard,
  activeCommunicationTasks,
  activeImagingStudies,
  activeUsableDocuments
}: any) {
  if (!activePatient) {
    return (
<<<<<<< HEAD
      <section className="patient-cockpit" aria-label="РљР°СЂС‚РѕС‡РєР° РїР°С†РёРµРЅС‚Р°">
        <div className="patient-summary-card">
          <p className="eyebrow">РљР°СЂС‚РѕС‡РєР° РїР°С†РёРµРЅС‚Р°</p>
          <h2>РџР°С†РёРµРЅС‚ РЅРµ РІС‹Р±СЂР°РЅ</h2>
          <div className="patient-facts">
            <span>Р’С‹Р±РµСЂРёС‚Рµ РїР°С†РёРµРЅС‚Р° РІ СЃРїРёСЃРєРµ РёР»Рё СЂР°СЃРїРёСЃР°РЅРёРё, С‡С‚РѕР±С‹ СѓРІРёРґРµС‚СЊ РµРіРѕ РґР°РЅРЅС‹Рµ.</span>
=======
      <section className="patient-cockpit" aria-label="Карточка пациента">
        <div className="patient-summary-card">
          <p className="eyebrow">Карточка пациента</p>
          <h2>Пациент не выбран</h2>
          <div className="patient-facts">
            <span>Выберите пациента в списке или расписании, чтобы увидеть его данные.</span>
>>>>>>> gitlab/main
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
        <section className="patient-cockpit" aria-label="РљР°СЂС‚РѕС‡РєР° РїР°С†РёРµРЅС‚Р°">
          <div className="patient-summary-card">
            <p className="eyebrow">РљР°СЂС‚РѕС‡РєР° РїР°С†РёРµРЅС‚Р°</p>
            <h2>{activePatient.fullName}</h2>
            <div className="patient-info-list" style={{ display: "flex", flexDirection: "column", gap: "12px", border: "none", background: "transparent" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "14px" }}>
                <Calendar size={16} />
                <span>Р”Р°С‚Р° СЂРѕР¶РґРµРЅРёСЏ: <strong style={{ color: "var(--text-primary)" }}>{activePatient.birthDate ?? "РЅРµ СѓРєР°Р·Р°РЅР°"}</strong></span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "14px" }}>
                <Phone size={16} />
                <span>РўРµР»РµС„РѕРЅ: <strong style={{ color: "var(--text-primary)" }}>{activePatient.phone ?? "РЅРµ СѓРєР°Р·Р°РЅ"}</strong></span>
              </div>
              {activePatient.notes && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", color: "var(--text-secondary)", fontSize: "14px" }}>
                  <Info size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>Р—Р°РјРµС‚РєРё: <strong style={{ color: "var(--text-primary)" }}>{activePatient.notes}</strong></span>
                </div>
              )}
            </div>
            {activePatientInsight ? (
              <div className={`patient-insight-panel risk-${activePatientInsight.riskLevel}`} style={{ padding: '12px', borderRadius: '8px', background: activePatientInsight.riskLevel === 'high' ? '#fee2e2' : activePatientInsight.riskLevel === 'medium' ? '#fef3c7' : '#f1f5f9', border: '1px solid ' + (activePatientInsight.riskLevel === 'high' ? '#f87171' : activePatientInsight.riskLevel === 'medium' ? '#fbbf24' : '#e2e8f0') }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: activePatientInsight.riskLevel === 'high' ? '#b91c1c' : activePatientInsight.riskLevel === 'medium' ? '#b45309' : '#475569' }}>
                    {patientInsightRiskLabels[activePatientInsight.riskLevel as keyof typeof patientInsightRiskLabels]}
                  </span>
                  <strong style={{ fontSize: '13px', color: '#1e293b' }}>{activePatientInsight.nextBestAction}</strong>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '12px', fontWeight: 500 }}>
                  {activePatientInsight.balanceDueRub ? <span style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', color: '#0f172a' }}>рџ’° Р”РѕР»Рі {money(activePatientInsight.balanceDueRub)}</span> : null}
                  {activePatientInsight.openTasks > 0 ? <span style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', color: '#0f172a' }}>рџ“ћ Р—Р°РґР°С‡: {activePatientInsight.openTasks}</span> : null}
                  {activePatientInsight.missingDocumentKinds.length > 0 ? <span style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', color: '#0f172a' }}>рџ“„ РќРµС‚ РґРѕРє-С‚РѕРІ: {activePatientInsight.missingDocumentKinds.length}</span> : null}
                  {activePatientInsight.recallDueAt ? <span style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', color: '#0f172a' }}>РїРѕРІС‚РѕСЂРЅС‹Р№ РІРёР·РёС‚ {formatShortDate(activePatientInsight.recallDueAt)}</span> : null}
                </div>
              </div>
            ) : null}
          </div>
          <div className="patient-feature-grid">
            <article className="clickable-card" onClick={() => { window.location.hash = "visit"; }} style={{ cursor: "pointer" }}>
              <History aria-hidden="true" />
              <div>
<<<<<<< HEAD
                <h3>Р­РњРљ / РСЃС‚РѕСЂРёСЏ</h3>
                <p className="tile-meta">РџСЂРёС‘РјС‹ В· РґРёР°РіРЅРѕР·С‹ В· Р·СѓР±РЅР°СЏ РєР°СЂС‚Р°</p>
=======
                <h3>История (ЭМК)</h3>
                <p>Приемы, диагнозы, зубная карта, файлы и решения врача в одном месте. Нажмите, чтобы открыть прием.</p>
>>>>>>> gitlab/main
              </div>
            </article>
            <article className="clickable-card" onClick={() => { window.location.hash = "documents"; }} style={{ cursor: "pointer" }}>
              <FileText aria-hidden="true" />
              <div>
<<<<<<< HEAD
                <h3>Р”РѕРєСѓРјРµРЅС‚С‹</h3>
                <p className="tile-meta">{activeUsableDocuments.length > 0 ? `${activeUsableDocuments.length} С€С‚.` : "РЅРµС‚"} РїРѕ РІРёР·РёС‚Сѓ</p>
=======
                <h3>Документы</h3>
                <p>{activeUsableDocuments.length} документа по текущему лечению, включая договор и акт. Нажмите, чтобы открыть.</p>
>>>>>>> gitlab/main
              </div>
            </article>
            <article className="clickable-card" onClick={() => { window.location.hash = "finance"; }} style={{ cursor: "pointer" }}>
              <CreditCard aria-hidden="true" />
              <div>
<<<<<<< HEAD
                <h3>РћРїР»Р°С‚С‹</h3>
                <p className="tile-meta">{money(dashboard.billingSummary.totalPaidRub)} В· РґРѕР»Рі {money(dashboard.billingSummary.totalDueRub)}</p>
=======
                <h3>Оплаты</h3>
                <p>
                  Оплачено {money(dashboard.billingSummary.totalPaidRub)}, остаток {money(dashboard.billingSummary.totalDueRub)}. Нажмите, чтобы перейти.
                </p>
>>>>>>> gitlab/main
              </div>
            </article>
            <article className="clickable-card" onClick={() => { window.location.hash = "communications"; }} style={{ cursor: "pointer" }}>
              <MessageSquare aria-hidden="true" />
              <div>
<<<<<<< HEAD
                <h3>РЎРІСЏР·СЊ</h3>
                <p className="tile-meta">{activeCommunicationTasks.length > 0 ? `${activeCommunicationTasks.length} Р·Р°РґР°С‡` : "Р·Р°РґР°С‡ РЅРµС‚"}</p>
=======
                <h3>Связь</h3>
                <p>{activeCommunicationTasks.length} задач: подтверждения, долги, инструкции и повторные визиты. Нажмите для перехода.</p>
>>>>>>> gitlab/main
              </div>
            </article>
            <article className="clickable-card" onClick={() => { window.location.hash = "imaging"; }} style={{ cursor: "pointer" }}>
              <ImageIcon aria-hidden="true" />
              <div>
<<<<<<< HEAD
                <h3>РЎРЅРёРјРєРё</h3>
                <p className="tile-meta">{activeImagingStudies.length > 0 ? `${activeImagingStudies.length} СЃРЅРёРјРєР°` : "СЃРЅРёРјРєРѕРІ РЅРµС‚"}</p>
=======
                <h3>Снимки</h3>
                <p>{activeImagingStudies.length} снимка: прицельные, ОПТГ, ТРГ, КТ и фото. Нажмите для просмотра.</p>
>>>>>>> gitlab/main
              </div>
            </article>
          </div>
        </section>
    </>
  );
}
