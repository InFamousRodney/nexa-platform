# Testing Configuration Issues Documentation

## Jest vs Vitest Configuration Issues

### Current Problems

1. **Jest DOM Dependencies in Frontend**
   - **Location**: `/apps/frontend/tsconfig.test.json`
   ```json
   {
     "compilerOptions": {
       "types": ["vitest/globals", "@testing-library/jest-dom"]  // Problem: Mixed testing frameworks
     }
   }
   ```
   - **Issues**:
     - Attempting to use both Vitest and Jest DOM types simultaneously
     - `@testing-library/jest-dom` causing TypeScript errors because:
       - Not compatible with Vitest setup
       - Conflicts with Vitest's DOM testing utilities

2. **Jest References Found**

   a. **Frontend Test Setup**
   - File: `/apps/frontend/src/test/setup.ts`
   ```typescript
   import '@testing-library/jest-dom';
   import * as matchers from '@testing-library/jest-dom/matchers';
   import { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
   ```

   b. **Package Dependencies**
   - File: `/apps/frontend/package.json`
   ```json
   {
     "dependencies": {
       "@testing-library/jest-dom": "^6.6.3"
     }
   }
   ```

   c. **Lock File References**
   - File: `pnpm-lock.yaml`
   - Contains references to:
     - `@testing-library/jest-dom@6.6.3`
     - `@types/testing-library__jest-dom@6.0.0`

## Supabase Edge Functions Issues

1. **TypeScript Configuration Problems**
   - **Location**: `/supabase/functions/tsconfig.json`
   ```json
   {
     "compilerOptions": {
       "lib": ["deno.window", "dom", "esnext"]  // Invalid lib configuration
     }
   }
   ```
   - **Issues**:
     - `deno.window` is not a valid TypeScript lib option
     - Configuration mixes Node.js/browser and Deno settings

2. **Module Resolution Issues**
   - **Location**: `/supabase/functions/sfdc-auth-initiate/index.ts`
   - **Current problematic imports**:
   ```typescript
   import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
   import { createClient } from "@supabase/supabase-js";
   ```
   - **Issues**:
     - Deno imports require specific module resolution settings
     - Supabase client import path not properly configured

## Required Actions

1. **Frontend Testing Updates**
   - Remove `@testing-library/jest-dom` from package.json
   - Update test setup file to use Vitest matchers
   - Remove Jest DOM types from tsconfig.test.json
   - Update any test files using Jest DOM matchers to use Vitest equivalents

2. **Supabase Edge Functions Fixes**
   - Update TypeScript lib settings to use valid options
   - Configure proper module resolution for Deno imports
   - Ensure consistent TypeScript configuration across all Edge Functions

## Migration Steps

1. **Remove Jest Dependencies**
   ```bash
   pnpm remove @testing-library/jest-dom @types/testing-library__jest-dom
   ```

2. **Update TypeScript Configurations**
   - Remove Jest DOM references from all tsconfig files
   - Update Deno configurations for Edge Functions

3. **Update Test Files**
   - Replace Jest DOM matchers with Vitest equivalents
   - Update import statements in test setup files
   - Verify all tests are using Vitest syntax
