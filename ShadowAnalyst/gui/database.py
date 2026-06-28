from __future__ import annotations

import os
import sqlite3
import sys


def find_project_root():
    start_dirs = []
    if getattr(sys, 'frozen', False):
        start_dirs.append(os.path.dirname(sys.executable))
    else:
        start_dirs.append(os.path.dirname(os.path.abspath(__file__)))
    start_dirs.append(os.getcwd())

    for start_dir in start_dirs:
        current = os.path.abspath(start_dir)
        while True:
            if os.path.exists(os.path.join(current, 'config.json')):
                return current
            parent = os.path.dirname(current)
            if parent == current:
                break
            current = parent

    # Fallback
    main_dir = os.path.dirname(sys.executable) if getattr(
        sys, 'frozen', False) else os.path.dirname(os.path.abspath(__file__))
    current = os.path.abspath(main_dir)
    for _ in range(5):
        if os.path.basename(current).lower() in ['dist', 'gui', 'shadowanalyst']:
            current = os.path.dirname(current)
        else:
            break
    return current


PROJECT_ROOT = find_project_root()

# DB should live in C:\Clinic_MVP\ShadowAnalyst\shadow_analyst.db if the directory exists
# Otherwise in C:\Clinic_MVP\shadow_analyst.db
shadow_analyst_dir = os.path.join(PROJECT_ROOT, 'ShadowAnalyst')
if os.path.exists(shadow_analyst_dir) and os.path.isdir(shadow_analyst_dir):
    DB_PATH = os.path.join(shadow_analyst_dir, 'shadow_analyst.db')
else:
    DB_PATH = os.path.join(PROJECT_ROOT, 'shadow_analyst.db')


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    print(f"[DB] Initializing database at {DB_PATH}")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_name TEXT,
            patient_age INTEGER,
            patient_gender TEXT,
            original_image TEXT,
            enhanced_image TEXT,
            ai_image TEXT,
            brightness INTEGER DEFAULT 100,
            contrast INTEGER DEFAULT 100,
            inverted BOOLEAN DEFAULT 0,
            scale REAL DEFAULT 1.0,
            translate_x REAL DEFAULT 0.0,
            translate_y REAL DEFAULT 0.0,
            slider_position REAL DEFAULT 50.0,
            summary TEXT,
            report TEXT,
            audio_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    # Migration for older databases
    try:
        cursor.execute('ALTER TABLE scans ADD COLUMN ai_image TEXT')
    except sqlite3.OperationalError:
        pass

    conn.commit()
    conn.close()


def save_scan(data: dict) -> int:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO scans (
            patient_name, patient_age, patient_gender,
            original_image, enhanced_image, ai_image,
            brightness, contrast, inverted,
            scale, translate_x, translate_y, slider_position,
            summary, report, audio_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
            data.get('patient_name', ''),
            data.get('patient_age'),
            data.get('patient_gender', 'Не указан'),
            data.get('original_image', ''),
            data.get('enhanced_image', ''),
            data.get('ai_image', ''),
            data.get('brightness', 100),
            data.get('contrast', 100),
            data.get('inverted', False),
            data.get('scale', 1.0),
            data.get('translate_x', 0.0),
            data.get('translate_y', 0.0),
            data.get('slider_position', 50.0),
            data.get('summary', ''),
            data.get('report', ''),
            data.get('audio_url', ''),
        ),
    )
    conn.commit()
    scan_id = cursor.lastrowid
    conn.close()
    return scan_id


def get_all_scans() -> list:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM scans ORDER BY created_at DESC')
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_scan_by_id(scan_id: int) -> dict | None:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM scans WHERE id = ?', (scan_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


def delete_scan(scan_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM scans WHERE id = ?', (scan_id,))
    conn.commit()
    conn.close()


def update_scan(scan_id: int, data: dict):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        UPDATE scans SET
            patient_name = ?,
            patient_age = ?,
            patient_gender = ?,
            brightness = ?,
            contrast = ?,
            inverted = ?,
            scale = ?,
            translate_x = ?,
            translate_y = ?,
            slider_position = ?,
            summary = ?,
            report = ?,
            audio_url = ?
        WHERE id = ?
    """, (
            data.get('patient_name', ''),
            data.get('patient_age'),
            data.get('patient_gender', 'Не указан'),
            data.get('brightness', 100),
            data.get('contrast', 100),
            data.get('inverted', False),
            data.get('scale', 1.0),
            data.get('translate_x', 0.0),
            data.get('translate_y', 0.0),
            data.get('slider_position', 50.0),
            data.get('summary', ''),
            data.get('report', ''),
            data.get('audio_url', ''),
            scan_id,
        ),
    )
    conn.commit()
    conn.close()
