from __future__ import annotations

import os
import secrets
from datetime import datetime

import uvicorn
from database import get_connection
from database import init_db
from fastapi import Depends
from fastapi import FastAPI
from fastapi import Form
from fastapi import HTTPException
from fastapi import Request
from fastapi import status
from fastapi.responses import HTMLResponse
from fastapi.responses import RedirectResponse
from fastapi.security import HTTPBasic
from fastapi.security import HTTPBasicCredentials
from fastapi.templating import Jinja2Templates

security = HTTPBasic()


def verify_credentials(credentials: HTTPBasicCredentials = Depends(security)):
    expected_username = os.environ.get('ADMIN_USERNAME')
    expected_password = os.environ.get('ADMIN_PASSWORD')

    if not expected_username or not expected_password:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='Admin credentials are not configured on the server',
        )

    correct_username = secrets.compare_digest(
        credentials.username, expected_username)
    correct_password = secrets.compare_digest(
        credentials.password, expected_password)

    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect username or password',
            headers={'WWW-Authenticate': 'Basic'},
        )
    return credentials.username


app = FastAPI(title='Dentaliya-2 Admin')
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, 'templates'))

# Initialize DB on startup


@app.on_event('startup')
def startup_event():
    init_db()


security = HTTPBasic()


def get_current_username(credentials: HTTPBasicCredentials = Depends(security)):
    expected_username = os.environ.get('ADMIN_USERNAME')
    expected_password = os.environ.get('ADMIN_PASSWORD')

    if not expected_username or not expected_password:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='Admin credentials are not configured on the server',
        )

    correct_username = secrets.compare_digest(
        credentials.username, expected_username)
    correct_password = secrets.compare_digest(
        credentials.password, expected_password)
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect username or password',
            headers={'WWW-Authenticate': 'Basic'},
        )
    return credentials.username


@app.get('/', response_class=HTMLResponse)
async def read_root(request: Request, username: str = Depends(get_current_username)):
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
    return templates.TemplateResponse(
        request=request, name='dashboard.html', context={
            'request': request,
            'appointments': [dict(ix) for ix in appointments],
            'patients': [dict(ix) for ix in patients],
        },
    )


@app.post('/patients/add')
async def add_patient(name: str = Form(...), phone: str = Form(None), username: str = Depends(get_current_username)):
    conn = get_connection()
    c = conn.cursor()
    created_at = datetime.now().isoformat()
    c.execute('INSERT INTO patients (name, phone, created_at) VALUES (?, ?, ?)',
              (name, phone, created_at))
    conn.commit()
    conn.close()
    return RedirectResponse(url='/', status_code=303)


@app.post('/appointments/add')
async def add_appointment(patient_id: int = Form(...), doctor: str = Form(...), date: str = Form(...), username: str = Depends(get_current_username)):
    conn = get_connection()
    c = conn.cursor()
    created_at = datetime.now().isoformat()
    c.execute(
        '''
        INSERT INTO appointments (patient_id, doctor, appointment_date, created_at)
        VALUES (?, ?, ?, ?)
    ''', (patient_id, doctor, date, created_at),
    )
    conn.commit()
    conn.close()
    return RedirectResponse(url='/', status_code=303)


@app.get('/api/current_appointment')
async def get_current_appointment(username: str = Depends(get_current_username)):
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
            'appointment_id': row['id'],
            'patient_name': row['patient_name'],
            'doctor': row['doctor'],
            'time': row['appointment_date'],
        }
    return {'error': 'No appointments today'}

if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True)
