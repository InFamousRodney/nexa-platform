02 - Technisch Architectuur Document (TAD) voor NEXA
Status: IN PROGRESS
Inhoudsopgave:
Architectuuroverzicht
Componenten en Technologiekeuzes
Dataflow Beschrijvingen (TODO)
Dataopslag Architectuur (TODO)
API Architectuur (TODO)
Security Architectuur (TODO)
Deployment Architectuur (TODO)


1. Architectuuroverzicht
NEXA volgt een moderne webapplicatie-architectuur, gecentreerd rond Supabase als Backend-as-a-Service (BaaS) platform en Neo4j als gespecialiseerde graph database. De architectuur bestaat uit de volgende hoofdlagen:

Frontend Laag (React):
- De gebruikersinterface, draaiend in de browser van de gebruiker
- Verantwoordelijk voor weergave, gebruikersinteractie en communicatie met de API Laag
- Gebruikt React (v18+) met TypeScript voor type-veilige ontwikkeling
- Implementeert Tailwind CSS voor styling en Headless UI componenten
- Maakt gebruik van Zustand voor state management en React Query voor data fetching
- Hosting op Vercel voor optimale performance en schaalbaarheid

API Laag (Supabase Edge Functions):
- De backend logica, gehost als serverless functions binnen Supabase
- Verantwoordelijk voor het afhandelen van requests van de frontend
- Orkestreert de dataflow tussen verschillende componenten
- Beheert authenticatie/autorisatie via Supabase Auth
- Communiceert met de datalagen en externe services
- Gebruikt Node.js (LTS) met TypeScript en Express.js voor robuuste API ontwikkeling

Dataopslag Laag:
Supabase Postgres DB:
- Relationele database voor persistente opslag van:
  - Gebruikersdata en authenticatie-info
  - Applicatieconfiguraties
  - Metadata snapshots (geparsed)
  - Analyseresultaten en logs
- Maakt gebruik van Row Level Security (RLS) voor data-scheiding
- Beheerd via Supabase Migrations voor versiebeheer

Neo4j Graph DB:
- Gespecialiseerde graph database (Neo4j AuraDB)
- Opslag van de knowledge graph (metadata componenten en relaties per snapshot)
- Gebruikt voor complexe dependency tracing en impactanalyse queries
- Beveiligd via database authenticatie en netwerk policies

Externe Services Laag:
Salesforce Platform:
- Bron van de metadata via OAuth 2.0 PKCE Flow
- Interactie via Metadata API en Tooling API
- Beveiligde opslag van access tokens in Supabase

AI Engine (LLM):
- OpenAI (GPT-4/GPT-3.5-Turbo) of Anthropic (Claude)
- Voor genereren van natuurlijke taal uitleg en remediatiesuggesties
- API keys veilig beheerd als secrets in Supabase Functions

Kernprincipes:
1. Supabase-Centric: Maximale benutting van Supabase features (Auth, DB, Functions, Storage)
2. Specialized Datastores: Postgres voor gestructureerde data, Neo4j voor graph queries
3. Serverless: API laag draait op schaalbare serverless functions
4. API-Driven: Communicatie via goed gedefinieerde API endpoints
5. Snapshot-Based: Analyses gebaseerd op point-in-time metadata snapshots
6. Security-First: Implementatie van RLS, OAuth, en veilige token opslag


2. Componenten en Technologiekeuzes
Status: [✓ Technologieën Gedefinieerd, ✓ Frontend Basis OK, ✓ DB Setup OK, API Implementatie TODO]

Hieronder een gedetailleerd overzicht van de technologieën per component, inclusief implementatiestatus.

2.1 Frontend (React)
Status: [✓ Geïnitialiseerd & Basis OK]
Framework: React (v18+) [Status: ✓ Gebruikt]
Taal: TypeScript [Status: ✓ Gebruikt]
UI Bibliotheek: 
- Tailwind CSS + Shadcn/UI [Status: ✓ Geïnstalleerd & Geconfigureerd]
- Headless UI componenten voor toegankelijkheid
State Management: Zustand [Status: ✓ Geïnstalleerd, Basis Store OK]
Routing: React Router [Status: ✓ Geïnstalleerd, Basis Routes OK]
Data Fetching: 
- React Query (TanStack Query) [Status: ✓ Geïnstalleerd, Gebruikt voor Mock Data]
- Supabase JS Client [Status: ✓ Geïnstalleerd]
Graph Visualisatie: Cytoscape.js [Status: [ ] Niet Geïmplementeerd]
Hosting: Vercel [Status: [ ] Niet Ingericht]

