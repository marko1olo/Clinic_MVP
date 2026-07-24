def reply_to_pr_comments(replies):
    print("Replying to comments", replies)

reply_to_pr_comments(
    replies='''[
        {
            "comment_id": "5056805083",
            "reply": "Understood. Acknowledging that this work is now obsolete and stopping work on this task."
        },
        {
            "comment_id": "5069319099",
            "reply": "Understood. Acknowledging that this work is now obsolete and stopping work on this task."
        },
        {
            "comment_id": "5070496165",
            "reply": "Understood. Acknowledging that this work is now obsolete and stopping work on this task."
        }
    ]'''
)
