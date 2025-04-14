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

// Generic validation helpers
const isValidUUID = (id: string): boolean => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidURL = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

const isValidDate = (date: string): boolean => {
    return !isNaN(Date.parse(date));
};

// Organization validators
export const validateOrganization = (org: Organization): string[] => {
    const errors: string[] = [];
    
    if (!org.id || !isValidUUID(org.id)) {
        errors.push('Invalid organization ID');
    }
    
    if (!org.name || org.name.length < 2) {
        errors.push('Organization name must be at least 2 characters long');
    }
    
    if (!org.created_at || !isValidDate(org.created_at)) {
        errors.push('Invalid created_at date');
    }
    
    return errors;
};

// User validators
export const validateUser = (user: User): string[] => {
    const errors: string[] = [];
    
    if (!user.id || !isValidUUID(user.id)) {
        errors.push('Invalid user ID');
    }
    
    if (!user.email || !isValidEmail(user.email)) {
        errors.push('Invalid email address');
    }
    
    if (user.first_name && user.first_name.length < 2) {
        errors.push('First name must be at least 2 characters long');
    }
    
    if (user.last_name && user.last_name.length < 2) {
        errors.push('Last name must be at least 2 characters long');
    }
    
    if (!user.created_at || !isValidDate(user.created_at)) {
        errors.push('Invalid created_at date');
    }
    
    return errors;
};

// Salesforce Connection validators
export const validateSalesforceConnection = (conn: SalesforceConnection): string[] => {
    const errors: string[] = [];
    
    if (!conn.id || !isValidUUID(conn.id)) {
        errors.push('Invalid connection ID');
    }
    
    if (!conn.name || conn.name.length < 2) {
        errors.push('Connection name must be at least 2 characters long');
    }
    
    if (!conn.instance_url || !isValidURL(conn.instance_url)) {
        errors.push('Invalid instance URL');
    }
    
    if (!conn.organization_id || !isValidUUID(conn.organization_id)) {
        errors.push('Invalid organization ID');
    }
    
    return errors;
};

// Metadata Snapshot validators
export const validateMetadataSnapshot = (snapshot: MetadataSnapshot): string[] => {
    const errors: string[] = [];
    
    if (!snapshot.id || !isValidUUID(snapshot.id)) {
        errors.push('Invalid snapshot ID');
    }
    
    if (!snapshot.sf_connection_id || !isValidUUID(snapshot.sf_connection_id)) {
        errors.push('Invalid Salesforce connection ID');
    }
    
    if (!['PENDING', 'COMPLETED', 'FAILED'].includes(snapshot.status)) {
        errors.push('Invalid status');
    }
    
    if (!snapshot.created_at || !isValidDate(snapshot.created_at)) {
        errors.push('Invalid created_at date');
    }
    
    if (snapshot.completed_at && !isValidDate(snapshot.completed_at)) {
        errors.push('Invalid completed_at date');
    }
    
    return errors;
};

// Parsed Component validators
export const validateParsedComponent = (component: ParsedComponent): string[] => {
    const errors: string[] = [];
    
    if (!component.id || !isValidUUID(component.id)) {
        errors.push('Invalid component ID');
    }
    
    if (!component.snapshot_id || !isValidUUID(component.snapshot_id)) {
        errors.push('Invalid snapshot ID');
    }
    
    if (!component.component_type || component.component_type.length < 2) {
        errors.push('Component type must be at least 2 characters long');
    }
    
    if (!component.api_name || component.api_name.length < 2) {
        errors.push('API name must be at least 2 characters long');
    }
    
    if (!component.created_at || !isValidDate(component.created_at)) {
        errors.push('Invalid created_at date');
    }
    
    return errors;
};

// Parsed Relationship validators
export const validateParsedRelationship = (relationship: ParsedRelationship): string[] => {
    const errors: string[] = [];
    
    if (!relationship.id || !isValidUUID(relationship.id)) {
        errors.push('Invalid relationship ID');
    }
    
    if (!relationship.snapshot_id || !isValidUUID(relationship.snapshot_id)) {
        errors.push('Invalid snapshot ID');
    }
    
    if (!relationship.source_component_api_name || relationship.source_component_api_name.length < 2) {
        errors.push('Source component API name must be at least 2 characters long');
    }
    
    if (!relationship.target_component_api_name || relationship.target_component_api_name.length < 2) {
        errors.push('Target component API name must be at least 2 characters long');
    }
    
    if (!relationship.relationship_type || relationship.relationship_type.length < 2) {
        errors.push('Relationship type must be at least 2 characters long');
    }
    
    if (!relationship.created_at || !isValidDate(relationship.created_at)) {
        errors.push('Invalid created_at date');
    }
    
    return errors;
};

// Analysis Result validators
export const validateAnalysisResult = (result: AnalysisResult): string[] => {
    const errors: string[] = [];
    
    if (!result.id || !isValidUUID(result.id)) {
        errors.push('Invalid result ID');
    }
    
    if (!result.snapshot_id || !isValidUUID(result.snapshot_id)) {
        errors.push('Invalid snapshot ID');
    }
    
    if (!result.analysis_type || result.analysis_type.length < 2) {
        errors.push('Analysis type must be at least 2 characters long');
    }
    
    if (!['Info', 'Warning', 'Error'].includes(result.severity)) {
        errors.push('Invalid severity');
    }
    
    if (!result.description || result.description.length < 2) {
        errors.push('Description must be at least 2 characters long');
    }
    
    if (!result.created_at || !isValidDate(result.created_at)) {
        errors.push('Invalid created_at date');
    }
    
    return errors;
};

// AI Interaction validators
export const validateAIInteraction = (interaction: AIInteraction): string[] => {
    const errors: string[] = [];
    
    if (!interaction.id || !isValidUUID(interaction.id)) {
        errors.push('Invalid interaction ID');
    }
    
    if (!interaction.prompt || interaction.prompt.length < 2) {
        errors.push('Prompt must be at least 2 characters long');
    }
    
    if (interaction.snapshot_id && !isValidUUID(interaction.snapshot_id)) {
        errors.push('Invalid snapshot ID');
    }
    
    if (interaction.user_id && !isValidUUID(interaction.user_id)) {
        errors.push('Invalid user ID');
    }
    
    if (interaction.feedback_rating && ![-1, 1].includes(interaction.feedback_rating)) {
        errors.push('Invalid feedback rating');
    }
    
    if (!interaction.created_at || !isValidDate(interaction.created_at)) {
        errors.push('Invalid created_at date');
    }
    
    return errors;
}; 