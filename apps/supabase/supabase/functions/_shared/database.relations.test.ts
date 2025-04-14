import { assertEquals } from "https://deno.land/std@0.208.0/assert/assert_equals.ts";
import { 
    OrganizationWithMembers,
    OrganizationWithConnections,
    UserWithOrganizations,
    SalesforceConnectionWithSnapshots,
    MetadataSnapshotWithComponents,
    ParsedComponentWithRelations,
    AccountWithContacts,
    AccountWithOpportunities,
    ContactWithAccount,
    OpportunityWithAccount,
    AnalysisResultWithComponent,
    AIInteractionWithUser,
    AIInteractionWithSnapshot
} from './database.relations.ts';

Deno.test("OrganizationWithMembers interface", () => {
    const org: OrganizationWithMembers = {
        id: "org123",
        name: "Test Org",
        members: [
            {
                user_id: "user1",
                organization_id: "org123"
            }
        ],
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
    };

    assertEquals(org.id, "org123");
    assertEquals(org.members.length, 1);
    assertEquals(org.members[0].user_id, "user1");
});

Deno.test("OrganizationWithConnections interface", () => {
    const org: OrganizationWithConnections = {
        id: "org123",
        name: "Test Org",
        connections: [
            {
                id: "conn1",
                name: "Test Connection",
                instance_url: "https://test.salesforce.com",
                organization_id: "org123"
            }
        ],
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
    };

    assertEquals(org.id, "org123");
    assertEquals(org.connections.length, 1);
    assertEquals(org.connections[0].name, "Test Connection");
});

Deno.test("UserWithOrganizations interface", () => {
    const user: UserWithOrganizations = {
        id: "user1",
        email: "test@example.com",
        organizations: [
            {
                user_id: "user1",
                organization_id: "org123"
            }
        ],
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
    };

    assertEquals(user.id, "user1");
    assertEquals(user.organizations.length, 1);
    assertEquals(user.organizations[0].organization_id, "org123");
});

Deno.test("SalesforceConnectionWithSnapshots interface", () => {
    const connection: SalesforceConnectionWithSnapshots = {
        id: "conn1",
        name: "Test Connection",
        instance_url: "https://test.salesforce.com",
        organization_id: "org123",
        snapshots: [
            {
                id: "snap1",
                sf_connection_id: "conn1",
                status: "COMPLETED",
                created_at: "2024-01-01T00:00:00Z"
            }
        ]
    };

    assertEquals(connection.id, "conn1");
    assertEquals(connection.snapshots.length, 1);
    assertEquals(connection.snapshots[0].status, "COMPLETED");
});

Deno.test("MetadataSnapshotWithComponents interface", () => {
    const snapshot: MetadataSnapshotWithComponents = {
        id: "snap1",
        sf_connection_id: "conn1",
        status: "COMPLETED",
        created_at: "2024-01-01T00:00:00Z",
        components: [
            {
                id: "comp1",
                snapshot_id: "snap1",
                component_type: "CustomObject",
                api_name: "Account",
                attributes: {},
                created_at: "2024-01-01T00:00:00Z"
            }
        ],
        relationships: [],
        analysis_results: []
    };

    assertEquals(snapshot.id, "snap1");
    assertEquals(snapshot.components.length, 1);
    assertEquals(snapshot.components[0].api_name, "Account");
});

Deno.test("ParsedComponentWithRelations interface", () => {
    const component: ParsedComponentWithRelations = {
        id: "comp1",
        snapshot_id: "snap1",
        component_type: "CustomObject",
        api_name: "Account",
        attributes: {},
        created_at: "2024-01-01T00:00:00Z",
        source_relationships: [],
        target_relationships: [],
        analysis_results: []
    };

    assertEquals(component.id, "comp1");
    assertEquals(component.api_name, "Account");
});

Deno.test("AccountWithContacts interface", () => {
    const account: AccountWithContacts = {
        id: "acc1",
        name: "Test Account",
        contacts: [
            {
                id: "cont1",
                account_id: "acc1",
                first_name: "John",
                last_name: "Doe",
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z"
            }
        ],
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
    };

    assertEquals(account.id, "acc1");
    assertEquals(account.contacts.length, 1);
    assertEquals(account.contacts[0].first_name, "John");
});

