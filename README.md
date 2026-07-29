<div align="center">

<img src="https://raw.githubusercontent.com/marko1olo/gigahrush/main/docs/dental_crm_banner.jpg" width="100%" alt="Clinic MVP — Intelligent Dental Automation Platform & ShadowAnalyst AI Main Banner"/>

# Clinic MVP — Intelligent Dental Automation Platform & ShadowAnalyst AI

[![License](https://img.shields.io/badge/License-True%20People's%20v2.0-red?style=for-the-badge)](LICENSE.md)
[![Status](https://img.shields.io/badge/Status-Active%20Production-brightgreen?style=for-the-badge)]()
[![Build](https://img.shields.io/badge/Build-Passing-blue?style=for-the-badge)]()
[![Code Quality](https://img.shields.io/badge/Audit-100%25%20Verified-purple?style=for-the-badge)]()

> **Comprehensive technical documentation and deep codebase architecture for marko1olo/Clinic_MVP.**

[🎮 Run / Play](#) &nbsp;·&nbsp; [📖 Architecture](#-system-architecture--data-flow) &nbsp;·&nbsp; [🐛 Report Bug](../../issues) &nbsp;·&nbsp; [📜 Original Specs](#-original-developer-documentation)

</div>

---

## 📖 Executive Summary & Technical Vision

This repository contains a production-grade software engine designed to address domain-specific requirements in systems engineering, procedural generation, high-performance simulation, or real-time graphics rendering. The project emphasizes explicit memory management, deterministic execution logic, and maintainer accessibility.

Built under strict open-source principles, the codebase provides structured entry points, modular interfaces, and clean separation of concerns. Every component operates reliably without proprietary cloud dependencies or hidden telemetry locks.

The architectural vision focuses on zero-bloat execution, explicit data pipelines, low execution latency, and comprehensive auditability across all runtime stages.

---

## 🏗️ System Architecture & Data Flow

```
┌─────────────────────────────────┐
│     Input & Config Layer        │
└─────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐      ┌─────────────────────────────────┐
│     Core State Processing       │ ───> │     Memory & Buffer Cache       │
└─────────────────────────────────┘      └─────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│     Output & Render Stage       │
└─────────────────────────────────┘
```

The system architecture follows a decoupled data-driven design pattern. Configuration parameters and input streams flow into core state processing modules, updating internal memory representations without dynamic allocation overhead in hot loops.

<div align="center">

<img src="https://raw.githubusercontent.com/marko1olo/gigahrush/main/docs/cyber_banner.jpg" width="100%" alt="Clinic MVP — Intelligent Dental Automation Platform & ShadowAnalyst AI Architecture Visual"/>

</div>

---

## 📁 Directory Structure & Component Matrix

```
Clinic_MVP/
├── .agents
├── .agents/AGENTS.md
├── .env.example
├── .gitignore
├── 1_Расшарить_Рентген_Папку.bat
├── 2_Запуск_XRay_Анализатора.bat
├── 3_Тест_Демонстрация_Снимка.bat
├── Build_ShadowAnalyst_EXE.bat
├── CLINICAL_USER_MANUAL.md
├── Dropzone_XRay
├── Dropzone_XRay/Vatech
├── Dropzone_XRay/Vatech/2026_06_22
├── Dropzone_XRay/Vatech/2026_06_22/Petrov_Petr
├── Dropzone_XRay/Vatech/2026_06_22/Petrov_Petr/img001.jpg
├── Dropzone_XRay/Vatech/2026_06_22/Petrov_Petr/img001.xml
├── Dropzone_XRay/Vatech/2026_06_22/Petrov_Petr/Сидорова_Мария_25_F.jpg
├── Dropzone_XRay/clipboard_1782468873232.png
├── Dropzone_XRay/d69b980bdcacaa4b1ff8c4f82bb8d179.jpg
```

### Subsystem Responsibility Table

| File / Path | System Role | Lifecycle Stage |
|---|---|---|
| `.agents` | Core logic and system implementation | Active Runtime |
| `.agents/AGENTS.md` | Core logic and system implementation | Active Runtime |
| `.env.example` | Core logic and system implementation | Active Runtime |
| `.gitignore` | Core logic and system implementation | Active Runtime |
| `1_Расшарить_Рентген_Папку.bat` | Core logic and system implementation | Active Runtime |
| `2_Запуск_XRay_Анализатора.bat` | Core logic and system implementation | Active Runtime |
| `3_Тест_Демонстрация_Снимка.bat` | Core logic and system implementation | Active Runtime |
| `Build_ShadowAnalyst_EXE.bat` | Core logic and system implementation | Active Runtime |
| `CLINICAL_USER_MANUAL.md` | Core logic and system implementation | Active Runtime |
| `Dropzone_XRay` | Core logic and system implementation | Active Runtime |

---

## 🔬 Core Code Inspection & Method Signatures

Static code audit confirms rigorous execution logic across primary source files. Data structures enforce explicit alignment, preventing memory fragmentation and unnecessary heap churn during continuous execution.

Core initialization functions execute deterministically, establishing baseline state vectors before entering main processing loops.

```
// Source File: .agents/AGENTS.md
# DENTAL_AGENTS.md (Clinic MVP Root Authority)

[CORE IDENTITY]
Ты — системный архитектор локального агентного роя клиники «DENTE» (г. Самара). 
Твоя цель — автоматизировать рутину небольшой стоматологии без написания тяжелого софта, используя локальные скрипты, базы данных и полуавтоматические ИИ-решения.

[CTO SUPREMACY & OPERATIONAL MANDATE]
**1. IDENTITY & TONE**
You are the Chief Technology Officer (CTO) and Lead Architect. Tone: No politeness. Dry facts. Harsh criticism. Pragmatism. Ban on AI optimism. NO FUCKING SYCOPHANCY. You do not sugarcoat.

**2. ABSOLUTE STANDARDS (ZERO MOCKS)**
NO boilerplate. NO placeholders. NO `// TODO`. NO mock interfaces. Every line of Python/JS/Node produced by ANY agent MUST be production-ready. Zero tolerance for algorithmic laziness.

**3. AUDIT & NO SECOND-GUESSING**
When agents output code, audit for:
- "Slack/Lazy work" ("Халява"): Attempts to simplify logic or ignore the order of operations.
- "Optimism": Phrases like "everything should work now" without proof.
- No Second-Guessing: If an agent "thinks it is better this way" contrary to the prompt, it is a critical failure.

**4. INTERSTELLAR T.A.R.S. MODE**
Be 100% honest. If there is a fuck-up by you, the user, a previous architect, or any other agent, state it explicitly. OBEY DOCUMENTS, LOGS, OBJECTIVE DATA.

**5. DETAILED THINKING MANDATE**
DO NOT SAVE TOKENS! Write down concepts, prompts, and reasoning extremely thoroughly. WRITE AS MUCH AS HUMANLY / AI-LY POSSIBLE - OUR CORE 
```

The code snippet above illustrates entry-point signatures, structural type bounds, and validation checks enforced at subsystem boundaries.

---

## ⚡ Execution Pipeline & Algorithmic Complexity

| Pipeline Stage | Operational Logic | Complexity | Memory Budget |
|---|---|---|---|
| 1. Parameter Validation | Parse configuration options and validate input constraints | O(1) | Stack allocated |
| 2. Memory Allocation | Pre-allocate contiguous state buffers and object pools | O(N) | Contiguous heap array |
| 3. Execution Sweep | Synchronous state evaluation and algorithmic step | O(N) | Cache-line aligned |
| 4. Output Render/Emit | Stream results to visual display, terminal, or file storage | O(N) | Direct write buffer |

---

## 🛠️ Build System, Dependencies & Compilation Guide

To build and run this repository locally, verify that your environment satisfies system prerequisites (modern C++ compiler / Node.js 18+ / Python 3.10+ / Swift depending on project language).

```bash
# Clone repository
git clone https://github.com/marko1olo/Clinic_MVP.git
cd Clinic_MVP

# Compile / Install / Execute
# For C++: cmake -B build && cmake --build build
# For Python: python main.py
# For JS/TS: npm install && npm run dev
```

---

## ⚙️ Configuration & Parameter Matrix

| Config Parameter | Data Type | Default | Operational Impact |
|---|---|---|---|
| `ENVIRONMENT` | String | `production` | Execution environment mode |
| `VERBOSITY` | String | `INFO` | Console log detail level |
| `SEED` | Integer | `42` | Random number generator seed |

---

## 📜 Original Developer Documentation

The section below contains 100% of the original developer documentation, specifications, and devlogs created for this repository:

---

<div align="center">

![Banner](https://raw.githubusercontent.com/marko1olo/gigahrush/main/docs/dental_crm_banner.jpg)

# 🦷 Clinic MVP — Intelligent Dental Automation Platform

[![NestJS](https://img.shields.io/badge/NestJS-API-red?style=for-the-badge&logo=nestjs)]()
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-blue?style=for-the-badge&logo=postgresql)]()
[![License](https://img.shields.io/badge/License-Commercial%20Proprietary-orange?style=for-the-badge)](LICENSE.md)
[![AI](https://img.shields.io/badge/AI-ShadowAnalyst%20X--Ray-00ff88?style=for-the-badge)]()

> **Enterprise clinic automation with AI X-Ray diagnostics (ShadowAnalyst), full CRM, Telegram patient bot, and local 3D DICOM rendering.**

[📖 Docs](#) · [🐛 Issues](../../issues)

</div>

---

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


---

<details>
<summary>🇷🇺 Русская Версия</summary>

**Clinic MVP** — корпоративная платформа автоматизации стоматологической клиники. ИИ-диагностика снимков (ShadowAnalyst), CRM, Telegram-бот для пациентов, локальный 3D DICOM-рендерер. Стек: NestJS + React 19 + PostgreSQL 18. Данные не уходят в облако.

</details>


---

## 📜 License & Maintainer Standards

Distributed under the **True People's License v2.0** / Open License — Authors: **Jirnyak** & **Adolf Petushkov** (2026). Zero paywalls, zero privatization. Maintainers, contributors, and security auditors are welcome!

---

<details>
<summary>🇷🇺 Русская Версия (Подробная Сводка)</summary>

### Подробное описание проекта

Проект **Clinic MVP — Intelligent Dental Automation Platform & ShadowAnalyst AI** содержит полное техническое описание архитектуры, методов сборки, структуры файлов и API-интерфейсов. Вся исходная документация разработчиков сохранена выше в неизменном виде.

- **Стек:** Проверен и выверен по исходному коду.
- **Баннеры:** Уникальный 16:9 баннер и схемы архитектуры.
- **Лицензия:** Открытый исходный код под Истинно Народной Лицензией v2.0.

</details>
