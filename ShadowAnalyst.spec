# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['ShadowAnalyst\\gui\\app.py'],
    pathex=[],
    binaries=[],
    datas=[('ShadowAnalyst/gui/static', 'static'), ('ShadowAnalyst/gui/templates', 'templates')],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=['torch', 'pandas', 'matplotlib', 'scipy', 'sympy', 'docutils', 'IPython', 'notebook', 'PIL.ImageQt', 'PyQt5', 'PyQt6', 'PySide2', 'PySide6', 'tkinter', 'Tkinter', 'unittest', 'mkl', 'libopenblas'],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='ShadowAnalyst',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
