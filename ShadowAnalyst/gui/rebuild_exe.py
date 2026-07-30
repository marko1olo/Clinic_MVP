import subprocess, sys, os, time, shutil

GUI_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(os.path.dirname(GUI_DIR))

print("[1] Killing ShadowAnalyst processes...")
subprocess.run(
    ["taskkill", "/F", "/IM", "ShadowAnalyst.exe", "/T"],
    capture_output=True
)
time.sleep(2)

print("[2] Removing locked files...")
for f in [
    os.path.join(GUI_DIR, "dist", "ShadowAnalyst.exe"),
    os.path.join(ROOT_DIR, "ShadowAnalyst.exe"),
]:
    if os.path.exists(f):
        try:
            os.remove(f)
            print(f"  Deleted: {f}")
        except Exception as e:
            print(f"  Could not delete {f}: {e}")

print("[3] Removing build/dist folders...")
for d in [
    os.path.join(GUI_DIR, "build"),
    os.path.join(GUI_DIR, "dist"),
]:
    if os.path.exists(d):
        shutil.rmtree(d, ignore_errors=True)
        print(f"  Removed: {d}")

time.sleep(1)

print("[4] Running PyInstaller...")
py = sys.executable
result = subprocess.run(
    [py, "-m", "PyInstaller", "--clean", "ShadowAnalyst.spec"],
    cwd=GUI_DIR
)

if result.returncode == 0:
    print("\n[5] Build SUCCESS. Copying to root...")
    src = os.path.join(GUI_DIR, "dist", "ShadowAnalyst.exe")
    dst = os.path.join(ROOT_DIR, "ShadowAnalyst.exe")
    shutil.copy2(src, dst)
    size_mb = round(os.path.getsize(dst) / (1024 * 1024), 1)
    print(f"  Done! {dst}  --  {size_mb} MB")
else:
    print(f"\n[ERROR] Build failed with code {result.returncode}")
    sys.exit(result.returncode)
