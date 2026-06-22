from fastapi import FastAPI, Request, Form
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
import uvicorn
from datetime import datetime

from database import init_db, get_connection

app = FastAPI(title="Dentaliya-2 Admin")
templates = Jinja2Templates(directory="templates")

# Initialize DB on startup
@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    conn = get_connection()
    c = conn.cursor()
    
    # Get upcoming appointments
    c.execute('''
        SELECT a.id, a.appointment_date, a.doctor, a.status, p.name as patient_name, p.phone
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        WHERE a.status = 'scheduled'
        ORDER BY a.appointment_date ASC
        LIMIT 20
    ''')
    appointments = c.fetchall()
    
    # Get all patients for the dropdown
    c.execute('SELECT * FROM patients ORDER BY name ASC LIMIT 100')
    patients = c.fetchall()
    
    conn.close()
    return templates.TemplateResponse("dashboard.html", {
        "request": request, 
        "appointments": appointments,
        "patients": patients
    })

@app.post("/patients/add")
async def add_patient(name: str = Form(...), phone: str = Form(None)):
    conn = get_connection()
    c = conn.cursor()
    created_at = datetime.now().isoformat()
    c.execute('INSERT INTO patients (name, phone, created_at) VALUES (?, ?, ?)', (name, phone, created_at))
    conn.commit()
    conn.close()
    return RedirectResponse(url="/", status_code=303)

@app.post("/appointments/add")
async def add_appointment(patient_id: int = Form(...), doctor: str = Form(...), date: str = Form(...)):
    conn = get_connection()
    c = conn.cursor()
    created_at = datetime.now().isoformat()
    c.execute('''
        INSERT INTO appointments (patient_id, doctor, appointment_date, created_at)
        VALUES (?, ?, ?, ?)
    ''', (patient_id, doctor, date, created_at))
    conn.commit()
    conn.close()
    return RedirectResponse(url="/", status_code=303)

@app.get("/api/current_appointment")
async def get_current_appointment():
    conn = get_connection()
    c = conn.cursor()
    # Получаем ближайший прошедший или текущий аппойнтмент (сегодняшний день)
    c.execute('''
        SELECT a.id, a.appointment_date, a.doctor, p.name as patient_name
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        WHERE date(a.appointment_date) = date('now')
        ORDER BY abs(julianday(a.appointment_date) - julianday('now', 'localtime')) ASC
        LIMIT 1
    ''')
    row = c.fetchone()
    conn.close()
    
    if row:
        return {
            "appointment_id": row["id"],
            "patient_name": row["patient_name"],
            "doctor": row["doctor"],
            "time": row["appointment_date"]
        }
    return {"error": "No appointments today"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
