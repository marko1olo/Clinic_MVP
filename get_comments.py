from default_api import read_pr_comments

try:
    comments = read_pr_comments()
    print(comments)
except Exception as e:
    print(f"Error getting PR comments: {e}")
