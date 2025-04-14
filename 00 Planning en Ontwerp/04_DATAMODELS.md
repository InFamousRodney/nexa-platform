04 - Data Modellen voor NEXA
Status: IN PROGRESS - (Supabase Schema/RLS/Seed Lokaal OK, Neo4j Model Defined/Setup TODO)
Inhoudsopgave:
Supabase (PostgreSQL) Datamodel
Neo4j Graph Model

1. Supabase (PostgreSQL) Datamodel
Status: [✓ Lokaal Geïmplementeerd & Geseed, ✓ Basis RLS OK]
Dit beschrijft het gedetailleerde schema voor de PostgreSQL database beheerd door Supabase. RLS policies zijn geïmplementeerd via migraties.

1.1 Authenticatie & Autorisatie Gerelateerd
Status: [✓ Basis OK (Auth users beheerd door Supabase, relaties hieronder OK)]

-- Organisaties (voor multi-tenancy/teams)
-- Status: [✓ Aangemaakt & Geseed]
CREATE TABLE public.organizations (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name TEXT NOT NULL,
    owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY; -- Status: [✓ Basis RLS Toegepast]

-- Koppeling gebruikers aan organisaties
-- Status: [✓ Aangemaakt & Geseed (voor testgebruiker)]
CREATE TABLE public.organization_members (
    organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    PRIMARY KEY (organization_id, user_id)
);
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY; -- Status: [✓ Basis RLS Toegepast]

1.2 Salesforce Connectie & Snapshot Beheer
Status: [✓ Basis OK]

-- Salesforce Connections table
-- Status: [✓ Aangemaakt & Geseed]
CREATE TABLE public.salesforce_connections (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    sf_org_id TEXT NOT NULL UNIQUE,
    sf_user_id TEXT,
    instance_url TEXT NOT NULL,
    access_token_encrypted TEXT, -- Status: [Kolom OK, Encryptie Logica TODO]
    refresh_token_encrypted TEXT, -- Status: [Kolom OK, Encryptie Logica TODO]
    status TEXT NOT NULL DEFAULT 'inactive',
    last_connected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
CREATE INDEX idx_sf_connections_org_id ON public.salesforce_connections(organization_id);
ALTER TABLE public.salesforce_connections ENABLE ROW LEVEL SECURITY; -- Status: [✓ Basis RLS Toegepast]

-- Metadata Snapshots table
-- Status: [✓ Aangemaakt]
CREATE TABLE public.metadata_snapshots (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    sf_connection_id uuid REFERENCES public.salesforce_connections(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    error_message TEXT,
    triggered_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    completed_at TIMESTAMPTZ
);
CREATE INDEX idx_snapshots_sf_connection_id ON public.metadata_snapshots(sf_connection_id);
CREATE INDEX idx_snapshots_status ON public.metadata_snapshots(status);
ALTER TABLE public.metadata_snapshots ENABLE ROW LEVEL SECURITY; -- Status: [✓ Basis RLS Toegepast]

1.3 Geparsed Metadata Opslag
Status: [✓ Basis OK]

-- Parsed Components table
-- Status: [✓ Aangemaakt]
CREATE TABLE public.parsed_components (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    snapshot_id uuid REFERENCES public.metadata_snapshots(id) ON DELETE CASCADE NOT NULL,
    component_type TEXT NOT NULL,
    api_name TEXT NOT NULL,
    label TEXT,
    sf_id TEXT,
    attributes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE (snapshot_id, api_name)
);
CREATE INDEX idx_components_snapshot_id ON public.parsed_components(snapshot_id);
CREATE INDEX idx_components_snapshot_type ON public.parsed_components(snapshot_id, component_type);
ALTER TABLE public.parsed_components ENABLE ROW LEVEL SECURITY; -- Status: [✓ Basis RLS Toegepast]

-- Parsed Relationships table
-- Status: [✓ Aangemaakt]
CREATE TABLE public.parsed_relationships (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    snapshot_id uuid REFERENCES public.metadata_snapshots(id) ON DELETE CASCADE NOT NULL,
    source_component_api_name TEXT NOT NULL,
    source_component_type TEXT NOT NULL,
    target_component_api_name TEXT NOT NULL,
    target_component_type TEXT NOT NULL,
    relationship_type TEXT NOT NULL,
    context JSONB,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_relationships_snapshot_id ON public.parsed_relationships(snapshot_id);
CREATE INDEX idx_relationships_snapshot_source ON public.parsed_relationships(snapshot_id, source_component_api_name);
CREATE INDEX idx_relationships_snapshot_target ON public.parsed_relationships(snapshot_id, target_component_api_name);
CREATE INDEX idx_relationships_snapshot_type ON public.parsed_relationships(snapshot_id, relationship_type);
ALTER TABLE public.parsed_relationships ENABLE ROW LEVEL SECURITY; -- Status: [✓ Basis RLS Toegepast]

1.4 Analyse & AI Resultaten
Status: [✓ Basis OK]

-- Analysis Results table
-- Status: [✓ Aangemaakt]
CREATE TABLE public.analysis_results (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    snapshot_id uuid REFERENCES public.metadata_snapshots(id) ON DELETE CASCADE NOT NULL,
    analysis_type TEXT NOT NULL,
    component_api_name TEXT,
    component_type TEXT,
    severity TEXT NOT NULL DEFAULT 'Info',
    description TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_analysis_results_snapshot_id ON public.analysis_results(snapshot_id);
CREATE INDEX idx_analysis_results_snapshot_type ON public.analysis_results(snapshot_id, analysis_type);
CREATE INDEX idx_analysis_results_snapshot_component ON public.analysis_results(snapshot_id, component_api_name);
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY; -- Status: [✓ Basis RLS Toegepast]

-- AI Interactions table
-- Status: [✓ Aangemaakt]
CREATE TABLE public.ai_interactions (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    snapshot_id uuid REFERENCES public.metadata_snapshots(id) ON DELETE SET NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    prompt TEXT NOT NULL,
    neo4j_query_summary TEXT,
    llm_response TEXT,
    feedback_rating INT CHECK (feedback_rating IN (-1, 1)),
    feedback_comment TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_ai_interactions_user_id ON public.ai_interactions(user_id);
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY; -- Status: [✓ Basis RLS Toegepast]

Opmerkingen:
- Het seed.sql script vult organizations, organization_members, en salesforce_connections met testdata. De andere tabellen blijven leeg na supabase db reset.
- Encryptie logica voor tokens is nog niet geïmplementeerd in de (nog te bouwen) Edge Functions.
- RLS policies zijn toegepast, maar vereisen een geldige gebruikerssessie (JWT) om te werken bij API calls.
- Het gebruik van JSONB voor attributes en context biedt flexibiliteit.
- Indexen zijn essentieel voor performance, vooral op snapshot_id en api_name.

2. Neo4j Graph Model
Dit model is geoptimaliseerd voor dependency tracing. Data wordt per snapshot opgeslagen.

2.1 Node Labels en Properties (Herhaling/Verfijning):
:MetadataComponent (Abstract)
snapshotId: STRING (Verplicht, deel van unique constraint)
apiName: STRING (Verplicht, deel van unique constraint)
label: STRING
type: STRING (bijv. 'CustomObject', 'CustomField', 'Flow')
sfId: STRING (Optioneel)
createdAt: DATETIME (Timestamp van creatie in Neo4j)
:CustomObject (Erft :MetadataComponent)
sharingModel: STRING
:CustomField (Erft :MetadataComponent)
dataType: STRING
isRequired: BOOLEAN
formula: STRING (Optioneel)
:Flow (Erft :MetadataComponent)
processType: STRING
status: STRING ('Active'/'Inactive')
... (Andere specifieke labels zoals gedefinieerd in TAD)

2.2 Relationship Types (Herhaling/Verfijning):
BELONGS_TO: Structurele relatie (bijv. Veld -> Object).
REFERENCES: Algemene verwijzing tussen componenten (bijv. Flow -> Veld, Flow -> Object).
USED_IN: Meer specifieke verwijzing, idealiter met context properties.
(field)-[:USED_IN {elementType: 'Decision'}]->(flow)
TRIGGERS: Geeft aan dat een trigger reageert op een object (of vice versa).
IMPACTS: Kan gebruikt worden als een samenvattende relatie na een diepere analyse.


2.3 Indexen en Constraints (Cypher):
Deze commando's moeten worden uitgevoerd op de Neo4j database om performance en datakwaliteit te garanderen.

// Zorgt ervoor dat elke component uniek is binnen een snapshot
CREATE CONSTRAINT unique_metadata_component_snapshot_apiName IF NOT EXISTS
FOR (m:MetadataComponent) REQUIRE (m.snapshotId, m.apiName) IS UNIQUE;
 
// Index voor snel opzoeken van alle componenten binnen een snapshot
CREATE INDEX index_metadata_component_snapshotId IF NOT EXISTS
FOR (m:MetadataComponent) ON (m.snapshotId);
 
// Index voor snel opzoeken op apiName (handig maar deels gedekt door constraint)
// Kan nuttig zijn als je vaak zoekt op apiName ZONDER snapshotId (maar dat zou minder voorkomen)
CREATE INDEX index_metadata_component_apiName IF NOT EXISTS
FOR (m:MetadataComponent) ON (m.apiName);
 
// Index op type voor snelle filtering (bijv. geef alle Flows in snapshot X)
CREATE INDEX index_metadata_component_type IF NOT EXISTS
FOR (m:MetadataComponent) ON (m.type);
 
// Specifieke indexen kunnen nuttig zijn afhankelijk van query patronen, bijv.:
// CREATE INDEX index_flow_status IF NOT EXISTS FOR (f:Flow) ON (f.status);
// CREATE INDEX index_customfield_datatype IF NOT EXISTS FOR (cf:CustomField) ON (cf.dataType);

Opmerkingen:
Het snapshotId is cruciaal in elke node en constraint/index om data te isoleren.
De keuze tussen REFERENCES en USED_IN (en de properties op USED_IN) hangt af van het detailniveau dat we uit de parsing kunnen halen en nodig hebben voor de analyses.
 
STATUS HIERONDER:
04 - Data Modellen voor NEXA
Status: IN PROGRESS - (Supabase Schema/RLS/Seed Lokaal OK, Neo4j Model Defined/Setup TODO)
Inhoudsopgave:
Supabase (PostgreSQL) Datamodel
Neo4j Graph Model

1. Supabase (PostgreSQL) Datamodel
Status: [✓ Lokaal Geïmplementeerd & Geseed, ✓ Basis RLS OK]
Dit beschrijft het gedetailleerde schema voor de PostgreSQL database beheerd door Supabase. RLS policies zijn geïmplementeerd via migraties.

1.1 Authenticatie & Autorisatie Gerelateerd
Status: [✓ Basis OK (Auth users beheerd door Supabase, relaties hieronder OK)]

-- Organisaties (voor multi-tenancy/teams)
-- Status: [✓ Aangemaakt & Geseed]
CREATE TABLE public.organizations (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name TEXT NOT NULL,
    owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY; -- Status: [✓ Basis RLS Toegepast]

-- Koppeling gebruikers aan organisaties
-- Status: [✓ Aangemaakt & Geseed (voor testgebruiker)]
CREATE TABLE public.organization_members (
    organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    PRIMARY KEY (organization_id, user_id)
);
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY; -- Status: [✓ Basis RLS Toegepast]

1.2 Salesforce Connectie & Snapshot Beheer
Status: [✓ Basis OK]

-- Salesforce Connections table
-- Status: [✓ Aangemaakt & Geseed]
CREATE TABLE public.salesforce_connections (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    sf_org_id TEXT NOT NULL UNIQUE,
    sf_user_id TEXT,
    instance_url TEXT NOT NULL,
    access_token_encrypted TEXT, -- Status: [Kolom OK, Encryptie Logica TODO]
    refresh_token_encrypted TEXT, -- Status: [Kolom OK, Encryptie Logica TODO]
    status TEXT NOT NULL DEFAULT 'inactive',
    last_connected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
CREATE INDEX idx_sf_connections_org_id ON public.salesforce_connections(organization_id);
ALTER TABLE public.salesforce_connections ENABLE ROW LEVEL SECURITY; -- Status: [✓ Basis RLS Toegepast]

-- Metadata Snapshots table
-- Status: [✓ Aangemaakt]
CREATE TABLE public.metadata_snapshots (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    sf_connection_id uuid REFERENCES public.salesforce_connections(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    error_message TEXT,
    triggered_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    completed_at TIMESTAMPTZ
);
CREATE INDEX idx_snapshots_sf_connection_id ON public.metadata_snapshots(sf_connection_id);
CREATE INDEX idx_snapshots_status ON public.metadata_snapshots(status);
ALTER TABLE public.metadata_snapshots ENABLE ROW LEVEL SECURITY; -- Status: [✓ Basis RLS Toegepast]

1.3 Geparsed Metadata Opslag
Status: [✓ Basis OK]

-- Parsed Components table
-- Status: [✓ Aangemaakt]
CREATE TABLE public.parsed_components (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    snapshot_id uuid REFERENCES public.metadata_snapshots(id) ON DELETE CASCADE NOT NULL,
    component_type TEXT NOT NULL,
    api_name TEXT NOT NULL,
    label TEXT,
    sf_id TEXT,
    attributes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE (snapshot_id, api_name)
);
CREATE INDEX idx_components_snapshot_id ON public.parsed_components(snapshot_id);
CREATE INDEX idx_components_snapshot_type ON public.parsed_components(snapshot_id, component_type);
ALTER TABLE public.parsed_components ENABLE ROW LEVEL SECURITY; -- Status: [✓ Basis RLS Toegepast]

-- Parsed Relationships table
-- Status: [✓ Aangemaakt]
CREATE TABLE public.parsed_relationships (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    snapshot_id uuid REFERENCES public.metadata_snapshots(id) ON DELETE CASCADE NOT NULL,
    source_component_api_name TEXT NOT NULL,
    source_component_type TEXT NOT NULL,
    target_component_api_name TEXT NOT NULL,
    target_component_type TEXT NOT NULL,
    relationship_type TEXT NOT NULL,
    context JSONB,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_relationships_snapshot_id ON public.parsed_relationships(snapshot_id);
CREATE INDEX idx_relationships_snapshot_source ON public.parsed_relationships(snapshot_id, source_component_api_name);
CREATE INDEX idx_relationships_snapshot_target ON public.parsed_relationships(snapshot_id, target_component_api_name);
CREATE INDEX idx_relationships_snapshot_type ON public.parsed_relationships(snapshot_id, relationship_type);
ALTER TABLE public.parsed_relationships ENABLE ROW LEVEL SECURITY; -- Status: [✓ Basis RLS Toegepast]

1.4 Analyse & AI Resultaten
Status: [✓ Basis OK]

-- Analysis Results table
-- Status: [✓ Aangemaakt]
CREATE TABLE public.analysis_results (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    snapshot_id uuid REFERENCES public.metadata_snapshots(id) ON DELETE CASCADE NOT NULL,
    analysis_type TEXT NOT NULL,
    component_api_name TEXT,
    component_type TEXT,
    severity TEXT NOT NULL DEFAULT 'Info',
    description TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_analysis_results_snapshot_id ON public.analysis_results(snapshot_id);
CREATE INDEX idx_analysis_results_snapshot_type ON public.analysis_results(snapshot_id, analysis_type);
CREATE INDEX idx_analysis_results_snapshot_component ON public.analysis_results(snapshot_id, component_api_name);
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY; -- Status: [✓ Basis RLS Toegepast]

-- AI Interactions table
-- Status: [✓ Aangemaakt]
CREATE TABLE public.ai_interactions (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    snapshot_id uuid REFERENCES public.metadata_snapshots(id) ON DELETE SET NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    prompt TEXT NOT NULL,
    neo4j_query_summary TEXT,
    llm_response TEXT,
    feedback_rating INT CHECK (feedback_rating IN (-1, 1)),
    feedback_comment TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_ai_interactions_user_id ON public.ai_interactions(user_id);
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY; -- Status: [✓ Basis RLS Toegepast]

Opmerkingen:
Het seed.sql script vult organizations, organization_members, en salesforce_connections met testdata. De andere tabellen blijven leeg na supabase db reset.
Encryptie logica voor tokens is nog niet geïmplementeerd in de (nog te bouwen) Edge Functions.
RLS policies zijn toegepast, maar vereisen een geldige gebruikerssessie (JWT) om te werken bij API calls.
Het gebruik van JSONB voor attributes en context biedt flexibiliteit.
Indexen zijn essentieel voor performance, vooral op snapshot_id en api_name.

2. Neo4j Graph Model
Dit model is geoptimaliseerd voor dependency tracing. Data wordt per snapshot opgeslagen.

2.1 Node Labels en Properties (Herhaling/Verfijning):
:MetadataComponent (Abstract)
snapshotId: STRING (Verplicht, deel van unique constraint)
apiName: STRING (Verplicht, deel van unique constraint)
label: STRING
type: STRING (bijv. 'CustomObject', 'CustomField', 'Flow')
sfId: STRING (Optioneel)
createdAt: DATETIME (Timestamp van creatie in Neo4j)
:CustomObject (Erft :MetadataComponent)
sharingModel: STRING
:CustomField (Erft :MetadataComponent)
dataType: STRING
isRequired: BOOLEAN
formula: STRING (Optioneel)
:Flow (Erft :MetadataComponent)
processType: STRING
status: STRING ('Active'/'Inactive')
... (Andere specifieke labels zoals gedefinieerd in TAD)

2.2 Relationship Types (Herhaling/Verfijning):
BELONGS_TO: Structurele relatie (bijv. Veld -> Object).
REFERENCES: Algemene verwijzing tussen componenten (bijv. Flow -> Veld, Flow -> Object).
USED_IN: Meer specifieke verwijzing, idealiter met context properties.
(field)-[:USED_IN {elementType: 'Decision'}]->(flow)
TRIGGERS: Geeft aan dat een trigger reageert op een object (of vice versa).
IMPACTS: Kan gebruikt worden als een samenvattende relatie na een diepere analyse.


2.3 Indexen en Constraints (Cypher):
Deze commando's moeten worden uitgevoerd op de Neo4j database om performance en datakwaliteit te garanderen.

// Zorgt ervoor dat elke component uniek is binnen een snapshot
CREATE CONSTRAINT unique_metadata_component_snapshot_apiName IF NOT EXISTS
FOR (m:MetadataComponent) REQUIRE (m.snapshotId, m.apiName) IS UNIQUE;
 
// Index voor snel opzoeken van alle componenten binnen een snapshot
CREATE INDEX index_metadata_component_snapshotId IF NOT EXISTS
FOR (m:MetadataComponent) ON (m.snapshotId);
 
// Index voor snel opzoeken op apiName (handig maar deels gedekt door constraint)
// Kan nuttig zijn als je vaak zoekt op apiName ZONDER snapshotId (maar dat zou minder voorkomen)
CREATE INDEX index_metadata_component_apiName IF NOT EXISTS
FOR (m:MetadataComponent) ON (m.apiName);
 
// Index op type voor snelle filtering (bijv. geef alle Flows in snapshot X)
CREATE INDEX index_metadata_component_type IF NOT EXISTS
FOR (m:MetadataComponent) ON (m.type);
 
// Specifieke indexen kunnen nuttig zijn afhankelijk van query patronen, bijv.:
// CREATE INDEX index_flow_status IF NOT EXISTS FOR (f:Flow) ON (f.status);
// CREATE INDEX index_customfield_datatype IF NOT EXISTS FOR (cf:CustomField) ON (cf.dataType);

Opmerkingen:
Het snapshotId is cruciaal in elke node en constraint/index om data te isoleren.
De keuze tussen REFERENCES en USED_IN hangt af van het detailniveau uit de parsing.

