<div align="center">

![Banner](https://raw.githubusercontent.com/marko1olo/gigahrush/main/docs/dental_crm_banner.jpg)

# 🦷 Clinic MVP — Intelligent Dental Automation Platform

[![NestJS](https://img.shields.io/badge/NestJS-API-red?style=for-the-badge&logo=nestjs)]()
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-blue?style=for-the-badge&logo=postgresql)]()
[![License](https://img.shields.io/badge/License-Commercial%20Proprietary-orange?style=for-the-badge)](LICENSE.md)
[![AI](https://img.shields.io/badge/AI-ShadowAnalyst%20X--Ray-00ff88?style=for-the-badge)]()

> **Enterprise clinic automation with AI-powered X-Ray diagnostics (ShadowAnalyst), full CRM, Telegram patient bot, and local DICOM rendering.**

[📖 Docs](#) · [🐛 Issues](../../issues) · [📧 Contact](#)

</div>

---

## 📖 About

**Clinic MVP** is a full-stack dental clinic automation platform built for production use. It integrates AI X-Ray analysis, a full CRM workflow, automated patient communications via Telegram & WhatsApp, and a zero-cloud local DICOM image renderer — all in one platform.

---

## 🏗️ System Architecture

```
┌─────────────────────┐      ┌─────────────────────┐      ┌──────────────────────┐
│   React 19 SPA      │─────▶│   NestJS API Gateway │─────▶│  PostgreSQL 18       │
│   (DICOM 3D render) │      │   (Drizzle ORM)      │      │  (Strict isolation)  │
└─────────────────────┘      └─────────────────────┘      └──────────────────────┘
         │                             │                              │
         ▼                             ▼                              ▼
┌──────────────────┐       ┌──────────────────┐       ┌─────────────────────────┐
│ ShadowAnalyst AI │       │  Telegram Bot    │       │  Avito Lead Dispatcher  │
│ (X-Ray Vision)   │       │  (Patient I/O)   │       │  (Auto Lead Capture)    │
└──────────────────┘       └──────────────────┘       └─────────────────────────┘
```

---

## 🩺 Key Modules

### ShadowAnalyst AI — X-Ray Diagnostic Engine
- Automated detection of caries, periodontitis, and bone resorption
- Local inference — patient data never leaves the clinic
- DICOM-compliant image handling with 3D tooth model overlay

### DENTE CRM — Full Clinic Workflow
- Patient registry, treatment plans, visit history
- Interactive appointment scheduling with conflict detection
- Financial ledger, insurance tracking, debt management

### Patient Communication Bot
- Telegram & WhatsApp automated appointment reminders
- Smart booking parser — patients book via natural language messages
- AI response drafts with operator approval flow

---

## 🚀 Quick Start (Local Development)

```bash
git clone https://github.com/marko1olo/Clinic_MVP.git
cd Clinic_MVP/dental-crm

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env: set DATABASE_URL, TELEGRAM_BOT_TOKEN, etc.

# Run database migrations
pnpm db:migrate

# Start development servers
pnpm dev
```

---

## 📜 License

**Commercial Proprietary & Source-Available License** — Adolf Petushkov (c) 2026.
Contributors and maintainers welcome. Commercial deployment requires a license agreement.

---

<details>
<summary>🇷🇺 Русская Версия</summary>

**Clinic MVP** — корпоративная платформа автоматизации стоматологической клиники. Включает: ИИ-диагностику снимков (ShadowAnalyst), полноценную CRM, автоматический Telegram-бот для пациентов и локальный 3D DICOM-рендерер.

Стек: NestJS + React 19 + PostgreSQL 18 + Drizzle ORM. Всё работает локально — данные пациентов не уходят в облако.

</details>