Deno.test("AccountWithOpportunities interface", () => {
    const account: AccountWithOpportunities = {
        id: "acc123",
        name: "Test Account",
        description: "A test account",
        industry: "Technology",
        website: "https://test.com",
        phone: "123-456-7890",
        billing_street: "123 Test St",
        billing_city: "Test City",
        billing_state: "Test State",
        billing_postal_code: "12345",
        billing_country: "Test Country",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        opportunities: [
            {
                id: "opp123",
                account_id: "acc123",
                name: "Test Opportunity",
                description: "A test opportunity",
                amount: 100000,
                stage: "Prospecting",
                probability: 20,
                close_date: "2024-12-31",
                type: "New Business",
                lead_source: "Web",
                next_step: "Initial Meeting",
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z"
            }
        ]
    };

    assertEquals(account.id, "acc123");
    assertEquals(account.name, "Test Account");
    assertEquals(account.description, "A test account");
    assertEquals(account.industry, "Technology");
    assertEquals(account.website, "https://test.com");
    assertEquals(account.phone, "123-456-7890");

    assertEquals(account.opportunities.length, 1);
    assertEquals(account.opportunities[0].id, "opp123");
    assertEquals(account.opportunities[0].account_id, "acc123");
    assertEquals(account.opportunities[0].name, "Test Opportunity");
    assertEquals(account.opportunities[0].amount, 100000);
    assertEquals(account.opportunities[0].stage, "Prospecting");
    assertEquals(account.opportunities[0].probability, 20);
    assertEquals(account.opportunities[0].type, "New Business");
    assertEquals(account.opportunities[0].lead_source, "Web");
    assertEquals(account.opportunities[0].next_step, "Initial Meeting");
});

Deno.test("ContactWithAccount interface", () => {
    const contact: ContactWithAccount = {
        id: "contact123",
        account_id: "acc123",
        first_name: "John",
        last_name: "Doe",
        email: "john@test.com",
        phone: "123-456-7890",
        title: "CEO",
        department: "Executive",
        mailing_street: "123 Test St",
        mailing_city: "Test City",
        mailing_state: "Test State",
        mailing_postal_code: "12345",
        mailing_country: "Test Country",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        account: {
            id: "acc123",
            name: "Test Account",
            description: "A test account",
            industry: "Technology",
            website: "https://test.com",
            phone: "123-456-7890",
            billing_street: "123 Test St",
            billing_city: "Test City",
            billing_state: "Test State",
            billing_postal_code: "12345",
            billing_country: "Test Country",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z"
        }
    };

    assertEquals(contact.id, "contact123");
    assertEquals(contact.account_id, "acc123");
    assertEquals(contact.first_name, "John");
    assertEquals(contact.last_name, "Doe");
    assertEquals(contact.email, "john@test.com");
    assertEquals(contact.title, "CEO");
    assertEquals(contact.department, "Executive");

    assertEquals(contact.account.id, "acc123");
    assertEquals(contact.account.name, "Test Account");
    assertEquals(contact.account.industry, "Technology");
    assertEquals(contact.account.website, "https://test.com");
    assertEquals(contact.account.phone, "123-456-7890");
});

Deno.test("OpportunityWithAccount interface", () => {
    const opportunity: OpportunityWithAccount = {
        id: "opp123",
        account_id: "acc123",
        name: "Test Opportunity",
        description: "A test opportunity",
        amount: 100000,
        stage: "Prospecting",
        probability: 20,
        close_date: "2024-12-31",
        type: "New Business",
        lead_source: "Web",
        next_step: "Initial Meeting",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        account: {
            id: "acc123",
            name: "Test Account",
            description: "A test account",
            industry: "Technology",
            website: "https://test.com",
            phone: "123-456-7890",
            billing_street: "123 Test St",
            billing_city: "Test City",
            billing_state: "Test State",
            billing_postal_code: "12345",
            billing_country: "Test Country",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z"
        }
    };

    assertEquals(opportunity.id, "opp123");
    assertEquals(opportunity.account_id, "acc123");
    assertEquals(opportunity.name, "Test Opportunity");
    assertEquals(opportunity.description, "A test opportunity");
    assertEquals(opportunity.amount, 100000);
    assertEquals(opportunity.stage, "Prospecting");
    assertEquals(opportunity.probability, 20);
    assertEquals(opportunity.type, "New Business");
    assertEquals(opportunity.lead_source, "Web");
    assertEquals(opportunity.next_step, "Initial Meeting");

    assertEquals(opportunity.account.id, "acc123");
    assertEquals(opportunity.account.name, "Test Account");
    assertEquals(opportunity.account.industry, "Technology");
    assertEquals(opportunity.account.website, "https://test.com");
    assertEquals(opportunity.account.phone, "123-456-7890");
});

