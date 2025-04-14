01 - Gedetailleerd Specificatiedocument voor NEXA
Status: IN PROGRESS - (Database Schema & RLS Basis Geïmplementeerd)
Inhoudsopgave:
Use Cases per Doelgroep [Compleet]
Functionele Requirements [In Progress]
Non-Functionele Requirements [TODO]
Acceptatiecriteria [In Progress]

1. Use Cases per Doelgroep
Dit beschrijft de primaire scenario's waarin de verschillende gebruikersrollen NEXA zullen gebruiken.

1.1 Salesforce Developers
Als Salesforce Developer wil ik alle afhankelijkheden van een specifiek metadata component (veld, Apex class, Flow, LWC) visualiseren, zodat ik de impact van een wijziging of verwijdering kan inschatten voordat ik deze doorvoer.
Scenario: Voor het aanpassen van een Apex Trigger, wil de developer zien welke objecten, velden of andere classes deze trigger aanroepen of door deze trigger worden beïnvloed.
Als Salesforce Developer wil ik een AI-gegenereerde uitleg krijgen waarom een voorgestelde wijziging (bijv. verwijderen custom field 'Legacy_Status__c') impact heeft op andere componenten (bijv. 3 Flows, 2 Reports, 1 Apex Class), zodat ik snel begrijp wat het risico is en waar ik moet kijken.
Als Salesforce Developer wil ik specifieke Flow errors (veroorzaakt door metadata inconsistenties, zoals een verwijzing naar een niet-bestaand veld) snel kunnen identificeren en de root cause kunnen zien in de context van de metadata graph, zodat ik troubleshooting tijd kan verkorten.
Als Salesforce Developer wil ik voorafgaand aan een deployment via CI/CD (bijv. Copado, Gearset) een automatische NEXA impact analyse kunnen triggeren, zodat ik een extra veiligheidscheck heb op onverwachte neveneffecten. (V1/V2 Feature)
Als Salesforce Developer wil ik kunnen zien welke metadata componenten niet (meer) gebruikt lijken te worden (geen inkomende relaties in de graph), zodat ik kan helpen met het opschonen van de org (technical debt reductie).

1.2 Salesforce Admins & Consultants
Als Salesforce Admin wil ik de impact simuleren van het wijzigen van een veldtype (bijv. van Text naar Picklist) of het verwijderen van een veld, zodat ik proactief kan zien welke page layouts, flows, validation rules, reports, etc. aangepast moeten worden.
Als Salesforce Consultant wil ik snel een overzicht krijgen van de complexiteit en belangrijkste afhankelijkheden in een (voor mij nieuwe) Salesforce org, zodat ik sneller inzicht krijg in de bestaande configuratie en risicogebieden.
Als Salesforce Admin wil ik een AI-suggestie krijgen voor remediatie wanneer een hoog-risico wijziging wordt gedetecteerd (bijv. "Update deze 3 Flows en verwijder het veld uit Rapport X voordat je het veld verwijdert"), zodat ik begeleiding krijg bij het veilig doorvoeren van de wijziging. (V1 Feature)
Als Salesforce Admin wil ik de impact zien van het deactiveren van een Flow of aanpassen van een Permission Set, zodat ik begrijp welke processen of gebruikerstoegang hierdoor beïnvloed worden.
Als Salesforce Consultant wil ik metadata snapshots kunnen vergelijken (bijv. voor en na een release), zodat ik kan valideren welke wijzigingen zijn doorgevoerd en of er onbedoelde aanpassingen zijn gemaakt. (V2 Feature)

1.3 Change Managers
Als Change Manager wil ik een geconsolideerd impact rapport en risicoscore ontvangen voor een voorgestelde set van wijzigingen (change set), zodat ik een onderbouwde beslissing kan nemen over de goedkeuring ervan.
Als Change Manager wil ik de AI-gegenereerde uitleg van de impact kunnen gebruiken als onderdeel van de documentatie in het change request, zodat de risico's duidelijk zijn voor alle stakeholders.
Als Change Manager wil ik een historisch overzicht kunnen zien van eerdere analyses en gedetecteerde risico's, zodat ik trends kan identificeren en het change proces kan verbeteren. (Logging in Supabase)
Als Change Manager wil ik notificaties ontvangen wanneer een geplande wijziging (via CI/CD hook) een hoog risico heeft volgens NEXA, zodat ik proactief kan ingrijpen. (V2 Feature)

1.4 Enterprise Architecten
Als Enterprise Architect wil ik een holistisch beeld krijgen van de metadata structuur en de belangrijkste afhankelijkheden binnen de Salesforce org (en potentieel tussen orgs/clouds), zodat ik de algehele architectuur kan beoordelen en documenteren.
Als Enterprise Architect wil ik gebieden met hoge complexiteit of verouderde patronen identificeren via de graph analyse, zodat ik input heb voor refactoring of moderniseringsinitiatieven.
Als Enterprise Architect wil ik NEXA gebruiken om de impact van het introduceren of verwijderen van Managed Packages te analyseren, zodat ik de afhankelijkheden met custom metadata beter begrijp.
Als Enterprise Architect wil ik de evolutie van de metadata graph over tijd kunnen volgen, zodat ik architecturale drift kan monitoren en de technische schuld kan beheersen. (Via snapshots)

2. Functionele Requirements
Deze sectie beschrijft de specifieke functionaliteiten die NEXA moet bieden.

