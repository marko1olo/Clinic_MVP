Title: 🧪 Add edge case tests for SSH utility

🎯 **What:**
Added missing test coverage for the `ssh` function located in `utils.py`. The new tests focus on the unhandled edge cases including command timeout behaviors and decoding anomalies when reading from standard output and error streams.

📊 **Coverage:**
- Added `test_ssh_timeout`: Ensures the `timeout` argument correctly forwards to `client.exec_command`.
- Added `test_ssh_decode_error`: Validates that invalid UTF-8 byte sequences in `stdout` and `stderr` are safely decoded using `errors='replace'` without crashing the application.
- Added `test_ssh_long_command_and_custom_desc`: Verifies that logging properly truncates very long commands or accurately uses custom descriptions provided through the `desc` argument.

✨ **Result:**
Test coverage of the `ssh` utility has been substantially improved, bringing confidence that unexpected byte streams or edge-case execution times are appropriately handled. All tests pass with no regressions introduced in dependent scripts like `test_setup_backups.py`.
