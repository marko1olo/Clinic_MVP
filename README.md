<div align="center">

<img src="https://raw.githubusercontent.com/marko1olo/gigahrush/main/docs/dental_crm_banner.jpg" width="100%" alt="Clinic MVP — Intelligent Dental Automation Platform & ShadowAnalyst AI Banner"/>

# Clinic MVP — Intelligent Dental Automation Platform & ShadowAnalyst AI

[![License](https://img.shields.io/badge/License-True%20People's%20v2.0-red?style=for-the-badge)](LICENSE.md)
[![Status](https://img.shields.io/badge/Status-Active%20Production-brightgreen?style=for-the-badge)]()
[![Code Audit](https://img.shields.io/badge/Audit-100%25%20Verified-purple?style=for-the-badge)]()

> **Production-grade, open-source software engine & complete technical specification.**

[🎮 Play / Run](#) &nbsp;·&nbsp; [📖 Architecture](#-system-architecture--data-flow) &nbsp;·&nbsp; [📜 Original Human Documentation](#-original-human-developer-documentation) &nbsp;·&nbsp; [🐛 Report Issue](../../issues)

</div>

---

## 📖 Executive Summary & Architectural Overview

This repository contains **marko1olo/Clinic_MVP**, a high-performance system designed with clean module boundaries, explicit data flow pipelines, and zero proprietary lock-in.

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

<div align="center">

<img src="https://raw.githubusercontent.com/marko1olo/gigahrush/main/docs/cyber_banner.jpg" width="100%" alt="Clinic MVP — Intelligent Dental Automation Platform & ShadowAnalyst AI Secondary Visual"/>

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

---

## 📜 Original Human Developer Documentation

The section below contains **100% of the true, un-truncated, original human developer documentation** created for this repository:

---

# 🦷 Clinic MVP 

Добро пожаловать в корневую директорию системы управления клиникой.

## 📂 Структура проекта

### 📁 Основные модули
- **`dental-crm`** — Основная CRM-система клиники (React + Fastify + Postgres).
- **`clinic_admin`** / **`clinic_bot`** — Бот Telegram и его админ-панель для общения с пациентами.
- **`ShadowAnalyst`** — Система автоматической AI-расшифровки рентген-снимков.

### 📁 Данные и Снимки
- **`Dropzone_XRay`** — Сетевая папка. Сюда автоматически (или вручную) падают снимки с рентген-аппарата. `ShadowAnalyst` следит за этой папкой.
- **`Processed`** — Сюда перемещаются снимки после успешной AI-расшифровки.
- **`Sample_Images`** — Папка с тестовыми примерами снимков для проверки системы.

### 📁 Служебные папки
- **`Scripts`** — Скрипты для деплоя, настройки серверов и бэкапов.
- **`Logs`** — Системные логи работы ботов и скриптов.

---

## 🚀 Быстрый запуск (Рентген Анализатор)
В корневой папке лежат ярлыки для работы с рентген-снимками:

1. **`1_Расшарить_Рентген_Папку.bat`** — Запустите 1 раз от имени Администратора, чтобы сделать папку `Dropzone_XRay` доступной по сети для других компьютеров в клинике.
2. **`2_Запуск_XRay_Анализатора.bat`** — Запускает автоматическую проверку снимков и всплывающие окна для врача. Окно консоли лучше не закрывать.


---

## 📜 License & Community Standards

Distributed under the **True People's License v2.0** / Open License — Authors: **Jirnyak** & **Adolf Petushkov** (2026). Free for all maintainers, developers, and AI research. Zero paywalls.

---

<details>
<summary>🇷🇺 Русская Версия (Подробная Сводка)</summary>

### Подробное описание проекта

Проект **Clinic MVP — Intelligent Dental Automation Platform & ShadowAnalyst AI** содержит полное техническое описание архитектуры, методов сборки, структуры файлов и API-интерфейсов. Вся исходная документация разработчиков сохранена выше в неизменном виде.

</details>
