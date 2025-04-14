import { 
    SalesforceConnection, 
    Organization, 
    OrganizationMember, 
    User, 
    Account, 
    Contact, 
    Opportunity, 
    MetadataSnapshot, 
    ParsedComponent, 
    ParsedRelationship, 
    AnalysisResult, 
    AIInteraction 
} from './database.types.ts';

// Organization Relations
export interface OrganizationWithMembers extends Organization {
    members: OrganizationMember[];
}

export interface OrganizationWithConnections extends Organization {
    connections: SalesforceConnection[];
}

// User Relations
export interface UserWithOrganizations extends User {
    organizations: OrganizationMember[];
}

// Salesforce Connection Relations
export interface SalesforceConnectionWithSnapshots extends SalesforceConnection {
    snapshots: MetadataSnapshot[];
}

// Metadata Snapshot Relations
export interface MetadataSnapshotWithComponents extends MetadataSnapshot {
    components: ParsedComponent[];
    relationships: ParsedRelationship[];
    analysis_results: AnalysisResult[];
}

// Component Relations
export interface ParsedComponentWithRelations extends ParsedComponent {
    source_relationships: ParsedRelationship[];
    target_relationships: ParsedRelationship[];
    analysis_results: AnalysisResult[];
}

// Account Relations
export interface AccountWithContacts extends Account {
    contacts: Contact[];
}

export interface AccountWithOpportunities extends Account {
    opportunities: Opportunity[];
}

// Contact Relations
export interface ContactWithAccount extends Contact {
    account: Account;
}

// Opportunity Relations
export interface OpportunityWithAccount extends Opportunity {
    account: Account;
}

// Analysis Result Relations
export interface AnalysisResultWithComponent extends AnalysisResult {
    component?: ParsedComponent;
}

// AI Interaction Relations
export interface AIInteractionWithUser extends AIInteraction {
    user?: User;
}

export interface AIInteractionWithSnapshot extends AIInteraction {
    snapshot?: MetadataSnapshot;
} 