2.2 API Laag (Supabase Edge Functions)
Status: [✓ Technologie Gedefinieerd, Implementatie TODO]
Runtime: Node.js (LTS versie, bijv. v18 of v20) [Status: ✓ Beslissing Genomen]
Taal: TypeScript [Status: ✓ Gekozen]
Framework: Express.js [Status: ✓ Beslissing Genomen]
Supabase Interactie: Supabase JS Client (@supabase/supabase-js) [Status: ✓ Geïnstalleerd (Frontend), Compatibel]
Neo4j Interactie: Officiële Neo4j JavaScript Driver (neo4j-driver) [Status: [ ] Nog niet geïnstalleerd/getest]
Salesforce Interactie: JSforce [Status: [ ] Nog niet geïnstalleerd/getest]
LLM Interactie: Officiële SDK's of fetch [Status: [ ] Nog niet geïmplementeerd]
Build Proces: TypeScript compilatie naar JavaScript (bijv. met tsc of esbuild) [Status: Proces Gedefinieerd]

2.3 Dataopslag Laag
Supabase Postgres DB:
Status: [✓ Lokaal Geïmplementeerd]
Versie: Laatste stabiele versie [Status: ✓ Actief (Lokaal)]
Schema Beheer: Supabase Migrations [Status: ✓ In gebruik]
Toegang: Via Supabase JS Client & Edge Functions [Status: Concept OK]
Beveiliging: Row Level Security (RLS) policies [Status: ✓ Basis geïmplementeerd]

Neo4j Graph DB:
Status: [✓ Lokaal Gestart, Model Defined]
Hosting: Neo4j AuraDB (Aanbevolen) / Docker [Status: ✓ Lokaal via Docker]
Versie: Laatste stabiele versie [Status: ✓ Actief (Lokaal)]
Query Taal: Cypher [Status: ✓ Constraints/Indexen gedefinieerd]
Toegang: Via Neo4j JavaScript Driver [Status: [ ] Nog niet geïmplementeerd]
Beveiliging: Standaard Docker/AuraDB features [Status: Basis OK (Lokaal)]

2.4 Externe Services Laag
Status: [✓ Gedefinieerd, Integratie TODO]
Salesforce Platform:
Authenticatie: OAuth 2.0 PKCE Flow [Status: Concept OK]
API's: Metadata API, Tooling API, etc. [Status: Concept OK]

AI Engine (LLM):
Provider: OpenAI/Anthropic (Configureerbaar) [Status: Concept OK]
Integratie: SDK's / REST API [Status: Concept OK]
Beveiliging: API keys via Supabase secrets [Status: Concept OK]

2.5 Ontwikkeling & Tooling
Status: [✓ Ingesteld & Gebruikt]
Versiebeheer: Git (GitHub) [Status: ✓ Actief]
Code Editor: VS Code [Status: ✓ Actief]
Package Manager: PNPM [Status: ✓ Actief]
Lokale Ontwikkeling:
- Supabase CLI [Status: ✓ Actief]
- Docker Compose (voor Neo4j) [Status: ✓ Actief]
CI/CD: GitHub Actions [Status: [ ] Niet Ingericht]


3. Dataflow Beschrijvingen
Status: [✓ Conceptueel Gedefinieerd, Implementatie TODO]

Deze sectie beschrijft de sequenties van interacties tussen componenten voor kernfunctionaliteiten.

3.1 Dataflow: Metadata Pipeline (Fetch, Parse, Store, Build Graph)
Status: [✓ Conceptueel Gedefinieerd, Implementatie TODO]

Dit proces wordt getriggerd door de gebruiker vanuit de frontend om Salesforce metadata te importeren en de knowledge graph te bouwen/updaten.

Trigger (Frontend):
- Gebruiker selecteert een gekoppelde Salesforce Org en klikt op "Fetch Metadata"
- React Frontend stuurt een authenticated HTTPS POST request naar een specifieke API endpoint op de Supabase Edge Function (bijv. /api/pipeline/start)
- Request bevat het ID van de gekoppelde org
[Status: Frontend UI element bestaat (conceptueel), API call TODO]

Start Pipeline (API Function):
- Edge Function valideert de request en de autorisatie van de gebruiker (via Supabase Auth context)
- Maakt een nieuw metadata_snapshot record aan in de Supabase Postgres DB met status 'PENDING' of 'FETCHING'
- Retourneert het snapshot_id naar de frontend
[Status: Auth validatie & DB interactie TODO]

