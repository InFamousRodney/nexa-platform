-- Enable necessary extensions if not already enabled
-- Ensures the uuid_generate_v4() function is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- ### Authenticatie & Autorisatie Gerelateerd ###
-- These tables manage users, organizations, and their relationships.

-- Organisations table for multi-tenancy or team structures
CREATE TABLE public.organizations (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(), -- Unique identifier for the organization
    name TEXT NOT NULL, -- Name of the organization
    owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional: Link to the user who created the org (references Supabase Auth users table)
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL -- Timestamp of creation
);
-- Add comment for clarity
COMMENT ON TABLE public.organizations IS 'Stores organization details for multi-tenancy.';
-- Enable Row Level Security (RLS) for data isolation between organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Membership table linking users to organizations
CREATE TABLE public.organization_members (
    organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL, -- Link to the organizations table (cascade delete means membership is removed if org is deleted)
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Link to the Supabase Auth users table (cascade delete means membership is removed if user is deleted)
    role TEXT NOT NULL DEFAULT 'member', -- Role of the user within the organization (e.g., 'admin', 'member')
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL, -- Timestamp when membership was created
    PRIMARY KEY (organization_id, user_id) -- Composite primary key ensures a user has only one role per organization
);
COMMENT ON TABLE public.organization_members IS 'Maps users to organizations and defines their roles.';
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- ### Salesforce Connectie & Snapshot Beheer ###
-- These tables manage connections to Salesforce orgs and metadata snapshots taken from them.