Deno.test("AnalysisResultWithComponent interface", () => {
    const result: AnalysisResultWithComponent = {
        id: "result1",
        snapshot_id: "snap1",
        analysis_type: "DependencyCheck",
        severity: "Warning",
        description: "Test warning",
        component: {
            id: "comp1",
            snapshot_id: "snap1",
            component_type: "CustomObject",
            api_name: "Account",
            attributes: {},
            created_at: "2024-01-01T00:00:00Z"
        },
        created_at: "2024-01-01T00:00:00Z"
    };

    assertEquals(result.id, "result1");
    assertEquals(result.component?.api_name, "Account");
});

Deno.test("AIInteractionWithUser interface", () => {
    const interaction: AIInteractionWithUser = {
        id: "interaction123",
        snapshot_id: "snap123",
        user_id: "user123",
        prompt: "Analyze Account object",
        neo4j_query_summary: "MATCH (a:Account) RETURN a",
        llm_response: "Analysis completed successfully",
        feedback_rating: 1,
        feedback_comment: "Great analysis",
        created_at: "2024-01-01T00:00:00Z",
        user: {
            id: "user123",
            email: "test@example.com",
            first_name: "John",
            last_name: "Doe",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z"
        }
    };

    assertEquals(interaction.id, "interaction123");
    assertEquals(interaction.snapshot_id, "snap123");
    assertEquals(interaction.user_id, "user123");
    assertEquals(interaction.prompt, "Analyze Account object");
    assertEquals(interaction.neo4j_query_summary, "MATCH (a:Account) RETURN a");
    assertEquals(interaction.llm_response, "Analysis completed successfully");
    assertEquals(interaction.feedback_rating, 1);
    assertEquals(interaction.feedback_comment, "Great analysis");

    assertEquals(interaction.user?.id, "user123");
    assertEquals(interaction.user?.email, "test@example.com");
    assertEquals(interaction.user?.first_name, "John");
    assertEquals(interaction.user?.last_name, "Doe");

    // Test without user
    const interactionNoUser: AIInteractionWithUser = {
        id: "interaction456",
        prompt: "General analysis",
        created_at: "2024-01-01T00:00:00Z"
    };

    assertEquals(interactionNoUser.id, "interaction456");
    assertEquals(interactionNoUser.user, undefined);
});

Deno.test("AIInteractionWithSnapshot interface", () => {
    const interaction: AIInteractionWithSnapshot = {
        id: "interaction123",
        snapshot_id: "snap123",
        user_id: "user123",
        prompt: "Analyze metadata snapshot",
        neo4j_query_summary: "MATCH (s:Snapshot) RETURN s",
        llm_response: "Analysis completed successfully",
        feedback_rating: 1,
        feedback_comment: "Great analysis",
        created_at: "2024-01-01T00:00:00Z",
        snapshot: {
            id: "snap123",
            sf_connection_id: "conn123",
            status: "COMPLETED",
            created_at: "2024-01-01T00:00:00Z",
            completed_at: "2024-01-01T00:05:00Z"
        }
    };

    assertEquals(interaction.id, "interaction123");
    assertEquals(interaction.snapshot_id, "snap123");
    assertEquals(interaction.user_id, "user123");
    assertEquals(interaction.prompt, "Analyze metadata snapshot");
    assertEquals(interaction.neo4j_query_summary, "MATCH (s:Snapshot) RETURN s");
    assertEquals(interaction.llm_response, "Analysis completed successfully");
    assertEquals(interaction.feedback_rating, 1);
    assertEquals(interaction.feedback_comment, "Great analysis");

    assertEquals(interaction.snapshot?.id, "snap123");
    assertEquals(interaction.snapshot?.sf_connection_id, "conn123");
    assertEquals(interaction.snapshot?.status, "COMPLETED");
    assertEquals(interaction.snapshot?.created_at, "2024-01-01T00:00:00Z");
    assertEquals(interaction.snapshot?.completed_at, "2024-01-01T00:05:00Z");

    // Test without snapshot
    const interactionNoSnapshot: AIInteractionWithSnapshot = {
        id: "interaction456",
        prompt: "General analysis",
        created_at: "2024-01-01T00:00:00Z"
    };

    assertEquals(interactionNoSnapshot.id, "interaction456");
    assertEquals(interactionNoSnapshot.snapshot, undefined);
});

