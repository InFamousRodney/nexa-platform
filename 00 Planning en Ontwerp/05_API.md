# NEXA API Specificaties V0.1

Dit document beschrijft de REST API endpoints voor het NEXA platform, gehost op Supabase Edge Functions. Het definieert de interactie tussen de frontend en de backend.

**Status:** IN PROGRESS - Bevat specificaties voor MVP Milestones 1 & 2.

**Referenties:**
*   GSD: `01_Status_GSD.md`
*   TAD: `02_Status_TAD.md`
*   Data Model: `04_Status_DataModel.md`
*   Project Rules: `07-project-rules.md`
*   Coding Rules: `08_global-coding-rules.md`

## 1. Algemene Principes

*   **Base URL:** Alle API endpoints zijn beschikbaar onder de Supabase functions URL, typisch: `[SUPABASE_PROJECT_URL]/functions/v1/`. Voor lokale ontwikkeling is dit `http://localhost:54321/functions/v1/`.
*   **Format:** Alle request en response bodies gebruiken JSON (`application/json`).
*   **Authenticatie:**
    *   Alle endpoints (tenzij anders vermeld) vereisen authenticatie via een JWT.
    *   De frontend MOET een `Authorization: Bearer <JWT>` header meesturen.
    *   De backend (Edge Function) MOET de token valideren via `supabase.auth.getUser(jwt)`.
*   **Autorisatie:**
    *   De backend MOET controleren of de geauthenticeerde gebruiker gemachtigd is om de actie uit te voeren op de gevraagde resource (meestal gebaseerd op `organization_members`).
    *   Row Level Security (RLS) in de database biedt een extra beveiligingslaag.
*   **Error Responses:** Fouten worden geretourneerd met een passende HTTP status code (4xx/5xx) en een JSON body:
    ```json
    {
      "error": "Error Type Identifier", // Bv. "Unauthorized", "Validation Error", "Internal Server Error"
      "details": "Een meer gedetailleerde foutmelding." // Optioneel, kan specifiekere info bevatten
    }
    ```

## 2. Endpoints

---

### 2.1 Salesforce Connecties

#### **`GET /v1/connections`**

*   **Status:** `[DEFINED - Target: Milestone 1.2]`
*   **Beschrijving:** Haalt de lijst op van Salesforce connecties die gekoppeld zijn aan de organisatie(s) van de ingelogde gebruiker. Bedoeld voor de `OrgSelector` in de frontend. (Ref: GSD FR-AUTH-04)
*   **Authenticatie:** Vereist (Bearer Token).
*   **Request:**
    *   Headers: `Authorization: Bearer <JWT>`
*   **Response (Success): `200 OK`**
    *   Headers: `Content-Type: application/json`, CORS headers.
    *   Body: JSON array van connectie objecten.
        ```json
        [
          {
            "id": "uuid", // salesforce_connections.id
            "sf_org_id": "00D...", // salesforce_connections.sf_org_id
            "instance_url": "https://yourdomain.my.salesforce.com", // salesforce_connections.instance_url
            "status": "active" | "inactive" | "error", // salesforce_connections.status
            "last_connected_at": "ISO 8601 Timestamp | null" // salesforce_connections.last_connected_at
          }
          // ... meer connecties
        ]
        ```
*   **Response (Error):**
    *   `401 Unauthorized`: Geen/ongeldige JWT.
    *   `500 Internal Server Error`: Database query of andere serverfout.

---

#### **`POST /v1/sfdc-auth-initiate`**

*   **Status:** `[DEFINED - Target: Milestone 2.2]`
*   **Beschrijving:** Start de Salesforce OAuth 2.0 PKCE flow om een nieuwe Salesforce org te koppelen. Genereert de autorisatie URL. (Ref: GSD FR-AUTH-03 Start)
*   **Authenticatie:** Vereist (Bearer Token).
*   **Request:**
    *   Headers: `Authorization: Bearer <JWT>`
*   **Response (Success): `200 OK`**
    *   Headers: `Content-Type: application/json`, CORS headers.
    *   Body:
        ```json
        {
          "authorizationUrl": "https://login.salesforce.com/services/oauth2/authorize?client_id=...&redirect_uri=...&response_type=code&scope=...&state=...&code_challenge=...&code_challenge_method=S256"
        }
        ```
*   **Response (Error):**
    *   `401 Unauthorized`: Geen/ongeldige JWT.
    *   `500 Internal Server Error`: Fout bij genereren URL of state.

---

#### **`GET /v1/sfdc-auth-callback`**

*   **Status:** `[DEFINED - Target: Milestone 2.2]`
*   **Beschrijving:** Callback endpoint waar Salesforce de gebruiker naartoe stuurt na autorisatie. Handelt de code exchange af, slaat tokens veilig op. **Niet direct aangeroepen door de frontend.** (Ref: GSD FR-AUTH-03 Afronding)
*   **Authenticatie:** Geen Bearer Token. Validatie via `state` parameter en PKCE `code_verifier` (intern beheerd door de backend).
*   **Request:**
    *   Query Parameters (van Salesforce redirect): `code=...`, `state=...`
*   **Response (Success): `302 Found`**
    *   Headers: `Location: [URL_NAAR_FRONTEND_SETTINGS_OF_DASHBOARD]` (Redirect gebruiker terug naar de app). Eventueel met succes/fout indicatie in query params van de redirect URL.
*   **Response (Error):**
    *   `400 Bad Request`: Ongeldige `state` of `code`.
    *   `500 Internal Server Error`: Fout bij token exchange, database opslag, of encryptie. Kan ook een redirect naar een frontend error pagina zijn.

---

### 2.2 Metadata Pipeline

#### **`POST /v1/pipeline-start`**

*   **Status:** `[DEFINED - Target: Milestone 2.1]`
*   **Beschrijving:** Start asynchroon het proces voor het ophalen en verwerken van metadata voor een specifieke Salesforce connectie. Maakt initieel een `metadata_snapshots` record aan. (Ref: GSD FR-PIPE-01 Start)
*   **Authenticatie:** Vereist (Bearer Token).
*   **Request:**
    *   Headers: `Authorization: Bearer <JWT>`, `Content-Type: application/json`.
    *   Body:
        ```json
        {
          "connectionId": "uuid" // ID van de salesforce_connections record
        }
        ```
*   **Response (Success): `202 Accepted`**
    *   Headers: `Content-Type: application/json`, CORS headers.
    *   Body:
        ```json
        {
          "snapshotId": "uuid" // ID van de nieuw aangemaakte metadata_snapshots record
        }
        ```
        *(Status 202 Accepted geeft aan dat de request is geaccepteerd voor verwerking, maar nog niet voltooid)*
*   **Response (Error):**
    *   `400 Bad Request`: Ongeldige of ontbrekende `connectionId` in body.
    *   `401 Unauthorized`: Geen/ongeldige JWT.
    *   `403 Forbidden`: Gebruiker heeft geen toegang tot de opgegeven `connectionId`.
    *   `404 Not Found`: `connectionId` bestaat niet.
    *   `500 Internal Server Error`: Fout bij aanmaken snapshot record in DB.

---

*Voeg hier later specificaties toe voor andere endpoints zoals:*
*   `GET /v1/snapshot-status?id={snapshotId}`
*   `POST /v1/ai-ask`
*   `GET /v1/analysis-results?snapshotId={...}`
*   Etc.