Fetch Metadata (API Function):
- Edge Function haalt de benodigde Salesforce access token op voor de geselecteerde org
- Gebruikt JSforce om verbinding te maken met de Salesforce Platform Metadata API
- Vraagt de benodigde metadata types op (Objecten, Fields, Flows, etc.)
- Werkt de status van de metadata_snapshot bij naar 'FETCHING'
[Status: SF API interactie & DB status update TODO]

Parse Metadata (API Function):
- Na succesvolle ontvangst van de metadata (XML/ZIP), parsed de Edge Function deze data
- De parsing logica zet de ruwe metadata om naar de vooraf gedefinieerde, consistente structuur per component type
- Werkt de status bij naar 'PARSING'
[Status: Parsing logica & DB status update TODO]

Store Metadata (API Function):
- Edge Function schrijft de gestructureerde metadata weg naar de relevante tabellen in de Supabase Postgres DB
- Werkt de status bij naar 'STORING' of 'STORED'
[Status: DB interactie TODO]

Start Graph Population (API Function):
- Wordt getriggerd na succesvolle opslag van metadata
- Werkt de status bij naar 'BUILDING_GRAPH'
[Status: Trigger mechanisme & DB status update TODO]

Populate Graph (API Function):
- Edge Function leest de gestructureerde metadata uit de Supabase DB
- Vertaalt deze data naar Cypher CREATE of MERGE statements voor nodes en relaties
- Maakt verbinding met de Neo4j Graph DB via de Neo4j JavaScript Driver
- Voert de Cypher queries uit om de graph te bouwen of bij te werken
[Status: Neo4j interactie & DB status update TODO]

Voltooiing (API Function & Frontend):
- Edge Function werkt de status bij naar 'COMPLETED' of 'FAILED'
- Frontend kan periodiek de status opvragen via een API endpoint
- Toont de status aan de gebruiker
[Status: Frontend status update & DB status update TODO]

3.2 Dataflow: AI Impact Analyse Vraag
Status: [✓ Conceptueel Gedefinieerd, Implementatie TODO]

Dit proces beschrijft hoe een vraag van de gebruiker in de AI Assistant wordt afgehandeld.

Vraag Stellen (Frontend):
- Gebruiker typt een vraag in de AI Assistant UI
- React Frontend stuurt een authenticated HTTPS POST request naar een API endpoint
- Request bevat de vraagtekst en het snapshot_id
[Status: Frontend UI element bestaat (conceptueel), API call TODO]

Vraag Verwerking (API Function):
- Edge Function valideert de input en autorisatie
- Interpreteert de gebruikersvraag (intentie en entiteiten)
[Status: NLU/Intentieherkenning TODO]

Graph Query (API Function):
- Genereert Cypher queries op basis van de geïnterpreteerde vraag
- Voert de queries uit op de Neo4j Graph DB
[Status: Cypher generatie & Neo4j interactie TODO]

Context Voorbereiding (API Function):
- Verzamelt de resultaten van de Neo4j query
- Bereidt de context voor de LLM voor (vraag, resultaten, instructies)
[Status: Prompt engineering TODO]

LLM Aanroep (API Function):
- Stuurt de voorbereide prompt naar de AI Engine
- Wacht op het antwoord
[Status: LLM API interactie TODO]

Antwoord Verwerking & Opslag (API Function):
- Ontvangt en verwerkt het antwoord van de LLM
- Slaat de interactie op in de ai_interactions tabel
- Stuurt het antwoord terug naar de frontend
[Status: DB interactie TODO]

Antwoord Tonen (Frontend):
- React Frontend ontvangt en toont het antwoord
- Toont feedback knoppen
[Status: Frontend UI update TODO]

Feedback Verwerking (Optioneel):
- Frontend stuurt feedback naar een apart API endpoint
- Edge Function slaat feedback op in de ai_interactions tabel
[Status: Frontend API call & DB interactie TODO]


4. Dataopslag Architectuur
Status: [✓ Supabase Lokaal OK, Neo4j Model Defined]

Deze sectie beschrijft de structuur en modellen voor dataopslag in Supabase Postgres en Neo4j.

4.1 Supabase (PostgreSQL) Datamodel
Status: [✓ Lokaal Geïmplementeerd & Geseed]

De Supabase database wordt gebruikt voor gestructureerde data, gebruikersbeheer, en het persisteren van de geparste metadata voordat deze naar Neo4j gaat.

Kern Tabellen: [Status: ✓ Alle tabellen aangemaakt via migratie]
users (Beheerd door Supabase Auth):
- id (uuid, primary key) - Standaard Supabase user ID
- email (text) - Standaard Supabase
- ... (Andere standaard Supabase Auth velden)