Deno.test("OrganizationWithMembers", () => {
    const organization: OrganizationWithMembers = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Test Organization",
        description: "A test organization",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        members: [
            {
                user_id: "user123",
                organization_id: "123e4567-e89b-12d3-a456-426614174000"
            }
        ]
    };

    assertEquals(organization.id, "123e4567-e89b-12d3-a456-426614174000");
    assertEquals(organization.name, "Test Organization");
    assertEquals(organization.description, "A test organization");
    assertEquals(organization.members.length, 1);
    assertEquals(organization.members[0].user_id, "user123");
    assertEquals(organization.members[0].organization_id, "123e4567-e89b-12d3-a456-426614174000");
});

Deno.test("OrganizationWithConnections", () => {
    const organization: OrganizationWithConnections = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Test Organization",
        description: "A test organization",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        connections: [
            {
                id: "conn123",
                name: "Test Connection",
                instance_url: "https://test.salesforce.com",
                organization_id: "123e4567-e89b-12d3-a456-426614174000"
            }
        ]
    };

    assertEquals(organization.id, "123e4567-e89b-12d3-a456-426614174000");
    assertEquals(organization.name, "Test Organization");
    assertEquals(organization.description, "A test organization");
    assertEquals(organization.connections.length, 1);
    assertEquals(organization.connections[0].id, "conn123");
    assertEquals(organization.connections[0].name, "Test Connection");
    assertEquals(organization.connections[0].instance_url, "https://test.salesforce.com");
    assertEquals(organization.connections[0].organization_id, "123e4567-e89b-12d3-a456-426614174000");
});

Deno.test("UserWithOrganizations", () => {
    const user: UserWithOrganizations = {
        id: "user123",
        email: "test@example.com",
        first_name: "John",
        last_name: "Doe",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        organizations: [
            {
                user_id: "user123",
                organization_id: "org123"
            }
        ]
    };

    assertEquals(user.id, "user123");
    assertEquals(user.email, "test@example.com");
    assertEquals(user.first_name, "John");
    assertEquals(user.last_name, "Doe");
    assertEquals(user.organizations.length, 1);
    assertEquals(user.organizations[0].user_id, "user123");
    assertEquals(user.organizations[0].organization_id, "org123");
});

Deno.test("SalesforceConnectionWithSnapshots", () => {
    const connection: SalesforceConnectionWithSnapshots = {
        id: "conn123",
        name: "Test Connection",
        instance_url: "https://test.salesforce.com",
        organization_id: "org123",
        snapshots: [
            {
                id: "snap123",
                sf_connection_id: "conn123",
                status: "COMPLETED",
                created_at: "2024-01-01T00:00:00Z",
                completed_at: "2024-01-01T00:05:00Z"
            }
        ]
    };

    assertEquals(connection.id, "conn123");
    assertEquals(connection.name, "Test Connection");
    assertEquals(connection.instance_url, "https://test.salesforce.com");
    assertEquals(connection.organization_id, "org123");
    assertEquals(connection.snapshots.length, 1);
    assertEquals(connection.snapshots[0].id, "snap123");
    assertEquals(connection.snapshots[0].sf_connection_id, "conn123");
    assertEquals(connection.snapshots[0].status, "COMPLETED");
    assertEquals(connection.snapshots[0].created_at, "2024-01-01T00:00:00Z");
    assertEquals(connection.snapshots[0].completed_at, "2024-01-01T00:05:00Z");
});

