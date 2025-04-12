06 - Plan voor Ontwikkelomgeving & Tooling
Status: IN PROGRESS (Lokale Dev Env OK, Tooling Gekozen)
Inhoudsopgave:
Code Repository
Lokale Ontwikkelomgeving
Kerntechnologieën (Herhaling)
Code Editor & Extensies
Code Kwaliteit & Consistentie
Testing Frameworks
CI/CD
Project Management

1. Code Repository
Status: [✓ Ingericht & In Gebruik]

1.1 Versiebeheer & Hosting
Status: [✓ Geïmplementeerd]
- Versiebeheer: Git [Status: ✓ Gebruikt]
- Hosting: GitHub [Status: ✓ Gekozen & In Gebruik]
  - Gekozen vanwege integraties zoals Actions
  - Alternatieven (GitLab/Bitbucket) niet meer in overweging

1.2 Repository Structuur
Status: [✓ Geïmplementeerd]
Monorepo beheerd met PNPM workspaces:
```
/nexa-platform/
├── apps/
│   ├── frontend/         # React app
│   └── supabase/         # Supabase project (migrations, functions, seed)
├── packages/             # (Nog niet in gebruik)
├── docs/                 # Documentatie
├── pnpm-workspace.yaml
├── package.json
```

1.3 Branching Strategie
Status: [✓ Concept OK, Implementatie TBD]
Gitflow (of variant) aanbevolen:
- main: Productie code, stabiele releases
- develop: Integratiebranch voor volgende release, basis voor staging deployments
- feature/xxx: Branches voor nieuwe features, afgetakt van develop
- bugfix/xxx: Branches voor fixes op develop
- hotfix/xxx: Branches voor urgente fixes op main

1.4 Pull Request Proces
Status: [✓ Gedefinieerd, Implementatie TODO]
- Alle merges naar main en develop gaan via Pull Requests
- Vereisten:
  - Minimaal één review
  - Succesvolle CI checks (linting, tests)
  - Beschrijvende titel en beschrijving
  - Gerelateerde issues gelinkt

2. Lokale Ontwikkelomgeving
Status: [✓ Operationeel]

2.1 Vereiste Software
Status: [✓ Alle Geïnstalleerd]
- Node.js (LTS versie) [Status: ✓ Geïnstalleerd]
- PNPM [Status: ✓ Geïnstalleerd]
- Git [Status: ✓ Geïnstalleerd]
- Docker Desktop [Status: ✓ Geïnstalleerd]
- Supabase CLI [Status: ✓ Geïnstalleerd]

2.2 Setup Stappen
Status: [✓ Basis OK]

2.2.1 Repository Setup
Status: [✓ Gedaan]
- Clone de Git repository [Status: ✓ Gedaan]
- Installeer project dependencies (pnpm install in root) [Status: ✓ Gedaan]

2.2.2 Supabase Setup
Status: [✓ Werkend]
- Login bij Supabase CLI (supabase login) [Status: ✓ Gedaan]
- Start Supabase services (supabase start vanuit apps/supabase) [Status: ✓ Werkend]
- Pas migraties toe en seed data (supabase db reset) [Status: ✓ Werkend]

2.2.3 Neo4j Setup
Status: [✓ Basis OK, Setup TODO]
- Start Neo4j container via docker-compose up -d [Status: ✓ Werkend]
- Voer initiele Cypher CREATE CONSTRAINT/INDEX commando's uit in Neo4j Browser [Status: [ ] TODO]

2.2.4 Environment Configuratie
Status: [✓ Basis OK]
- Maak .env bestanden aan op basis van .env.example [Status: ✓ Basis OK (voor lokaal)]
- Configureer lokale database URLs, Supabase anon key, service role key, Neo4j credentials

2.2.5 Applicatie Starten
Status: [✓ Basis OK]
- Start Frontend dev server (pnpm --filter frontend dev) [Status: ✓ Werkend]
- Lokale Supabase functions (Deno runtime) [Status: ✓ Werkend (runtime, nog geen functies)]

3. Kerntechnologieën (Herhaling & Status)
Status: [✓ Keuzes Gemaakt, Status Toegevoegd]

3.1 Frontend Stack
Status: [✓ Basis OK, Deels Geïmplementeerd]
- React [Status: ✓ Gebruikt]
- TypeScript [Status: ✓ Gebruikt]
- Tailwind CSS [Status: ✓ Gebruikt]
- Zustand [Status: ✓ Geïnstalleerd, Basis Store OK]
- React Router [Status: ✓ Geïnstalleerd, Basis Routes OK]
- TanStack Query (useQuery) [Status: ✓ Geïnstalleerd, Gebruikt]
- Cytoscape.js [Status: [ ] Nog niet geïmplementeerd]

