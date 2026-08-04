# -*- coding: utf-8 -*-
"""Live smoke: steril scan + leads POST with bad body → 400 RU message-first.
Mint tokens with AUTH_TOKEN_SECRET matching apps/api/.env."""
from __future__ import annotations

import json
import os
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(r"C:/Clinic_MVP/dental-crm")
OUT = Path(r"C:/Clinic_MVP/dental-crm/.tmp/smoke_gameplay.txt")
TOKEN_OUT = Path(r"C:/Clinic_MVP/dental-crm/.tmp/smoke_token.txt")
MINT = ROOT / ".tmp" / "mint-demo-token.mjs"
API = "http://127.0.0.1:4100"
SECRET = "dev-auth-token-secret-for-tests"
lines: list[str] = []


def log(s: str) -> None:
	lines.append(s)
	print(s)


# health
try:
	with urllib.request.urlopen(API + "/api/health", timeout=5) as r:
		log(f"HEALTH={r.status} {r.read().decode('utf-8', 'replace')[:200]}")
except Exception as e:
	log(f"HEALTH_FAIL={e!r}")
	OUT.write_text("\n".join(lines), encoding="utf-8")
	sys.exit(2)

# mint with correct secret
env = os.environ.copy()
env["AUTH_TOKEN_SECRET"] = SECRET
mint_cmd = ["node", str(MINT)]
if not MINT.is_file():
	# fallback: try package scripts / inline
	log(f"MINT_MISSING={MINT}")
	# try reading existing token
	if TOKEN_OUT.is_file():
		log("USING_EXISTING_TOKEN_FILE")
	else:
		OUT.write_text("\n".join(lines), encoding="utf-8")
		sys.exit(3)
else:
	proc = subprocess.run(
		mint_cmd,
		cwd=str(ROOT),
		capture_output=True,
		text=True,
		encoding="utf-8",
		errors="replace",
		env=env,
		timeout=30,
	)
	log(f"MINT_RC={proc.returncode}")
	log(f"MINT_STDOUT={proc.stdout[:500]!r}")
	log(f"MINT_STDERR={proc.stderr[:300]!r}")
	if proc.returncode == 0 and proc.stdout.strip():
		TOKEN_OUT.write_text(proc.stdout.strip(), encoding="utf-8")

raw = TOKEN_OUT.read_text(encoding="utf-8").strip()
# token file may be JSON or bare
try:
	d = json.loads(raw)
	if isinstance(d, dict) and "staffToken" in d:
		staff, clinic = d["staffToken"], d["clinicToken"]
	else:
		raise ValueError("not dict tokens")
except Exception:
	# try last JSON object in output
	import re

	m = re.search(r"\{[^{}]*staffToken[^{}]*\}", raw, re.S)
	if not m:
		log(f"TOKEN_PARSE_FAIL raw={raw[:400]!r}")
		OUT.write_text("\n".join(lines), encoding="utf-8")
		sys.exit(4)
	d = json.loads(m.group(0))
	staff, clinic = d["staffToken"], d["clinicToken"]

log(f"STAFF_LEN={len(staff)} CLINIC_LEN={len(clinic)}")


def post(label: str, path: str, body: bytes, auth: bool = True) -> None:
	headers = {"Content-Type": "application/json"}
	if auth:
		headers["x-dente-staff-token"] = staff
		headers["x-dente-clinic-token"] = clinic
	req = urllib.request.Request(API + path, data=body, method="POST", headers=headers)
	try:
		with urllib.request.urlopen(req, timeout=10) as r:
			code = r.status
			body_txt = r.read().decode("utf-8", "replace")
	except urllib.error.HTTPError as e:
		code = e.code
		body_txt = e.read().decode("utf-8", "replace")
	except Exception as e:
		code = None
		body_txt = repr(e)
	log(f"{label}_STATUS={code}")
	log(f"{label}_BODY={body_txt}")
	# assert gameplay shape
	if auth and code == 400:
		try:
			payload = json.loads(body_txt)
			msg = payload.get("message") or ""
			err = payload.get("error") or ""
			cyr = bool(__import__("re").search(r"[А-Яа-яЁё]", msg))
			log(f"{label}_ERROR={err}")
			log(f"{label}_MESSAGE_CYR={cyr}")
			log(f"{label}_MESSAGE={msg}")
		except Exception as ex:
			log(f"{label}_JSON_FAIL={ex!r}")


# workspace profile array (regression)
post("WP_ARRAY", "/api/workspace/profile", b"[]", auth=True)
post("WP_NOAUTH", "/api/workspace/profile", b"[]", auth=False)

# sterilization bad body
post("STERIL_EMPTY", "/api/sterilization/scan", b"{}", auth=True)
post("STERIL_ARRAY", "/api/sterilization/scan", b"[]", auth=True)
post("STERIL_NOAUTH", "/api/sterilization/scan", b"{}", auth=False)

# leads bad body
post("LEAD_EMPTY", "/api/leads", b"{}", auth=True)
post("LEAD_ARRAY", "/api/leads", b"[]", auth=True)
post("LEAD_NOAUTH", "/api/leads", b"{}", auth=False)
post("LEAD_STATUS_BAD", "/api/leads/00000000-0000-4000-8000-000000000001/status", b'{"status":"nope"}', auth=True)

OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
log(f"WROTE={OUT}")