Deno.test("MetadataSnapshotWithComponents", () => {
    const snapshot: MetadataSnapshotWithComponents = {
        id: "snap123",
        sf_connection_id: "conn123",
        status: "COMPLETED",
        created_at: "2024-01-01T00:00:00Z",
        completed_at: "2024-01-01T00:05:00Z",
        components: [
            {
                id: "comp123",
                snapshot_id: "snap123",
                component_type: "CustomObject",
                api_name: "Account",
                attributes: {},
                created_at: "2024-01-01T00:00:00Z"
            }
        ],
        relationships: [
            {
                id: "rel123",
                snapshot_id: "snap123",
                source_component_api_name: "Account",
                source_component_type: "CustomObject",
                target_component_api_name: "Contact",
                target_component_type: "CustomObject",
                relationship_type: "BELONGS_TO",
                created_at: "2024-01-01T00:00:00Z"
            }
        ],
        analysis_results: [
            {
                id: "analysis123",
                snapshot_id: "snap123",
                analysis_type: "DependencyCheck",
                component_api_name: "Account",
                component_type: "CustomObject",
                severity: "Info",
                description: "Test analysis",
                created_at: "2024-01-01T00:00:00Z"
            }
        ]
    };

    assertEquals(snapshot.id, "snap123");
    assertEquals(snapshot.sf_connection_id, "conn123");
    assertEquals(snapshot.status, "COMPLETED");
    assertEquals(snapshot.created_at, "2024-01-01T00:00:00Z");
    assertEquals(snapshot.completed_at, "2024-01-01T00:05:00Z");

    assertEquals(snapshot.components.length, 1);
    assertEquals(snapshot.components[0].id, "comp123");
    assertEquals(snapshot.components[0].component_type, "CustomObject");
    assertEquals(snapshot.components[0].api_name, "Account");

    assertEquals(snapshot.relationships.length, 1);
    assertEquals(snapshot.relationships[0].id, "rel123");
    assertEquals(snapshot.relationships[0].source_component_api_name, "Account");
    assertEquals(snapshot.relationships[0].target_component_api_name, "Contact");
    assertEquals(snapshot.relationships[0].relationship_type, "BELONGS_TO");

    assertEquals(snapshot.analysis_results.length, 1);
    assertEquals(snapshot.analysis_results[0].id, "analysis123");
    assertEquals(snapshot.analysis_results[0].analysis_type, "DependencyCheck");
    assertEquals(snapshot.analysis_results[0].component_api_name, "Account");
    assertEquals(snapshot.analysis_results[0].severity, "Info");
});

Deno.test("ParsedComponentWithRelations", () => {
    const component: ParsedComponentWithRelations = {
        id: "comp123",
        snapshot_id: "snap123",
        component_type: "CustomObject",
        api_name: "Account",
        attributes: {},
        created_at: "2024-01-01T00:00:00Z",
        source_relationships: [
            {
                id: "rel123",
                snapshot_id: "snap123",
                source_component_api_name: "Account",
                source_component_type: "CustomObject",
                target_component_api_name: "Contact",
                target_component_type: "CustomObject",
                relationship_type: "HAS_MANY",
                created_at: "2024-01-01T00:00:00Z"
            }
        ],
        target_relationships: [
            {
                id: "rel456",
                snapshot_id: "snap123",
                source_component_api_name: "Opportunity",
                source_component_type: "CustomObject",
                target_component_api_name: "Account",
                target_component_type: "CustomObject",
                relationship_type: "BELONGS_TO",
                created_at: "2024-01-01T00:00:00Z"
            }
        ],
        analysis_results: [
            {
                id: "analysis123",
                snapshot_id: "snap123",
                analysis_type: "SecurityCheck",
                component_api_name: "Account",
                component_type: "CustomObject",
                severity: "Warning",
                description: "Missing field-level security",
                created_at: "2024-01-01T00:00:00Z"
            }
        ]
    };

    assertEquals(component.id, "comp123");
    assertEquals(component.snapshot_id, "snap123");
    assertEquals(component.component_type, "CustomObject");
    assertEquals(component.api_name, "Account");

    assertEquals(component.source_relationships.length, 1);
    assertEquals(component.source_relationships[0].id, "rel123");
    assertEquals(component.source_relationships[0].source_component_api_name, "Account");
    assertEquals(component.source_relationships[0].target_component_api_name, "Contact");
    assertEquals(component.source_relationships[0].relationship_type, "HAS_MANY");

    assertEquals(component.target_relationships.length, 1);
    assertEquals(component.target_relationships[0].id, "rel456");
    assertEquals(component.target_relationships[0].source_component_api_name, "Opportunity");
    assertEquals(component.target_relationships[0].target_component_api_name, "Account");
    assertEquals(component.target_relationships[0].relationship_type, "BELONGS_TO");

    assertEquals(component.analysis_results.length, 1);
    assertEquals(component.analysis_results[0].id, "analysis123");
    assertEquals(component.analysis_results[0].analysis_type, "SecurityCheck");
    assertEquals(component.analysis_results[0].severity, "Warning");
    assertEquals(component.analysis_results[0].description, "Missing field-level security");
});

