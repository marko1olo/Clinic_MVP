import os
import secrets
from fastapi import FastAPI, Request, Form, Depends, HTTPException, status, Cookie, Response
from fastapi.concurrency import run_in_threadpool
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, RedirectResponse
import uvicorn
from datetime import datetime

from database import init_db, get_connection

app = FastAPI(title="Dentaliya-2 Admin")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

# Initialize DB on startup
@app.on_event("startup")
def startup_event():
    init_db()


security = HTTPBasic()

def _get_expected_credentials():
    expected_username = os.environ.get("ADMIN_USERNAME")
    expected_password = os.environ.get("ADMIN_PASSWORD")

    if not expected_username or not expected_password:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Admin credentials are not configured on the server",
        )
    return expected_username, expected_password

def _verify_password(credentials, expected_username, expected_password):
    correct_username = secrets.compare_digest(credentials.username, expected_username)
    correct_password = secrets.compare_digest(credentials.password, expected_password)
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )

def get_current_username(credentials: HTTPBasicCredentials = Depends(security)):
    expected_username, expected_password = _get_expected_credentials()
    _verify_password(credentials, expected_username, expected_password)
    return credentials.username

def get_dashboard_data():
    try:
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

        # Convert rows to dicts inside the threadpool to avoid keeping cursor alive
        res_appointments = [dict(ix) for ix in appointments]
        res_patients = [dict(ix) for ix in patients]

        conn.close()
        return res_appointments, res_patients
    except Exception as e:
        print(f"Error fetching dashboard data: {e}")
        return [], []

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request, username: str = Depends(get_current_username)):
    appointments, patients = await run_in_threadpool(get_dashboard_data)

    csrf_token = request.cookies.get("csrf_token") or secrets.token_hex(32)
    response_obj = templates.TemplateResponse(request=request, name="dashboard.html", context={
        "request": request, 
        "appointments": appointments,
        "patients": patients,
        "csrf_token": csrf_token
    })
    response_obj.set_cookie(key="csrf_token", value=csrf_token, httponly=True, samesite="lax")
    return response_obj

def insert_patient(name, phone):
    conn = get_connection()
    c = conn.cursor()
    created_at = datetime.now().isoformat()
    c.execute('INSERT INTO patients (name, phone, created_at) VALUES (?, ?, ?)', (name, phone, created_at))
    conn.commit()
    conn.close()

@app.post("/patients/add")
async def add_patient(name: str = Form(...), phone: str = Form(None), csrf_token: str = Form(...), cookie_csrf_token: str = Cookie(None, alias="csrf_token"), username: str = Depends(get_current_username)):
    if not cookie_csrf_token or not secrets.compare_digest(csrf_token, cookie_csrf_token):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="CSRF token mismatch")
    await run_in_threadpool(insert_patient, name, phone)
    return RedirectResponse(url="/", status_code=303)

def insert_appointment(patient_id, doctor, date):
    conn = get_connection()
    c = conn.cursor()
    created_at = datetime.now().isoformat()
    c.execute('''
        INSERT INTO appointments (patient_id, doctor, appointment_date, created_at)
        VALUES (?, ?, ?, ?)
    ''', (patient_id, doctor, date, created_at))
    conn.commit()
    conn.close()

@app.post("/appointments/add")
async def add_appointment(patient_id: int = Form(...), doctor: str = Form(...), date: str = Form(...), csrf_token: str = Form(...), cookie_csrf_token: str = Cookie(None, alias="csrf_token"), username: str = Depends(get_current_username)):
    if not cookie_csrf_token or not secrets.compare_digest(csrf_token, cookie_csrf_token):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="CSRF token mismatch")
    await run_in_threadpool(insert_appointment, patient_id, doctor, date)
    return RedirectResponse(url="/", status_code=303)

def fetch_current_appointment():
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
    
    if row:
        res = {
            "appointment_id": row["id"],
            "patient_name": row["patient_name"],
            "doctor": row["doctor"],
            "time": row["appointment_date"]
        }
    else:
        res = None

    conn.close()
    return res

@app.get("/api/current_appointment")
async def get_current_appointment(username: str = Depends(get_current_username)):
    appointment = await run_in_threadpool(fetch_current_appointment)
    if appointment:
        return appointment
    return {"error": "No appointments today"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
