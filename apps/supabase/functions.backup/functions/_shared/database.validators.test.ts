import { assertEquals } from "https://deno.land/std@0.208.0/assert/assert_equals.ts";
import {
    validateOrganization,
    validateUser,
    validateSalesforceConnection,
    validateMetadataSnapshot,
    validateParsedComponent,
    validateParsedRelationship,
    validateAnalysisResult,
    validateAIInteraction
} from './database.validators.ts';

Deno.test("validateOrganization", () => {
    const validOrg = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Test Org",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
    };
    
    const invalidOrg = {
        id: "invalid-id",
        name: "T",
        created_at: "invalid-date",
        updated_at: "2024-01-01T00:00:00Z"
    };
    
    assertEquals(validateOrganization(validOrg), []);
    assertEquals(validateOrganization(invalidOrg).length > 0, true);
});

Deno.test("validateUser", () => {
    const validUser = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "test@example.com",
        first_name: "John",
        last_name: "Doe",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
    };
    
    const invalidUser = {
        id: "invalid-id",
        email: "invalid-email",
        first_name: "J",
        last_name: "D",
        created_at: "invalid-date",
        updated_at: "2024-01-01T00:00:00Z"
    };
    
    assertEquals(validateUser(validUser), []);
    assertEquals(validateUser(invalidUser).length > 0, true);
});

Deno.test("validateSalesforceConnection", () => {
    const validConn = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Test Connection",
        instance_url: "https://test.salesforce.com",
        organization_id: "123e4567-e89b-12d3-a456-426614174000"
    };
    
    const invalidConn = {
        id: "invalid-id",
        name: "T",
        instance_url: "invalid-url",
        organization_id: "invalid-org-id"
    };
    
    assertEquals(validateSalesforceConnection(validConn), []);
    assertEquals(validateSalesforceConnection(invalidConn).length > 0, true);
});

Deno.test("validateMetadataSnapshot", () => {
    const validSnapshot = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        sf_connection_id: "123e4567-e89b-12d3-a456-426614174000",
        status: "COMPLETED" as const,
        created_at: "2024-01-01T00:00:00Z",
        completed_at: "2024-01-01T00:05:00Z"
    };
    
    const invalidSnapshot = {
        id: "invalid-id",
        sf_connection_id: "invalid-conn-id",
        status: "INVALID" as any,
        created_at: "invalid-date",
        completed_at: "invalid-date"
    };
    
    assertEquals(validateMetadataSnapshot(validSnapshot), []);
    assertEquals(validateMetadataSnapshot(invalidSnapshot).length > 0, true);
});

Deno.test("validateParsedComponent", () => {
    const validComponent = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        snapshot_id: "123e4567-e89b-12d3-a456-426614174000",
        component_type: "CustomObject",
        api_name: "Account",
        attributes: {},
        created_at: "2024-01-01T00:00:00Z"
    };
    
    const invalidComponent = {
        id: "invalid-id",
        snapshot_id: "invalid-snap-id",
        component_type: "C",
        api_name: "A",
        attributes: {},
        created_at: "invalid-date"
    };
    
    assertEquals(validateParsedComponent(validComponent), []);
    assertEquals(validateParsedComponent(invalidComponent).length > 0, true);
});

Deno.test("validateParsedRelationship", () => {
    const validRelationship = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        snapshot_id: "123e4567-e89b-12d3-a456-426614174000",
        source_component_api_name: "Account",
        source_component_type: "CustomObject",
        target_component_api_name: "Contact",
        target_component_type: "CustomObject",
        relationship_type: "BELONGS_TO",
        created_at: "2024-01-01T00:00:00Z"
    };
    
    const invalidRelationship = {
        id: "invalid-id",
        snapshot_id: "invalid-snap-id",
        source_component_api_name: "A",
        source_component_type: "C",
        target_component_api_name: "C",
        target_component_type: "C",
        relationship_type: "B",
        created_at: "invalid-date"
    };
    
    assertEquals(validateParsedRelationship(validRelationship), []);
    assertEquals(validateParsedRelationship(invalidRelationship).length > 0, true);
});

Deno.test("validateAnalysisResult", () => {
    const validResult = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        snapshot_id: "123e4567-e89b-12d3-a456-426614174000",
        analysis_type: "DependencyCheck",
        severity: "Warning" as const,
        description: "Test warning",
        created_at: "2024-01-01T00:00:00Z"
    };
    
    const invalidResult = {
        id: "invalid-id",
        snapshot_id: "invalid-snap-id",
        analysis_type: "D",
        severity: "Invalid" as any,
        description: "T",
        created_at: "invalid-date"
    };
    
    assertEquals(validateAnalysisResult(validResult), []);
    assertEquals(validateAnalysisResult(invalidResult).length > 0, true);
});

Deno.test("validateAIInteraction", () => {
    const validInteraction = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        prompt: "Test prompt",
        snapshot_id: "123e4567-e89b-12d3-a456-426614174000",
        user_id: "123e4567-e89b-12d3-a456-426614174000",
        feedback_rating: 1 as const,
        created_at: "2024-01-01T00:00:00Z"
    };
    
    const invalidInteraction = {
        id: "invalid-id",
        prompt: "T",
        snapshot_id: "invalid-snap-id",
        user_id: "invalid-user-id",
        feedback_rating: 2 as any,
        created_at: "invalid-date"
    };
    
    assertEquals(validateAIInteraction(validInteraction), []);
    assertEquals(validateAIInteraction(invalidInteraction).length > 0, true);
}); 