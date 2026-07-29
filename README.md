# 🦷 Clinic MVP & ShadowAnalyst AI — Intelligent Dental Automation Platform

![Dental CRM Banner](https://raw.githubusercontent.com/marko1olo/gigahrush/main/docs/dental_crm_banner.jpg)

> **Enterprise Clinic Automation MVP with AI-Powered X-Ray Diagnostics (ShadowAnalyst), Dental CRM, and Telegram Patient Communication Bot.**

---

### 🩺 System Architecture / Архитектура

```
┌──────────────────┐      ┌──────────────────┐      ┌────────────────────┐
│   React SPA      │ ───> │  NestJS API Gateway │ ───>│ PostgreSQL 18 DB   │
│ (Local DICOM 3D) │      │  (pg-pool & Drizzle)│      │ (Strict Isolation) │
└──────────────────┘      └──────────────────┘      └────────────────────┘
         │                          │                          │
         ▼                          ▼                          ▼
┌──────────────────┐      ┌──────────────────┐      ┌────────────────────┐
│ ShadowAnalyst AI │      │ Telegram Bot API │      │ Avito Lead Bridge  │
│ (X-Ray Vision)   │      │ (Patient Booking)│      │ (Auto Dispatcher)  │
└──────────────────┘      └──────────────────┘      └────────────────────┘
```

---

### 🌟 Key Modules

* 🩺 **ShadowAnalyst AI:** Automated X-Ray diagnostic analyzer detecting caries, periodontitis, and bone loss.
* 📅 **Smart Dental CRM:** Interactive patient schedule, treatment plans, financial ledgers, and tooth matrix cards.
* 💬 **Automated Patient Bot:** Telegram & WhatsApp integration for appointment reminders and automated intake.

---

### 📜 License
Protected under **DENTE Enterprise Proprietary & Source-Available Commercial License (Adolf Petushkov)**.