organizations:
- id (uuid, primary key) - Uniek ID voor de tenant/organisatie in NEXA
- name (text) - Naam van de organisatie
- owner_id (uuid, foreign key naar users.id) - Optioneel, wie de org heeft aangemaakt
- created_at (timestampz)

organization_members:
- organization_id (uuid, foreign key naar organizations.id)
- user_id (uuid, foreign key naar users.id)
- role (text, bijv. 'admin', 'member')
- created_at (timestampz)
- Primary key op (organization_id, user_id)

salesforce_connections:
- id (uuid, primary key)
- organization_id (uuid, foreign key naar organizations.id)
- sf_org_id (text, 18-char) - Unieke Salesforce Org ID
- sf_user_id (text) - Salesforce User ID
- instance_url (text) - Salesforce instance URL
- access_token (text, encrypted) - Versleuteld access token
- refresh_token (text, encrypted) - Versleuteld refresh token
- status (text, bijv. 'active', 'inactive', 'revoked')
- last_connected_at (timestampz)
- created_at (timestampz)
- user_id (uuid, foreign key naar users.id)

metadata_snapshots:
- id (uuid, primary key)
- sf_connection_id (uuid, foreign key naar salesforce_connections.id)
- status (text, 'PENDING', 'FETCHING', 'PARSING', 'STORING', 'STORED', 'BUILDING_GRAPH', 'COMPLETED', 'FAILED')
- error_message (text, nullable)
- triggered_by (uuid, foreign key naar users.id)
- created_at (timestampz)
- completed_at (timestampz, nullable)

parsed_components:
- id (uuid, primary key)
- snapshot_id (uuid, foreign key naar metadata_snapshots.id, index)
- component_type (text, bijv. 'CustomObject', 'CustomField', 'Flow', 'ApexTrigger', 'Report', index)
- api_name (text, index)
- label (text, nullable)
- sf_id (text, nullable)
- attributes (jsonb)
- raw_definition (text, nullable)
- created_at (timestampz)

parsed_relationships:
- id (uuid, primary key)
- snapshot_id (uuid, foreign key naar metadata_snapshots.id, index)
- source_component_id (uuid, foreign key naar parsed_components.id)
- target_component_id (uuid, foreign key naar parsed_components.id)
- relationship_type (text, bijv. 'FIELD_USED_IN_FLOW', 'FLOW_REFERENCES_FIELD', 'FIELD_BELONGS_TO_OBJECT', index)
- context (jsonb, nullable)
- created_at (timestampz)

analysis_results:
- id (uuid, primary key)
- snapshot_id (uuid, foreign key naar metadata_snapshots.id, index)
- analysis_type (text, bijv. 'Flow Inconsistency Check', 'Unused Component', index)
- component_id (uuid, foreign key naar parsed_components.id, nullable)
- severity (text, bijv. 'Error', 'Warning', 'Info')
- description (text)
- details (jsonb, nullable)
- created_at (timestampz)

ai_interactions:
- id (uuid, primary key)
- snapshot_id (uuid, foreign key naar metadata_snapshots.id)
- user_id (uuid, foreign key naar users.id)
- prompt (text)
- neo4j_query_summary (text, nullable)
- llm_response (text)
- feedback_rating (integer, nullable, bijv. 1=👍, -1=👎)
- feedback_comment (text, nullable)
- created_at (timestampz)

Beveiliging: [Status: ✓ Basis geïmplementeerd]
Row Level Security (RLS) policies zijn geïmplementeerd om ervoor te zorgen dat gebruikers alleen toegang hebben tot data die behoort tot de organizations waarvan zij lid zijn.

4.2 Neo4j Graph Model
Status: [✓ Model Gedefinieerd, Setup TODO]

De Neo4j database bevat de knowledge graph, geoptimaliseerd voor het traceren van afhankelijkheden. Elke node en relatie bevat een snapshotId property om data van verschillende snapshots te scheiden.

Node Labels (Voorbeelden): [Status: ✓ Gedefinieerd]
:MetadataComponent (Abstract)
- Properties: snapshotId, apiName, label, type, sfId, createdAt

:CustomObject
- Properties: sharingModel, ...

:CustomField
- Properties: dataType, isRequired, formula, ...

:Flow
- Properties: processType, status, ...

:ApexTrigger
- Properties: events (list<string>, e.g., ['before insert', 'after update']), ...

:Report
- Properties: reportType, ...

Relationship Types (Voorbeelden): [Status: ✓ Gedefinieerd]
BELONGS_TO
REFERENCES
USED_IN (met properties)
TRIGGERS
IMPACTS

