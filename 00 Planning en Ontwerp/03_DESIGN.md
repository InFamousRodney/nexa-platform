03 - UI UX Designs (versie 1.0 - 8 April 2025 23:00)
Status: IN PROGRESS
Inhoudsopgave:
Algemene Principes & Stijl
Hoofdschermen & Layout
2.1 Login / Registratie Scherm
2.2 Hoofddashboard
2.3 Instellingen Pagina
Belangrijke Componenten
3.1 Metadata Pipeline Control
3.2 Snapshot Lijst / Selectie
3.3 Graph Visualisatie Area
3.4 AI Assistant Paneel
3.5 Analyse Resultaten Weergave
User Flows
4.1 Salesforce Org Koppelen 
4.2 Metadata Snapshot Maken & Analyseren
4.3 AI Impact Analyse Vraag Stellen

1. Algemene Principes & Stijl
Status: [✓ Basis OK]

Look & Feel:
Status: [✓ Basis thema geïmplementeerd]
- Professioneel, modern, data-gericht
- Donker thema geïmplementeerd als primaire stijl
- Licht thema optioneel (V1+ mogelijkheid)
- Kleurenpalet rustig met duidelijke accentkleuren:
  - Donkerblauw/grijs tinten als basis
  - Paars voor acties
  - Groen/rood/geel/blauw voor status/severity badges

Layout:
Status: [✓ Basis layout geïmplementeerd]
- Multi-pagina applicatie met vaste linker navigatiebalk
- Content per pagina georganiseerd in duidelijke cards/panelen
- Afgeronde hoeken en consistente spacing
- Responsief design (minimaal voor moderne desktop browsers)
- Overzichtelijk met duidelijke scheiding tussen hoofdsecties
- Gebruik van cards of panelen om informatie te groeperen

Interactie:
Status: [✓ Basis componenten aanwezig, Feedback deels OK]
- Consistente UI elementen via Shadcn/UI
- Duidelijke feedback bij acties:
  - Loading states
  - Succesmeldingen
  - Foutmeldingen
- Interactieve elementen intuïtief:
  - Knoppen lijken op knoppen
  - Duidelijke tooltips
- Feedback mechanismen deels geïmplementeerd in OrgSelector

Typografie:
Status: [✓ Basis hiërarchie aanwezig]
- Duidelijk leesbaar lettertype
- Hiërarchie in groottes en gewichten voor:
  - Titels
  - Labels
  - Body tekst

Technologie:
Status: [✓ Gebruikt]
- React
- TypeScript
- Tailwind CSS
- Shadcn/UI componenten
- Headless UI voor toegankelijkheid

2. Applicatie Structuur & Schermen
Status: [✓ Basis Routing OK, Views Hebben Placeholders]

De applicatie is gestructureerd rond meerdere specifieke views/pagina's, toegankelijk via de linker navigatiebalk. De routing is opgezet, maar de inhoud van de meeste views is nog placeholder.

2.1 Login / Registratie Scherm
Status: [ ] Niet Gestart
Doel: Gebruikers toegang geven tot hun NEXA account of hen laten registreren.
Layout & Elementen:
- Eenvoudige, gecentreerde layout
- Velden voor e-mail, wachtwoord
- Knoppen voor Login/Registreer/Wachtwoord Herstel
- Optionele OAuth knoppen
- Duidelijke foutmeldingen bij ongeldige loginpogingen
- Implementatie TODO

2.2 Dashboard (Home View)
Status: [✓ Basis Layout OK, Componenten Deels Functioneel]
Doel: Dient als startpunt en overzichtspagina. Biedt snelle toegang tot kernacties en inzichten.
Layout:
- Bevat de OrgSelector (deels functioneel met mock data)
- Metadata Pipeline card (placeholder)
- AI Assistant paneel (placeholder)
- Sectie met "Quick Stats" (placeholder)
Functionaliteit:
- Gebruiker kan actieve org kiezen (werkt met mock data)
- Pipeline starten (TODO)
- AI vragen stellen (TODO)

2.3 Snapshots View
Status: [✓ Basis Layout OK, Componenten Placeholder]
Doel: Beheren en bekijken van de historie van metadata snapshots voor een geselecteerde organisatie.
Layout:
- Bevat de OrgSelector
- Metadata Pipeline card
- Hoofdgedeelte met "Available Snapshots" (placeholder)
Functionaliteit:
- Gebruikers kunnen door de lijst van snapshots bladeren (TODO)
- Snapshot selecteren als actieve context (TODO)
- Pipeline triggeren (TODO)

2.4 Metadata Explorer View
Status: [✓ Basis Layout OK, Componenten Placeholder]
Doel: Gedetailleerd browsen en inspecteren van de individuele metadata componenten binnen een geselecteerde snapshot.
Layout:
- Bevat de OrgSelector
- Snapshot Selector/Info card (placeholder)
- Hoofdgedeelte met tabs (placeholder) en zoekbalk (placeholder)
- Rechterpaneel (placeholder) toont details
Functionaliteit:
- Componenten filteren/zoeken (TODO)
- Componenten selecteren (TODO)
- Gedetailleerde informatie bekijken (TODO)

2.5 Graph Visualization View
Status: [✓ Basis Layout OK, Componenten Placeholder]
Doel: Het interactief visualiseren van de knowledge graph (afhankelijkheden) voor een geselecteerde snapshot.
Layout:
- Bevat de OrgSelector
- Snapshot Selector/Info card (placeholder)
- "Graph Controls" card (placeholder)
- Grote canvas (placeholder)
Functionaliteit:
- Graph verkennen (TODO)
- Navigeren (TODO)
- Filteren (TODO)
- Componenten selecteren (TODO)

2.6 Analysis Results View
Status: [✓ Basis Layout OK, Componenten Placeholder]
Doel: Het bekijken, filteren en beheren van de bevindingen (errors, warnings, info) die door de "Analyze Snapshot" stap zijn gegenereerd.
Layout:
- Bevat de OrgSelector
- Snapshot Selector/Info card (placeholder)
- Filtersectie (placeholder)
- Hoofdgedeelte met zoekbalk/filters (placeholder)
- Lijst/stats (placeholder)
Functionaliteit:
- Overzicht krijgen (TODO)
- Doorzoeken/filteren (TODO)
- Doorklikken (TODO)

2.7 Settings View
Status: [✓ Basis Structuur OK (Placeholder Forms)]
Doel: Beheren van gebruikersprofiel, Salesforce connecties, en applicatievoorkeuren.
Layout:
- Tab-structuur (Profile, Salesforce Connections, Appearance)
- [Status: ✓ Tabs OK]
Functionaliteit:
- Wachtwoord wijzigen (TODO)
- Orgs koppelen/ontkoppelen (TODO)
- Thema wisselen (TODO)
- Notificaties instellen (TODO)
- [Status: Inhoud TODO]

