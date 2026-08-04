"""Run leadsFinanceSterilBody inject tests; write result to fixed path."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

API = Path(r"C:\Clinic_MVP\dental-crm\apps\api")
TEST = API / "src" / "tests" / "routes" / "leadsFinanceSterilBody.test.ts"
OUT = Path(r"C:\Clinic_MVP\dental-crm\.tmp\steril_leads_test_out.txt")
OUT.parent.mkdir(parents=True, exist_ok=True)

lines = [
	f"cwd_start={os.getcwd()}",
	f"api_exists={API.is_dir()}",
	f"test_exists={TEST.is_file()}",
	f"test_size={TEST.stat().st_size if TEST.is_file() else 0}",
]

cmd = ["node", "--import", "tsx", "--test", str(TEST)]
env = os.environ.copy()
env["NODE_ENV"] = "development"

proc = subprocess.run(
	cmd,
	cwd=str(API),
	capture_output=True,
	text=True,
	encoding="utf-8",
	errors="replace",
	env=env,
	timeout=180,
)
lines.append(f"returncode={proc.returncode}")
lines.append("--- STDOUT ---")
lines.append(proc.stdout or "")
lines.append("--- STDERR ---")
lines.append(proc.stderr or "")
OUT.write_text("\n".join(lines), encoding="utf-8")
print(f"wrote {OUT} rc={proc.returncode}")
sys.exit(proc.returncode)