2.1 Authenticatie en Autorisatie
FR-AUTH-01: [Status: [ ] Niet Gestart] Gebruikers moeten zich kunnen registreren voor een NEXA account (bijv. met e-mail/wachtwoord of via OAuth provider zoals Google/GitHub).
FR-AUTH-02: [Status: [ ] Niet Gestart] Geregistreerde gebruikers moeten kunnen inloggen op het NEXA platform.
FR-AUTH-03: [Status: [ ] Niet Gestart] Gebruikers moeten hun NEXA account kunnen koppelen aan één of meerdere Salesforce orgs via een veilige OAuth 2.0 PKCE flow.
FR-AUTH-04: [Status: [✓ Basis Geïmplementeerd]] Toegang tot metadata en analyses moet beperkt zijn tot de gebruiker(s) die toegang hebben tot de gekoppelde Salesforce org binnen NEXA (basis Role-Based Access Control - RBAC). (RLS Policies in DB zijn aangemaakt)
FR-AUTH-05: [Status: [✓ Schema Gedefinieerd]] Salesforce credentials (tokens) moeten veilig (encrypted) worden opgeslagen en beheerd. (Kolommen in DB zijn aangemaakt, encryptie logica nog niet)

2.2 Metadata Pipeline (Fetch, Parse, Store)
FR-PIPE-01: [Status: [ ] Niet Gestart] Het systeem moet, op verzoek van de gebruiker, verbinding maken met een gekoppelde Salesforce org en metadata ophalen via de Salesforce Metadata API en/of Tooling API.
FR-PIPE-02: [Status: [ ] Niet Gestart] Het systeem moet de volgende Salesforce metadata types kunnen parsen (MVP focus):
- Custom Objects & Fields (inclusief relaties, formules)
- Flows (Screen Flows, Autolaunched Flows, Record-Triggered Flows - inclusief elementen zoals Decisions, Assignments, Get/Update/Create/Delete Records)
- Apex Triggers (identificatie van object en basis events - DML operations)
- Reports & Report Types (gebruikte objecten en velden)
- (V1+) Apex Classes (basis dependencies)
- (V1+) Permission Sets / Profiles (veld- en objectpermissies)
- (V1+) Page Layouts
- (V1+) Validation Rules
FR-PIPE-03: [Status: [ ] Niet Gestart] Het systeem moet de geparste metadata omzetten naar een vooraf gedefinieerde, consistente structuur per component type (bijv. vaste JSON-schema's of tabeldefinities), waarbij informatie zoals attributen en relaties uniform worden vastgelegd, geschikt voor opslag in Supabase en latere verwerking.
FR-PIPE-04: [Status: [✓ Schema Gedefinieerd]] Het systeem moet de gestructureerde, geparste metadata opslaan in de Supabase database, gekoppeld aan de specifieke Salesforce org en een uniek "snapshot" ID. (Tabellen parsed_components, parsed_relationships bestaan)
FR-PIPE-05: [Status: [ ] Niet Gestart] Het systeem moet de gebruiker feedback geven over de voortgang en status (Gestart, Bezig met ophalen, Bezig met parsen, Opslaan voltooid, Mislukt) van de metadata pipeline run.
FR-PIPE-06: [Status: [ ] Niet Gestart] Het systeem moet om kunnen gaan met time-outs of errors tijdens het ophalen/parsen en deze loggen.
FR-PIPE-07: [Status: [ ] Niet Gestart] Gebruikers moeten een lijst kunnen zien van recent aangemaakte metadata snapshots voor hun gekoppelde orgs.
FR-PIPE-08: [Status: [Conceptueel OK]] Elk metadata snapshot vertegenwoordigt de staat van de verbonden Salesforce org op het moment van de 'Fetch' actie. Latere wijzigingen in Salesforce (inclusief verwijderingen) worden pas zichtbaar in NEXA nadat een nieuwe snapshot is gemaakt.

2.3 Knowledge Graph (Population & Querying)
FR-GRAPH-01: [Status: [ ] Niet Gestart] Het systeem moet, op verzoek van de gebruiker voor een specifieke snapshot, de opgeslagen gestructureerde metadata uit Supabase lezen.
FR-GRAPH-02: [Status: [ ] Niet Gestart] Het systeem moet de gelezen metadata omzetten naar een graph-structuur bestaande uit nodes (componenten zoals Object, Field, Flow, Report) en relaties (zoals USED_IN, REFERENCES, BELONGS_TO, TRIGGERS).
FR-GRAPH-03: [Status: [ ] Niet Gestart] Het systeem moet deze graph-structuur populeren (aanmaken/updaten) in de Neo4j database, gekoppeld aan het snapshot ID.
FR-GRAPH-04: [Status: [ ] Niet Gestart] Het systeem moet Neo4j queries kunnen uitvoeren om afhankelijkheden en impactpaden te traceren.
FR-GRAPH-05: [Status: [ ] Niet Gestart] Het systeem moet basisstatistieken over de graph kunnen leveren (aantal nodes/relaties per type) voor een snapshot.
FR-GRAPH-06: [Status: [ ] Niet Gestart] Het systeem moet specifieke analyse-queries op de Neo4j graph kunnen uitvoeren om potentiële problemen te detecteren.

2.4 Frontend & Visualisatie
FR-UI-01: [Status: [✓ Basis Geïmplementeerd]] De gebruiker moet een dashboard zien met een overzicht van gekoppelde orgs en recente snapshots/analyses. (Basis layout en OrgSelector (mock) bestaan)
FR-UI-02: [Status: [ ] Niet Gestart] De gebruiker moet de metadata pipeline (Fetch/Store, Build Graph, Analyze) kunnen starten vanuit de UI.
FR-UI-03: [Status: [ ] Niet Gestart] Het systeem moet een interactieve visualisatie van de Neo4j knowledge graph tonen voor een geselecteerde snapshot.
FR-UI-04: [Status: [ ] Niet Gestart] De graph visualisatie moet basisinteracties ondersteunen: zoomen, pannen, selecteren van nodes/relaties.
FR-UI-05: [Status: [ ] Niet Gestart] Bij selectie van een node in de graph moet de gebruiker basisinformatie over dat metadata component kunnen zien.
FR-UI-06: [Status: [ ] Niet Gestart] (V1+) De gebruiker moet kunnen filteren in de graph visualisatie.
FR-UI-07: [Status: [ ] Niet Gestart] (V1+) De gebruiker moet aantekeningen kunnen maken bij specifieke nodes of relaties.
FR-UI-08: [Status: [ ] Niet Gestart] De gebruiker moet de resultaten van uitgevoerde analyses op een duidelijke manier kunnen inzien in de UI.

2.6 AI Reasoning & Explainability
FR-AI-01: [Status: [ ] Niet Gestart] De gebruiker moet via een "AI Assistant" interface vragen kunnen stellen over metadata relaties of de impact van (gesimuleerde) wijzigingen.
FR-AI-02: [Status: [ ] Niet Gestart] Het systeem moet de gebruikersvraag interpreteren en vertalen naar relevante Neo4j queries.
FR-AI-03: [Status: [ ] Niet Gestart] Het systeem moet de resultaten van de Neo4j query samen met context naar een LLM sturen.
FR-AI-04: [Status: [ ] Niet Gestart] Het systeem moet het antwoord van de LLM verwerken en presenteren aan de gebruiker.
FR-AI-05: [Status: [ ] Niet Gestart] (V1) Het systeem moet een basis risicoscore kunnen berekenen voor een component of gesimuleerde wijziging.
FR-AI-06: [Status: [ ] Niet Gestart] (V1) Gebruikers moeten feedback kunnen geven op de AI-gegenereerde uitleg.
FR-AI-07: [Status: [✓ Schema Gedefinieerd]] (V1) De gebruikersfeedback moet worden opgeslagen in Supabase. (Tabel ai_interactions bestaat)
FR-AI-08: [Status: [ ] Niet Gestart] (V1+) Het systeem moet AI-gegenereerde suggesties voor remediatie kunnen geven.

2.7 Integraties & API
FR-API-01: [Status: [ ] Niet Gestart] Er moet een interne API (gehost op Supabase Functions) beschikbaar zijn voor frontend-backend communicatie.
FR-API-02: [Status: [ ] Niet Gestart] (V2+) Er moeten externe API endpoints (REST/GraphQL) beschikbaar komen voor integratie.
FR-API-03: [Status: [ ] Niet Gestart] (V2+) Het systeem moet via webhooks kunnen reageren op events uit CI/CD tools.

2.8 Analyse Resultaten
FR-RSLT-01: [Status: [✓ Schema Gedefinieerd]] De resultaten van alle uitgevoerde analyses moeten worden opgeslagen in Supabase. (Tabel analysis_results bestaat)
FR-RSLT-02: [Status: [Conceptueel OK]] Alle analyses worden uitgevoerd binnen de context van één specifieke metadata snapshot.

2.9 Snapshot beheer en vergelijken
FR-COMP-01: [Status: [ ] Niet Gestart] (V2 Feature) Het systeem moet gebruikers in staat stellen om twee metadata snapshots met elkaar te vergelijken.

3. Non-Functionele Requirements
Deze sectie beschrijft de kwaliteitseisen waaraan het NEXA-platform moet voldoen.

3.1 Performance & Schaalbaarheid
NFR-PERF-01 (Metadata Fetch): Het ophalen van metadata van een gemiddelde Salesforce org (bijv. <500 custom objects, <1000 flows/processes) moet binnen een acceptabele tijd voltooid zijn (streefwaarde: < 15 minuten). Gebruiker moet feedback krijgen tijdens lange runs.
NFR-PERF-02 (Parsing & Storage): Het parsen van de opgehaalde metadata en opslaan in Supabase moet efficiënt gebeuren (streefwaarde: < 10 minuten na fetch voltooid).
NFR-PERF-03 (Graph Population): Het populeren van de Neo4j graph vanuit de Supabase data moet binnen een redelijke tijd plaatsvinden (streefwaarde: < 5 minuten voor een gemiddelde org snapshot).
NFR-PERF-04 (Graph Query): Standaard impactanalyse queries op de Neo4j graph (bijv. directe afhankelijkheden opvragen) moeten doorgaans binnen enkele seconden (< 5s) resultaat geven in de UI. Complexe, diepe analyses kunnen langer duren.
NFR-PERF-05 (AI Response): De reactietijd van de AI Assistant (van vraag tot antwoord, inclusief Neo4j query en LLM call) moet acceptabel zijn voor interactief gebruik (streefwaarde: < 10-15 seconden voor de meeste vragen).
NFR-SCALE-01 (Gebruikers): Het platform moet ontworpen zijn om gelijktijdig gebruik door tientallen tot honderden gebruikers te ondersteunen (V1). Supabase en Neo4j AuraDB bieden hiervoor schaalbaarheidsopties.
NFR-SCALE-02 (Orgs): Het systeem moet kunnen omgaan met data van honderden gekoppelde Salesforce orgs, met duidelijke scheiding van data per tenant (org/gebruiker).
NFR-SCALE-03 (Metadata Grootte): Hoewel initiële focus op gemiddelde orgs ligt, moet de architectuur rekening houden met de mogelijkheid om in de toekomst zeer grote en complexe Salesforce orgs te ondersteunen (bijv. door optimalisaties in parsing, storage, graph model).

3.2 Betrouwbaarheid & Beschikbaarheid
NFR-REL-01: De kernfunctionaliteiten (metadata pipeline, graph analyse, AI uitleg) moeten een hoge mate van betrouwbaarheid hebben. Fouten tijdens processen moeten correct worden afgehandeld en gelogd.
NFR-REL-02: Het systeem moet robuust zijn tegen fouten in de Salesforce API (bijv. tijdelijke onbeschikbaarheid, API limieten) en hier correct op reageren (bijv. retry-mechanisme, duidelijke foutmelding).
NFR-AVAIL-01: Het NEXA platform (frontend en API's gehost via Supabase) moet streven naar een hoge beschikbaarheid (bijv. 99.5% uptime), afhankelijk van de SLA's van de onderliggende cloud providers (Supabase, Neo4j AuraDB, LLM provider). Gepland onderhoud wordt gecommuniceerd.

3.3 Beveiliging
NFR-SEC-01 (Authenticatie): Alle toegang tot het platform en API's moet beveiligd zijn via sterke authenticatiemechanismen (Supabase Auth).
NFR-SEC-02 (Autorisatie): Toegang tot data moet gebaseerd zijn op rollen en eigendom (RBAC). Gebruikers mogen alleen data zien van de orgs waartoe zij geautoriseerd zijn (Supabase Row Level Security).
NFR-SEC-03 (Data Encryptie): Gevoelige data, met name Salesforce access/refresh tokens, moeten zowel 'at rest' (in Supabase DB) als 'in transit' (API calls) versleuteld zijn.
NFR-SEC-04 (API Security): API endpoints moeten beschermd zijn tegen veelvoorkomende aanvallen (OWASP Top 10), inclusief input validatie en rate limiting.
NFR-SEC-05 (Salesforce Connectie): De OAuth 2.0 PKCE flow moet correct geïmplementeerd worden voor veilige Salesforce authenticatie. Tokens mogen nooit worden blootgesteld aan de frontend.
NFR-SEC-06 (Dependency Scanning): Software dependencies (NPM packages, etc.) moeten regelmatig worden gescand op bekende kwetsbaarheden.
NFR-SEC-07 (Logging & Audit): Belangrijke security events (logins, Salesforce connecties, toegang tot data) moeten worden gelogd voor audit doeleinden.

3.4 Bruikbaarheid (Usability)
NFR-USE-01: De gebruikersinterface moet intuïtief en makkelijk te navigeren zijn voor de gedefinieerde doelgroepen.
NFR-USE-02: Foutmeldingen en systeemberichten moeten duidelijk, begrijpelijk en (waar mogelijk) actiegericht zijn.
NFR-USE-03: De graph visualisatie moet helder zijn en gebruikers helpen om complexe afhankelijkheden te begrijpen, niet te overweldigen.
NFR-USE-04: De AI Assistant moet een natuurlijke interactie mogelijk maken en duidelijke, beknopte antwoorden geven.
NFR-USE-05: Het moet voor de gebruiker duidelijk zijn welke data actueel is (status van snapshots en analyses).

3.5 Onderhoudbaarheid & Uitbreidbaarheid
NFR-MAINT-01: De codebase moet modulair, goed gedocumenteerd en voorzien van tests (unit, integratie) zijn om toekomstig onderhoud en uitbreiding te vergemakkelijken.
NFR-MAINT-02: Het moet relatief eenvoudig zijn om ondersteuning voor nieuwe Salesforce metadata types toe te voegen aan de parser en graph engine.
NFR-MAINT-03: Het systeem moet configureerbaar zijn (bijv. API keys, LLM endpoint) via environment variabelen of een configuratieservice.
NFR-EXT-01: De architectuur moet het mogelijk maken om in de toekomst nieuwe analysemodules of AI-capaciteiten toe te voegen zonder grote impact op bestaande functionaliteit.

4. Acceptatiecriteria
Deze sectie definieert de specifieke voorwaarden waaronder een Functionele Requirement als succesvol geïmplementeerd wordt beschouwd. Hieronder volgen voorbeelden voor enkele kern-FRs.

FR-AUTH-03 (Salesforce Org Koppelen):
AC-AUTH-03-01: [Status: [ ] Niet Gestart] (Start Koppeling)
AC-AUTH-03-02: [Status: [✓ Schema Gedefinieerd]] (Succesvolle Autorisatie) (Connectie tabel bestaat)
AC-AUTH-03-03: [Status: [✓ Schema Gedefinieerd]] (Veilige Opslag) (Kolommen voor tokens bestaan, encryptie logica niet)
AC-AUTH-03-04: [Status: [ ] Niet Gestart] (Foutafhandeling)

FR-PIPE-04 (Metadata Opslag in Supabase):
AC-PIPE-04-01: [Status: [✓ Schema Gedefinieerd]] (Data Aanwezig)
AC-PIPE-04-02: [Status: [✓ Schema Gedefinieerd]] (Structuur Correct)
AC-PIPE-04-03: [Status: [✓ Schema Gedefinieerd]] (Relatie Consistentie)

FR-GRAPH-03 (Graph Populatie in Neo4j):
AC-GRAPH-03-01: [Status: [ ] Niet Gestart] (Nodes Aangemaakt)
AC-GRAPH-03-02: [Status: [ ] Niet Gestart] (Relaties Aangemaakt)
AC-GRAPH-03-03: [Status: [ ] Niet Gestart] (Idempotentie)

FR-UI-03 & FR-UI-04 (Basis Graph Visualisatie):
AC-UI-03-01: [Status: [ ] Niet Gestart] (Weergave na Build)
AC-UI-04-01: [Status: [ ] Niet Gestart] (Zoom/Pan)
AC-UI-04-02: [Status: [ ] Niet Gestart] (Node Selectie)

FR-AI-01 & FR-AI-04 (AI Vraag & Antwoord):
AC-AI-01-01: [Status: [ ] Niet Gestart] (Vraag Stellen)
AC-AI-04-01: [Status: [ ] Niet Gestart] (Antwoord Ontvangen)
AC-AI-04-02: [Status: [ ] Niet Gestart] (Loading Indicator)

FR-GRAPH-06 (Detectie Problemen):
AC-GRAPH-06-01: [Status: [ ] Niet Gestart] (Start Analyse)
AC-GRAPH-06-02: [Status: [ ] Niet Gestart] (Detectie - Positief Scenario)
AC-GRAPH-06-03: [Status: [ ] Niet Gestart] (Detectie - Negatief Scenario)
AC-GRAPH-06-04: [Status: [ ] Niet Gestart] (Resultaat Structuur)

FR-RSLT-01 (Opslag Analyse Resultaten):
AC-RSLT-01-01: [Status: [✓ Schema Gedefinieerd]] (Opslag na Analyse)
AC-RSLT-01-02: [Status: [✓ Schema Gedefinieerd]] (Koppeling Data)
AC-RSLT-01-03: [Status: [✓ Schema Gedefinieerd]] (Geen Resultaten)

FR-UI-08 (Weergave Analyse Resultaten):
AC-UI-08-01: [Status: [ ] Niet Gestart] (Beschikbaarheid Resultaten)
AC-UI-08-02: [Status: [ ] Niet Gestart] (Weergave Lijst)
AC-UI-08-03: [Status: [ ] Niet Gestart] (Duidelijkheid)
AC-UI-08-04: [Status: [ ] Niet Gestart] (Geen Resultaten Weergave)
AC-UI-08-05: [Status: [ ] Niet Gestart] (Navigatie - Optioneel V1+)

FR-AI-02 FR-AI-03 FR-AI-04 (AI Assistant testen):
AC-AI-02-01: [Status: [ ] Niet Gestart] (Query Vertaling - Impact Vraag)
AC-AI-03-01: [Status: [ ] Niet Gestart] (LLM Input)
AC-AI-04-03: [Status: [ ] Niet Gestart] (Geen Impact Gevonden)
AC-AI-04-04: [Status: [ ] Niet Gestart] (Foutafhandeling LLM)

STATUS HIER ONDER:

01 - Gedetailleerd Specificatiedocument voor NEXA
Status: IN PROGRESS - (Basis Supabase DB Structuur & Beveiliging Lokaal OK)
Inhoudsopgave:
Use Cases per Doelgroep
Functionele Requirements
Non-Functionele Requirements (TODO)
Acceptatiecriteria

1. Use Cases per Doelgroep
(Deze sectie bevat geen implementeerbare requirements, dus geen statusindicatoren hier)
...

2. Functionele Requirements
Deze sectie beschrijft de specifieke functionaliteiten die NEXA moet bieden.
2.1 Authenticatie en Autorisatie
Status: [ ] Niet Gestart FR-AUTH-01: Gebruikers moeten zich kunnen registreren voor een NEXA account (bijv. met e-mail/wachtwoord of via OAuth provider zoals Google/GitHub).
Status: [ ] Niet Gestart FR-AUTH-02: Geregistreerde gebruikers moeten kunnen inloggen op het NEXA platform.
Status: [ ] Niet Gestart FR-AUTH-03: Gebruikers moeten hun NEXA account kunnen koppelen aan één of meerdere Salesforce orgs via een veilige OAuth 2.0 PKCE flow.
Status: [✓ Basis Geïmplementeerd] FR-AUTH-04: Toegang tot metadata en analyses moet beperkt zijn tot de gebruiker(s) die toegang hebben tot de gekoppelde Salesforce org binnen NEXA (basis Role-Based Access Control - RBAC). (RLS Policies in DB zijn aangemaakt)
Status: [✓ Schema Gedefinieerd] FR-AUTH-05: Salesforce credentials (tokens) moeten veilig (encrypted) worden opgeslagen en beheerd. (Kolommen in DB zijn aangemaakt, encryptie logica nog niet)
2.2 Metadata Pipeline (Fetch, Parse, Store)
Status: [ ] Niet Gestart FR-PIPE-01: Het systeem moet, op verzoek van de gebruiker, verbinding maken met een gekoppelde Salesforce org en metadata ophalen via de Salesforce Metadata API en/of Tooling API.
Status: [ ] Niet Gestart FR-PIPE-02: Het systeem moet de volgende Salesforce metadata types kunnen parsen (MVP focus): ... (Types List) ...
Status: [ ] Niet Gestart FR-PIPE-03: Het systeem moet de geparste metadata omzetten naar een vooraf gedefinieerde, consistente structuur per component type ..., geschikt voor opslag in Supabase en latere verwerking.
Status: [✓ Schema Gedefinieerd] FR-PIPE-04: Het systeem moet de gestructureerde, geparste metadata opslaan in de Supabase database, gekoppeld aan de specifieke Salesforce org en een uniek "snapshot" ID. (Tabellen parsed_components, parsed_relationships bestaan)
Status: [ ] Niet Gestart FR-PIPE-05: Het systeem moet de gebruiker feedback geven over de voortgang en status ... van de metadata pipeline run.
Status: [ ] Niet Gestart FR-PIPE-06: Het systeem moet om kunnen gaan met time-outs of errors tijdens het ophalen/parsen en deze loggen.
Status: [ ] Niet Gestart FR-PIPE-07: Gebruikers moeten een lijst kunnen zien van recent aangemaakte metadata snapshots voor hun gekoppelde orgs. (Vereist API & Frontend)
Status: [Conceptueel OK] FR-PIPE-08: Elk metadata snapshot vertegenwoordigt de staat van de verbonden Salesforce org op het moment van de 'Fetch' actie. ... (Architectuur principe)
2.3 Knowledge Graph (Population & Querying)
Status: [ ] Niet Gestart FR-GRAPH-01: Het systeem moet, op verzoek van de gebruiker voor een specifieke snapshot, de opgeslagen gestructureerde metadata uit Supabase lezen.
Status: [ ] Niet Gestart FR-GRAPH-02: Het systeem moet de gelezen metadata omzetten naar een graph-structuur ...
Status: [ ] Niet Gestart FR-GRAPH-03: Het systeem moet deze graph-structuur populeren (aanmaken/updaten) in de Neo4j database, gekoppeld aan het snapshot ID.
Status: [ ] Niet Gestart FR-GRAPH-04: Het systeem moet Neo4j queries kunnen uitvoeren om afhankelijkheden en impactpaden te traceren ...
Status: [ ] Niet Gestart FR-GRAPH-05: Het systeem moet basisstatistieken over de graph kunnen leveren ...
Status: [ ] Niet Gestart FR-GRAPH-06: Het systeem moet specifieke analyse-queries op de Neo4j graph kunnen uitvoeren om potentiële problemen te detecteren ...
2.4 Frontend & Visualisatie
Status: [✓ Basis Geïmplementeerd] FR-UI-01: De gebruiker moet een dashboard zien met een overzicht van gekoppelde orgs en recente snapshots/analyses. (Basis layout en OrgSelector (mock) bestaan)
Status: [ ] Niet Gestart FR-UI-02: De gebruiker moet de metadata pipeline ... kunnen starten vanuit de UI.
Status: [ ] Niet Gestart FR-UI-03: Het systeem moet een interactieve visualisatie van de Neo4j knowledge graph tonen ...
Status: [ ] Niet Gestart FR-UI-04: De graph visualisatie moet basisinteracties ondersteunen ...
Status: [ ] Niet Gestart FR-UI-05: Bij selectie van een node ... moet de gebruiker basisinformatie ... kunnen zien ...
Status: [ ] Niet Gestart FR-UI-06: (V1+) De gebruiker moet kunnen filteren in de graph visualisatie ...
Status: [ ] Niet Gestart FR-UI-07: (V1+) De gebruiker moet aantekeningen kunnen maken ...
Status: [ ] Niet Gestart FR-UI-08: De gebruiker moet de resultaten van uitgevoerde analyses ... kunnen inzien in de UI ...
2.6 AI Reasoning & Explainability
Status: [ ] Niet Gestart FR-AI-01: De gebruiker moet via een "AI Assistant" interface vragen kunnen stellen ...
Status: [ ] Niet Gestart FR-AI-02: Het systeem moet de gebruikersvraag interpreteren en vertalen naar relevante Neo4j queries ...
Status: [ ] Niet Gestart FR-AI-03: Het systeem moet de resultaten van de Neo4j query ... naar een LLM ... sturen ...
Status: [ ] Niet Gestart FR-AI-04: Het systeem moet het antwoord van de LLM ... presenteren aan de gebruiker ...
Status: [ ] Niet Gestart FR-AI-05: (V1) Het systeem moet een basis risicoscore kunnen berekenen ...
Status: [ ] Niet Gestart FR-AI-06: (V1) Gebruikers moeten feedback kunnen geven ...
Status: [✓ Schema Gedefinieerd] FR-AI-07: (V1) De gebruikersfeedback moet worden opgeslagen in Supabase ... (Tabel ai_interactions bestaat)
Status: [ ] Niet Gestart FR-AI-08: (V1+) Het systeem moet ... AI-gegenereerde suggesties voor remediatie kunnen geven.
2.7 Integraties & API
Status: [ ] Niet Gestart FR-API-01: Er moet een interne API (gehost op Supabase Functions) beschikbaar zijn ...
Status: [ ] Niet Gestart FR-API-02: (V2+) Er moeten externe API endpoints (REST/GraphQL) beschikbaar komen ...
Status: [ ] Niet Gestart FR-API-03: (V2+) Het systeem moet via webhooks kunnen reageren op events uit CI/CD tools ...
2.8 Analyse Resultaten
Status: [✓ Schema Gedefinieerd] FR-RSLT-01: De resultaten van alle uitgevoerde analyses ... moeten worden opgeslagen in Supabase ... (Tabel analysis_results bestaat)
Status: [Conceptueel OK] FR-RSLT-02: Alle analyses ... worden uitgevoerd binnen de context van één specifieke ... metadata snapshot. (Architectuur principe)
2.9 Snapshot beheer en vergelijken
Status: [ ] Niet Gestart FR-COMP-01 (V2 Feature): Het systeem moet gebruikers in staat stellen om twee metadata snapshots met elkaar te vergelijken ...

3. Non-Functionele Requirements (TODO)
Deze sectie beschrijft de kwaliteitseisen waaraan het NEXA-platform moet voldoen.

3.1 Performance & Schaalbaarheid
NFR-PERF-01 (Metadata Fetch): Het ophalen van metadata van een gemiddelde Salesforce org (bijv. <500 custom objects, <1000 flows/processes) moet binnen een acceptabele tijd voltooid zijn (streefwaarde: < 15 minuten). Gebruiker moet feedback krijgen tijdens lange runs.
NFR-PERF-02 (Parsing & Storage): Het parsen van de opgehaalde metadata en opslaan in Supabase moet efficiënt gebeuren (streefwaarde: < 10 minuten na fetch voltooid).
NFR-PERF-03 (Graph Population): Het populeren van de Neo4j graph vanuit de Supabase data moet binnen een redelijke tijd plaatsvinden (streefwaarde: < 5 minuten voor een gemiddelde org snapshot).
NFR-PERF-04 (Graph Query): Standaard impactanalyse queries op de Neo4j graph (bijv. directe afhankelijkheden opvragen) moeten doorgaans binnen enkele seconden (< 5s) resultaat geven in de UI. Complexe, diepe analyses kunnen langer duren.
NFR-PERF-05 (AI Response): De reactietijd van de AI Assistant (van vraag tot antwoord, inclusief Neo4j query en LLM call) moet acceptabel zijn voor interactief gebruik (streefwaarde: < 10-15 seconden voor de meeste vragen).
NFR-SCALE-01 (Gebruikers): Het platform moet ontworpen zijn om gelijktijdig gebruik door tientallen tot honderden gebruikers te ondersteunen (V1). Supabase en Neo4j AuraDB bieden hiervoor schaalbaarheidsopties.
NFR-SCALE-02 (Orgs): Het systeem moet kunnen omgaan met data van honderden gekoppelde Salesforce orgs, met duidelijke scheiding van data per tenant (org/gebruiker).
NFR-SCALE-03 (Metadata Grootte): Hoewel initiële focus op gemiddelde orgs ligt, moet de architectuur rekening houden met de mogelijkheid om in de toekomst zeer grote en complexe Salesforce orgs te ondersteunen (bijv. door optimalisaties in parsing, storage, graph model).

3.2 Betrouwbaarheid & Beschikbaarheid
NFR-REL-01: De kernfunctionaliteiten (metadata pipeline, graph analyse, AI uitleg) moeten een hoge mate van betrouwbaarheid hebben. Fouten tijdens processen moeten correct worden afgehandeld en gelogd.
NFR-REL-02: Het systeem moet robuust zijn tegen fouten in de Salesforce API (bijv. tijdelijke onbeschikbaarheid, API limieten) en hier correct op reageren (bijv. retry-mechanisme, duidelijke foutmelding).
NFR-AVAIL-01: Het NEXA platform (frontend en API's gehost via Supabase) moet streven naar een hoge beschikbaarheid (bijv. 99.5% uptime), afhankelijk van de SLA's van de onderliggende cloud providers (Supabase, Neo4j AuraDB, LLM provider). Gepland onderhoud wordt gecommuniceerd.

3.3 Beveiliging
NFR-SEC-01 (Authenticatie): Alle toegang tot het platform en API's moet beveiligd zijn via sterke authenticatiemechanismen (Supabase Auth).
NFR-SEC-02 (Autorisatie): Toegang tot data moet gebaseerd zijn op rollen en eigendom (RBAC). Gebruikers mogen alleen data zien van de orgs waartoe zij geautoriseerd zijn (Supabase Row Level Security).
NFR-SEC-03 (Data Encryptie): Gevoelige data, met name Salesforce access/refresh tokens, moeten zowel 'at rest' (in Supabase DB) als 'in transit' (API calls) versleuteld zijn.
NFR-SEC-04 (API Security): API endpoints moeten beschermd zijn tegen veelvoorkomende aanvallen (OWASP Top 10), inclusief input validatie en rate limiting.
NFR-SEC-05 (Salesforce Connectie): De OAuth 2.0 PKCE flow moet correct geïmplementeerd worden voor veilige Salesforce authenticatie. Tokens mogen nooit worden blootgesteld aan de frontend.
NFR-SEC-06 (Dependency Scanning): Software dependencies (NPM packages, etc.) moeten regelmatig worden gescand op bekende kwetsbaarheden.
NFR-SEC-07 (Logging & Audit): Belangrijke security events (logins, Salesforce connecties, toegang tot data) moeten worden gelogd voor audit doeleinden.

3.4 Bruikbaarheid (Usability)
NFR-USE-01: De gebruikersinterface moet intuïtief en makkelijk te navigeren zijn voor de gedefinieerde doelgroepen.
NFR-USE-02: Foutmeldingen en systeemberichten moeten duidelijk, begrijpelijk en (waar mogelijk) actiegericht zijn.
NFR-USE-03: De graph visualisatie moet helder zijn en gebruikers helpen om complexe afhankelijkheden te begrijpen, niet te overweldigen.
NFR-USE-04: De AI Assistant moet een natuurlijke interactie mogelijk maken en duidelijke, beknopte antwoorden geven.
NFR-USE-05: Het moet voor de gebruiker duidelijk zijn welke data actueel is (status van snapshots en analyses).

3.5 Onderhoudbaarheid & Uitbreidbaarheid
NFR-MAINT-01: De codebase moet modulair, goed gedocumenteerd en voorzien van tests (unit, integratie) zijn om toekomstig onderhoud en uitbreiding te vergemakkelijken.
NFR-MAINT-02: Het moet relatief eenvoudig zijn om ondersteuning voor nieuwe Salesforce metadata types toe te voegen aan de parser en graph engine.
NFR-MAINT-03: Het systeem moet configureerbaar zijn (bijv. API keys, LLM endpoint) via environment variabelen of een configuratieservice.
NFR-EXT-01: De architectuur moet het mogelijk maken om in de toekomst nieuwe analysemodules of AI-capaciteiten toe te voegen zonder grote impact op bestaande functionaliteit.

4. Acceptatiecriteria
Deze sectie definieert de specifieke voorwaarden waaronder een Functionele Requirement als succesvol geïmplementeerd wordt beschouwd.
FR-AUTH-03 (Salesforce Org Koppelen):
AC-AUTH-03-01: [Status: [ ] Niet Gestart] (Start Koppeling)
AC-AUTH-03-02: [Status: [✓ Schema Gedefinieerd]] (Succesvolle Autorisatie) (Connectie tabel bestaat)
AC-AUTH-03-03: [Status: [✓ Schema Gedefinieerd]] (Veilige Opslag) (Kolommen voor tokens bestaan, encryptie logica niet)
AC-AUTH-03-04: [Status: [ ] Niet Gestart] (Foutafhandeling)
FR-PIPE-04 (Metadata Opslag in Supabase):
AC-PIPE-04-01: [Status: [✓ Schema Gedefinieerd]] (Data Aanwezig)
AC-PIPE-04-02: [Status: [✓ Schema Gedefinieerd]] (Structuur Correct)
AC-PIPE-04-03: [Status: [✓ Schema Gedefinieerd]] (Relatie Consistentie)
FR-GRAPH-03 (Graph Populatie in Neo4j):
AC-GRAPH-03-01: [Status: [ ] Niet Gestart] (Nodes Aangemaakt)
AC-GRAPH-03-02: [Status: [ ] Niet Gestart] (Relaties Aangemaakt)
AC-GRAPH-03-03: [Status: [ ] Niet Gestart] (Idempotentie)
FR-UI-03 & FR-UI-04 (Basis Graph Visualisatie):
AC-UI-03-01: [Status: [ ] Niet Gestart] (Weergave na Build)
AC-UI-04-01: [Status: [ ] Niet Gestart] (Zoom/Pan)
AC-UI-04-02: [Status: [ ] Niet Gestart] (Node Selectie)
FR-AI-01 & FR-AI-04 (AI Vraag & Antwoord):
AC-AI-01-01: [Status: [ ] Niet Gestart] (Vraag Stellen)
AC-AI-04-01: [Status: [ ] Niet Gestart] (Antwoord Ontvangen)
AC-AI-04-02: [Status: [ ] Niet Gestart] (Loading Indicator)
FR-GRAPH-06 (Detectie Problemen):
AC-GRAPH-06-01: [Status: [ ] Niet Gestart] (Start Analyse)
AC-GRAPH-06-02: [Status: [ ] Niet Gestart] (Detectie - Positief Scenario)
AC-GRAPH-06-03: [Status: [ ] Niet Gestart] (Detectie - Negatief Scenario)
AC-GRAPH-06-04: [Status: [ ] Niet Gestart] (Resultaat Structuur)
FR-RSLT-01 (Opslag Analyse Resultaten):
AC-RSLT-01-01: [Status: [✓ Schema Gedefinieerd]] (Opslag na Analyse)
AC-RSLT-01-02: [Status: [✓ Schema Gedefinieerd]] (Koppeling Data)
AC-RSLT-01-03: [Status: [✓ Schema Gedefinieerd]] (Geen Resultaten)
FR-UI-08 (Weergave Analyse Resultaten):
AC-UI-08-01: [Status: [ ] Niet Gestart] (Beschikbaarheid Resultaten)
AC-UI-08-02: [Status: [ ] Niet Gestart] (Weergave Lijst)
AC-UI-08-03: [Status: [ ] Niet Gestart] (Duidelijkheid)
AC-UI-08-04: [Status: [ ] Niet Gestart] (Geen Resultaten Weergave)
AC-UI-08-05: [Status: [ ] Niet Gestart] (Navigatie - Optioneel V1+)
FR-AI-02 FR-AI-03 FR-AI-04 (AI Assistant testen):
AC-AI-02-01: [Status: [ ] Niet Gestart] (Query Vertaling - Impact Vraag)
AC-AI-03-01: [Status: [ ] Niet Gestart] (LLM Input)
AC-AI-04-03: [Status: [ ] Niet Gestart] (Geen Impact Gevonden)
AC-AI-04-04: [Status: [ ] Niet Gestart] (Foutafhandeling LLM)



 