3.2 Backend (API) Stack
Status: [✓ Gekozen, Implementatie TODO]
- Deno Runtime [Status: ✓ Gekozen]
- TypeScript [Status: ✓ Gekozen]
- Standaard Deno http/server [Status: ✓ Gekozen]
- Supabase JS Client [Status: ✓ Compatibel, Nog niet gebruikt in backend]
- Neo4j JS Driver [Status: [ ] Nog niet getest/geïmplementeerd in backend]
- JSforce (of alternatief) [Status: [ ] Nog niet getest/geïmplementeerd in backend]

3.3 Database Stack
Status: [✓ Gekozen, Deels Geïmplementeerd]
- PostgreSQL (via Supabase) [Status: ✓ Lokaal Actief & Schema OK]
- Neo4j [Status: ✓ Lokaal Actief, Model OK, Setup TODO]

4. Code Editor & Extensies
Status: [✓ Basis OK, Aanbevolen Extensies Gedefinieerd]

4.1 Code Editor
Status: [✓ Gekozen]
- VS Code [Status: ✓ Geïnstalleerd]
- Cursor [Status: ✓ Geïnstalleerd]

4.2 Aanbevolen Extensies
Status: [✓ Lijst Gedefinieerd, Installatie Optioneel]

4.2.1 TypeScript & JavaScript
Status: [✓ Basis Extensies Gedefinieerd]
- TypeScript Vue Plugin (Volar) [Status: ✓ Aanbevolen]
- ESLint [Status: ✓ Aanbevolen]
- Prettier [Status: ✓ Aanbevolen]
- Error Lens [Status: ✓ Aanbevolen]
- TypeScript Hero [Status: ✓ Aanbevolen]

4.2.2 React & UI
Status: [✓ Basis Extensies Gedefinieerd]
- React Developer Tools [Status: ✓ Aanbevolen]
- Tailwind CSS IntelliSense [Status: ✓ Aanbevolen]
- PostCSS Language Support [Status: ✓ Aanbevolen]
- CSS Modules [Status: ✓ Aanbevolen]

4.2.3 Database & API
Status: [✓ Basis Extensies Gedefinieerd]
- SQLTools [Status: ✓ Aanbevolen]
- SQLTools PostgreSQL/CockroachDB [Status: ✓ Aanbevolen]
- Neo4j Graph Database [Status: ✓ Aanbevolen]
- Thunder Client [Status: ✓ Aanbevolen]

4.2.4 Git & Project Management
Status: [✓ Basis Extensies Gedefinieerd]
- GitLens [Status: ✓ Aanbevolen]
- Git Graph [Status: ✓ Aanbevolen]
- Todo Tree [Status: ✓ Aanbevolen]
- Error Lens [Status: ✓ Aanbevolen]

4.2.5 Testing & Debugging
Status: [✓ Basis Extensies Gedefinieerd]
- Jest [Status: ✓ Aanbevolen]
- Test Explorer UI [Status: ✓ Aanbevolen]
- Debugger for Chrome [Status: ✓ Aanbevolen]

4.2.6 Docker & Containers
Status: [✓ Basis Extensies Gedefinieerd]
- Docker [Status: ✓ Aanbevolen]
- Remote - Containers [Status: ✓ Aanbevolen]

4.2.7 AI & Productivity
Status: [✓ Basis Extensies Gedefinieerd]
- GitHub Copilot [Status: ✓ Aanbevolen]
- Tabnine [Status: ✓ Aanbevolen]
- Code Spell Checker [Status: ✓ Aanbevolen]

5. Code Kwaliteit & Consistentie
Status: [✓ Concepten Gekozen, Implementatie TODO]

5.1 Linting & Code Style
Status: [✓ Geïnstalleerd, Configuratie TODO]
- ESLint [Status: ✓ Geïnstalleerd]
  - TypeScript configuratie [Status: ✓ Basis OK]
  - React configuratie [Status: ✓ Basis OK]
  - Deno/Node.js configuratie [Status: [ ] TODO]
- Prettier [Status: ✓ Geïnstalleerd]
  - Gedeelde configuratie (.prettierrc) [Status: ✓ Basis OK]
  - Integratie met ESLint [Status: [ ] TODO]

5.2 Git Hooks & Pre-commit Checks
Status: [✓ Concept Gedefinieerd, Implementatie TODO]
- husky [Status: [ ] Niet Geïnstalleerd]
- lint-staged [Status: [ ] Niet Geïnstalleerd]
- Pre-commit checks:
  - Linting [Status: [ ] Niet Geïmplementeerd]
  - Formatting [Status: [ ] Niet Geïmplementeerd]
  - Type checking [Status: [ ] Niet Geïmplementeerd]

5.3 Type Checking
Status: [✓ Basis OK]
- TypeScript strict mode [Status: ✓ Ingebouwd]
- Type checking in CI/CD [Status: [ ] TODO]
- Type definitions voor externe packages [Status: ✓ Basis OK]

