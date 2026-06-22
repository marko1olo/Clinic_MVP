from fastapi.testclient import TestClient
from main import app
import os
import base64

client = TestClient(app)

def test_unauthenticated_requests():
    # Should get 401 Unauthorized
    response = client.get("/")
    assert response.status_code == 401

    response = client.post("/patients/add", data={"name": "Test", "phone": "123"})
    assert response.status_code == 401

    response = client.post("/appointments/add", data={"patient_id": 1, "doctor": "Dr. Smith", "date": "2023-10-27"})
    assert response.status_code == 401

    response = client.get("/api/current_appointment")
    assert response.status_code == 401

def test_authenticated_requests():
    # Create test DB first to avoid errors on page load
    from database import init_db
    init_db()

    # Use default credentials
    auth_str = "admin:CHANGE_ME_IMMEDIATELY"
    b64_auth = base64.b64encode(auth_str.encode()).decode()
    headers = {"Authorization": f"Basic {b64_auth}"}

    # Should succeed or redirect (for posts)
    response = client.get("/", headers=headers)
    assert response.status_code == 200

    # Add patient to satisfy FK
    response = client.post("/patients/add", data={"name": "Test Patient", "phone": "123"}, headers=headers)
    assert response.status_code in [200, 303]

    response = client.post("/appointments/add", data={"patient_id": 1, "doctor": "Dr. Smith", "date": "2023-10-27T10:00:00"}, headers=headers)
    assert response.status_code in [200, 303]

    response = client.get("/api/current_appointment", headers=headers)
    assert response.status_code == 200
