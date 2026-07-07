file_path = r"C:\Clinic_MVP\ShadowAnalyst\gui\static\app.js"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the double brace syntax error
bad_block = """            }
            }
        } catch (e) {"""

good_block = """            }
        } catch (e) {"""

if bad_block in content:
    content = content.replace(bad_block, good_block)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("SUCCESS: app.js syntax error cleaned up!")
else:
    # Try with \r\n
    bad_block_rn = bad_block.replace("\n", "\r\n")
    good_block_rn = good_block.replace("\n", "\r\n")
    if bad_block_rn in content:
        content = content.replace(bad_block_rn, good_block_rn)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("SUCCESS: app.js syntax error cleaned up (rn)!")
    else:
        print("WARNING: Bad block not found, checking file...")
