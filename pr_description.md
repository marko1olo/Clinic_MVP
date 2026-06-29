🧹 [code health] Remove unused `get_scan_by_id` function

🎯 What: Removed the `get_scan_by_id` function from `ShadowAnalyst/gui/database.py`.
💡 Why: The function was identified as unused dead code and its removal improves maintainability and readability of the codebase by eliminating unneeded code paths.
✅ Verification: Confirmed via search that the function is not referenced anywhere else in the codebase and executed python test script to ensure that the module can still be imported successfully.
✨ Result: Reduced dead code, improving overall code health without affecting functionality.