Indexering: [Status: ✓ Gedefinieerd, nog niet toegepast]
Indexen op :MetadataComponent(snapshotId) en :MetadataComponent(apiName) en :MetadataComponent(type) zijn gedefinieerd.

Constraint: [Status: ✓ Gedefinieerd, nog niet toegepast]
Een UNIQUE constraint op (:MetadataComponent {snapshotId, apiName}) is gedefinieerd.

Model Evolutie: Dit model is een startpunt en kan evolueren op basis van performance analyse en nieuwe requirements.

5. API Architectuur
Status: [✓ Conceptueel Gedefinieerd, Implementatie TODO]

Deze sectie definieert de architectuur van de API-laag die draait op Supabase Edge Functions en dient als de interface tussen de frontend en de backend logica/data.

5.1 API Stijl en Format
Status: [✓ Gedefinieerd]
Stijl: RESTful API. We gebruiken standaard HTTP-methoden (GET, POST, PUT, DELETE) en resource-gebaseerde URL's.
Format: JSON voor zowel request bodies als response bodies.
Content Type: application/json.

5.2 Hosting en Framework
Status: [✓ Technologie Gedefinieerd]
Hosting: Supabase Edge Functions. Elke (of een groep gerelateerde) endpoint(s) wordt geïmplementeerd als een aparte Edge Function in een eigen map binnen apps/supabase/functions/.
Framework: Node.js runtime met het Express.js framework voor routing, request/response handling en middleware.

5.3 Basispad en Versioning
Status: [✓ Gedefinieerd]
Basispad: Alle API-endpoints zullen beschikbaar zijn onder een basispad, bijvoorbeeld /api/v1.
Versioning: API-versies worden beheerd via het URL-pad (bijv. /api/v1, /api/v2). Dit maakt het mogelijk om toekomstige wijzigingen door te voeren zonder bestaande integraties (zoals de frontend) te breken.

5.4 Authenticatie en Autorisatie
Status: [✓ Conceptueel Gedefinieerd, Implementatie TODO]
Authenticatie: Alle API-endpoints (behalve eventuele publieke endpoints zoals login/registratie) vereisen authenticatie. Dit wordt afgehandeld via JSON Web Tokens (JWT) die worden uitgegeven door Supabase Auth. De frontend stuurt het JWT mee in de Authorization: Bearer <token> header bij elke request. Een Express middleware valideert het token bij elke beschermde request.
Autorisatie: Na succesvolle authenticatie bepaalt de API-logica of de gebruiker gemachtigd is om de gevraagde actie uit te voeren op de betreffende resource. Dit gebeurt op basis van:
- De user_id uit het gevalideerde JWT
- Lidmaatschap en rol binnen organizations (indien van toepassing)
- Controles op eigendom van resources (bijv. mag gebruiker X snapshot Y zien?)
- Supabase Row Level Security (RLS) wordt ingezet op database-niveau als extra beveiligingslaag

5.5 Endpoint Definitie Overzicht (Conceptueel)
Status: [✓ Conceptueel Gedefinieerd, Implementatie TODO]

Hieronder volgt een conceptueel overzicht van de belangrijkste API-resources en endpoints. De exacte specificaties (request/response details) worden verder uitgewerkt in het aparte "API Specificaties" document.

Authenticatie (Grotendeels afgehandeld door Supabase Client SDK):
- Standaard Supabase endpoints voor login, registratie, wachtwoord reset, etc.
- POST /api/v1/auth/sfdc/initiate: Start de OAuth flow om een Salesforce org te koppelen (FR-AUTH-03)
- GET /api/v1/auth/sfdc/callback: Callback endpoint voor Salesforce OAuth flow

Salesforce Connections:
- GET /api/v1/connections: Haalt de lijst van gekoppelde Salesforce orgs op voor de ingelogde gebruiker/organisatie (Relateert aan FR-AUTH-03)
- GET /api/v1/connections/{connectionId}: Haalt details van een specifieke koppeling op
- DELETE /api/v1/connections/{connectionId}: Verwijdert een Salesforce koppeling

Metadata Pipeline & Snapshots:
- POST /api/v1/pipeline/start: Start de volledige metadata pipeline (Fetch, Parse, Store, Build Graph) voor een specifieke connectionId (Relateert aan FR-PIPE-01, FR-GRAPH-01)
  Request body: { "connectionId": "..." }
  Response: { "snapshotId": "...", "initialStatus": "PENDING" }