5.4 Code Review Guidelines
Status: [✓ Gedefinieerd]
- Pull Request templates [Status: [ ] TODO]
- Code review checklist [Status: [ ] TODO]
- Best practices documentatie [Status: [ ] TODO]

6. Testing Frameworks
Status: [✓ Keuzes Gemaakt, Implementatie TODO]

6.1 Unit Testing
Status: [✓ Framework Gekozen, Setup TODO]
- Framework: Vitest [Status: ✓ Gekozen]
  - Voordelen: Snelheid, moderne API, Vite compatibiliteit
  - Alternatief: Jest [Status: ✓ Beschikbaar]
- Frontend Component Testing:
  - React Testing Library [Status: ✓ Gekozen]
  - Component isolatie en interactie tests
- Backend Unit Testing:
  - Deno/Node.js module tests
  - Utility functie tests

6.2 Integration Testing
Status: [✓ Concept Gedefinieerd, Setup TODO]
- Framework: Vitest/Jest [Status: ✓ Gekozen]
- Test Scope:
  - API route -> service -> DB interacties
  - Module integratie tests
  - Database integratie tests
- Test Database Setup:
  - PostgreSQL (via Supabase) [Status: [ ] TODO]
  - Neo4j [Status: [ ] TODO]

6.3 End-to-End Testing
Status: [✓ Framework Gekozen, Setup TODO]
- Framework: Playwright [Status: ✓ Gekozen]
  - Voordelen: Snelheid, betrouwbaarheid
  - Alternatief: Cypress [Status: ✓ Beschikbaar]
- Test Scope:
  - Volledige user flows
  - Browser interacties
  - Staging omgeving tests
- Test Environment:
  - Staging deployment [Status: [ ] TODO]
  - Test data setup [Status: [ ] TODO]

6.4 Test Coverage & Reporting
Status: [✓ Concept Gedefinieerd, Setup TODO]
- Coverage Tools:
  - Vitest/Jest coverage reporting [Status: [ ] TODO]
  - Coverage thresholds [Status: [ ] TODO]
- CI/CD Integration:
  - Coverage checks in PRs [Status: [ ] TODO]
  - Coverage reports in CI [Status: [ ] TODO]

7. CI/CD
Status: [✓ Tooling Gekozen, Implementatie TODO]

7.1 Platform & Configuratie
Status: [✓ Gekozen, Setup TODO]
- Platform: GitHub Actions [Status: ✓ Gekozen]
- Configuratie:
  - Workflow bestanden (.github/workflows/*.yaml) [Status: [ ] Niet Geïmplementeerd]
  - Pipeline stappen (zie TAD Sectie 7.2) [Status: [ ] Aanpassing voor Deno TODO]

7.2 Pipeline Stappen
Status: [✓ Concept Gedefinieerd, Implementatie TODO]
- Build:
  - Frontend build [Status: [ ] TODO]
  - Backend build [Status: [ ] TODO]
- Test:
  - Unit tests [Status: [ ] TODO]
  - Integration tests [Status: [ ] TODO]
  - E2E tests [Status: [ ] TODO]
- Deploy:
  - Staging deployment [Status: [ ] TODO]
  - Production deployment [Status: [ ] TODO]

7.3 Environment Management
Status: [✓ Concept Gedefinieerd, Setup TODO]
- Environment variabelen [Status: [ ] TODO]
- Secrets management [Status: [ ] TODO]
- Deployment targets [Status: [ ] TODO]

7.4 Monitoring & Logging
Status: [✓ Concept Gedefinieerd, Setup TODO]
- Build logs [Status: [ ] TODO]
- Test results [Status: [ ] TODO]
- Deployment status [Status: [ ] TODO]

8. Project Management
Status: [✓ Tools Gekozen/In Gebruik]

8.1 Issue Tracking
Status: [✓ Keuze Te Maken]
- GitHub Issues [Status: ✓ Beschikbaar]
  - Voordelen: Integratie met repository
  - Alternatieven:
    - Jira [Status: ✓ Beschikbaar]
    - Linear [Status: ✓ Beschikbaar]
    - Trello [Status: ✓ Beschikbaar]

8.2 Communicatie
Status: [✓ Keuze Gemaakt]
- Slack [Status: ✓ In Gebruik]
- Microsoft Teams [Status: ✓ Beschikbaar]

8.3 Documentatie
Status: [✓ In Gebruik]
- Google Drive / Gedeelde Map [Status: ✓ In Gebruik]
  - Planning documenten
  - Design documenten
- Repository docs/ map [Status: ✓ In Gebruik]
  - Technische documentatie
  - API documentatie

8.4 Project Planning
Status: [✓ Concept Gedefinieerd]
- Sprint planning [Status: [ ] TODO]
- Release planning [Status: [ ] TODO]
- Milestone tracking [Status: [ ] TODO]

