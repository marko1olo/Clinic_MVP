import os
import sys
import sqlite3

if getattr(sys, 'frozen', False):
    EXE_DIR = os.path.dirname(sys.executable)
else:
    # database.py lives in ShadowAnalyst/gui
    EXE_DIR = os.path.dirname(os.path.abspath(__file__))

# If running script, save DB in ShadowAnalyst/ folder
DB_PATH = os.path.join(os.path.dirname(EXE_DIR) if not getattr(sys, 'frozen', False) else EXE_DIR, "shadow_analyst.db")

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
        cursor.execute("ALTER TABLE scans ADD COLUMN ai_image TEXT")
    except sqlite3.OperationalError:
        pass
        
    conn.commit()
    conn.close()

def save_scan(data: dict) -> int:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO scans (
            patient_name, patient_age, patient_gender,
            original_image, enhanced_image, ai_image,
            brightness, contrast, inverted,
            scale, translate_x, translate_y, slider_position,
            summary, report, audio_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.get("patient_name", ""),
        data.get("patient_age"),
        data.get("patient_gender", "Не указан"),
        data.get("original_image", ""),
        data.get("enhanced_image", ""),
        data.get("ai_image", ""),
        data.get("brightness", 100),
        data.get("contrast", 100),
        data.get("inverted", False),
        data.get("scale", 1.0),
        data.get("translate_x", 0.0),
        data.get("translate_y", 0.0),
        data.get("slider_position", 50.0),
        data.get("summary", ""),
        data.get("report", ""),
        data.get("audio_url", "")
    ))
    conn.commit()
    scan_id = cursor.lastrowid
    conn.close()
    return scan_id

def get_all_scans() -> list:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scans ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_scan_by_id(scan_id: int) -> dict | None:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scans WHERE id = ?", (scan_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def delete_scan(scan_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM scans WHERE id = ?", (scan_id,))
    conn.commit()
    conn.close()

def update_scan(scan_id: int, data: dict):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
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
        data.get("patient_name", ""),
        data.get("patient_age"),
        data.get("patient_gender", "Не указан"),
        data.get("brightness", 100),
        data.get("contrast", 100),
        data.get("inverted", False),
        data.get("scale", 1.0),
        data.get("translate_x", 0.0),
        data.get("translate_y", 0.0),
        data.get("slider_position", 50.0),
        data.get("summary", ""),
        data.get("report", ""),
        data.get("audio_url", ""),
        scan_id
    ))
    conn.commit()
    conn.close()
