export type Database = {
  public: {
    Tables: {
      salesforce_connections: {
        Row: SalesforceConnection;
        Insert: Omit<SalesforceConnection, 'id'>;
        Update: Partial<SalesforceConnection>;
      };
      organization_members: {
        Row: OrganizationMember;
        Insert: OrganizationMember;
        Update: Partial<OrganizationMember>;
      };
      organizations: {
        Row: Organization;
        Insert: Omit<Organization, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Organization>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<User>;
      };
      accounts: {
        Row: Account;
        Insert: Omit<Account, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Account>;
      };
      contacts: {
        Row: Contact;
        Insert: Omit<Contact, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Contact>;
      };
      opportunities: {
        Row: Opportunity;
        Insert: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Opportunity>;
      };
      metadata_snapshots: {
        Row: MetadataSnapshot;
        Insert: Omit<MetadataSnapshot, 'id' | 'created_at'>;
        Update: Partial<MetadataSnapshot>;
      };
      parsed_components: {
        Row: ParsedComponent;
        Insert: Omit<ParsedComponent, 'id' | 'created_at'>;
        Update: Partial<ParsedComponent>;
      };
      parsed_relationships: {
        Row: ParsedRelationship;
        Insert: Omit<ParsedRelationship, 'id' | 'created_at'>;
        Update: Partial<ParsedRelationship>;
      };
      analysis_results: {
        Row: AnalysisResult;
        Insert: Omit<AnalysisResult, 'id' | 'created_at'>;
        Update: Partial<AnalysisResult>;
      };
      ai_interactions: {
        Row: AIInteraction;
        Insert: Omit<AIInteraction, 'id' | 'created_at'>;
        Update: Partial<AIInteraction>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

export interface SalesforceConnection {
    id: string;
    name: string;
    instance_url: string;
    organization_id: string;
}

export interface OrganizationMember {
    user_id: string;
    organization_id: string;
}

export interface Organization {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    created_at: string;
    updated_at: string;
}

export interface Account {
    id: string;
    name: string;
    description?: string;
    industry?: string;
    website?: string;
    phone?: string;
    billing_street?: string;
    billing_city?: string;
    billing_state?: string;
    billing_postal_code?: string;
    billing_country?: string;
    created_at: string;
    updated_at: string;
}

export interface Contact {
    id: string;
    account_id: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    title?: string;
    department?: string;
    mailing_street?: string;
    mailing_city?: string;
    mailing_state?: string;
    mailing_postal_code?: string;
    mailing_country?: string;
    created_at: string;
    updated_at: string;
}

export interface Opportunity {
    id: string;
    account_id: string;
    name: string;
    description?: string;
    amount?: number;
    stage: string;
    probability?: number;
    close_date: string;
    type?: string;
    lead_source?: string;
    next_step?: string;
    created_at: string;
    updated_at: string;
}

export interface MetadataSnapshot {
    id: string;
    sf_connection_id: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    error_message?: string;
    triggered_by?: string;
    created_at: string;
    completed_at?: string;
}

export interface ParsedComponent {
    id: string;
    snapshot_id: string;
    component_type: string;
    api_name: string;
    label?: string;
    sf_id?: string;
    attributes: Record<string, any>;
    created_at: string;
}

export interface ParsedRelationship {
    id: string;
    snapshot_id: string;
    source_component_api_name: string;
    source_component_type: string;
    target_component_api_name: string;
    target_component_type: string;
    relationship_type: string;
    context?: Record<string, any>;
    created_at: string;
}

export interface AnalysisResult {
    id: string;
    snapshot_id: string;
    analysis_type: string;
    component_api_name?: string;
    component_type?: string;
    severity: 'Info' | 'Warning' | 'Error';
    description: string;
    details?: Record<string, any>;
    created_at: string;
}

export interface AIInteraction {
    id: string;
    snapshot_id?: string;
    user_id?: string;
    prompt: string;
    neo4j_query_summary?: string;
    llm_response?: string;
    feedback_rating?: -1 | 1;
    feedback_comment?: string;
    created_at: string;
} 