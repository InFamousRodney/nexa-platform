import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { SalesforceConnection, OrganizationMember, Organization, User, Account, Contact, Opportunity, MetadataSnapshot, ParsedComponent, ParsedRelationship, AnalysisResult, AIInteraction } from './database.types.ts';

Deno.test("SalesforceConnection should have the correct properties", () => {
    const connection: SalesforceConnection = {
        id: 'test-id',
        name: 'Test Connection',
        instance_url: 'https://test.salesforce.com',
        organization_id: 'org-id'
    };

    assertEquals(connection.id, 'test-id');
    assertEquals(connection.name, 'Test Connection');
    assertEquals(connection.instance_url, 'https://test.salesforce.com');
    assertEquals(connection.organization_id, 'org-id');
});

Deno.test("OrganizationMember should have the correct properties", () => {
    const member: OrganizationMember = {
        user_id: 'user-123',
        organization_id: 'org-456'
    };

    assertEquals(member.user_id, 'user-123');
    assertEquals(member.organization_id, 'org-456');
});

Deno.test("Organization interface", () => {
    const org: Organization = {
        id: "org123",
        name: "Test Organization",
        description: "A test organization",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
    };

    assertEquals(org.id, "org123");
    assertEquals(org.name, "Test Organization");
    assertEquals(org.description, "A test organization");
    assertEquals(org.created_at, "2024-01-01T00:00:00Z");
    assertEquals(org.updated_at, "2024-01-01T00:00:00Z");
});

Deno.test("User interface", () => {
    const user: User = {
        id: "user123",
        email: "test@example.com",
        first_name: "John",
        last_name: "Doe",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
    };

    assertEquals(user.id, "user123");
    assertEquals(user.email, "test@example.com");
    assertEquals(user.first_name, "John");
    assertEquals(user.last_name, "Doe");
    assertEquals(user.created_at, "2024-01-01T00:00:00Z");
    assertEquals(user.updated_at, "2024-01-01T00:00:00Z");
});

Deno.test("Contact interface", () => {
    const contact: Contact = {
        id: "contact123",
        account_id: "account456",
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        title: "Sales Manager",
        department: "Sales",
        mailing_street: "123 Main St",
        mailing_city: "New York",
        mailing_state: "NY",
        mailing_postal_code: "10001",
        mailing_country: "USA",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
    };

    assertEquals(contact.id, "contact123");
    assertEquals(contact.account_id, "account456");
    assertEquals(contact.first_name, "John");
    assertEquals(contact.last_name, "Doe");
    assertEquals(contact.email, "john.doe@example.com");
    assertEquals(contact.phone, "+1234567890");
    assertEquals(contact.title, "Sales Manager");
    assertEquals(contact.department, "Sales");
    assertEquals(contact.mailing_street, "123 Main St");
    assertEquals(contact.mailing_city, "New York");
    assertEquals(contact.mailing_state, "NY");
    assertEquals(contact.mailing_postal_code, "10001");
    assertEquals(contact.mailing_country, "USA");
    assertEquals(contact.created_at, "2024-01-01T00:00:00Z");
    assertEquals(contact.updated_at, "2024-01-01T00:00:00Z");
});

Deno.test("Opportunity interface", () => {
    const opportunity: Opportunity = {
        id: "opp123",
        account_id: "account456",
        name: "Enterprise Deal",
        description: "Large enterprise opportunity",
        amount: 100000,
        stage: "Proposal",
        probability: 75,
        close_date: "2024-06-30",
        type: "New Business",
        lead_source: "Partner Referral",
        next_step: "Schedule demo",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
    };

    assertEquals(opportunity.id, "opp123");
    assertEquals(opportunity.account_id, "account456");
    assertEquals(opportunity.name, "Enterprise Deal");
    assertEquals(opportunity.description, "Large enterprise opportunity");
    assertEquals(opportunity.amount, 100000);
    assertEquals(opportunity.stage, "Proposal");
    assertEquals(opportunity.probability, 75);
    assertEquals(opportunity.close_date, "2024-06-30");
    assertEquals(opportunity.type, "New Business");
    assertEquals(opportunity.lead_source, "Partner Referral");
    assertEquals(opportunity.next_step, "Schedule demo");
    assertEquals(opportunity.created_at, "2024-01-01T00:00:00Z");
    assertEquals(opportunity.updated_at, "2024-01-01T00:00:00Z");
});

Deno.test("MetadataSnapshot interface", () => {
    const snapshot: MetadataSnapshot = {
        id: "snapshot123",
        sf_connection_id: "connection456",
        status: "COMPLETED",
        triggered_by: "user789",
        created_at: "2024-01-01T00:00:00Z",
        completed_at: "2024-01-01T00:05:00Z"
    };

    assertEquals(snapshot.id, "snapshot123");
    assertEquals(snapshot.sf_connection_id, "connection456");
    assertEquals(snapshot.status, "COMPLETED");
    assertEquals(snapshot.triggered_by, "user789");
    assertEquals(snapshot.created_at, "2024-01-01T00:00:00Z");
    assertEquals(snapshot.completed_at, "2024-01-01T00:05:00Z");
});

