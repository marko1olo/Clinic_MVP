import time
import threading
import sys
import os
from http.server import HTTPServer, BaseHTTPRequestHandler

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'gui')))
from app import wait_for_server

class DummyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")

def run_delayed_server(delay):
    time.sleep(delay)
    try:
        server = HTTPServer(('127.0.0.1', 8086), DummyHandler)
        server.timeout = 5
        server.handle_request()
        server.server_close()
    except Exception as e:
        print(e)

if __name__ == '__main__':
    t = threading.Thread(target=run_delayed_server, args=(0.1,), daemon=True)
    t.start()

    start = time.time()
    res = wait_for_server("http://127.0.0.1:8086", timeout=5)
    end = time.time()

    print(f"Time taken: {end - start:.3f} seconds, result: {res}")
