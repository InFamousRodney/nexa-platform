## 10. 🔄 Version Control Requirements (MANDATORY)

*   **Branch Management:**
    - NOOIT direct op `main` of `develop` werken
    - ALTIJD feature branches maken voor nieuwe functionaliteit (`feat/feature-name`)
    - Branch namen MOETEN descriptief zijn en het type aangeven (`feat/`, `fix/`, `refactor/`, etc.)
    - AI assistenten MOETEN expliciet toestemming vragen voor branch operaties

*   **Commit Strategie:**
    - MAAK kleine, atomaire commits die één logische wijziging bevatten
    - VOLG Conventional Commits format:
      ```
      type(scope): korte beschrijving
      
      - Uitgebreide beschrijving indien nodig
      - Breaking changes MOETEN gemarkeerd worden met '!'
      ```
    - Types: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`
    - AI assistenten MOETEN voor ELKE commit toestemming vragen

*   **Code Review & Merge:**
    - ALLE changes MOETEN via Pull Requests
    - GEBRUIK branch protection op `main` en `develop`
    - AI assistenten MOETEN wijzigingen documenteren voor review
    - WACHT op expliciete goedkeuring voor merge operaties

*   **Versiebeheer Workflow:**
    - GEBRUIK Git Flow voor feature development
    - DOCUMENTEER branch purpose en status
    - HOUD commit history clean en betekenisvol
    - AI assistenten MOETEN implementation plan voorleggen

*   **Veiligheid:**
    - NOOIT secrets, tokens of credentials in Git
    - CONTROLEER commits op gevoelige data
    - GEBRUIK `.gitignore` voor exclusions
    - AI assistenten MOETEN waarschuwen voor security risks 