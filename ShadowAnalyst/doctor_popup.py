import time
import json
import threading
import tkinter as tk
from tkinter import ttk
import paho.mqtt.client as mqtt

import os

MQTT_HOST = "62.84.100.97" # Default public IP
MQTT_PORT = 1883
MQTT_USER = os.getenv("MQTT_USER", "")
MQTT_PASS = os.getenv("MQTT_PASS", "")
TOPIC_XRAY_RESULT = "clinic/xray/result"

# Load config dynamically if exists
CONFIG_FILE = r"C:\Clinic_MVP\config.json"
if os.path.exists(CONFIG_FILE):
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            config = json.load(f)
            MQTT_HOST = config.get("mqtt_host", MQTT_HOST)
            MQTT_PORT = config.get("mqtt_port", MQTT_PORT)
            MQTT_USER = config.get("mqtt_user", MQTT_USER)
            MQTT_PASS = config.get("mqtt_pass", MQTT_PASS)
            TOPIC_XRAY_RESULT = config.get("mqtt_topic_xray", TOPIC_XRAY_RESULT)
    except Exception as e:
        print(f"Error loading config.json: {e}")

def parse_findings(findings):
    """
    Parses the findings string and separates it into normal findings (body_lines)
    and alert findings (alert_lines).
    """
    body_lines = []
    alert_lines = []

    if not findings or findings == "Норма":
        body_lines.append("Патологий не обнаружено. Норма.")
    else:
        for line in findings.split('\n'):
            if 'кариес' in line.lower() or 'воспаление' in line.lower():
                alert_lines.append(line)
            else:
                body_lines.append(line)

    return body_lines, alert_lines


class DoctorPopupApp:
    def __init__(self):
        self.root = tk.Tk()
        self.root.withdraw() # Hide initially
        
        # Configure window
        self.root.overrideredirect(True) # Remove window borders
        self.root.attributes("-topmost", True) # Always on top
        self.root.attributes("-alpha", 0.95) # Slight transparency
        
        # Styling
        self.style = ttk.Style()
        self.style.theme_use('clam')
        self.style.configure('Outer.TFrame', background='#38bdf8') # Accent border
        self.style.configure('Popup.TFrame', background='#0a0e17') # Main bg
        self.style.configure('Title.TLabel', background='#0a0e17', foreground='#38bdf8', font=('Segoe UI', 11, 'bold'))
        self.style.configure('Body.TLabel', background='#0a0e17', foreground='#e2e8f0', font=('Segoe UI', 9))
        self.style.configure('Alert.TLabel', background='#0a0e17', foreground='#ef4444', font=('Segoe UI', 9, 'bold'))
        
        # Outer frame to act as 1px border
        self.outer_frame = ttk.Frame(self.root, style='Outer.TFrame', padding=1)
        self.outer_frame.pack(fill=tk.BOTH, expand=True)
        
        self.frame = ttk.Frame(self.outer_frame, style='Popup.TFrame', padding=15)
        self.frame.pack(fill=tk.BOTH, expand=True)
        
        self.lbl_title = ttk.Label(self.frame, text="🦷 Анализ снимка", style='Title.TLabel')
        self.lbl_title.pack(anchor=tk.W, pady=(0, 5))
        
        self.lbl_body = ttk.Label(self.frame, text="", style='Body.TLabel', justify=tk.LEFT)
        self.lbl_body.pack(anchor=tk.W)
        
        self.lbl_alert = ttk.Label(self.frame, text="", style='Alert.TLabel', justify=tk.LEFT)
        self.lbl_alert.pack(anchor=tk.W, pady=(5, 0))
        
        # Position bottom right
        self.screen_width = self.root.winfo_screenwidth()
        self.screen_height = self.root.winfo_screenheight()
        
        self.hide_timer = None

    def show_popup(self, filename, findings):
        # Update text
        self.lbl_title.config(text=f"🦷 Снимок: {filename}")
        
        body_lines, alert_lines = parse_findings(findings)
        
        self.lbl_body.config(text="\n".join(body_lines))
        self.lbl_alert.config(text="\n".join(alert_lines))
        
        # Calculate geometry
        self.root.update_idletasks()
        width = self.root.winfo_reqwidth() + 20
        height = self.root.winfo_reqheight() + 20
        
        x = self.screen_width - width - 20
        y = self.screen_height - height - 60 # Above taskbar
        
        self.root.geometry(f"{width}x{height}+{x}+{y}")
        self.root.deiconify() # Show
        
        # Auto hide after 12 seconds
        if self.hide_timer:
            self.root.after_cancel(self.hide_timer)
        self.hide_timer = self.root.after(12000, self.hide)

    def hide(self):
        self.root.withdraw()

def on_connect(client, userdata, flags, rc, properties):
    if rc == 0:
        print("Connected to MQTT broker")
        client.subscribe(TOPIC_XRAY_RESULT)
    else:
        print(f"Failed to connect, return code {rc}")

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        filename = payload.get('file', 'unknown')
        findings = payload.get('findings', '')
        
        # Tell tkinter to show popup in the main thread
        userdata['app'].root.after(0, userdata['app'].show_popup, filename, findings)
    except Exception as e:
        print(f"Error parsing message: {e}")

def run_mqtt(app):
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.user_data_set({'app': app})
    if MQTT_USER:
        client.username_pw_set(MQTT_USER, MQTT_PASS)
    client.on_connect = on_connect
    client.on_message = on_message
    
    while True:
        try:
            client.connect(MQTT_HOST, MQTT_PORT, 60)
            client.loop_forever()
        except Exception as e:
            print(f"MQTT Error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    app = DoctorPopupApp()
    
    # Start MQTT in background
    mqtt_thread = threading.Thread(target=run_mqtt, args=(app,), daemon=True)
    mqtt_thread.start()
    
    print("Doctor Popup is running in background...")
    app.root.mainloop()