3. Belangrijke Componenten
Status: [✓ Basis Componenten Aanwezig, Functionaliteit Deels OK]

Deze sectie beschrijft de belangrijkste UI-componenten die op het dashboard of andere schermen voorkomen, met meer detail over hun uiterlijk en functionaliteit, inclusief de huidige implementatiestatus.

3.1 Linker Navigatiebalk
Status: [✓ Geïmplementeerd (Statisch)]
Locatie: Vast aan de linkerkant van het scherm.
Elementen:
- Logo bovenaan
- Lijst met navigatie-items (icon + tekst):
  - Dashboard
  - Snapshots
  - Metadata
  - Analysis
  - Visualization
  - Settings
- Gebruikersmenu/icoon onderaan (placeholder)
- Actieve view is gehighlight via react-router-dom

3.2 Salesforce Org Selector Card
Status: [✓ Deels Functioneel (Mock Data)]
Locatie: Consistent aanwezig bovenaan in de meeste views.
Elementen:
- Titel ("Salesforce Organization")
- Dropdown om een gekoppelde org te selecteren:
  - Dynamisch gevuld met mock data
  - Toont loading/error states
- Knop "Connect New Org" (placeholder, nog niet functioneel)
Functionaliteit:
- Haalt (mock) data op met useQuery
- Synchroniseert de selectie met de globale Zustand store (useAppStore)
- Selecteert automatisch de eerste optie na laden

3.3 Metadata Pipeline Card
Status: [✓ Visueel Aanwezig (Placeholder)]
Locatie: Consistent aanwezig (vaak links) in views waar pipeline acties relevant zijn (Dashboard, Snapshots).
Elementen:
- Titel ("Metadata Pipeline")
- Status badge rechtsboven (statisch, bijv. "Idle")
- Visuele weergave van stappen:
  - Fetch Metadata
  - Build Knowledge Graph
  - Analyze Snapshot
- Iconen (statisch)
- Knop "Run Pipeline" (placeholder, niet functioneel)
- Timestamp "Last snapshot" (placeholder)

3.4 Snapshot Selector / Info Card
Status: [✓ Visueel Aanwezig (Placeholder)]
Locatie: Aanwezig in views die context van een specifieke snapshot vereisen (Snapshots, Metadata Explorer, Graph Visualization, Analysis Results).
Elementen:
- Titel ("Metadata Snapshots" of "Available Snapshots")
- Dropdown bovenaan om de actieve snapshot te selecteren (placeholder, niet functioneel)
- "History" knop (placeholder)
- Details van de geselecteerde snapshot (placeholder)

3.5 Graph Visualization Area & Controls
Status: [ ] Niet Gestart (Layout Placeholder)]
Locatie: Centrale deel van de Graph Visualization View.
Elementen:
Graph Canvas:
- Placeholder voor Cytoscape.js/D3.js
- Interactief gebied voor nodes en edges
Toolbar:
- Zoekbalk ("Search components...")
- Knop "Filters"
- Knop "Layout"
Graph Controls Card:
- Dropdown "Layout Type" (Cose, Concentric, Breadth First)
- Dropdown "Node Type Filter" (All Types, Objects, Fields, Flows, etc.)
- Inputveld "Search Node" (Enter API name...)
Interactie:
- Pannen (slepen van de achtergrond)
- Zoomen (scrollwiel of knoppen)
- Node selectie (klikken op een node)
- Node slepen (optioneel, afhankelijk van layout)
- Hover-effecten (optioneel)

3.6 Metadata Component List/Browser
Status: [ ] Niet Gestart (Layout Placeholder)]
Locatie: Hoofdgedeelte van de Metadata Explorer View.
Elementen:
- Tabs ("Objects", "Fields", "Components")
- Zoekbalk ("Search metadata...")
- Lijst/tabel gebied om componenten weer te geven
- Placeholder indien geen snapshot geselecteerd

3.7 Component Detail Paneel (met Tabs)
Status: [ ] Niet Gestart (Layout Placeholder)]
Locatie: Contextueel, waarschijnlijk rechterpaneel in Metadata Explorer, of als overlay/modal bij selectie in Graph/Analysis views.
Elementen:
Header:
- Component Naam (groot)
- Type (badge)
- API Naam (kleiner)
- Optionele badges (Status, Coverage)
Tabs:
- "Overview"
- "Relationships"
- "Issues"
Overview Tab:
- Kerninformatie (Created date, Last Modified date)
- "Summary" sectie met belangrijke attributen/gebruikspunten
Relationships Tab:
- Lijst van gerelateerde componenten
- Gegroepeerd per relatietype
Issues Tab:
- Lijst van analyse resultaten
- Severity icoon, beschrijving, best practice/suggestie

3.8 Analysis Results List/View
Status: [ ] Niet Gestart (Layout Placeholder)]
Locatie: Hoofdgedeelte van de Analysis Results View.
Elementen:
Header:
- Titel ("Analysis Results")
- Snapshot context indicator
Filter/Zoekbalk:
- Input "Search issues..."
- Dropdown "All Severities"
- Dropdown "All Types"
Weergave Opties:
- Tabs/Knoppen voor "List View" en "Statistics"
List View:
- Tabel/Lijst met issues
- Kolommen/Info per issue:
  - Severity (icoon/badge)
  - Component Naam & Type
  - Beschrijving van issue
  - Link/Icoon om details/component te bekijken
Statistics View (Optioneel):
- Samenvattingen
- Kaarten met aantal Errors/Warnings/Infos
- Lijst met issues per component type
Linker Filter Paneel:
- Checkboxen voor Severity filtering

3.9 AI Assistant Paneel
Status: [✓ Visueel Aanwezig (Placeholder)]
Locatie: Aanwezig op het Dashboard.
Elementen:
- Titel ("AI Assistant")
- Input veld ("Ask about your Salesforce metadata...")
- Verzend knop (icoon)
- Scrollbare chatgeschiedenis
- Voorbeeldvragen (klikbaar)
- Feedback knoppen (👍/👎) onder elk AI antwoord
Functionaliteit:
- Input veld (placeholder, niet functioneel)
- Verzend knop (placeholder)
- Chatgeschiedenis (leeg/placeholder)
- Voorbeeldvragen (statisch, niet functioneel)
- Feedback knoppen (visueel aanwezig, niet functioneel)

