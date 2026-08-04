import pathlib
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
root = pathlib.Path(r"C:/Clinic_MVP/dental-crm")
out = []


def p(s: str) -> None:
	out.append(s)


t = (root / "apps/api/src/routes/sterilization.ts").read_text(encoding="utf-8")
for m in re.finditer(r'message:\s*"([^"]+)"', t):
	p("STERIL: " + m.group(1))

t2 = (root / "apps/api/src/routes/leads.ts").read_text(encoding="utf-8")
p("=== LEADS MSGS ===")
for m in re.finditer(r'message:\s*"([^"]+)"', t2):
	p(m.group(1))
p("=== LEADS safeParse ===")
for i, line in enumerate(t2.splitlines(), 1):
	if any(k in line for k in ("safeParse", "ValidationError", "message:")):
		p(f"{i}:{line.strip()[:160]}")

p("=== bookingFailure hits ===")
for fp in (root / "apps/web/src").rglob("*"):
	if fp.suffix in (".ts", ".tsx"):
		try:
			txt = fp.read_text(encoding="utf-8")
		except Exception:
			continue
		if "bookingFailureMessage" in txt or "operatorReadableErrorDetail" in txt:
			for i, line in enumerate(txt.splitlines(), 1):
				if "bookingFailureMessage" in line or "operatorReadableErrorDetail" in line:
					p(f"{fp}:{i}:{line.strip()[:180]}")

lk = root / "apps/web/src/components/leads/LeadsKanbanView.tsx"
p("=== Kanban exists " + str(lk.exists()) + " ===")
if lk.exists():
	txt = lk.read_text(encoding="utf-8")
	p("lines " + str(len(txt.splitlines())))
	for i, line in enumerate(txt.splitlines(), 1):
		low = line.lower()
		if any(
			k in low
			for k in (
				"toast",
				"addlead",
				"updatelead",
				"error",
				"message",
				"booking",
				"convert",
				"catch",
				"failed",
				"showtoast",
			)
		):
			p(f"{i}:{line.strip()[:180]}")

pst = root / "apps/web/src/lib/panelStateText.ts"
if pst.exists():
	p("=== panelStateText ===")
	for i, line in enumerate(pst.read_text(encoding="utf-8").splitlines(), 1):
		if i <= 100:
			p(f"{i}:{line}")

# diary message-first helper snippet
for name in (
	"apps/web/src/components/useVisitDiaryLogic.ts",
	"apps/web/src/lib/operatorReadableError.ts",
	"apps/web/src/lib/serverErrorText.ts",
):
	fp = root / name
	if fp.exists():
		p(f"=== {name} hits ===")
		txt = fp.read_text(encoding="utf-8")
		for i, line in enumerate(txt.splitlines(), 1):
			if any(
				k in line
				for k in (
					"message",
					"serverDetail",
					"FailureMessage",
					"Cyrillic",
					"payload",
					"ValidationError",
				)
			):
				if i < 200 or "function " in line:
					p(f"{i}:{line.strip()[:160]}")

pathlib.Path(r"C:/Clinic_MVP/dental-crm.tmp/discover_mf_out.txt").write_text(
	"\n".join(out), encoding="utf-8"
)
print("WROTE", len(out), "lines")