- GET /api/v1/snapshots?connectionId={connectionId}: Haalt een lijst van metadata snapshots op voor een connectie, inclusief hun status (Relateert aan FR-PIPE-07)
- GET /api/v1/snapshots/{snapshotId}/status: Haalt de actuele status van een specifieke snapshot run op (Relateert aan FR-PIPE-05)
- GET /api/v1/snapshots/{snapshotId}: Haalt details van een specifieke snapshot op (na voltooiing)

Graph & Analyse:
- GET /api/v1/graph/{snapshotId}/visualize?depth={depth}&focus={nodeId}: Haalt data op voor de graph visualisatie van een specifieke snapshot (Nodes & Edges). Parameters voor initiële focus en diepte (Relateert aan FR-UI-03)
- GET /api/v1/graph/{snapshotId}/component/{componentApiName}: Haalt details en directe relaties van een specifiek component op uit de graph
- POST /api/v1/analysis/{snapshotId}/start: Start het analyse proces (bijv. Flow Checks) voor een snapshot (Relateert aan FR-GRAPH-06)
- GET /api/v1/analysis/{snapshotId}/results: Haalt de opgeslagen analyse resultaten op voor een snapshot (Relateert aan FR-RSLT-01, FR-UI-08)

AI Assistant:
- POST /api/v1/ai/{snapshotId}/ask: Stuurt een vraag naar de AI assistant voor een specifieke snapshot (Relateert aan FR-AI-01)
  Request body: { "question": "..." }
  Response: { "answer": "...", "interactionId": "..." }
- POST /api/v1/ai/feedback: Stuurt gebruikersfeedback over een AI interactie (Relateert aan FR-AI-06, FR-AI-07)
  Request body: { "interactionId": "...", "rating": 1, "comment": "..." }

5.6 Error Handling
Status: [✓ Conceptueel Gedefinieerd, Implementatie TODO]
API-fouten worden geretourneerd met een passende HTTP status code (bijv. 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error).
De response body bij een fout bevat een gestructureerd JSON-object met minimaal een errorCode (een interne, herkenbare code) en een errorMessage (een mens-leesbare beschrijving). 

Voorbeeld:
```json
{
  "errorCode": "SNAPSHOT_NOT_FOUND",
  "errorMessage": "Metadata snapshot with the specified ID does not exist or you don't have permission to access it."
}
```

5.7 CORS (Cross-Origin Resource Sharing)
Status: [✓ Basis OK, Verfijning TODO]
Supabase Edge Functions moeten correct geconfigureerd worden (via Access-Control-Allow-Origin headers, etc.) om requests van de gehoste frontend (Vercel/Netlify domein) toe te staan.


6. Security Architectuur
Status: [✓ Conceptueel Gedefinieerd, ✓ RLS Basis OK, Encryptie Kolommen OK]

Deze sectie beschrijft de beveiligingsmaatregelen die worden geïmplementeerd om de vertrouwelijkheid, integriteit en beschikbaarheid van het NEXA platform en de data van gebruikers te waarborgen.

6.1 Authenticatie
Status: [✓ Mechanisme Gekozen (Supabase Auth)]
Mechanisme: Supabase Auth wordt gebruikt voor gebruikersauthenticatie. Ondersteuning voor e-mail/wachtwoord en mogelijk OAuth providers (Google, GitHub) voor registratie en login (FR-AUTH-01, FR-AUTH-02).

JWT: Na succesvolle login geeft Supabase Auth een JSON Web Token (JWT) uit. Dit token wordt door de frontend opgeslagen (bijv. in localStorage of sessionStorage - afweging nodig m.b.t. XSS risico) en meegestuurd in de Authorization: Bearer <token> header bij elke API-request naar de Supabase Edge Functions.

Token Validatie: Een Express middleware in de API-laag valideert de handtekening en geldigheid (vervaldatum) van het JWT bij elke beschermde request. De user_id wordt uit het gevalideerde token geëxtraheerd voor autorisatiechecks.

Wachtwoordbeleid: Supabase Auth standaardinstellingen voor wachtwoordcomplexiteit en eventuele MFA (Multi-Factor Authentication) worden overwogen.

6.2 Autorisatie
Status: [✓ RLS Basis OK, API Autorisatie TODO]
API Autorisatie: De API-laag (Edge Functions) voert autorisatiechecks uit na authenticatie. Deze checks verifiëren of de geauthenticeerde gebruiker (user_id uit JWT) de gevraagde actie mag uitvoeren op de specifieke resource. Dit gebeurt op basis van lidmaatschap van organizations en eventuele rollen (organization_members tabel).