3.10 Settings Tabs & Forms
Status: [✓ Basis Structuur OK (Placeholder Forms)]
Locatie: Binnen de Settings View.
Elementen:
Tabs:
- "Profile"
- "Salesforce Connections"
- "Appearance"
[Status: ✓ Tabs OK]
Profile Tab:
- Velden voor Email (read-only)
- Name (editbaar)
- Sectie "Change Password" met velden voor Current, New, Confirm New Password
- "Save Changes" knop
Salesforce Connections Tab:
- Tabel met "Connected Salesforce Orgs"
- Kolommen: Org ID, Instance URL, Connected On, Status, Actions
- Actie knoppen per rij: "Test", "Disconnect"
- Knop onder tabel: "Connect New Salesforce Org"
Appearance Tab:
- "Theme" sectie met "Toggle theme" (licht/donker switch)
- "Notification Preferences" sectie met checkboxes
[Status: Inhoud TODO]

4. User Flows
Status: [✓ Gedefinieerd, Implementatie TODO]

Deze sectie beschrijft de stapsgewijze interacties van de gebruiker met het NEXA platform om specifieke taken uit te voeren. De implementatie van deze flows is nog niet gestart.

4.1 User Flow: Salesforce Org Koppelen
Status: [ ] Niet Gestart
Doel: Een gebruiker verbindt een Salesforce org met zijn NEXA account.
Actor: Ingelogde NEXA gebruiker.
Startpunt: Gebruiker bevindt zich op het Hoofddashboard of de Instellingen pagina. De knop "Connect New Salesforce Org" is visueel aanwezig maar nog niet functioneel.

Stappen:
[TODO] Gebruiker klikt op de knop "Koppel Nieuwe Salesforce Org". (FR-AUTH-03 start)
[TODO] NEXA Backend (API - Deno Function): /functions/v1/sfdc-auth-initiate wordt aangeroepen. Backend initieert OAuth 2.0 PKCE flow en genereert Salesforce autorisatie URL.
[TODO] NEXA Frontend: Redirect de gebruiker naar de ontvangen Salesforce autorisatie URL.
[Extern] Salesforce: Gebruiker logt in, geeft toestemming.
[Extern] Salesforce: Redirect gebruiker terug naar NEXA callback API endpoint (bv. /functions/v1/sfdc-auth-callback) met code en state.
[TODO] NEXA Backend (API - Callback Endpoint - Deno Function):
- Ontvangt code/state, valideert state
- Wisselt code in bij Salesforce voor tokens (met PKCE verifier)
- Haalt Org ID/User ID op
- Slaat connectie info (incl. versleutelde tokens) op in salesforce_connections tabel
[TODO] NEXA Backend (API): Redirect gebruiker terug naar NEXA frontend (bv. Instellingen pagina) met succesindicator.
[TODO] NEXA Frontend: Detecteert succes, toont melding, ververst lijst van gekoppelde orgs (roept API aan om nieuwe lijst te halen).

Foutpaden:
[TODO] Gebruiker klikt "Weigeren" (Deny) in Salesforce -> Redirect terug naar NEXA met error parameter -> Frontend toont foutmelding.
[TODO] Ongeldige state bij callback -> Backend retourneert fout -> Frontend toont foutmelding.
[TODO] Fout bij inwisselen code voor tokens -> Backend logt fout, retourneert fout -> Frontend toont foutmelding.
[TODO] Fout bij opslaan connectie -> Backend logt fout, retourneert fout -> Frontend toont foutmelding.

4.2 User Flow: Metadata Snapshot Maken & Analyseren
Status: [ ] Niet Gestart
Doel: De gebruiker importeert metadata van een gekoppelde org, bouwt de knowledge graph, en voert de standaard analyses uit.
Actor: Ingelogde NEXA gebruiker.
Startpunt: Gebruiker bevindt zich op het Hoofddashboard/Snapshots View, heeft een actieve Salesforce connectie geselecteerd (werkt nu met mock/seed data). De knop "Fetch & Build Snapshot" is visueel aanwezig maar nog niet functioneel.

Stappen:
[TODO] Initiate Pipeline: Gebruiker klikt op "Fetch & Build Snapshot".
[TODO] NEXA Frontend: Stuurt request naar backend API (bv. POST /functions/v1/pipeline-start) met connectionId. Toont 'loading' status.
[TODO] NEXA Backend (Deno Function(s) - Asynchroon Proces):
- Start pipeline proces (zie Dataflow 3.1)
- Maakt metadata_snapshot record (PENDING)
- Haalt metadata op van Salesforce (status FETCHING)
- Parsed metadata (status PARSING)
- Slaat metadata op in Supabase DB (status STORING/STORED)
- Populeert Neo4j graph (status BUILDING_GRAPH)
- Update snapshot status in DB gedurende het proces
- Retourneert initiële snapshotId naar frontend
[TODO] NEXA Frontend:
- Ontvangt snapshotId
- Vraagt periodiek status op (bv. GET /functions/v1/snapshot-status?id=...) of luistert via Realtime
- Toont actuele status
[TODO] Pipeline Voltooid: Backend update status naar 'COMPLETED'/'FAILED'.
[TODO] NEXA Frontend: Detecteert 'COMPLETED' status, update UI, maakt nieuwe snapshot selecteerbaar.
[TODO] Initiate Analysis: Gebruiker klikt "Analyze Snapshot" (of automatisch).
[TODO] NEXA Frontend: Stuurt request (bv. POST /functions/v1/analysis-start?snapshotId=...). Toont 'Analyzing...' status.
[TODO] NEXA Backend (Deno Function): Voert analyse queries uit op Neo4j, slaat resultaten op in analysis_results.
[TODO] NEXA Frontend: Vraagt resultaten op (bv. GET /functions/v1/analysis-results?snapshotId=...), toont deze.

Foutpaden:
[TODO] Pipeline mislukt in een stap -> Status wordt 'FAILED' met foutmelding -> Frontend toont foutmelding.
[TODO] Analyse mislukt -> Frontend toont foutmelding.

4.3 User Flow: AI Impact Analyse Vraag Stellen
Status: [ ] Niet Gestart
Doel: De gebruiker stelt een vraag aan de AI Assistant over de impact van een wijziging of over metadata relaties.
Actor: Ingelogde NEXA gebruiker.
Startpunt: Gebruiker bevindt zich op het Hoofddashboard, heeft een snapshot geselecteerd (TODO - snapshot selectie moet werken). AI Assistant paneel is visueel aanwezig (placeholder).

