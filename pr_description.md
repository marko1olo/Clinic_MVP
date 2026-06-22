🔒 Fix Unauthenticated Appointments Creation

🎯 **What:** The `/appointments/add` endpoint, as well as `/patients/add`, `/api/current_appointment`, and the root dashboard `/`, lacked authentication, allowing any user to create data and view upcoming schedules.
⚠️ **Risk:** An attacker could exploit this by maliciously filling the schedule with fake appointments (Denial of Service), inputting fake patient data, or viewing real patient data without authorization.
🛡️ **Solution:** Added a `verify_credentials` FastAPI dependency that implements HTTP Basic Authentication. This dependency ensures that the user is authenticated via the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables before they can hit these protected endpoints. I also added tests (`test_auth.py`) that verify both authenticated and unauthenticated responses.
