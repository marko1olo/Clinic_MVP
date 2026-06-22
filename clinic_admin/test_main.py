import os
import pytest
from fastapi.testclient import TestClient
from main import app, init_db

# Ensure we use a test database or initialize correctly
@pytest.fixture(autouse=True)
def setup_db():
    init_db()
    yield

client = TestClient(app)

def test_read_root_unconfigured_credentials():
    # temporarily delete credentials if they exist
    u = os.environ.pop("ADMIN_USERNAME", None)
    p = os.environ.pop("ADMIN_PASSWORD", None)

    response = client.get("/", auth=("admin", "admin"))
    assert response.status_code == 500
    assert response.json() == {"detail": "Admin credentials are not configured on the server"}

    if u is not None:
        os.environ["ADMIN_USERNAME"] = u
    if p is not None:
        os.environ["ADMIN_PASSWORD"] = p

def test_read_root_unauthenticated():
    os.environ["ADMIN_USERNAME"] = "admin"
    os.environ["ADMIN_PASSWORD"] = "admin"
    response = client.get("/")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}

def test_read_root_authenticated_correct():
    os.environ["ADMIN_USERNAME"] = "admin"
    os.environ["ADMIN_PASSWORD"] = "admin"
    response = client.get("/", auth=("admin", "admin"))
    assert response.status_code == 200

def test_read_root_authenticated_incorrect():
    os.environ["ADMIN_USERNAME"] = "admin"
    os.environ["ADMIN_PASSWORD"] = "admin"
    response = client.get("/", auth=("admin", "wrong"))
    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect email or password"}

def test_api_current_appointment_unauthenticated():
    # Verify that the unauthenticated API endpoint remains accessible
    response = client.get("/api/current_appointment")
    assert response.status_code == 200
    assert "error" in response.json() or "appointment_id" in response.json()