Stappen:
[TODO] Vraag Invoeren: Gebruiker typt vraag in input veld.
[TODO] Vraag Versturen: Gebruiker klikt verzendknop.
[TODO] NEXA Frontend:
- Voegt vraag toe aan chat UI
- Toont loading indicator
- Stuurt vraag + snapshotId naar backend API (bv. POST /functions/v1/ai-ask)
[TODO] NEXA Backend (Deno Function):
- Verwerkt vraag (zie Dataflow 3.2)
- Interpreteert, query Neo4j, bereidt LLM prompt voor
- Roept LLM aan, verwerkt antwoord
- Slaat interactie op (optioneel)
- Retourneert antwoord
[TODO] NEXA Frontend:
- Ontvangt antwoord
- Verwijdert loading indicator
- Toont AI antwoord in chat UI
- Toont feedback knoppen
[TODO] (Optioneel) Feedback Geven: Gebruiker klikt feedback knop.
[TODO] (Optioneel) NEXA Frontend: Stuurt feedback naar backend API (bv. POST /functions/v1/ai-feedback).
[TODO] (Optioneel) NEXA Backend (Deno Function): Slaat feedback op.

Foutpaden:
[TODO] Fout tijdens backend verwerking (Neo4j, LLM) -> Backend retourneert fout -> Frontend toont foutmelding in chat interface.
[TODO] Snapshot niet gevonden of ongeldig -> Backend retourneert 404 -> Frontend toont foutmelding.

STATUS HIERONDER:
03 - UI UX Designs (versie 1.0 - Datum van vandaag)
Status: IN PROGRESS (Basis Layout OK, OrgSelector Deels Functioneel)
Inhoudsopgave:
Algemene Principes & Stijl
Applicatie Structuur & Schermen
2.1 Login / Registratie Scherm
2.2 Dashboard
2.3 Snapshots View
2.4 Metadata Explorer View
2.5 Graph Visualization View
2.6 Analysis Results View
2.7 Settings View


Belangrijke Componenten
3.1 Linker Navigatiebalk
3.2 Salesforce Org Selector Card
3.3 Metadata Pipeline Card
3.4 Snapshot Selector / Info Card
3.5 Graph Visualization Area & Controls
3.6 Metadata Component List/Browser
3.7 Component Detail Paneel (met Tabs)
3.8 Analysis Results List/View
3.9 AI Assistant Paneel
3.10 Settings Tabs & Forms


User Flows
4.1 Salesforce Org Koppelen
4.2 Metadata Snapshot Maken & Analyseren
4.3 AI Impact Analyse Vraag Stellen



1. Algemene Principes & Stijl
Status: [✓ Basis OK]
Look & Feel: Professioneel, modern, data-gericht. De mockups tonen een effectief donker thema; dit wordt de primaire stijl. Een optioneel licht thema (instelbaar via Settings > Appearance) is een V1+ mogelijkheid. Kleurenpalet is rustig (donkerblauw/grijs tinten) met duidelijke accentkleuren (paars voor acties, groen/rood/geel/blauw voor status/severity badges).
Layout: Multi-pagina applicatie met een vaste linker navigatiebalk. Content per pagina is georganiseerd in duidelijke cards/panelen met afgeronde hoeken en consistente spacing. Responsief design is belangrijk (minimaal voor moderne desktop browsers).
Interactie: Consistente UI elementen (knoppen, dropdowns, tabs, badges). Duidelijke visuele feedback voor loading states, succes- en foutmeldingen. Tooltips voor iconen of complexe elementen.
Typografie: Duidelijk leesbaar lettertype met hiërarchie in groottes en gewichten voor titels, labels en body tekst.
Technologie: React, TypeScript, Tailwind CSS (zie TAD).

2. Applicatie Structuur & Schermen
Status: [✓ Basis Routing OK, Views Hebben Placeholders]
De applicatie is gestructureerd rond meerdere specifieke views/pagina's, toegankelijk via de linker navigatiebalk. De routing is opgezet, maar de inhoud van de meeste views is nog placeholder.
2.1 Login / Registratie Scherm
Status: [ ] Niet Gestart
Doel: Gebruikers toegang geven tot hun NEXA account of hen laten registreren.
Layout & Elementen: Eenvoudige, gecentreerde layout met velden voor e-mail, wachtwoord, knoppen voor Login/Registreer/Wachtwoord Herstel, optionele OAuth knoppen. (Implementatie TODO)
2.2 Dashboard (Home View)
Status: [✓ Basis Layout OK, Componenten Deels Functioneel]
Doel: Dient als startpunt en overzichtspagina. Biedt snelle toegang tot kernacties en inzichten.
Layout: Bevat de OrgSelector (deels functioneel met mock data), Metadata Pipeline card (placeholder), AI Assistant paneel (placeholder), en een sectie met "Quick Stats" (placeholder).
Functionaliteit: Gebruiker kan actieve org kiezen (werkt met mock data), pipeline starten (TODO), en AI vragen stellen (TODO).
2.3 Snapshots View
Status: [✓ Basis Layout OK, Componenten Placeholder]
Doel: Beheren en bekijken van de historie van metadata snapshots voor een geselecteerde organisatie.
Layout: Bevat de OrgSelector, Metadata Pipeline card, en een hoofdgedeelte met "Available Snapshots" (placeholder).
Functionaliteit: Gebruikers kunnen door de lijst van snapshots bladeren (TODO), een snapshot selecteren als actieve context (TODO), en de pipeline triggeren (TODO).
2.4 Metadata Explorer View
Status: [✓ Basis Layout OK, Componenten Placeholder]
Doel: Gedetailleerd browsen en inspecteren van de individuele metadata componenten binnen een geselecteerde snapshot.
Layout: Bevat de OrgSelector, Snapshot Selector/Info card, en een hoofdgedeelte met tabs (Objects, Fields, Components) en een zoekbalk. Een rechterpaneel toont details van het geselecteerde component.
Functionaliteit: Gebruikers kunnen componenten filteren/zoeken, selecteren, en gedetailleerde informatie bekijken in het Component Detail Paneel (zie 3.7).
2.5 Graph Visualization View
Status: [✓ Basis Layout OK, Componenten Placeholder]
Doel: Het interactief visualiseren van de knowledge graph (afhankelijkheden) voor een geselecteerde snapshot.
Layout: Bevat de OrgSelector, Snapshot Selector/Info card, een "Graph Controls" card (met Layout, Filter, Zoeken), en het grote canvas voor de graph zelf.
Functionaliteit: Gebruikers kunnen de graph verkennen, navigeren, filteren, en componenten selecteren om details te zien (waarschijnlijk in een overlay of door te navigeren naar de Metadata Explorer).
2.6 Analysis Results View
Status: [✓ Basis Layout OK, Componenten Placeholder]
Doel: Het bekijken, filteren en beheren van de bevindingen (errors, warnings, info) die door de "Analyze Snapshot" stap zijn gegenereerd.
Layout: Bevat de OrgSelector, Snapshot Selector/Info card, een filtersectie aan de linkerkant (checkboxes voor severity), en een hoofdgedeelte met zoekbalk, filters (severity, type), en de lijst van issues. Een optionele "Statistics" view kan samenvattingen tonen.
Functionaliteit: Gebruikers krijgen een overzicht van alle gedetecteerde problemen, kunnen deze doorzoeken en filteren, en mogelijk doorklikken naar het betreffende component.
2.7 Settings View
Status: [✓ Basis Layout OK, Componenten Placeholder]
Doel: Beheren van gebruikersprofiel, Salesforce connecties, en applicatievoorkeuren.
Layout: Gebruikt een tab-structuur (Profile, Salesforce Connections, Appearance).
Functionaliteit: Gebruikers kunnen wachtwoord wijzigen, orgs koppelen/ontkoppelen/testen, thema wisselen, en notificatievoorkeuren instellen.