Database Autorisatie (RLS): Supabase Row Level Security (RLS) is geconfigureerd op kritieke tabellen (organizations, organization_members, salesforce_connections, metadata_snapshots, parsed_components, etc.). RLS policies zorgen ervoor dat database queries (ook die via de Supabase client library of RPC calls vanuit Edge Functions) alleen data retourneren die behoort tot de organisatie(s) van de geauthenticeerde gebruiker. Dit biedt een diepe verdedigingslaag.

6.3 Data Security
Status: [✓ Concept Gedefinieerd, Encryptie Kolommen OK]
Encryptie in Transit: Alle communicatie tussen de gebruiker's browser en de frontend hosting (Vercel/Netlify), tussen de frontend en de Supabase API/DB, en tussen Supabase Functions en externe services (Salesforce, Neo4j AuraDB, LLM) verloopt via HTTPS/TLS, waardoor data tijdens het transport versleuteld is.

Encryptie at Rest (Supabase):
- Supabase versleutelt data at rest standaard op infrastructuurniveau
- Specifieke Kolom Encryptie: Gevoelige data, met name access_token_encrypted en refresh_token_encrypted in de salesforce_connections tabel, moeten expliciet applicatief versleuteld worden voordat ze naar de database worden geschreven. Dit gebeurt in de Edge Function(s) die tokens opslaan/bijwerken, mogelijk met pgsodium via database functies aangeroepen vanuit de Edge Function, of met een Node.js-compatibele encryptie library (met sleutels veilig beheerd als Supabase secrets)

Encryptie at Rest (Neo4j AuraDB): Neo4j AuraDB biedt standaard encryptie at rest voor de graph data.

Data Masking/Minimization: Er wordt geen onnodig gevoelige Salesforce data opgeslagen. Focus ligt op metadata structuren. Er worden geen Salesforce record data opgeslagen.

6.4 API Security
Status: [Conceptueel Gedefinieerd, Implementatie TODO]
Input Validatie: Alle data die via API-requests binnenkomt (request bodies, query parameters, path parameters) wordt gevalideerd op type, formaat en toegestane waarden (bijv. met een library zoals zod of express-validator) om injection attacks en onverwachte fouten te voorkomen.

Rate Limiting: Implementatie van rate limiting op API-endpoints (mogelijk via Supabase ingebouwde features of Express middleware) om misbruik en Denial-of-Service (DoS) aanvallen te beperken.

Security Headers: Gebruik van standaard security headers (zoals Strict-Transport-Security, Content-Security-Policy, X-Content-Type-Options, X-Frame-Options) op zowel de frontend hosting als de API responses om browser-gebaseerde aanvallen (XSS, clickjacking) te mitigeren.

CORS: Strikte configuratie van Cross-Origin Resource Sharing (CORS) headers om alleen requests van de toegestane frontend domeinen toe te staan.

6.5 Salesforce Connectie Security
Status: [Conceptueel Gedefinieerd, Implementatie TODO]
OAuth 2.0 PKCE: De Proof Key for Code Exchange (PKCE) extensie wordt gebruikt tijdens de OAuth flow. Dit is de best practice voor publieke clients (zoals een backend die namens een browser handelt) en voorkomt "authorization code interception" aanvallen.

Veilige Token Opslag: Refresh en access tokens worden versleuteld opgeslagen in de Supabase database (zie 6.3). Tokens worden nooit direct naar de frontend gestuurd.

