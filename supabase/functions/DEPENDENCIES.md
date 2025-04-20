# Supabase Edge Functions Dependencies Guide

## Overview
Supabase Edge Functions use Deno, which has its own way of managing dependencies. Here's how to properly manage dependencies in your Edge Functions.

## Import Maps
Import maps are the recommended way to manage dependencies in Deno. Create an `import_map.json` file in your project:

```json
{
  "imports": {
    "@supabase/supabase-js": "https://esm.sh/@supabase/supabase-js@2.38.4",
    "@supabase/auth-helpers-shared": "https://esm.sh/@supabase/auth-helpers-shared@0.6.1",
    "std/": "https://deno.land/std@0.208.0/"
  }
}
```

## Dependency Sources

### 1. JSR (JavaScript Registry)
The recommended way to import dependencies:

```typescript
import { createClient } from 'jsr:@supabase/supabase-js@2'
```

### 2. ESM.sh
Alternative CDN for npm packages:

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
```

### 3. Deno.land/x
For Deno-specific modules:

```typescript
import * as postgres from 'https://deno.land/x/postgres@v0.17.0/mod.ts'
```

### 4. npm: Specifier
For npm packages (requires --allow-env and --allow-read permissions):

```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'
```

## Best Practices

1. **Version Pinning**: Always pin to specific versions to ensure reproducible builds
2. **Import Maps**: Use import maps for centralized dependency management
3. **JSR First**: Prefer JSR imports when available
4. **Permissions**: Be explicit about required permissions in your documentation

## Common Dependencies

- `@supabase/supabase-js`: Supabase client library
- `std` modules from Deno standard library
- Database clients (e.g., `postgres`)
- Utility libraries (e.g., `zod` for validation)

## TypeScript Configuration

Add types to your `deno.json` configuration:

```json
{
  "compilerOptions": {
    "types": [
      "@supabase/supabase-js"
    ]
  }
}
```

## Troubleshooting

1. **Missing Types**: Ensure types are properly configured in `deno.json`
2. **Import Errors**: Verify import map configuration
3. **Permission Errors**: Check required Deno permissions
4. **Version Conflicts**: Use import maps to enforce consistent versions

## Security Considerations

1. Only use trusted sources for dependencies
2. Pin dependency versions
3. Regularly update dependencies for security patches
4. Review permissions required by dependencies
