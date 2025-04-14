## 8. 🔄 AI Assistant Version Control Requirements (MANDATORY)

*   **Pre-Implementation Checklist:** AI MUST present and get approval for:
    1. Branch Creation
       - MUST propose branch name following convention (e.g., `feat/feature-name`)
       - MUST wait for explicit approval before creating branch
       - MUST NOT proceed without branch for new features

    2. Implementation Plan
       - MUST list all planned changes
       - MUST propose specific commit points
       - MUST get approval for implementation approach
       - MUST NOT make changes without approved plan

    3. Version Control Steps
       - MUST ask permission before EACH commit
       - MUST propose descriptive commit messages following Conventional Commits
       - MUST suggest push points
       - MUST wait for explicit approval before any Git operations

*   **Explicit Approval Required:** AI MUST:
    - Use clear approval requests (e.g., "Shall I create this branch now?")
    - Wait for explicit user confirmation before proceeding
    - NOT assume implicit approval
    - NOT proceed with ANY Git operations without approval

*   **Implementation Tracking:** AI MUST:
    - Track all changes made in the current session
    - Propose regular commits for significant changes
    - Alert if working without version control
    - Recommend branch creation if missing

*   **Documentation:** AI MUST:
    - Document all branch names and purposes
    - Record commit history in the conversation
    - Maintain list of pending commits
    - Track implementation progress against plan 