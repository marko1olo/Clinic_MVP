<div align="center">

<img src="https://raw.githubusercontent.com/marko1olo/gigahrush/main/docs/dental_crm_banner.jpg" width="100%" alt="Clinic MVP Banner"/>

# 🦷 Clinic MVP — Intelligent Dental Automation Platform

[![NestJS](https://img.shields.io/badge/NestJS-API-red?style=for-the-badge&logo=nestjs)]()
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-blue?style=for-the-badge&logo=postgresql)]()
[![AI](https://img.shields.io/badge/AI-ShadowAnalyst%20X--Ray-00ff88?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-Commercial%20Proprietary-orange?style=for-the-badge)](LICENSE.md)
[![Stars](https://img.shields.io/github/stars/marko1olo/Clinic_MVP?style=for-the-badge&color=gold)]()

> **Enterprise dental clinic automation — AI X-Ray diagnostics (ShadowAnalyst), full CRM, Telegram patient bot, local 3D DICOM rendering.**

[📖 Docs](#) &nbsp;·&nbsp; [🐛 Issues](../../issues) &nbsp;·&nbsp; [📧 Contact](#)

</div>

---

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
