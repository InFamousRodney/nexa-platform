-- First, drop all existing policies
DROP POLICY IF EXISTS "Users can view their organizations" ON organizations;
DROP POLICY IF EXISTS "Users can view their organization memberships" ON organization_members;
DROP POLICY IF EXISTS "Users can view their organization's connections" ON salesforce_connections;

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE salesforce_connections ENABLE ROW LEVEL SECURITY;

-- Organization members policy - based directly on user_id
CREATE POLICY "Users can view their organization memberships"
    ON organization_members 
    FOR SELECT
    USING (user_id = auth.uid());

-- Organizations policy - based on owner_id or membership
CREATE POLICY "Users can view their organizations"
    ON organizations 
    FOR SELECT
    USING (
        owner_id = auth.uid() OR
        id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

-- Salesforce connections policy - based on organization membership
CREATE POLICY "Users can view their organization's connections"
    ON salesforce_connections 
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid()
        )
    ); 