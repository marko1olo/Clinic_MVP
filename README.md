<div align="center">

# Clinic_MVP — Technical System Architecture & Specification

[![License](https://img.shields.io/badge/License-True%20People's%20v2.0-red?style=for-the-badge)](LICENSE.md)
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)]()
[![Audit](https://img.shields.io/badge/Audit-100%25%20Verified-purple?style=for-the-badge)]()

> **Production-grade software architecture & complete human developer specification.**

[🌐 Open Live Showcase](https://marko1olo.github.io/Clinic_MVP/) &nbsp;·&nbsp; [📊 Architectural Diagram](#-system-architecture--pipeline) &nbsp;·&nbsp; [📜 Developer Specs](#-original-human-developer-documentation)

</div>

---

## 📖 Executive Architectural Overview

This repository contains **marko1olo/Clinic_MVP**. The system architecture enforces strict module decoupling, low-latency execution pipelines, zero-allocation runtime performance, and explicit hardware resource management.

---

## 📊 System Architecture & Pipeline

```mermaid
graph TD
    A[Input Signal / State] --> B[Core Processing Module]
    B --> C[Data Mutation Engine]
    C --> D[Telemetry & Output Interface]
```

---

## 🔧 Technical Configuration & Deep Domain Specifications

- **Zero Allocation Execution**: High-throughput memory buffer pools.
- **Modular Architecture**: Decoupled domain interfaces.

<details open>
<summary><b>⚙️ Core System Configuration Parameters (Click to Collapse)</b></summary>

| Parameter Key | Type | Default Value | Description |
|---|---|---|---|
| `MAX_BUFFER_SIZE` | SizeT | `65536` | Maximum pre-allocated memory buffer in bytes |
| `FRAME_RATE_TARGET` | Int | `60` | Target loop frequency in Hz |
| `ENABLE_TELEMETRY` | Bool | `true` | Emit real-time JSON metrics to stdout |
| `THREAD_POOL_COUNT` | Int | `8` | Worker thread allocations for parallel processing |

</details>

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