3. Belangrijke Componenten
3.1 Linker Navigatiebalk
Locatie: Vast aan de linkerkant van het scherm.
Elementen: Logo bovenaan, lijst met navigatie-items (icon + tekst: Dashboard, Snapshots, Metadata, Analysis, Visualization, Settings), gebruikersmenu/icoon onderaan (voor logout, mogelijk link naar settings). Actieve view is gehighlight.
3.2 Salesforce Org Selector Card
Locatie: Consistent aanwezig bovenaan in de meeste views.
Elementen: Titel ("Salesforce Organization"), Dropdown om een gekoppelde org te selecteren (toont naam en type, bijv. "Production Org (production)"), Knop "Connect New Org" (opent waarschijnlijk modal of navigeert naar Settings).
3.3 Metadata Pipeline Card
Locatie: Consistent aanwezig (vaak links) in views waar pipeline acties relevant zijn (Dashboard, Snapshots).
Elementen: Titel ("Metadata Pipeline"), Status badge rechtsboven (Idle, Building..., Complete, Failed). Visuele weergave van stappen (Fetch Metadata, Build Knowledge Graph, Analyze Snapshot) met iconen en korte beschrijving. Vinkjes verschijnen voor voltooide stappen. Knop "Run Pipeline" onderaan. Timestamp van "Last snapshot".
3.4 Snapshot Selector / Info Card
Locatie: Aanwezig in views die context van een specifieke snapshot vereisen (Snapshots, Metadata Explorer, Graph Visualization, Analysis Results).
Elementen: Titel ("Metadata Snapshots" of "Available Snapshots"). Dropdown bovenaan om de actieve snapshot te selecteren (toont ID/naam en status badge). "History" knop (functionaliteit TBD). Details van de geselecteerde snapshot (timestamp, aantal componenten, aantal relaties).
3.5 Graph Visualization Area & Controls
Locatie: Centrale deel van de Graph Visualization View.
Elementen:
Graph Canvas: Interactief gebied voor Cytoscape.js/D3.js.
Toolbar: Knoppen voor:
Zoom In / Zoom Out / Reset Zoom (Fit to screen).
Layout wisselen (indien meerdere layouts ondersteund, bijv. Cose, Concentric, Breadthfirst).
Optioneel: Export (PNG/JSON - V1+).
Zoekbalk: Inputveld om snel een component te vinden op apiName. Bij selectie van een zoekresultaat wordt de graph gecentreerd op die node.
Legenda (Optioneel V1+): Een legenda die de betekenis van verschillende node kleuren/vormen of edge types uitlegt.
Interactie:
Pannen (slepen van de achtergrond).
Zoomen (scrollwiel of knoppen).
Node selectie (klikken op een node). Selectie triggert het tonen van details in Paneel 3 (Component Details). (FR-UI-04, FR-UI-05).
Node slepen (optioneel, afhankelijk van layout).
Hover-effecten (optioneel, bijv. highlighten van node/edge bij muis erover).

3.6 Metadata Component List/Browser
Locatie: Hoofdgedeelte van de Metadata Explorer View.
Elementen: Tabs ("Objects", "Fields", "Components"). Zoekbalk rechtsboven ("Search metadata..."). Lijst/tabel gebied om componenten weer te geven (naam, type, etc.). Placeholder indien geen snapshot geselecteerd.
3.7 Component Detail Paneel (met Tabs)
Locatie: Contextueel, waarschijnlijk rechterpaneel in Metadata Explorer, of als overlay/modal bij selectie in Graph/Analysis views.
Elementen:
Header: Component Naam (groot), Type (badge), API Naam (kleiner). Optionele badges zoals Status ("Active") en Coverage ("78% Coverage").
Tabs: "Overview", "Relationships", "Issues".
Overview Tab: Toont kerninformatie (Created date, Last Modified date), "Summary" sectie met belangrijke attributen/gebruikspunten (lijst met iconen).
Relationships Tab: Lijst van gerelateerde componenten, gegroepeerd per relatietype (bijv. "Calls", "Queries", "Used By"). Per relatie: Component Naam, Type, en "View" knop (navigeert mogelijk naar dat component).
Issues Tab: Lijst van analyse resultaten (errors/warnings) die specifiek op dit component betrekking hebben. Toont severity icoon, beschrijving, en best practice/suggestie.

3.8 Analysis Results List/View
Locatie: Hoofdgedeelte van de Analysis Results View.
Elementen:
Header: Titel ("Analysis Results"), Snapshot context indicator.
Filter/Zoekbalk: Input "Search issues...", Dropdown "All Severities", Dropdown "All Types".
Weergave Opties: Tabs/Knoppen voor "List View" en "Statistics".
List View: Tabel/Lijst met issues. Kolommen/Info per issue: Severity (icoon/badge rechts), Component Naam & Type, Beschrijving van issue, Link/Icoon om details/component te bekijken.
Statistics View (Optioneel): Toont samenvattingen, bijv. kaarten met aantal Errors/Warnings/Infos, lijst met issues per component type.
Linker Filter Paneel: Checkboxen om te filteren op Severity ("Show Errors", "Show Warnings", "Show Info").