Deno.test("AccountWithContacts", () => {
    const account: AccountWithContacts = {
        id: "acc123",
        name: "Test Account",
        description: "A test account",
        industry: "Technology",
        website: "https://test.com",
        phone: "123-456-7890",
        billing_street: "123 Test St",
        billing_city: "Test City",
        billing_state: "Test State",
        billing_postal_code: "12345",
        billing_country: "Test Country",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        contacts: [
            {
                id: "contact123",
                account_id: "acc123",
                first_name: "John",
                last_name: "Doe",
                email: "john@test.com",
                phone: "123-456-7890",
                title: "CEO",
                department: "Executive",
                mailing_street: "123 Test St",
                mailing_city: "Test City",
                mailing_state: "Test State",
                mailing_postal_code: "12345",
                mailing_country: "Test Country",
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z"
            }
        ]
    };

    assertEquals(account.id, "acc123");
    assertEquals(account.name, "Test Account");
    assertEquals(account.description, "A test account");
    assertEquals(account.industry, "Technology");
    assertEquals(account.website, "https://test.com");
    assertEquals(account.phone, "123-456-7890");

    assertEquals(account.contacts.length, 1);
    assertEquals(account.contacts[0].id, "contact123");
    assertEquals(account.contacts[0].account_id, "acc123");
    assertEquals(account.contacts[0].first_name, "John");
    assertEquals(account.contacts[0].last_name, "Doe");
    assertEquals(account.contacts[0].email, "john@test.com");
    assertEquals(account.contacts[0].title, "CEO");
    assertEquals(account.contacts[0].department, "Executive");
});

Deno.test("AnalysisResultWithComponent", () => {
    const analysisResult: AnalysisResultWithComponent = {
        id: "analysis123",
        snapshot_id: "snap123",
        analysis_type: "SecurityCheck",
        component_api_name: "Account",
        component_type: "CustomObject",
        severity: "Warning",
        description: "Missing field-level security",
        created_at: "2024-01-01T00:00:00Z",
        component: {
            id: "comp123",
            snapshot_id: "snap123",
            component_type: "CustomObject",
            api_name: "Account",
            attributes: {},
            created_at: "2024-01-01T00:00:00Z"
        }
    };

    assertEquals(analysisResult.id, "analysis123");
    assertEquals(analysisResult.snapshot_id, "snap123");
    assertEquals(analysisResult.analysis_type, "SecurityCheck");
    assertEquals(analysisResult.component_api_name, "Account");
    assertEquals(analysisResult.component_type, "CustomObject");
    assertEquals(analysisResult.severity, "Warning");
    assertEquals(analysisResult.description, "Missing field-level security");

    assertEquals(analysisResult.component?.id, "comp123");
    assertEquals(analysisResult.component?.snapshot_id, "snap123");
    assertEquals(analysisResult.component?.component_type, "CustomObject");
    assertEquals(analysisResult.component?.api_name, "Account");

    // Test without component
    const analysisResultNoComponent: AnalysisResultWithComponent = {
        id: "analysis456",
        snapshot_id: "snap123",
        analysis_type: "GeneralCheck",
        severity: "Info",
        description: "General system check",
        created_at: "2024-01-01T00:00:00Z"
    };

    assertEquals(analysisResultNoComponent.id, "analysis456");
    assertEquals(analysisResultNoComponent.component, undefined);
}); 