Gedetailleerd Stappenplan: NEXA MVP Week 1

Doel Week 1: Werkende GET /connections API die door ingelogde gebruiker geautoriseerde Salesforce connecties retourneert, geïntegreerd in een OrgSelector component in de frontend die data via deze API ophaalt en selectie mogelijk maakt via Zustand.

Milestone 1.2: API - Salesforce Connecties Ophalen

Stap 1.2.1: Basis API Structuur & CORS Setup

Doel: Een minimaal werkend Deno Edge Function endpoint dat correct reageert op OPTIONS preflight requests en een placeholder response geeft voor GET.

Taken voor Cursor:

Maak de mapstructuur supabase/functions/connections/ aan.

Maak het bestand supabase/functions/_shared/database.types.ts aan. Definieer hierin de TypeScript interfaces: SalesforceConnection (met id, name, instance_url, organization_id), OrganizationMember (met user_id, organization_id), en Organization.

Maak het bestand supabase/functions/_shared/cors.ts aan.

Implementeer een handleCors functie die OPTIONS requests correct afhandelt (status 204, met Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers). Baseer Access-Control-Allow-Origin op een lijst toegestane origins (begin met je lokale frontend URL, bv. http://localhost:5173).

Laat handleCors voor non-OPTIONS requests een object met de benodigde CORS headers retourneren die aan de uiteindelijke response toegevoegd kunnen worden.

Maak het bestand supabase/functions/connections/index.ts aan.

Importeer serve en de handleCors functie.

Implementeer de basis serve handler.

Roep handleCors aan het begin aan. Return direct de response als het een OPTIONS request is. Sla de CORS headers op voor later gebruik bij andere requests.

Implementeer een try...catch block.

Binnen de try: Return voor nu een hardcoded new Response(JSON.stringify([]), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }).

Binnen de catch: Return een generieke 500 error response met CORS headers.

Output: Een deploybare/serve-bare functie die CORS preflight correct afhandelt en een lege array teruggeeft voor GET requests.

Review & Test: Controleer code structuur, CORS implementatie. Test lokaal met curl -X OPTIONS ... en curl -X GET .... Commit.

Stap 1.2.2: Supabase Client & Authenticatie Laag

Doel: Integratie van de Supabase client en validatie van het JWT token.

Taken voor Cursor:

Maak het bestand supabase/functions/_shared/supabaseClient.ts aan.

Importeer createClient van @supabase/supabase-js.

Importeer de Database interface uit database.types.ts.

Initialiseer de Supabase client (createClient<Database>(...)) met SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY uit de environment variables. Voeg checks toe of deze variabelen bestaan. Exporteer de client instance.

Pas supabase/functions/connections/index.ts aan:

Importeer de supabaseClient.

Na de CORS check, haal de Authorization header op. Return een 401 response (met CORS headers) als deze mist of niet start met Bearer.

Extraheer het token.

Gebruik supabaseClient.auth.getUser(token) om de gebruiker te valideren.

Return een 401 response (met CORS headers) als getUser een error geeft of geen user retourneert.

Log de user.id bij succesvolle validatie (voor debuggen).

Behoud voor nu de hardcoded return new Response(JSON.stringify([]), ...) aan het einde van de try block.

Output: API endpoint valideert nu JWT tokens. Requests zonder/met ongeldig token krijgen 401. Requests met geldig token loggen user ID en krijgen nog steeds lege array.

Review & Test: Controleer Supabase client setup, env var gebruik, token extractie, getUser logica, error responses. Test lokaal met curl (zonder token, met ongeldig token, met geldig test token). Commit.

Stap 1.2.3: Autorisatie Laag (Organization Membership)

Doel: Bepalen bij welke organisatie(s) de gevalideerde gebruiker hoort.

Taken voor Cursor:

Pas supabase/functions/connections/index.ts aan:

Na de succesvolle getUser call (je hebt nu user.id), voer een Supabase query uit op de organization_members tabel.