3.9 AI Assistant Paneel
Locatie: Aanwezig op het Dashboard (mogelijk inklapbaar of verplaatsbaar).
Elementen: Titel ("AI Assistant"). Input veld ("Ask about your Salesforce metadata..."). Verzend knop (icoon). Scrollbare chatgeschiedenis met afwisselend gebruikersvragen en AI-antwoorden. Voorbeeldvragen (klikbaar). Feedback knoppen (👍/👎) onder elk AI antwoord.
3.10 Settings Tabs & Forms
Locatie: Binnen de Settings View.
Elementen:
Tabs: "Profile", "Salesforce Connections", "Appearance".
Profile Tab: Velden voor Email (read-only), Name (editbaar), sectie "Change Password" met velden voor Current, New, Confirm New Password, "Save Changes" knop.
Salesforce Connections Tab: Tabel met "Connected Salesforce Orgs" (kolommen: Org ID, Instance URL, Connected On, Status, Actions). Actie knoppen per rij: "Test", "Disconnect". Knop onder tabel: "Connect New Salesforce Org".
Appearance Tab: "Theme" sectie met "Toggle theme" (licht/donker switch). "Notification Preferences" sectie met checkboxes (Email Notifications, Analysis Completion, Snapshot Failures).

4. User Flows
(Deze sectie blijft zoals gegenereerd in de vorige stap, met flows 4.1, 4.2, en 4.3. De startpunten zijn nu duidelijker door de gedefinieerde views, bijv. Org Koppelen start vanuit Settings)
(Herhaal hier de tekst voor 4.1, 4.2, en 4.3 zoals eerder gegenereerd)
4.1 User Flow: Salesforce Org Koppelen ... (etc.)
4.2 User Flow: Metadata Snapshot Maken & Analyseren ... (etc.)
4.3 User Flow: AI Impact Analyse Vraag Stellen ... (etc.)

STATUS HIERONDER:
03 - UI UX Designs (versie 1.0 - Datum van vandaag)
Status: IN PROGRESS (Basis Layout OK, OrgSelector Deels Functioneel)
Inhoudsopgave:
Algemene Principes & Stijl
Applicatie Structuur & Schermen
2.1 Login / Registratie Scherm
2.2 Dashboard
2.3 Snapshots View
2.4 Metadata Explorer View
2.5 Graph Visualization View
2.6 Analysis Results View
2.7 Settings View


Belangrijke Componenten
3.1 Linker Navigatiebalk
3.2 Salesforce Org Selector Card
3.3 Metadata Pipeline Card
3.4 Snapshot Selector / Info Card
3.5 Graph Visualization Area & Controls
3.6 Metadata Component List/Browser
3.7 Component Detail Paneel (met Tabs)
3.8 Analysis Results List/View
3.9 AI Assistant Paneel
3.10 Settings Tabs & Forms


User Flows
4.1 Salesforce Org Koppelen
4.2 Metadata Snapshot Maken & Analyseren
4.3 AI Impact Analyse Vraag Stellen



1. Algemene Principes & Stijl
Status: [✓ Basis OK]
Look & Feel: Professioneel, modern, data-gericht. Donker thema geïmplementeerd. Licht thema V1+. Kleurenpalet rustig met accenten. [Status: ✓ Basis thema geïmplementeerd]
Layout: Multi-pagina applicatie met vaste linker navigatie. Cards/panelen gebruikt. Responsief (desktop focus). [Status: ✓ Basis layout geïmplementeerd]
Interactie: Consistente UI elementen (via Shadcn/UI). Feedback (loading/error) deels in OrgSelector. [Status: ✓ Basis componenten aanwezig, Feedback deels OK]
Typografie: Basis hiërarchie aanwezig.
Technologie: React, TypeScript, Tailwind CSS. [Status: ✓ Gebruikt]

2. Applicatie Structuur & Schermen
Status: [✓ Basis Routing OK, Views Hebben Placeholders]

De applicatie is gestructureerd rond meerdere specifieke views/pagina's, toegankelijk via de linker navigatiebalk. De routing is opgezet, maar de inhoud van de meeste views is nog placeholder.

2.1 Login / Registratie Scherm
Status: [ ] Niet Gestart
Doel: Gebruikers toegang geven tot hun NEXA account of hen laten registreren.
Layout & Elementen: Eenvoudige, gecentreerde layout met velden voor e-mail, wachtwoord, knoppen voor Login/Registreer/Wachtwoord Herstel, optionele OAuth knoppen. (Implementatie TODO)
2.2 Dashboard (Home View)
Status: [✓ Basis Layout OK, Componenten Deels Functioneel]
Doel: Dient als startpunt en overzichtspagina. Biedt snelle toegang tot kernacties en inzichten.
Layout: Bevat de OrgSelector (deels functioneel met mock data), Metadata Pipeline card (placeholder), AI Assistant paneel (placeholder), en een sectie met "Quick Stats" (placeholder).
Functionaliteit: Gebruiker kan actieve org kiezen (werkt met mock data), pipeline starten (TODO), en AI vragen stellen (TODO).
2.3 Snapshots View
Status: [✓ Basis Layout OK, Componenten Placeholder]
Doel: Beheren en bekijken van de historie van metadata snapshots voor een geselecteerde organisatie.
Layout: Bevat de OrgSelector, Metadata Pipeline card, en een hoofdgedeelte met "Available Snapshots" (placeholder).
Functionaliteit: Gebruikers kunnen door de lijst van snapshots bladeren (TODO), een snapshot selecteren als actieve context (TODO), en de pipeline triggeren (TODO).
2.4 Metadata Explorer View
Status: [✓ Basis Layout OK, Componenten Placeholder]
Doel: Gedetailleerd browsen en inspecteren van de individuele metadata componenten binnen een geselecteerde snapshot.
Layout: Bevat de OrgSelector, Snapshot Selector/Info card, en een hoofdgedeelte met tabs (Objects, Fields, Components) en een zoekbalk. Een rechterpaneel toont details van het geselecteerde component.
Functionaliteit: Gebruikers kunnen componenten filteren/zoeken, selecteren, en gedetailleerde informatie bekijken in het Component Detail Paneel (zie 3.7).
2.5 Graph Visualization View
Status: [✓ Basis Layout OK, Componenten Placeholder]
Doel: Het interactief visualiseren van de knowledge graph (afhankelijkheden) voor een geselecteerde snapshot.
Layout: Bevat de OrgSelector, Snapshot Selector/Info card, een "Graph Controls" card (met Layout, Filter, Zoeken), en het grote canvas voor de graph zelf.
Functionaliteit: Gebruikers kunnen de graph verkennen, navigeren, filteren, en componenten selecteren om details te zien (waarschijnlijk in een overlay of door te navigeren naar de Metadata Explorer).
2.6 Analysis Results View
Status: [✓ Basis Layout OK, Componenten Placeholder]
Doel: Het bekijken, filteren en beheren van de bevindingen (errors, warnings, info) die door de "Analyze Snapshot" stap zijn gegenereerd.
Layout: Bevat de OrgSelector, Snapshot Selector/Info card, een filtersectie aan de linkerkant (checkboxes voor severity), en een hoofdgedeelte met zoekbalk, filters (severity, type), en de lijst van issues. Een optionele "Statistics" view kan samenvattingen tonen.
Functionaliteit: Gebruikers krijgen een overzicht van alle gedetecteerde problemen, kunnen deze doorzoeken en filteren, en mogelijk doorklikken naar het betreffende component.
2.7 Settings View
Status: [✓ Basis Layout OK, Componenten Placeholder]
Doel: Beheren van gebruikersprofiel, Salesforce connecties, en applicatievoorkeuren.
Layout: Gebruikt een tab-structuur (Profile, Salesforce Connections, Appearance). [Status: ✓ Tabs aanwezig]
Functionaliteit: Wachtwoord wijzigen (TODO), orgs koppelen/ontkoppelen (TODO), thema wisselen (TODO), notificatievoorkeuren instellen (TODO).

