import os
import subprocess
import sys

root_dir = r"C:\Clinic_MVP"

print(f"Scanning {root_dir} for Git repositories...")

# List of dirs to check
dirs_to_check = [root_dir]
for entry in os.scandir(root_dir):
    if entry.is_dir() and not entry.name.startswith(".") and entry.name != "node_modules":
        dirs_to_check.append(entry.path)

git_repos = []
for d in dirs_to_check:
    git_dir = os.path.join(d, ".git")
    if os.path.exists(git_dir) and os.path.isdir(git_dir):
        git_repos.append(d)

print(f"Found {len(git_repos)} Git repositories:")
for repo in git_repos:
    print(f"  - {repo}")

print("\nRunning 'git pull' in each repository...")
for repo in git_repos:
    print(f"\n========================================")
    print(f"Pulling in: {repo}")
    print(f"========================================")
    try:
        # Run git pull
        res = subprocess.run(
            ["git", "pull"],
            cwd=repo,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=30
        )
        if res.returncode == 0:
            print("Status: SUCCESS")
            if res.stdout:
                print("Output:\n" + res.stdout.strip())
            else:
                print("Already up to date.")
        else:
            print("Status: FAILED")
            print("Error:\n" + res.stderr.strip() + "\n" + res.stdout.strip())
    except Exception as e:
        print(f"Status: EXCEPTION - {e}")
