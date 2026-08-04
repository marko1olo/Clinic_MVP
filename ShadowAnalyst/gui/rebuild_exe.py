import os
import shutil
import subprocess
import sys
import time
import logging

logging.basicConfig(level=logging.INFO, format="%(message)s")

logging.info("[1] Killing ShadowAnalyst processes...")
subprocess.run(
    ["taskkill", "/F", "/IM", "ShadowAnalyst.exe", "/T"], capture_output=True
)
time.sleep(2)

logging.info("[2] Removing locked files...")
for f in [
    r"C:\Clinic_MVP\ShadowAnalyst\gui\dist\ShadowAnalyst.exe",
    r"C:\Clinic_MVP\ShadowAnalyst.exe",
]:
    if os.path.exists(f):
        try:
            os.remove(f)
            logging.info(f"  Deleted: {f}")
        except Exception as e:
            logging.error(f"  Could not delete {f}: {e}")

logging.info("[3] Removing build/dist folders...")
for d in [
    r"C:\Clinic_MVP\ShadowAnalyst\gui\build",
    r"C:\Clinic_MVP\ShadowAnalyst\gui\dist",
]:
    if os.path.exists(d):
        shutil.rmtree(d, ignore_errors=True)
        logging.info(f"  Removed: {d}")

time.sleep(1)

logging.info("[4] Running PyInstaller...")
py = r"C:\Users\Admin\AppData\Local\Programs\Python\Python313\python.exe"
result = subprocess.run(
    [py, "-m", "PyInstaller", "--clean", "ShadowAnalyst.spec"],
    cwd=r"C:\Clinic_MVP\ShadowAnalyst\gui",
)

if result.returncode == 0:
    logging.info("\n[5] Build SUCCESS. Copying to root...")
    src = r"C:\Clinic_MVP\ShadowAnalyst\gui\dist\ShadowAnalyst.exe"
    dst = r"C:\Clinic_MVP\ShadowAnalyst.exe"
    shutil.copy2(src, dst)
    size_mb = round(os.path.getsize(dst) / (1024 * 1024), 1)
    logging.info(f"  Done! {dst}  --  {size_mb} MB")
else:
    logging.error(f"\n[ERROR] Build failed with code {result.returncode}")
    sys.exit(result.returncode)