3. Belangrijke Componenten
Deze sectie beschrijft de belangrijkste UI-componenten die op het dashboard of andere schermen voorkomen, met meer detail over hun uiterlijk en functionaliteit, inclusief de huidige implementatiestatus.
3.1 Linker Navigatiebalk
Status: [✓ Geïmplementeerd (Statisch)]
Locatie: Vast aan de linkerkant van het scherm.
Elementen: Logo bovenaan, lijst met navigatie-items (icon + tekst: Dashboard, Snapshots, Metadata, Analysis, Visualization, Settings), gebruikersmenu/icoon onderaan (placeholder). Actieve view is gehighlight via react-router-dom.
3.2 Salesforce Org Selector Card
Status: [✓ Deels Functioneel (Mock Data)]
Locatie: Consistent aanwezig bovenaan in de meeste views.
Elementen: Titel ("Salesforce Organization"), Dropdown om een gekoppelde org te selecteren (dynamisch gevuld met mock data, toont loading/error states), Knop "Connect New Org" (placeholder, nog niet functioneel).
Functionaliteit: Haalt (mock) data op met useQuery, synchroniseert de selectie met de globale Zustand store (useAppStore), selecteert automatisch de eerste optie na laden.
3.3 Metadata Pipeline Card
Status: [✓ Visueel Aanwezig (Placeholder)]
Locatie: Consistent aanwezig (vaak links) in views waar pipeline acties relevant zijn (Dashboard, Snapshots).
Elementen: Titel ("Metadata Pipeline"), Status badge rechtsboven (statisch, bijv. "Idle"), Visuele weergave van stappen (Fetch Metadata, Build Knowledge Graph, Analyze Snapshot) met iconen (statisch), Knop "Run Pipeline" (placeholder, niet functioneel). Timestamp "Last snapshot" (placeholder).
3.4 Snapshot Selector / Info Card
Status: [✓ Visueel Aanwezig (Placeholder)]
Locatie: Aanwezig in views die context van een specifieke snapshot vereisen (Snapshots, Metadata Explorer, Graph Visualization, Analysis Results).
Elementen: Titel ("Metadata Snapshots" of "Available Snapshots"). Dropdown bovenaan om de actieve snapshot te selecteren (placeholder, niet functioneel). "History" knop (placeholder). Details van de geselecteerde snapshot (placeholder).
3.5 Graph Visualization Area & Controls
Status: [ ] Niet Gestart (Layout Placeholder)]
Locatie: Centrale deel van de Graph Visualization View.
Elementen:
Graph Canvas: Placeholder voor Cytoscape.js/D3.js.
Toolbar (boven canvas): Zoekbalk (placeholder), Knop "Filters" (placeholder), Knop "Layout" (placeholder).
Graph Controls Card (links van canvas): Dropdowns/Input voor Layout, Filter, Zoeken (placeholders).


3.6 Metadata Component List/Browser
Status: [ ] Niet Gestart (Layout Placeholder)]
Locatie: Hoofdgedeelte van de Metadata Explorer View.
Elementen: Tabs ("Objects", "Fields", "Components") (placeholder), Zoekbalk (placeholder), Lijst/tabel gebied (placeholder).
3.7 Component Detail Paneel (met Tabs)
Status: [ ] Niet Gestart (Layout Placeholder)]
Locatie: Contextueel, waarschijnlijk rechterpaneel in Metadata Explorer, etc.
Elementen:
Header: Component Naam, Type, API Naam (placeholders).
Tabs: "Overview", "Relationships", "Issues" (placeholders met placeholder inhoud).


3.8 Analysis Results List/View
Status: [ ] Niet Gestart (Layout Placeholder)]
Locatie: Hoofdgedeelte van de Analysis Results View.
Elementen:
Header: Titel, Snapshot context (placeholder).
Filter/Zoekbalk: Input/Dropdowns (placeholders).
Weergave Opties: Tabs/Knoppen "List View" / "Statistics" (placeholder).
List View: Tabel/Lijst (placeholder).
Statistics View: (Placeholder).
Linker Filter Paneel: Checkboxen (placeholder).


3.9 AI Assistant Paneel
Status: [✓ Visueel Aanwezig (Placeholder)]
Locatie: Aanwezig op het Dashboard.
Elementen: Titel ("AI Assistant"). Input veld (placeholder, niet functioneel). Verzend knop (placeholder). Scrollbare chatgeschiedenis (leeg/placeholder). Voorbeeldvragen (statisch, niet functioneel). Feedback knoppen (visueel aanwezig, niet functioneel).
3.10 Settings Tabs & Forms
Status: [✓ Basis Structuur OK (Placeholder Forms)]
Locatie: Binnen de Settings View.
Elementen:
Tabs: "Profile", "Salesforce Connections", "Appearance" zijn functioneel voor navigatie. [Status: ✓ Tabs OK]
Inhoud per tab: Placeholder formulieren/tekst. Geen functionaliteit geïmplementeerd (wachtwoord wijzigen, connecties tonen/beheren, thema wisselen). [Status: Inhoud TODO]
4. User Flows
Status: [✓ Gedefinieerd, Implementatie TODO]
Deze sectie beschrijft de stapsgewijze interacties van de gebruiker met het NEXA platform om specifieke taken uit te voeren. De implementatie van deze flows is nog niet gestart.
4.1 User Flow: Salesforce Org Koppelen
Status: [ ] Niet Gestart
Doel: Een gebruiker verbindt een Salesforce org met zijn NEXA account.
Actor: Ingelogde NEXA gebruiker.
Startpunt: Gebruiker bevindt zich op het Hoofddashboard of de Instellingen pagina. De knop "Connect New Salesforce Org" is visueel aanwezig maar nog niet functioneel.