-- Salesforce Connections table
CREATE TABLE public.salesforce_connections (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(), -- Unique identifier for the connection
    organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL, -- Link to the owning organization
    sf_org_id TEXT NOT NULL UNIQUE, -- Salesforce Org ID (18-char), must be unique across all connections in the system
    sf_user_id TEXT, -- Optional: Salesforce User ID of the user who authorized the connection
    instance_url TEXT NOT NULL, -- Salesforce instance URL (e.g., https://yourdomain.my.salesforce.com)
    -- Encrypted tokens (encryption/decryption happens in the application layer/edge function)
    access_token_encrypted TEXT,
    refresh_token_encrypted TEXT,
    status TEXT NOT NULL DEFAULT 'inactive', -- Connection status (e.g., 'active', 'inactive', 'revoked', 'needs_reauth')
    last_connected_at TIMESTAMPTZ, -- Timestamp of the last successful connection/refresh
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL, -- Timestamp when the connection was created
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL -- Optional: Link to the NEXA user who initiated the connection
);
COMMENT ON TABLE public.salesforce_connections IS 'Stores connection details and encrypted credentials for linked Salesforce orgs.';
-- Index for faster lookups based on organization
CREATE INDEX idx_sf_connections_org_id ON public.salesforce_connections(organization_id);
ALTER TABLE public.salesforce_connections ENABLE ROW LEVEL SECURITY;

-- Metadata Snapshots table
CREATE TABLE public.metadata_snapshots (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(), -- Unique identifier for the snapshot
    sf_connection_id uuid REFERENCES public.salesforce_connections(id) ON DELETE CASCADE NOT NULL, -- Link to the specific Salesforce connection this snapshot belongs to
    status TEXT NOT NULL DEFAULT 'PENDING', -- Status of the snapshot process (e.g., 'PENDING', 'FETCHING', 'PARSING', 'STORING', 'BUILDING_GRAPH', 'COMPLETED', 'FAILED')
    error_message TEXT, -- Stores error details if the snapshot process failed
    triggered_by uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional: Link to the NEXA user who initiated the snapshot
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL, -- Timestamp when the snapshot process was initiated
    completed_at TIMESTAMPTZ -- Timestamp when the snapshot process finished (successfully or failed)
);
COMMENT ON TABLE public.metadata_snapshots IS 'Records metadata snapshot runs, their status, and linkage to Salesforce connections.';
-- Index for faster lookups based on the Salesforce connection
CREATE INDEX idx_snapshots_sf_connection_id ON public.metadata_snapshots(sf_connection_id);
-- Index for faster filtering by status
CREATE INDEX idx_snapshots_status ON public.metadata_snapshots(status);
ALTER TABLE public.metadata_snapshots ENABLE ROW LEVEL SECURITY;

-- ### Geparsed Metadata Opslag ###
-- These tables store the structured metadata extracted during the parsing step of a snapshot.

-- Parsed Components table
CREATE TABLE public.parsed_components (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(), -- Unique identifier for the parsed component instance
    snapshot_id uuid REFERENCES public.metadata_snapshots(id) ON DELETE CASCADE NOT NULL, -- Link to the snapshot this component belongs to
    component_type TEXT NOT NULL, -- Type of the Salesforce metadata component (e.g., 'CustomObject', 'CustomField', 'Flow', 'ApexClass')
    api_name TEXT NOT NULL, -- Full API name of the component (e.g., 'Account', 'Account.Name', 'MyFlow__c')
    label TEXT, -- Optional: User-friendly label of the component
    sf_id TEXT, -- Optional: Salesforce ID of the component, if available
    -- Flexible storage for type-specific attributes using JSONB
    attributes JSONB DEFAULT '{}'::jsonb, -- e.g., for Field: { dataType: 'Text', isRequired: false }, for Flow: { status: 'Active', processType: 'AutoLaunchedFlow' }
    -- Optional: Store the raw XML/JSON definition for debugging or deeper analysis (can significantly increase storage)
    -- raw_definition TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL, -- Timestamp when this component record was created
    -- Ensure that each component is unique within a given snapshot based on its API name
    UNIQUE (snapshot_id, api_name)
);
COMMENT ON TABLE public.parsed_components IS 'Stores individual metadata components parsed from a snapshot.';
-- Index for faster lookups within a snapshot
CREATE INDEX idx_components_snapshot_id ON public.parsed_components(snapshot_id);
-- Index for faster filtering by component type within a snapshot
CREATE INDEX idx_components_snapshot_type ON public.parsed_components(snapshot_id, component_type);
-- The UNIQUE constraint automatically creates an index on (snapshot_id, api_name)
ALTER TABLE public.parsed_components ENABLE ROW LEVEL SECURITY;

-- Parsed Relationships table
-- Stores explicit relationships *between* components discovered during parsing.
CREATE TABLE public.parsed_relationships (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(), -- Unique identifier for the relationship instance
    snapshot_id uuid REFERENCES public.metadata_snapshots(id) ON DELETE CASCADE NOT NULL, -- Link to the snapshot this relationship belongs to
    -- Store API names instead of foreign keys to parsed_components.id
    -- This simplifies parsing (don't need all component IDs beforehand)
    -- and aligns with how Neo4j graph will likely be populated (using apiName).
    source_component_api_name TEXT NOT NULL, -- API name of the source component in the relationship
    source_component_type TEXT NOT NULL, -- Type of the source component
    target_component_api_name TEXT NOT NULL, -- API name of the target component in the relationship
    target_component_type TEXT NOT NULL, -- Type of the target component
    relationship_type TEXT NOT NULL, -- Type of the relationship (e.g., 'FIELD_USED_IN_FLOW', 'FLOW_CALLS_APEX', 'LOOKUP_TO_OBJECT')
    context JSONB, -- Optional: Extra context about the relationship (e.g., { flowElementApiName: 'Decision_CheckStatus' })
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL -- Timestamp when this relationship record was created
);
COMMENT ON TABLE public.parsed_relationships IS 'Stores explicit relationships between metadata components identified during parsing.';
-- Indexes for faster querying based on snapshot and related components/types
CREATE INDEX idx_relationships_snapshot_id ON public.parsed_relationships(snapshot_id);
CREATE INDEX idx_relationships_snapshot_source ON public.parsed_relationships(snapshot_id, source_component_api_name);
CREATE INDEX idx_relationships_snapshot_target ON public.parsed_relationships(snapshot_id, target_component_api_name);
CREATE INDEX idx_relationships_snapshot_type ON public.parsed_relationships(snapshot_id, relationship_type);
ALTER TABLE public.parsed_relationships ENABLE ROW LEVEL SECURITY;

-- ### Analyse & AI Resultaten ###
-- These tables store the results of analyses run on snapshots and interactions with the AI assistant.

-- Analysis Results table
CREATE TABLE public.analysis_results (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(), -- Unique identifier for the analysis result
    snapshot_id uuid REFERENCES public.metadata_snapshots(id) ON DELETE CASCADE NOT NULL, -- Link to the snapshot that was analyzed
    analysis_type TEXT NOT NULL, -- Type of analysis performed (e.g., 'Flow Inconsistency Check', 'Unused Component', 'Security Risk')
    -- Reference to the main component the result pertains to
    component_api_name TEXT, -- API name of the affected component (can be NULL if result is snapshot-wide)
    component_type TEXT, -- Type of the affected component
    severity TEXT NOT NULL DEFAULT 'Info', -- Severity level (e.g., 'Error', 'Warning', 'Info')
    description TEXT NOT NULL, -- Human-readable description of the finding
    details JSONB, -- Optional: Structured details about the finding (e.g., { missingField: 'Account.NonExistent__c' })
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL -- Timestamp when the analysis result was generated
);
COMMENT ON TABLE public.analysis_results IS 'Stores findings from various analyses performed on metadata snapshots.';
-- Indexes for faster querying of analysis results
CREATE INDEX idx_analysis_results_snapshot_id ON public.analysis_results(snapshot_id);
CREATE INDEX idx_analysis_results_snapshot_type ON public.analysis_results(snapshot_id, analysis_type);
CREATE INDEX idx_analysis_results_snapshot_component ON public.analysis_results(snapshot_id, component_api_name);
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

-- AI Interactions table
CREATE TABLE public.ai_interactions (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(), -- Unique identifier for the AI interaction
    snapshot_id uuid REFERENCES public.metadata_snapshots(id) ON DELETE SET NULL, -- Optional: Link to the snapshot context used for the interaction (can be NULL if question is general)
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Link to the NEXA user who initiated the interaction
    prompt TEXT NOT NULL, -- The question/prompt asked by the user
    neo4j_query_summary TEXT, -- Optional: Summary or type of the Neo4j query run to gather context for the LLM
    llm_response TEXT, -- The response generated by the Large Language Model (LLM)
    feedback_rating INT CHECK (feedback_rating IN (-1, 1)), -- Optional: User feedback (-1 = thumbs down, 1 = thumbs up)
    feedback_comment TEXT, -- Optional: User's textual feedback
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL -- Timestamp of the interaction
);
COMMENT ON TABLE public.ai_interactions IS 'Logs interactions with the AI assistant, including prompts, responses, and user feedback.';
-- Index for faster lookup of interactions by user
CREATE INDEX idx_ai_interactions_user_id ON public.ai_interactions(user_id);
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;