Scoped Permissions: Tijdens de OAuth flow worden alleen de minimaal benodigde Salesforce permissies aangevraagd (bijv. toegang tot metadata API's, refresh token scope).

6.6 Infrastructuur Security
Status: [✓ Platform Keuzes Gemaakt]
Supabase: Vertrouwt op de beveiligingsmaatregelen van het Supabase platform. Toegang tot het Supabase project dashboard wordt beperkt en beveiligd met MFA.

Neo4j AuraDB: Vertrouwt op de beveiligingsmaatregelen van Neo4j's cloud service. Database credentials worden veilig opgeslagen als secrets in de Supabase Functions environment.

LLM Provider: API keys ... worden veilig opgeslagen als secrets in de Supabase Functions environment...

6.7 Dependency Management
Status: [Tooling Gekozen, Proces TODO]
Scanning: Regelmatig scannen van project dependencies (PNPM packages, Deno modules) op bekende kwetsbaarheden met tools zoals pnpm audit, Snyk, of GitHub Dependabot. Voor Deno: deno lint --unstable kan helpen, en externe scanners.
Updates: Tijdig updaten van dependencies ...

6.8 Logging en Monitoring
Status: [Conceptueel Gedefinieerd, Implementatie TODO]
Audit Logging: Belangrijke security-gerelateerde events ... worden gelogd (bijv. via console.log in Edge Functions, wat verschijnt in Supabase Function logs, of door expliciet naar een logtabel te schrijven).
Monitoring: Monitoring op ongebruikelijke activiteiten of error rates (via Supabase ingebouwde monitoring of externe tools).

7. Deployment Architectuur
Status: [✓ Conceptueel Gedefinieerd, ✓ Lokale Omgeving OK, Staging/Prod TODO]

Deze sectie beschrijft de strategie en processen voor het bouwen, testen en deployen van de NEXA applicatie naar de verschillende omgevingen.

7.1 Omgevingen
Status: [✓ Lokale Setup OK, Staging/Prod TODO]

Er worden minimaal drie omgevingen onderhouden:

local (Ontwikkelomgeving):
Status: [✓ Operationeel]
Doel: Individuele ontwikkeling en unit testing.
Setup: Draait lokaal op de machine van de ontwikkelaar.
Componenten:
- Frontend (React): Draait lokaal via pnpm --filter frontend dev
- Supabase Stack: Draait lokaal via supabase start (incl. Postgres DB, Auth, Storage, Edge Functions)
- Neo4j: Draait lokaal via Docker Compose
- Salesforce: Ontwikkelaars gebruiken Developer Edition orgs of Sandboxes
Secrets: Lokale .env bestanden

staging (Test-/Acceptatieomgeving):
Status: [Nog Niet Ingericht]
Doel: Integratietesten, UAT.
Setup: Gehost in de cloud.
Componenten:
- Frontend (React): Gehost op Vercel/Netlify
- Supabase Project: Apart Supabase project (betaalde tier waarschijnlijk nodig)
- Neo4j Instance: Aparte Neo4j AuraDB instance
- Salesforce: Koppelingen naar Sandboxes
Data: Testdata (mogelijk geanonimiseerd)
Deployment: Via CI/CD vanuit develop branch

production (Productieomgeving):
Status: [Nog Niet Ingericht]
Doel: Live omgeving.
Setup: Gehost in de cloud.
Componenten:
- Frontend (React): Gehost op Vercel/Netlify
- Supabase Project: Apart Supabase project (betaalde tier)
- Neo4j Instance: Aparte Neo4j AuraDB instance (geschaald)
- Salesforce: Koppelingen naar productie orgs
Data: Live klantdata. Backups, monitoring essentieel
Deployment: Via CI/CD vanuit main branch (met goedkeuring)

7.2 CI/CD Pipeline (Continuous Integration / Continuous Deployment)
Status: [Conceptueel Gedefinieerd, Implementatie TODO]

Tool: GitHub Actions (aanbevolen).
Trigger: Pushes naar develop/main, Pull Requests.

Pipeline Stappen (Voorbeeld):
1. Checkout Code
2. Setup Environment (Node.js voor PNPM, Deno voor functions)
3. Install Dependencies (pnpm install)
4. Lint & Format Check (pnpm lint, pnpm format:check)
5. Unit Tests (pnpm test:frontend, supabase functions test)
6. Build Frontend (pnpm --filter frontend build)
7. Build/Bundle Functions (Check Deno/Supabase CLI voor bundling/dependency management)
8. (Optioneel) Integration Tests
9. Deploy Supabase Migrations (supabase link, supabase migration up)
10. Deploy Supabase Edge Functions (supabase functions deploy)
11. Deploy Frontend (Vercel/Netlify CLI/Action)
12. (Optioneel) End-to-End Tests
13. Notificatie

Deployment naar Productie: Vergelijkbaar, vanuit main, mogelijk handmatige trigger.

7.3 Monitoring en Logging
Status: [Conceptueel Gedefinieerd, Implementatie TODO]

Monitoring:
- Supabase Dashboard voor database en function metrics
- Vercel/Netlify Analytics voor frontend performance
- Neo4j AuraDB monitoring voor graph database
- Custom logging voor business metrics

Logging:
- Application logs in Supabase Functions
- Error tracking via Sentry of vergelijkbaar
- Audit logs voor security-relevante events
- Performance metrics voor kritieke endpoints

7.4 Backup en Recovery
Status: [Conceptueel Gedefinieerd, Implementatie TODO]

Backup Strategie:
- Supabase: Automatische dagelijkse backups
- Neo4j: AuraDB automatische backups
- Frontend: Version control via Git
- Configuration: Version control via Git

Recovery Procedures:
- Database restore procedures
- Function rollback procedures
- Frontend rollback procedures
- Disaster recovery plan