Stappen:
[TODO] Gebruiker klikt op de knop "Koppel Nieuwe Salesforce Org". (FR-AUTH-03 start)
[TODO] NEXA Backend (API - Deno Function): /functions/v1/sfdc-auth-initiate wordt aangeroepen. Backend initieert OAuth 2.0 PKCE flow en genereert Salesforce autorisatie URL.
[TODO] NEXA Frontend: Redirect de gebruiker naar de ontvangen Salesforce autorisatie URL.
[Extern] Salesforce: Gebruiker logt in, geeft toestemming.
[Extern] Salesforce: Redirect gebruiker terug naar NEXA callback API endpoint (bv. /functions/v1/sfdc-auth-callback) met code en state.
[TODO] NEXA Backend (API - Callback Endpoint - Deno Function):
- Ontvangt code/state, valideert state
- Wisselt code in bij Salesforce voor tokens (met PKCE verifier)
- Haalt Org ID/User ID op
- Slaat connectie info (incl. versleutelde tokens) op in salesforce_connections tabel
[TODO] NEXA Backend (API): Redirect gebruiker terug naar NEXA frontend (bv. Instellingen pagina) met succesindicator.
[TODO] NEXA Frontend: Detecteert succes, toont melding, ververst lijst van gekoppelde orgs (roept API aan om nieuwe lijst te halen).

Foutpaden:
[TODO] Gebruiker klikt "Weigeren" (Deny) in Salesforce -> Redirect terug naar NEXA met error parameter -> Frontend toont foutmelding.
[TODO] Ongeldige state bij callback -> Backend retourneert fout -> Frontend toont foutmelding.
[TODO] Fout bij inwisselen code voor tokens -> Backend logt fout, retourneert fout -> Frontend toont foutmelding.
[TODO] Fout bij opslaan connectie -> Backend logt fout, retourneert fout -> Frontend toont foutmelding.

4.2 User Flow: Metadata Snapshot Maken & Analyseren
Status: [ ] Niet Gestart
Doel: De gebruiker importeert metadata van een gekoppelde org, bouwt de knowledge graph, en voert de standaard analyses uit.
Actor: Ingelogde NEXA gebruiker.
Startpunt: Gebruiker bevindt zich op het Hoofddashboard/Snapshots View, heeft een actieve Salesforce connectie geselecteerd (werkt nu met mock/seed data). De knop "Fetch & Build Snapshot" is visueel aanwezig maar nog niet functioneel.

Stappen:
[TODO] Initiate Pipeline: Gebruiker klikt op "Fetch & Build Snapshot".
[TODO] NEXA Frontend: Stuurt request naar backend API (bv. POST /functions/v1/pipeline-start) met connectionId. Toont 'loading' status.
[TODO] NEXA Backend (Deno Function(s) - Asynchroon Proces):
- Start pipeline proces (zie Dataflow 3.1)
- Maakt metadata_snapshot record (PENDING)
- Haalt metadata op van Salesforce (status FETCHING)
- Parsed metadata (status PARSING)
- Slaat metadata op in Supabase DB (status STORING/STORED)
- Populeert Neo4j graph (status BUILDING_GRAPH)
- Update snapshot status in DB gedurende het proces
- Retourneert initiële snapshotId naar frontend
[TODO] NEXA Frontend:
- Ontvangt snapshotId
- Vraagt periodiek status op (bv. GET /functions/v1/snapshot-status?id=...) of luistert via Realtime
- Toont actuele status
[TODO] Pipeline Voltooid: Backend update status naar 'COMPLETED'/'FAILED'.
[TODO] NEXA Frontend: Detecteert 'COMPLETED' status, update UI, maakt nieuwe snapshot selecteerbaar.
[TODO] Initiate Analysis: Gebruiker klikt "Analyze Snapshot" (of automatisch).
[TODO] NEXA Frontend: Stuurt request (bv. POST /functions/v1/analysis-start?snapshotId=...). Toont 'Analyzing...' status.
[TODO] NEXA Backend (Deno Function): Voert analyse queries uit op Neo4j, slaat resultaten op in analysis_results.
[TODO] NEXA Frontend: Vraagt resultaten op (bv. GET /functions/v1/analysis-results?snapshotId=...), toont deze.

Foutpaden:
[TODO] Pipeline mislukt in een stap -> Status wordt 'FAILED' met foutmelding -> Frontend toont foutmelding.
[TODO] Analyse mislukt -> Frontend toont foutmelding.

4.3 User Flow: AI Impact Analyse Vraag Stellen
Status: [ ] Niet Gestart
Doel: De gebruiker stelt een vraag aan de AI Assistant over de impact van een wijziging of over metadata relaties.
Actor: Ingelogde NEXA gebruiker.
Startpunt: Gebruiker bevindt zich op het Hoofddashboard, heeft een snapshot geselecteerd (TODO - snapshot selectie moet werken). AI Assistant paneel is visueel aanwezig (placeholder).

Stappen:
[TODO] Vraag Invoeren: Gebruiker typt vraag in input veld.
[TODO] Vraag Versturen: Gebruiker klikt verzendknop.
[TODO] NEXA Frontend:
- Voegt vraag toe aan chat UI
- Toont loading indicator
- Stuurt vraag + snapshotId naar backend API (bv. POST /functions/v1/ai-ask)
[TODO] NEXA Backend (Deno Function):
- Verwerkt vraag (zie Dataflow 3.2)
- Interpreteert, query Neo4j, bereidt LLM prompt voor
- Roept LLM aan, verwerkt antwoord
- Slaat interactie op (optioneel)
- Retourneert antwoord
[TODO] NEXA Frontend:
- Ontvangt antwoord
- Verwijdert loading indicator
- Toont AI antwoord in chat UI
- Toont feedback knoppen
[TODO] (Optioneel) Feedback Geven: Gebruiker klikt feedback knop.
[TODO] (Optioneel) NEXA Frontend: Stuurt feedback naar backend API (bv. POST /functions/v1/ai-feedback).
[TODO] (Optioneel) NEXA Backend (Deno Function): Slaat feedback op.

Foutpaden:
[TODO] Fout tijdens backend verwerking (Neo4j, LLM) -> Backend retourneert fout -> Frontend toont foutmelding in chat interface.
[TODO] Snapshot niet gevonden of ongeldig -> Backend retourneert 404 -> Frontend toont foutmelding.







 

