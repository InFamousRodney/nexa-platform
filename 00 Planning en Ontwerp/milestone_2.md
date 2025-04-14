Gedetailleerd Takenpakket: Milestone 2 - Salesforce Integratie (Fase 1 Focus)

Doel: Gebruiker kan veilig een nieuwe Salesforce org koppelen via de UI. Tokens worden versleuteld opgeslagen.

Vereist: Salesforce Connected App geconfigureerd (Client ID, Secret, Callback URL: http://localhost:54321/functions/v1/sfdc-auth-callback).

Sub-Milestone 2.1: OAuth Setup & Encryptie Logica

[ ] Taak 2.1.1 (Config): Zorg dat Supabase Secrets SALESFORCE_CLIENT_ID en SALESFORCE_CLIENT_SECRET zijn ingesteld (lokaal via .env en later in productie).

[ ] Taak 2.1.2 (Config): Definieer een Supabase Secret TOKEN_ENCRYPTION_KEY (een sterke, willekeurige sleutel) voor symmetrische encryptie.

[x] Taak 2.1.3 (Code - Shared): Implementeer een encryptData(data: string): string functie in apps/supabase/functions/_shared/security.ts die de TOKEN_ENCRYPTION_KEY gebruikt (via Deno.env.get) en een sterke symmetrische encryptie-algoritme (bv. AES-GCM via Deno's crypto.subtle API). Retourneert de versleutelde data (bv. als base64 string).

[x] Taak 2.1.4 (Code - Shared): Implementeer een bijbehorende decryptData(encryptedData: string): string functie in apps/supabase/functions/_shared/security.ts.

[x] Taak 2.1.5 (Test): Schrijf Deno unit tests (security.test.ts) voor de encryptData en decryptData functies om te verifiëren dat data correct versleuteld en gedecrypteerd kan worden.

Sub-Milestone 2.2: Authenticatie Flow - Backend

[ ] Taak 2.2.1 (Code - API): Creëer de map en het index.ts bestand voor de sfdc-auth-initiate functie.

[ ] Taak 2.2.2 (Code - API): Implementeer de POST /v1/sfdc-auth-initiate API endpoint in index.ts:

Authenticatie: Valideer JWT.

PKCE: Genereer code_verifier en code_challenge. Sla code_verifier tijdelijk veilig op (bv. in een tijdelijke tabel of cache gekoppeld aan de state, of neem op in de state zelf als het kort leeft - onderzoek veilige opties).

State: Genereer een unieke, onvoorspelbare state parameter (CSRF bescherming). Sla deze ook tijdelijk op of koppel aan de gebruiker/sessie.

Bouw de Salesforce autorisatie URL (incl. client_id, redirect_uri, response_type=code, scopes, state, code_challenge, code_challenge_method=S256).

Retourneer { authorizationUrl: "..." } als JSON.

Implementeer error handling.

[ ] Taak 2.2.3 (Code - API): Creëer de map en het index.ts bestand voor de sfdc-auth-callback functie.

[ ] Taak 2.2.4 (Code - API): Implementeer de GET /v1/sfdc-auth-callback API endpoint in index.ts:

Haal code en state uit de query parameters.

Validatie: Verifieer de ontvangen state tegen de opgeslagen state. Haal de bijbehorende code_verifier op. Gooi error als state ongeldig is.

Token Exchange: Roep Salesforce token endpoint aan (fetch) met grant_type=authorization_code, code, client_id, client_secret, redirect_uri, en code_verifier.

Token Verwerking: Haal access_token, refresh_token, instance_url, id (Salesforce user/org ID URL) uit de Salesforce response.

Encryptie: Gebruik encryptData (uit Taak 2.1.3) om access_token en refresh_token te versleutelen.

Opslag: Sla de nieuwe connectie op in salesforce_connections: organization_id (haal op o.b.v. ingelogde user via JWT binnen callback context indien mogelijk, of passeer via state?), sf_org_id (parse uit Salesforce ID URL), sf_user_id (parse uit Salesforce ID URL), instance_url, access_token_encrypted, refresh_token_encrypted, status='active', user_id (ID van de NEXA user die koppelde).

Opschonen: Verwijder de tijdelijke state en code_verifier.

Redirect: Stuur een 302 Redirect naar de frontend (bv. /settings?connect=success).

Implementeer robuuste error handling voor state validatie, token exchange, encryptie en database opslag. Redirect naar bv. /settings?connect=error bij falen.

Sub-Milestone 2.3: Authenticatie Flow - Frontend

[ ] Taak 2.3.1 (Code - Frontend): Maak de "Connect New Org" knop in de UI (bv. op Settings pagina of bij OrgSelector) functioneel.

Bij klik: Roep (met useMutation van TanStack Query?) de POST /v1/sfdc-auth-initiate API aan.

Bij succes: Redirect de browser van de gebruiker naar de authorizationUrl uit de API response.

Toon loading/error state tijdens API call.

[ ] Taak 2.3.2 (Code - Frontend): Handel de redirect terug van Salesforce af.

Zorg dat de pagina waarnaar de callback redirect (bv. /settings) de query parameters (connect=success of connect=error) kan detecteren.

Toon een passende melding (bv. Toast of Alert) aan de gebruiker.

Bij succes: Trigger een refresh van de salesforceConnections query (via queryClient.invalidateQueries(['salesforceConnections']) van TanStack Query) zodat de nieuwe connectie in de OrgSelector verschijnt.

Sub-Milestone 2.4: Testen & Documentatie

[ ] Taak 2.4.1 (Test): Test de volledige OAuth flow lokaal grondig. Kun je een org koppelen? Worden tokens versleuteld opgeslagen (check DB)? Wordt de lijst in de UI bijgewerkt? Werkt error handling?

[ ] Taak 2.4.2 (Docs): Werk 05_API_Specificaties.md bij met de details van de geïmplementeerde /sfdc-auth-initiate en /sfdc-auth-callback endpoints.

[ ] Taak 2.4.3 (Docs): Documenteer de setup van de Salesforce Connected App en de benodigde Supabase Secrets in 06_Status_POT.md of een README.md in apps/supabase.