select('organization_id').

Filter (.eq()) op de user.id.

Voeg error handling toe voor deze query. Return een 500 response (met CORS headers) bij een databasefout.

Controleer het resultaat: Als de gebruiker geen lid is van organisaties (orgMembers is leeg of null), return dan direct new Response(JSON.stringify([]), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }).

Als er organisaties zijn, haal de organization_id's eruit (bv. met .map()) en sla deze op in een variabele (bv. orgIds). Log deze ID's (voor debuggen).

Behoud voor nu de hardcoded return new Response(JSON.stringify([]), ...) aan het allereinde van de try block.

Output: API endpoint bepaalt nu de organisaties van de gebruiker. Gebruikers zonder organisaties krijgen direct een lege array. Gebruikers met organisaties loggen de org ID's en krijgen nog steeds de placeholder response.

Review & Test: Controleer DB query, error handling, lege resultaat check, mapping. Test lokaal met curl en een geldig token voor een gebruiker die wel/geen lid is van organisaties (vereist testdata in organization_members). Commit.

Stap 1.2.4: Data Ophalen & Finale Response

Doel: De daadwerkelijke Salesforce connecties ophalen die bij de geautoriseerde organisaties horen en deze retourneren.

Taken voor Cursor:

Pas supabase/functions/connections/index.ts aan:

Na het verkrijgen van de orgIds (en alleen als orgIds niet leeg is), voer een Supabase query uit op de salesforce_connections tabel.

Selecteer alleen de benodigde, veilige velden: select('id, name, instance_url, organization_id').