Deno.test("ParsedComponent interface", () => {
    const component: ParsedComponent = {
        id: "component123",
        snapshot_id: "snapshot456",
        component_type: "CustomObject",
        api_name: "Account",
        label: "Account",
        sf_id: "01I5g000000G2fNEAS",
        attributes: {
            sharingModel: "Private",
            deploymentStatus: "Deployed"
        },
        created_at: "2024-01-01T00:00:00Z"
    };

    assertEquals(component.id, "component123");
    assertEquals(component.snapshot_id, "snapshot456");
    assertEquals(component.component_type, "CustomObject");
    assertEquals(component.api_name, "Account");
    assertEquals(component.label, "Account");
    assertEquals(component.sf_id, "01I5g000000G2fNEAS");
    assertEquals(component.attributes.sharingModel, "Private");
    assertEquals(component.attributes.deploymentStatus, "Deployed");
    assertEquals(component.created_at, "2024-01-01T00:00:00Z");
});

Deno.test("ParsedRelationship interface", () => {
    const relationship: ParsedRelationship = {
        id: "relationship123",
        snapshot_id: "snapshot456",
        source_component_api_name: "Account",
        source_component_type: "CustomObject",
        target_component_api_name: "Contact",
        target_component_type: "CustomObject",
        relationship_type: "BELONGS_TO",
        context: {
            fieldName: "AccountId",
            isMasterDetail: true
        },
        created_at: "2024-01-01T00:00:00Z"
    };

    assertEquals(relationship.id, "relationship123");
    assertEquals(relationship.snapshot_id, "snapshot456");
    assertEquals(relationship.source_component_api_name, "Account");
    assertEquals(relationship.source_component_type, "CustomObject");
    assertEquals(relationship.target_component_api_name, "Contact");
    assertEquals(relationship.target_component_type, "CustomObject");
    assertEquals(relationship.relationship_type, "BELONGS_TO");
    assertEquals(relationship.context?.fieldName, "AccountId");
    assertEquals(relationship.context?.isMasterDetail, true);
    assertEquals(relationship.created_at, "2024-01-01T00:00:00Z");
});

Deno.test("AnalysisResult interface", () => {
    const result: AnalysisResult = {
        id: "result123",
        snapshot_id: "snapshot456",
        analysis_type: "DependencyCheck",
        component_api_name: "Account",
        component_type: "CustomObject",
        severity: "Warning",
        description: "Account has circular reference",
        details: {
            referencePath: ["Account -> Contact -> Account"],
            impact: "Potential infinite loop in data processing"
        },
        created_at: "2024-01-01T00:00:00Z"
    };

    assertEquals(result.id, "result123");
    assertEquals(result.snapshot_id, "snapshot456");
    assertEquals(result.analysis_type, "DependencyCheck");
    assertEquals(result.component_api_name, "Account");
    assertEquals(result.component_type, "CustomObject");
    assertEquals(result.severity, "Warning");
    assertEquals(result.description, "Account has circular reference");
    assertEquals(result.details?.referencePath, ["Account -> Contact -> Account"]);
    assertEquals(result.details?.impact, "Potential infinite loop in data processing");
    assertEquals(result.created_at, "2024-01-01T00:00:00Z");
});

Deno.test("AIInteraction interface", () => {
    const interaction: AIInteraction = {
        id: "interaction123",
        snapshot_id: "snapshot456",
        user_id: "user789",
        prompt: "What are the dependencies of Account?",
        neo4j_query_summary: "MATCH (n:CustomObject {apiName: 'Account'})-[r]->(m) RETURN n, r, m",
        llm_response: "Account has relationships with Contact, Opportunity, and Case objects.",
        feedback_rating: 1,
        feedback_comment: "Helpful response",
        created_at: "2024-01-01T00:00:00Z"
    };

    assertEquals(interaction.id, "interaction123");
    assertEquals(interaction.snapshot_id, "snapshot456");
    assertEquals(interaction.user_id, "user789");
    assertEquals(interaction.prompt, "What are the dependencies of Account?");
    assertEquals(interaction.neo4j_query_summary, "MATCH (n:CustomObject {apiName: 'Account'})-[r]->(m) RETURN n, r, m");
    assertEquals(interaction.llm_response, "Account has relationships with Contact, Opportunity, and Case objects.");
    assertEquals(interaction.feedback_rating, 1);
    assertEquals(interaction.feedback_comment, "Helpful response");
    assertEquals(interaction.created_at, "2024-01-01T00:00:00Z");
}); 