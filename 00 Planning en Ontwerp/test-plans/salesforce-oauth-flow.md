# Testplan: Lokale End-to-End Verificatie Salesforce OAuth Flow

## Voorwaarden

### Vereiste Setup
- [ ] Lokale Supabase stack draait (`supabase start`)
- [ ] Frontend development server draait (`pnpm dev`)
- [ ] Toegang tot een Salesforce Developer/Sandbox Org
- [ ] `.env` bestand correct geconfigureerd:
  ```
  SALESFORCE_CLIENT_ID=<valid_id>
  SALESFORCE_CLIENT_SECRET=<valid_secret>
  SALESFORCE_REDIRECT_URI=http://localhost:54321/functions/v1/sfdc-auth-callback
  TOKEN_ENCRYPTION_KEY=<strong_key>
  ```
- [ ] Edge Function code aanwezig in `supabase/functions/`
- [ ] Salesforce Connected App geconfigureerd met correcte callback URL

### Voorbereiding
1. Open browser developer tools (Network tab)
2. Open een terminal voor Supabase function logs
3. Zorg dat je ingelogd bent in de NEXA frontend

## Test Scenarios

### 1. Succesvolle Connectie (Happy Path)

#### Stappen
1. Navigeer naar de NEXA frontend `/settings` pagina
2. Klik op "Connect New Org" button
   - Verifieer: Loading state van de button
   - Verifieer: Network request naar `sfdc-auth-initiate`
3. Wacht op redirect naar Salesforce login
   - Verifieer: URL bevat correcte `client_id` en `redirect_uri`
4. Log in op de Salesforce Test Org
5. Verleen toestemming op de OAuth pagina
6. Observeer de callback flow
   - Verifieer: Korte redirect naar `/functions/v1/sfdc-auth-callback`
   - Verifieer: Automatische redirect naar `/settings?status=success`
7. Controleer frontend feedback
   - Verifieer: Success toast verschijnt
   - Verifieer: Organisatielijst wordt ververst (check network tab voor query)

#### Controles
- [ ] Browser Network Tab: Alle requests succesvol (200/201)
- [ ] Supabase Logs: Geen errors in `sfdc-auth-initiate` en `sfdc-auth-callback`
- [ ] Frontend: Correcte visuele feedback en data refresh

### 2. Gebruiker Weigert Toestemming

#### Stappen
1. Volg stappen 1-4 van Happy Path
2. Klik op "Deny" / "Weigeren" op de Salesforce toestemmingspagina

#### Controles
- [ ] Redirect naar callback bevat `error=access_denied` (Salesforce OAuth standaard error code)
- [ ] Redirect naar `/settings` met `status=error&error=user_denied_access`
- [ ] Error toast wordt getoond met gebruiksvriendelijke melding: "Access to Salesforce organization was denied"
- [ ] Database: Geen nieuwe connectie toegevoegd
- [ ] Supabase Logs: Error correct gelogd met originele Salesforce error code

### 3. Ongeldige Client Credentials

#### Setup
1. Wijzig in `.env`:
   ```
   SALESFORCE_CLIENT_ID=invalid_id
   ```
2. Herstart Supabase stack voor volledige env var refresh:
   ```bash
   supabase stop
   supabase start
   ```
   Alternatief (minder zeker):
   ```bash
   supabase functions serve sfdc-auth-callback --no-verify-jwt
   ```

#### Stappen
1. Volg Happy Path stappen 1-5

#### Controles
- [ ] Callback functie logs tonen token exchange error:
  - Verwachte HTTP status: 400 of 401 van Salesforce token endpoint
  - Error response bevat "invalid_client" in de body
- [ ] Redirect naar `/settings` met `status=error&error=invalid_credentials`
- [ ] Error toast met gebruiksvriendelijke melding: "Could not connect to Salesforce. Please contact support."
- [ ] Database: Geen nieuwe connectie toegevoegd

#### Cleanup
- Herstel correcte credentials in `.env`
- Herstart Supabase stack (volledige herstart aanbevolen)

### 4. Netwerkfout tijdens Token Exchange

#### Setup
1. Voeg tijdelijk toe in `sfdc-auth-callback/index.ts`:
   ```typescript
   // Voeg toe voor de token exchange fetch:
   throw new Error('NETWORK_ERROR');
   ```

#### Stappen
1. Volg Happy Path stappen 1-5

#### Controles
- [ ] Callback functie logs tonen netwerk error met code 'NETWORK_ERROR'
- [ ] Redirect naar `/settings` met `status=error&error=token_exchange_failed`
- [ ] Error toast met gebruiksvriendelijke melding: "Could not connect to Salesforce service. Please try again later."
- [ ] Database: Geen nieuwe connectie toegevoegd

### 5. Data Opslag & Encryptie

#### Stappen
1. Voer een succesvolle connectie uit (Happy Path)
2. Open Supabase Studio of psql console
3. Query de `salesforce_connections` tabel:
   ```sql
   SELECT * FROM salesforce_connections ORDER BY created_at DESC LIMIT 1;
   ```

#### Controles
- [ ] Nieuw record aanwezig
- [ ] Verplichte velden correct ingevuld:
  - `user_id`
  - `org_id_salesforce`
  - `instance_url`
- [ ] Token velden zijn versleuteld:
  - `access_token_encrypted` bevat geen leesbare token
  - `refresh_token_encrypted` bevat geen leesbare token
  - Tokens lijken op Base64-geëncodeerde strings

## Aandachtspunten

### Veiligheid
- Gebruik ALTIJD een Test/Developer Org, nooit een productie org
- Controleer logs grondig op gevoelige informatie
- Reset test credentials na het testen
- Verwijder test connecties na afloop

### Debugging
- Check Supabase function logs voor gedetailleerde error informatie
- Gebruik browser dev tools voor network analyse
- Monitor de database voor onverwachte data mutaties

### Cleanup
- Herstel alle tijdelijke code wijzigingen
- Reset gewijzigde environment variables
- Verwijder test data indien nodig

## Error Code Reference

### Backend Error Codes
- `user_denied_access`: Gebruiker heeft expliciet toegang geweigerd
- `invalid_credentials`: Ongeldige client credentials (Client ID/Secret)
- `token_exchange_failed`: Algemene fout tijdens token exchange
- `network_error`: Netwerkfout tijdens externe calls
- `encryption_failed`: Fout tijdens token encryptie
- `database_error`: Fout tijdens opslaan van connectie

### Frontend Error Messages
Alle technische error codes worden vertaald naar gebruiksvriendelijke meldingen:
- "Access to Salesforce organization was denied"
- "Could not connect to Salesforce. Please contact support."
- "Could not connect to Salesforce service. Please try again later."
- "An error occurred while saving the connection"
