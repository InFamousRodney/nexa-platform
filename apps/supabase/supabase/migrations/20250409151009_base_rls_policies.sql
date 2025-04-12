-- Base RLS Policies
-- Ensure users can only interact with data belonging to their organization(s).

-- Policy for organizations table: Allow users to see organizations they are members of.
CREATE POLICY "Allow members to read their organizations"
ON public.organizations
FOR SELECT
USING (
  -- Check if the current user's ID exists in the organization_members table for this organization's ID.
  EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = public.organizations.id
      AND om.user_id = auth.uid() -- auth.uid() returns the ID of the currently authenticated user
  )
);

-- Policy for organization_members table: Allow users to see their own membership record and other members of their org(s).
CREATE POLICY "Allow members to read memberships of their organizations"
ON public.organization_members
FOR SELECT
USING (
  -- Check if the user is a member of the organization this membership record belongs to.
  EXISTS (
    SELECT 1
    FROM public.organization_members om_check
    WHERE om_check.organization_id = public.organization_members.organization_id -- Compare with the org_id of the row being checked
      AND om_check.user_id = auth.uid()
  )
);
-- Optional: Allow users to manage memberships if they have an 'admin' role (Example - needs refinement based on actual roles/permissions)
-- CREATE POLICY "Allow organization admins to manage memberships"
-- ON public.organization_members
-- FOR ALL -- Covers INSERT, UPDATE, DELETE
-- USING (
--   EXISTS (
--     SELECT 1
--     FROM public.organization_members om_admin
--     WHERE om_admin.organization_id = public.organization_members.organization_id
--       AND om_admin.user_id = auth.uid()
--       AND om_admin.role = 'admin'
--   )
-- )
-- WITH CHECK (
--   EXISTS (
--     SELECT 1
--     FROM public.organization_members om_admin
--     WHERE om_admin.organization_id = public.organization_members.organization_id
--       AND om_admin.user_id = auth.uid()
--       AND om_admin.role = 'admin'
--   )
-- );


-- Policy for salesforce_connections table: Allow users to interact with connections belonging to their organization(s).
CREATE POLICY "Allow members to interact with their organization connections"
ON public.salesforce_connections
FOR ALL -- Covers SELECT, INSERT, UPDATE, DELETE
USING ( -- This applies to SELECT, UPDATE, DELETE (which rows are visible/targetable)
  EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = public.salesforce_connections.organization_id
      AND om.user_id = auth.uid()
  )
)
WITH CHECK ( -- This applies to INSERT, UPDATE (is the new/modified row allowed)
  EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = public.salesforce_connections.organization_id
      AND om.user_id = auth.uid()
  )
);

-- Policy for metadata_snapshots table: Allow users to interact with snapshots belonging to their organization(s).
-- This relies on the RLS policy on salesforce_connections being implicitly checked via the foreign key relationship,
-- but it's safer to explicitly check membership for the organization linked *through* the connection.
CREATE POLICY "Allow members to interact with their organization snapshots"
ON public.metadata_snapshots
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.salesforce_connections sc
    JOIN public.organization_members om ON sc.organization_id = om.organization_id
    WHERE sc.id = public.metadata_snapshots.sf_connection_id -- Link snapshot to connection
      AND om.user_id = auth.uid() -- Check user membership for the connection's org
  )
)
WITH CHECK (
   EXISTS (
    SELECT 1
    FROM public.salesforce_connections sc
    JOIN public.organization_members om ON sc.organization_id = om.organization_id
    WHERE sc.id = public.metadata_snapshots.sf_connection_id
      AND om.user_id = auth.uid()
  )
);


-- Policies for parsed_components, parsed_relationships, analysis_results, ai_interactions
-- These tables are primarily linked via metadata_snapshots. Access control should cascade from there.
-- We define similar policies checking the user's membership in the organization associated with the snapshot.

CREATE POLICY "Allow members to interact with their organization parsed components"
ON public.parsed_components
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.metadata_snapshots ms
    JOIN public.salesforce_connections sc ON ms.sf_connection_id = sc.id
    JOIN public.organization_members om ON sc.organization_id = om.organization_id
    WHERE ms.id = public.parsed_components.snapshot_id -- Link component to snapshot
      AND om.user_id = auth.uid() -- Check user membership for the snapshot's org
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.metadata_snapshots ms
    JOIN public.salesforce_connections sc ON ms.sf_connection_id = sc.id
    JOIN public.organization_members om ON sc.organization_id = om.organization_id
    WHERE ms.id = public.parsed_components.snapshot_id
      AND om.user_id = auth.uid()
  )
);

CREATE POLICY "Allow members to interact with their organization parsed relationships"
ON public.parsed_relationships
FOR ALL
USING (
   EXISTS (
    SELECT 1
    FROM public.metadata_snapshots ms
    JOIN public.salesforce_connections sc ON ms.sf_connection_id = sc.id
    JOIN public.organization_members om ON sc.organization_id = om.organization_id
    WHERE ms.id = public.parsed_relationships.snapshot_id -- Link relationship to snapshot
      AND om.user_id = auth.uid() -- Check user membership for the snapshot's org
  )
)
WITH CHECK (
   EXISTS (
    SELECT 1
    FROM public.metadata_snapshots ms
    JOIN public.salesforce_connections sc ON ms.sf_connection_id = sc.id
    JOIN public.organization_members om ON sc.organization_id = om.organization_id
    WHERE ms.id = public.parsed_relationships.snapshot_id
      AND om.user_id = auth.uid()
  )
);

CREATE POLICY "Allow members to interact with their organization analysis results"
ON public.analysis_results
FOR ALL
USING (
   EXISTS (
    SELECT 1
    FROM public.metadata_snapshots ms
    JOIN public.salesforce_connections sc ON ms.sf_connection_id = sc.id
    JOIN public.organization_members om ON sc.organization_id = om.organization_id
    WHERE ms.id = public.analysis_results.snapshot_id -- Link result to snapshot
      AND om.user_id = auth.uid() -- Check user membership for the snapshot's org
  )
)
WITH CHECK (
   EXISTS (
    SELECT 1
    FROM public.metadata_snapshots ms
    JOIN public.salesforce_connections sc ON ms.sf_connection_id = sc.id
    JOIN public.organization_members om ON sc.organization_id = om.organization_id
    WHERE ms.id = public.analysis_results.snapshot_id
      AND om.user_id = auth.uid()
  )
);

CREATE POLICY "Allow members to interact with their own AI interactions"
ON public.ai_interactions
FOR ALL
USING (
  -- Users can only see/manage their own AI interactions
  public.ai_interactions.user_id = auth.uid()
)
WITH CHECK (
  public.ai_interactions.user_id = auth.uid()
);