Filter (.in()) op `ert voor de ingelogde gebruiker, gebaseerd op diens organisaties.

Stap 1.2.1: Basis Structuur, Types & CORS Setup

Taak voor Cursor:

Maak de directory structuur aan: supabase/functions/connections/ en supabase/functions/_shared/.

Maak supabase/functions/_shared/database.types.ts en definieer de TypeScript interfaces: SalesforceConnection (met id, name, instance_url, organization_id), OrganizationMember (met user_id, organization_id), Organization.

Maak supabase/functions/_shared/cors.ts. Implementeer de handleCors functie die OPTIONS preflight requests correct afhandelt (retourneert Response met status 204 en CORS headers) en voor andere requests een object met CORS headers retourneert. Sta minimaal de frontend origin (http://localhost:5173) toe in Access-Control-Allow-Origin. Sta headers toe zoals Authorization, Content-Type.

Maak supabase/functions/_shared/supabaseClient.ts. Initialiseer hier de Supabase service role client (createClient met service key uit env vars) en geef deze de Database types mee.

Maak supabase/functions/connections/index.ts. Importeer serve, handleCors, en supabaseClient. Zet de basis serve functie op. Implementeer de initiële CORS afhandeling (call handleCors, return Response if OPTIONS). Zorg voor een basis try...catch block. Return voor nu een hardcoded 200 OK response met een lege array [] als body en de juiste Content-Type: application/json en CORS headers.

Review/Test:

Code review: Zijn de bestanden/structuur correct? Zijn types logisch? Werkt de CORS preflight logic? Is de service client correct geïnitialiseerd (gebruik van env vars)?

Test (lokaal via supabase functions serve):

curl -X OPTIONS [jouw_lokale_functie_url] - Moet 204 No Content teruggeven met correcte Access-Control-* headers.

curl -X GET [jouw_lokale_functie_url] - Moet 200 OK teruggeven met [] en CORS headers.

Commit: git commit -m "feat(api): setup connections endpoint structure, types, cors"

Stap 1.2.2: Authenticatie (JWT Validatie)

Taak voor Cursor:

Pas connections/index.ts aan.

Binnen de try block (na CORS handling): Haal de Authorization header op.

Valideer of de header bestaat en het 'Bearer ' prefix heeft. Zo niet, return direct een 401 Unauthorized Response met een JSON error body en CORS headers.

Extraheer het token.

Gebruik supabaseClient.auth.getUser(token) om het token te valideren en de user op te halen.

Als getUser een error geeft of geen user retourneert, return direct een 401 Unauthorized Response met JSON error body en CORS headers.

Als validatie succesvol is, ga verder (retourneer nog steeds de hardcoded [] voor nu). Log eventueel user.id voor debugging.

Review/Test:

Code review: Wordt de header correct geparsed? Wordt getUser correct gebruikt? Worden 401 errors correct afgehandeld?

Test (lokaal):

curl GET [url] (zonder Auth header) -> Moet 401 krijgen.

curl GET -H "Authorization: Bearer invalidtoken" [url] -> Moet 401 krijgen.

curl GET -H "Authorization: Bearer [GELDIG_TEST_TOKEN]" [url] -> Moet 200 OK met [] krijgen (en user ID gelogd zien in functie logs).

Commit: git commit -m "feat(api): implement JWT authentication for connections"

Stap 1.2.3: Autorisatie (Ophalen Gebruiker Organisaties)

Taak voor Cursor:

Pas connections/index.ts aan.

Na de succesvolle JWT validatie (waar je de user hebt): Voer een Supabase query uit op de organization_members tabel.

Selecteer alleen organization_id.

Filter waar user_id gelijk is aan de user.id uit het token.

Voeg error handling toe voor deze query. Bij een database error, return een 500 Internal Server Error Response met JSON error body en CORS headers.

Als de query succesvol is maar geen rijen retourneert (orgMembers is leeg of null), return dan direct een 200 OK Response met een lege array [] als body en CORS headers (deze gebruiker hoort bij geen enkele org).

Als er organisaties zijn gevonden, bewaar de lijst met organization_ids (bv. in orgIds). Ga verder (retourneer nog steeds [] voor nu).

Review/Test:

Code review: Is de query correct? Wordt alleen organization_id geselecteerd? Is de filtering op user.id correct? Wordt DB error (500) en 'geen orgs' (200 leeg) correct afgehandeld?

Test (lokaal, vereist test data):

curl GET [url] met token van gebruiker ZONDER orgs -> Moet 200 OK met [] krijgen.

curl GET [url] met token van gebruiker MET orgs -> Moet 200 OK met [] krijgen (maar orgIds moeten intern beschikbaar zijn).

(Optioneel) Simuleer DB error -> Moet 500 krijgen.

Commit: git commit -m "feat(api): implement authorization logic (fetch user orgs)"

Stap 1.2.4: Data Ophalen & Filteren (Connecties)

Taak voor Cursor:

Pas connections/index.ts aan.

Na het succesvol ophalen van de orgIds (als die lijst niet leeg is): Voer een Supabase query uit op de salesforce_connections tabel.

Selecteer alleen de benodigde velden: id, name, instance_url.

Filter waar de organization_id voorkomt in de lijst orgIds (gebruik .in('organization_id', orgIds)).

Voeg error handling toe voor deze query. Bij een database error, return een 500 Internal Server Error Response met JSON error body en CORS headers.

Bewaar het resultaat (de lijst met connections).

Review/Test:

Code review: Is de query correct? Worden de juiste velden geselecteerd? Is de .in() filter correct? Wordt DB error (500) correct afgehandeld?

Test (lokaal, vereist test data voor user MET orgs EN gekoppelde connections):

curl GET [url] met token van gebruiker MET orgs -> Moet 200 OK krijgen. De response body moet nu de daadwerkelijke connecties bevatten (alleen de geselecteerde velden) die bij de orgs van die gebruiker horen.

curl GET [url] met token van gebruiker MET orgs maar ZONDER connections -> Moet 200 OK met [] krijgen.

Commit: git commit -m "feat(api): implement data fetching for connections filtered by org"

Stap 1.2.5: Finale Response & Afronding

Taak voor Cursor:

Pas connections/index.ts aan.

Zorg ervoor dat de uiteindelijke succesvolle Response de opgehaalde connections data (of een lege array als die leeg was) bevat, correct geformatteerd als JSON string.

Verwijder eventuele overbodige console.log statements.

Loop alle error responses nogmaals na: zijn de status codes (401, 500) en JSON bodies consistent?

Zorg dat alle responses (succes en error) de CORS headers bevatten.

Review/Test:

Code review: Is de code schoon? Is de finale response correct? Zijn alle paden (auth fail, no orgs, db error 1, db error 2, success) logisch afgehandeld?

Test (lokaal): Herhaal de belangrijkste tests uit de vorige stappen om te bevestigen dat alles nog steeds werkt zoals verwacht.

Commit: git commit -m "refactor(api): finalize connections endpoint response and error handling"

Milestone 1.3: Frontend - OrgSelector Integratie

Doel: De OrgSelector component in de React frontend gebruikt de API om echte data te tonen en synchroniseert de selectie met Zustand.

Stap 1.3.1: Frontend Supabase Client & Types

Taak voor Cursor:

Maak apps/frontend/src/lib/supabaseClient.ts. Initialiseer hier de Supabase anon key client (createClient met anon key en URL uit .env/import.meta.env).

Importeer de Database types uit supabase/functions/_shared/database.types.ts en geef deze mee aan createClient<Database>(...).

Voeg checks toe om te zorgen dat de environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) bestaan.

Review/Test:

Code review: Wordt de anon client correct geïnitialiseerd? Worden de types gebruikt? Zijn de env var checks aanwezig?

Test: Geen directe UI test, maar check of de frontend nog start zonder errors na deze toevoeging.

Commit: git commit -m "feat(frontend): setup supabase client with types"

Stap 1.3.2: Zustand Store Setup

Taak voor Cursor:

Maak apps/frontend/src/stores/useAppStore.ts.

Definieer een Zustand store met state selectedOrgId: string | null en een setter functie setSelectedOrgId: (orgId: string | null) => void. Initialiseer selectedOrgId met null.

Review/Test:

Code review: Is de store correct gedefinieerd? Zijn de types logisch?

Test: Kan later in de integratie getest worden.

Commit: git commit -m "feat(frontend): setup Zustand store for selected org"

Stap 1.3.3: Basis useConnections Hook met API Call

Taak voor Cursor:

Installeer @tanstack/react-query indien nog niet gedaan. Zorg dat QueryClientProvider is ingesteld in App.tsx.

Maak apps/frontend/src/hooks/useConnections.ts.

Importeer useQuery en de frontend supabaseClient.

Maak een asynchrone functie fetchConnections.

Binnen fetchConnections:

Haal de huidige sessie op (supabaseClient.auth.getSession()).

Als er geen sessie/token is, throw new Error('Not authenticated').

Roep de backend API (${import.meta.env.VITE_SUPABASE_URL}/functions/v1/connections) aan met fetch.

Voeg de Authorization: Bearer ${session.access_token} header toe.

Voor nu: Log de response of response.status. Gooi nog geen errors voor !response.ok. Return een hardcoded lege array [] of de geparsede JSON als test.

Maak de useConnections hook die useQuery aanroept met queryKey: ['connections'] en queryFn: fetchConnections.

Review/Test:

Code review: Wordt sessie correct opgehaald? Wordt token meegestuurd? Wordt API aangeroepen?

Test (Handmatig in browser met console/network tab):

Zorg voor een actieve sessie (login via console).

Roep de hook aan in een test component.

Check Network tab: Wordt de API call gemaakt? Is de Authorization header correct? Wat is de response status? Wordt er iets gelogd?

Commit: git commit -m "feat(frontend): setup basic useConnections hook with API call"

Stap 1.3.4: Voltooi useConnections Hook (Data/Error Handling)

Taak voor Cursor:

Pas fetchConnections in useConnections.ts aan.

Importeer de SalesforceConnection type uit _shared/database.types.ts. Type de return value van fetchConnections als Promise<SalesforceConnection[]>.

Na de fetch call: Check if (!response.ok). Zo ja, probeer de JSON error body te parsen en throw new Error(error.error || 'Failed to fetch connections').

Als response.ok, parse de JSON body (response.json()) en return dit (dit zou nu SalesforceConnection[] moeten zijn).

Configureer useQuery met staleTime (bv. 5 min) en retry: 1. Overweeg de enabled: !!session optimalisatie als je ook de useSupabase provider context gebruikt.

Review/Test:

Code review: Wordt error handling correct gedaan? Wordt data correct geparsed en geretourneerd? Zijn types correct?

Test (Handmatig/DevTools): Roep hook aan. Check data, error, isLoading states van de hook (bv. via React DevTools) onder verschillende condities (API succes, API fail).

Commit: git commit -m "feat(frontend): implement full data and error handling in useConnections"

Stap 1.3.5: OrgSelector Component - Loading & Error States

Taak voor Cursor:

Pas apps/frontend/src/components/OrgSelector.tsx aan.

Importeer en gebruik de useConnections hook. Destructureer data, isLoading, error.

Implementeer de UI rendering voor de isLoading state (bv. toon een disabled Select met een spinner en "Loading...").

Implementeer de UI rendering voor de error state (bv. toon een Alert component met de error.message).

Review/Test:

Code review: Worden de states correct gebruikt voor conditional rendering? Ziet de UI er logisch uit?

Test (UI): Forceer de hook om isLoading: true of error: new Error(...) te retourneren. Ziet de OrgSelector er correct uit in deze staten?

Commit: git commit -m "feat(frontend): handle loading and error states in OrgSelector"

Stap 1.3.6: OrgSelector Component - Success & Geen Data States

Taak voor Cursor:

Pas OrgSelector.tsx verder aan.

Implementeer de UI rendering voor wanneer !isLoading && !error:

Als connections data heeft (connections && connections.length > 0): Render de Select component. Map over connections om SelectItems te genereren (key={c.id}, value={c.id}, toon c.name).

Als connections leeg is (connections && connections.length === 0): Render een disabled Select met een placeholder zoals "No organizations found".

Voeg value en onSelect props toe aan OrgSelectorProps en koppel onValueChange van de Select aan de onSelect prop. Koppel de value prop aan de Select component's value.

Review/Test:

Code review: Is de mapping correct? Wordt de 'geen data' state correct afgehandeld? Worden props correct gebruikt?

Test (UI): Zorg dat de API data retourneert -> worden items getoond? Zorg dat API [] retourneert -> wordt "No organizations" getoond? Kan je een item selecteren (trigger onSelect)?

Commit: git commit -m "feat(frontend): handle success and no-data states in OrgSelector"

Stap 1.3.7: Integratie in Dashboard & Zustand Koppeling

Taak voor Cursor:

Pas apps/frontend/src/pages/Dashboard.tsx aan.

Importeer useAppStore en OrgSelector.

Haal selectedOrgId en setSelectedOrgId op uit useAppStore.

Render de OrgSelector component. Geef value={selectedOrgId || undefined} en onSelect={setSelectedOrgId} mee als props.

Review/Test:

Code review: Wordt de store correct gebruikt? Worden props correct doorgegeven?

Test (End-to-End): Laad het Dashboard.

Wordt de OrgSelector correct geladen (inclusief data van API)?

Selecteer een organisatie. Wordt de selectie visueel bijgewerkt in de dropdown?

Check (met React DevTools) of de selectedOrgId in de Zustand store wordt bijgewerkt na selectie.

Commit: git commit -m "feat(frontend): integrate OrgSelector into Dashboard and connect to Zustand"

Dit plan is veel gedetailleerder, geeft Cursor context per stap, en bevat expliciete review-, test-, en commit-momenten. Hopelijk helpt dit om het proces beheersbaarder te maken!