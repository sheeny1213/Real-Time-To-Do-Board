# Logic_Document.md

## Smart Assign

**How it works:**  
The Smart Assign feature automatically assigns a task to the user with the fewest active (not Done) tasks. When a user clicks the “Smart Assign” button on a task, the app counts the number of active tasks for each user and selects the user with the lowest count. This ensures tasks are distributed as evenly as possible among all users.

**Example:**  
Suppose there are three users: Alice, Bob, and Carol.  
- Alice has 2 active tasks  
- Bob has 1 active task  
- Carol has 3 active tasks  
If you click Smart Assign on a new task, it will be assigned to Bob, since he has the fewest active tasks.

---

## Conflict Handling

**How it works:**  
Conflict handling is triggered when two users try to edit the same task at the same time. Each task has a version number. When a user submits an edit, the backend checks if the version number matches the latest version in the database. If it doesn’t, a conflict is detected.

When  a conflict occurs, both users are shown a modal displaying:
- Their own (local) changes
- The latest version from the server (other user’s changes)

The user can then choose to:
- **Overwrite:** Replace the server’s version with their own changes.
- **Merge:** Combine both versions (the app provides a simple merge, preferring local changes but updating the version).

**Example:**  
- User A and User B both open Task X.
- User A changes the title and saves.
- User B changes the description and saves (after User A).
- The backend detects the version mismatch and returns both versions to User B.
- User B can now choose to overwrite or merge the changes.
