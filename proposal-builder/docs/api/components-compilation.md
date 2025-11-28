# Component Compilation API Documentation

Backend API endpoints for compiling TypeScript components and generating JSON schemas.

## Overview

The compilation system provides:
- TypeScript → JavaScript transpilation using Sucrase
- Props interface → JSON schema extraction
- Component validation and metadata extraction
- Automatic versioning and history tracking

## Endpoints

### 1. Compile Component

**POST** `/api/components/compile`

Compiles TypeScript component source code and updates ComponentSource table.

#### Request Body

```typescript
{
  blockType: string;          // Block type (e.g., 'HERO', 'PRICING_TABLE')
  sourceCode: string;         // TypeScript component source code
  dependencies?: string[];    // Optional npm dependencies
  changeDescription?: string; // Version change description
  createdById?: string;       // User ID who triggered compilation
}
```

#### Response

```typescript
{
  success: boolean;
  blockType?: string;
  compiledCode?: string;      // Compiled JavaScript
  schema?: JSONSchema;        // Generated JSON schema
  version?: number;           // New version number
  error?: string;
  warnings?: string[];
  metadata?: {
    componentName?: string;
    hasDefaultExport: boolean;
    propsInterfaceName?: string;
  };
}
```

#### Example

```bash
curl -X POST http://localhost:3000/api/components/compile \
  -H "Content-Type: application/json" \
  -d '{
    "blockType": "HERO",
    "sourceCode": "...",
    "changeDescription": "Updated hero component"
  }'
```

#### Success Response (200)

```json
{
  "success": true,
  "blockType": "HERO",
  "compiledCode": "\"use strict\";...",
  "schema": {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "title": "Props",
    "properties": {
      "heading": {
        "type": "string",
        "description": "Main heading text"
      }
    },
    "required": ["heading"]
  },
  "version": 2,
  "metadata": {
    "componentName": "HeroSection",
    "hasDefaultExport": true,
    "propsInterfaceName": "Props"
  }
}
```

#### Error Response (400)

```json
{
  "success": false,
  "error": "Invalid component structure",
  "warnings": [
    "Component must have a default function export",
    "Component should define a Props interface"
  ]
}
```

---

### 2. Get Component Source

**GET** `/api/components/source/[blockType]`

Retrieves component source code and metadata from ComponentSource table.

#### URL Parameters

- `blockType` (string): Block type identifier

#### Query Parameters

- `includeInactive` (boolean): Include inactive components (default: false)

#### Response

```typescript
{
  success: boolean;
  component?: {
    id: string;
    blockType: string;
    name: string;
    description?: string;
    sourceCode: string;
    compiledCode: string;
    schema: JSONSchema;
    version: number;
    isActive: boolean;
    lastCompiledAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  };
  error?: string;
}
```

#### Example

```bash
curl http://localhost:3000/api/components/source/HERO
```

#### Success Response (200)

```json
{
  "success": true,
  "component": {
    "id": "clx123...",
    "blockType": "HERO",
    "name": "HeroSection",
    "description": "Hero section component",
    "sourceCode": "import React...",
    "compiledCode": "\"use strict\";...",
    "schema": { ... },
    "version": 3,
    "isActive": true,
    "lastCompiledAt": "2025-11-26T12:00:00.000Z",
    "createdAt": "2025-11-20T10:00:00.000Z",
    "updatedAt": "2025-11-26T12:00:00.000Z"
  }
}
```

---

### 3. Update Component Source

**PATCH** `/api/components/source/[blockType]`

Updates component source code with automatic compilation and versioning.

**Authentication Required:** SUPER_ADMIN role

#### Request Body

```typescript
{
  sourceCode: string;         // Updated TypeScript source code
  changeDescription?: string; // Description of changes
}
```

#### Response

```typescript
{
  success: boolean;
  component?: ComponentSource;
  metadata?: {
    componentName?: string;
    hasDefaultExport: boolean;
    propsInterfaceName?: string;
  };
  warnings?: string[];
  error?: string;
}
```

#### Example

```bash
curl -X PATCH http://localhost:3000/api/components/source/HERO \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ..." \
  -d '{
    "sourceCode": "...",
    "changeDescription": "Added new props"
  }'
```

#### Features

- Automatic syntax validation
- TypeScript compilation
- JSON schema generation
- Version history tracking
- Rollback capability

---

### 4. Get Compilation Status

**GET** `/api/components/compile?blockType=[blockType]`

Get compilation status and metadata for a component.

#### Query Parameters

- `blockType` (string): Block type identifier

#### Response

```typescript
{
  success: boolean;
  component?: {
    id: string;
    blockType: string;
    name: string;
    version: number;
    isActive: boolean;
    lastCompiledAt?: Date;
    updatedAt: Date;
  };
  error?: string;
}
```

---

## Validation Rules

Components must meet these requirements:

1. **Default Export**: Must have `export default function`
2. **Props Interface**: Should define a Props interface
3. **Valid Syntax**: Must be valid TypeScript
4. **React Import**: Should import React or use "use client"

## Version History

Every compilation creates:
1. **Backup Version**: Previous version saved to ComponentVersion table
2. **New Version**: Incremented version number
3. **Audit Trail**: Change description and timestamp

## Error Handling

All endpoints return structured errors:

```typescript
{
  success: false,
  error: string,           // Main error message
  details?: string,        // Technical details
  warnings?: string[]      // Non-fatal warnings
}
```

## Status Codes

- `200 OK` - Successful request
- `400 Bad Request` - Invalid input or validation failure
- `401 Unauthorized` - Missing authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Component not found
- `500 Internal Server Error` - Server-side error

## Best Practices

1. **Always validate** before compilation
2. **Include change descriptions** for version tracking
3. **Check warnings** even on successful compilation
4. **Use GET** to fetch before PATCH to avoid conflicts
5. **Monitor version numbers** to detect changes

## Database Updates

Compilation affects these tables:

- **ComponentSource**: Updated with new code, schema, and version
- **ComponentVersion**: New version history entry created
- **ProposalComponentCode**: Inherited by new proposals

## Performance

- Compilation typically takes 50-200ms
- Caching is implemented at the component load level
- No cache invalidation needed for compilation endpoint
