# Research: Dynamic React Component Execution from Database

**Date:** 2025-11-26
**Status:** Research Complete
**Context:** Executing database-stored React component code at runtime in the browser

---

## Executive Summary

After comprehensive research into your system and industry best practices, I've identified the root causes of your issues and found working solutions used by platforms like CodeSandbox, StackBlitz, and Sandpack.

### Key Findings

1. **Prisma Enum Issue:** Your components return 404 NOT because of Prisma bugs, but because **they don't exist in the database yet**
2. **Your Current Approach is Sound:** Using Sucrase + new Function() is a viable pattern for browser-based code execution
3. **Industry Standards:** Major platforms use similar approaches with important security considerations

---

## Problem Analysis

### Issue 1: Components Not Found (404 Errors)

**Root Cause:** Missing database records, not Prisma enum bugs.

**Evidence from Testing:**
```bash
All ComponentSources in DB:
  - PRICING_TABLE : Pricing Table (Mock)
  - HERO : Hero Block

Test - findUnique VALUE_PROP: ❌ NOT FOUND
```

**What's Happening:**
- HERO and PRICING_TABLE work because they exist in your database
- VALUE_PROP, PLATFORM_FEATURES, etc. return 404 because they haven't been seeded yet
- Prisma `findUnique()` correctly returns `null` when records don't exist

**Solution:** Seed missing components into the `ComponentSource` table.

### Issue 2: Prisma Enum Queries

**Research Finding:** There IS a known Prisma 5.0 bug with enum fields.

According to [GitHub Issue #20227](https://github.com/prisma/prisma/issues/20227), `findUnique` on models with `@unique` enum fields can return null even when records exist. However, **this is NOT your issue** because:

1. Your `blockType` field is `@unique` but also the primary lookup field
2. Your test shows `findUnique` works correctly for HERO and PRICING_TABLE
3. The 404s are from genuinely missing records, not Prisma bugs

**Workaround (if needed):**
```typescript
// Instead of findUnique
const component = await prisma.componentSource.findFirst({
  where: { blockType: blockType }
});
```

Reference: [Prisma findUnique enum issue discussion](https://stackoverflow.com/questions/72762497/query-enum-type-on-prisma)

---

## Current Implementation Analysis

### Your Architecture

```
┌─────────────────────────────────────────────────────────┐
│ 1. PostgreSQL Database (via Prisma)                    │
│    - ComponentSource table                              │
│    - Stores TypeScript/JSX source code                  │
│    - Stores compiled CommonJS code                      │
└────────────────┬────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Sucrase Compiler (Server-side)                      │
│    - Transforms TypeScript → CommonJS JavaScript       │
│    - Converts JSX → React.createElement()              │
│    - Fast compilation without type checking            │
└────────────────┬────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Next.js API Route                                   │
│    - GET /api/components/load/[blockType]              │
│    - Serves compiled code as JSON response             │
│    - In-memory caching (5 min TTL)                     │
└────────────────┬────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Client-side Loader (browser)                        │
│    - Fetches compiled code via fetch()                 │
│    - Executes with new Function()                      │
│    - Custom require() for dependencies                 │
└────────────────┬────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 5. React Rendering                                     │
│    - Component function returned from execution        │
│    - Rendered with props into DOM                      │
└─────────────────────────────────────────────────────────┘
```

### What Works Well

✅ **Compilation Strategy:** Sucrase is appropriate for this use case
- Designed for fast transpilation without type checking
- Supports JSX, TypeScript, and CommonJS transforms
- Used successfully in development tools

✅ **Storage Pattern:** Database storage is valid
- PostgreSQL Text fields handle large code strings well
- Version history through `ComponentVersion` table
- Separation between source and compiled code

✅ **API Architecture:** Next.js API routes with caching
- Server-side code execution is isolated
- Caching reduces database hits
- Clear error handling

### What Needs Attention

⚠️ **Security Concerns with `new Function()`**

Your current approach violates Content Security Policy (CSP) best practices:

From [MDN CSP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src):
> Creating a new function dynamically is treated the same as eval, and is blocked by CSP unless 'unsafe-eval' is specified.

**Impact:**
- Cannot use strict CSP headers
- Vulnerable to code injection if source code is compromised
- Many enterprise environments block `unsafe-eval`

⚠️ **CommonJS in Browser**

Your custom `require()` system works but has limitations:
- Manual module mapping maintenance
- No real isolation between components
- Difficult to debug module resolution issues

---

## Industry Solutions Research

### 1. CodeSandbox Sandpack

**Architecture:** [Sandpack Documentation](https://sandpack.codesandbox.io/docs/architecture/overview)

```
Sandpack React (UI)
    ↓
Sandpack Client (VM selection)
    ↓
Bundler (iframe isolation)
    ↓
Browser Execution
```

**Key Insights:**
- Uses **iframe isolation** for code execution
- Sandpack CDN serves npm modules in msgpack bundles
- Supports **Nodebox** for running Node.js in browsers
- All execution happens in browser sandbox, not remote VMs

**Database Support:**
From [Sandpack FAQ](https://sandpack.codesandbox.io/docs/resources/faq):
> Nodebox is currently unable to connect to external databases. However, serverless databases (Supabase, DynamoDB, Google Cloud Datastore) can be used since they rely on REST APIs.

**Relevant for Your Use Case:**
- They pre-bundle code before execution
- Use message passing between frames for security
- Support dynamic code loading from their own storage

### 2. StackBlitz WebContainers

**Architecture:** [WebContainers Introduction](https://blog.stackblitz.com/posts/introducing-webcontainers/)

```
WebContainer (WASM-based OS)
    ↓
Virtual File System (in-memory)
    ↓
Node.js Runtime (browser-native)
    ↓
Browser Security Sandbox
```

**Key Technologies:**
- **WebAssembly-based** micro-operating system
- **SharedArrayBuffers** for multi-threading
- Can run SQLite3 database in-browser
- Executes Node.js natively in the browser

From [WebContainers Core](https://github.com/stackblitz/webcontainer-core):
> All code execution happens inside the browser's security sandbox, not on remote VMs or local binaries.

**Relevant for Your Use Case:**
- Shows that in-browser Node.js execution is possible
- Uses WASM for better security isolation
- File system stored in memory (like your DB approach)

### 3. SystemJS + Webpack Module Federation

**Architecture:** [SystemJS GitHub](https://github.com/systemjs/systemjs)

SystemJS provides a browser-based module loader that:
- Works as a hookable, standards-based module loader
- Transpiles to `System.register` format for old browsers
- Supports dynamic imports at runtime

**Webpack Module Federation:** [Module Federation Docs](https://webpack.js.org/concepts/module-federation/)
> Multiple separate builds should form a single application, with these separate builds acting like containers that can expose and consume code among themselves.

**Key Insight:**
From [Module Federation Plugin](https://webpack.js.org/plugins/module-federation-plugin/):
> Module Federation will work with any type currently available, including AMD, UMD, CommonJS, SystemJS, window variable and so on.

**Relevant for Your Use Case:**
- Standardized way to load CommonJS modules in browsers
- Better than custom `require()` implementation
- Used in micro-frontend architectures

### 4. Security: vm2 vs isolated-vm

**Critical Finding:** [vm2 Security Advisory](https://github.com/n8n-io/vm2)
> The vm2 library contains critical security issues and should not be used for production. Maintenance has been discontinued.

**Browser Context:**
- vm2 and isolated-vm are **Node.js only** solutions
- Cannot be used in browser environments
- Browser equivalent is iframe sandboxing

From [Semgrep Blog](https://semgrep.dev/blog/2023/discontinuation-of-node-vm2/):
> In the past year, there were 8 total GitHub security advisories tied to vm2, with 7 happening within a 4-month timeframe.

**Recommended Alternatives:**
- **Server-side:** isolated-vm (native v8 isolates)
- **Browser-side:** iframe sandboxing or Web Workers

---

## Best Practices for Your Use Case

### 1. Compilation Best Practices

**Sucrase Configuration:** [Sucrase NPM](https://www.npmjs.com/package/sucrase)

Your current setup:
```typescript
transform(sourceCode, {
  transforms: ['typescript', 'jsx', 'imports'],
  production: false,
  jsxRuntime: 'automatic',
  jsxPragma: 'React.createElement',
  jsxFragmentPragma: 'React.Fragment',
});
```

**Recommendations:**
✅ Keep `jsxRuntime: 'automatic'` for modern React
✅ Use `production: false` for development (easier debugging)
✅ Consider `production: true` for saved components (smaller size)

**Warning from [Sucrase InfoQ](https://www.infoq.com/news/2019/06/sucrase-fast-babel-modern-js/):**
> You should think carefully before using Sucrase in production, as it's mostly beneficial in development.

**For Your Case:** Since you're pre-compiling and storing, Sucrase is fine. The compiled code is production-safe CommonJS.

### 2. Execution Best Practices

**Current Method (new Function):**
```typescript
const factory = new Function(...Object.keys(context), wrappedCode);
const component = factory(...Object.values(context));
```

**Pros:**
- Simple implementation
- Works with your existing architecture
- Fast execution

**Cons:**
- Blocked by CSP `unsafe-eval`
- No true isolation
- Security risk if code is compromised

**Better Alternatives:**

#### Option A: Component Registry Pattern (Recommended)

From [Stack Overflow](https://stackoverflow.com/questions/42651398/dynamic-rendering-of-react-components-without-using-evil-eval):
> JSX type can be a capitalized variable - assign the component from an object to a capitalized variable and render it.

```typescript
// Pre-compile ALL components at build time or server startup
const COMPONENT_REGISTRY = {
  HERO: HeroBlock,
  PRICING_TABLE: PricingTableBlock,
  VALUE_PROP: ValuePropBlock,
  // ... etc
};

// Client-side rendering (CSP-safe)
function DynamicBlockRenderer({ blockType, props }) {
  const Component = COMPONENT_REGISTRY[blockType];
  return <Component {...props} />;
}
```

**Pros:**
✅ CSP-safe (no eval/Function)
✅ Type-safe with TypeScript
✅ Easy to debug
✅ No runtime compilation needed

**Cons:**
❌ Requires build-time compilation
❌ Cannot update components without redeploying

#### Option B: Iframe Sandboxing (Most Secure)

```typescript
// Load component in isolated iframe
const iframe = document.createElement('iframe');
iframe.sandbox = 'allow-scripts'; // Restricted permissions

// Post compiled code to iframe
iframe.contentWindow.postMessage({
  type: 'LOAD_COMPONENT',
  code: compiledCode,
  props: componentProps
}, '*');

// Receive rendered output
window.addEventListener('message', (event) => {
  if (event.data.type === 'COMPONENT_RENDERED') {
    // Inject HTML or handle result
  }
});
```

**Pros:**
✅ True isolation (separate execution context)
✅ CSP-friendly
✅ Cannot access parent window

**Cons:**
❌ Complex message passing
❌ Overhead of iframe creation
❌ Styling challenges (CSS isolation)

#### Option C: Web Workers (Hybrid Approach)

```typescript
// Create worker for code execution
const worker = new Worker('/component-executor.js');

worker.postMessage({
  code: compiledCode,
  props: componentProps
});

worker.onmessage = (e) => {
  const renderedHTML = e.data.html;
  // Server-side rendering in worker
};
```

**Pros:**
✅ Isolated execution context
✅ Can do React server rendering
✅ No blocking of main thread

**Cons:**
❌ Limited browser APIs in workers
❌ Cannot access DOM directly
❌ More complex architecture

### 3. Module System Best Practices

**Your Current Implementation:**
```typescript
const mockRequire = (moduleName: string) => {
  const moduleMap = {
    'react': React,
    'lucide-react': {},
    // ...
  };
  return moduleMap[moduleName] || {};
};
```

**Better Alternative: SystemJS**

From [SystemJS NPM](https://www.npmjs.com/package/systemjs):
```typescript
// Instead of custom require, use SystemJS
import { System } from 'systemjs';

// Register your compiled CommonJS modules
System.register('my-component', [], function(exports) {
  const React = System.import('react');
  // ... module code
  exports({ default: Component });
});

// Import and use
const Component = await System.import('my-component');
```

**Pros:**
✅ Standard module loader
✅ Better error messages
✅ Handles circular dependencies
✅ Used in production systems

**Integration with Module Federation:**
From [single-spa docs](https://single-spa.js.org/docs/recommended-setup/):
> The single-spa core team recommends using SystemJS + import maps as a module loader for microfrontends.

### 4. Database Storage Best Practices

**Your Current Schema:**
```prisma
model ComponentSource {
  blockType       BlockType @unique
  sourceCode      String    @db.Text  // TypeScript/JSX
  compiledCode    String    @db.Text  // CommonJS JS
  schema          Json                 // Props schema
  version         Int
}
```

**Recommendations:**

✅ **Keep source + compiled separation** - Good for debugging and re-compilation

✅ **Add compression for large components:**
```typescript
import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

// Before saving
const compressed = await gzipAsync(Buffer.from(compiledCode));
await prisma.componentSource.update({
  data: { compiledCode: compressed.toString('base64') }
});

// When loading
const buffer = Buffer.from(storedCode, 'base64');
const decompressed = await gunzipAsync(buffer);
const code = decompressed.toString('utf-8');
```

✅ **Consider separate CDN storage for production:**
```typescript
// Store compiled code in CDN instead of DB
model ComponentSource {
  compiledCodeUrl String?  // https://cdn.example.com/components/hero-v1.js
  compiledCodeHash String? // SHA-256 for integrity
}
```

**Benefits:**
- Reduced database size
- Faster delivery via CDN
- Can use standard module loading

---

## Recommendations for Your System

### Immediate Actions

1. **Fix the 404 Issue:**
   ```typescript
   // Seed missing components
   npx tsx scripts/seed-all-components.ts
   ```

2. **Add Better Error Messages:**
   ```typescript
   // In API route
   if (!componentSource) {
     const available = await prisma.componentSource.findMany({
       select: { blockType: true }
     });
     return NextResponse.json({
       error: `Component '${blockType}' not found`,
       available: available.map(c => c.blockType),
       hint: 'Run seed script to create missing components'
     }, { status: 404 });
   }
   ```

3. **Document CSP Limitations:**
   ```typescript
   // Add to your docs
   /**
    * SECURITY NOTE: This system requires 'unsafe-eval' in CSP headers
    * due to dynamic component execution with new Function().
    *
    * For production with strict CSP, consider:
    * - Pre-compiling components at build time
    * - Using iframe sandboxing
    * - Implementing SystemJS module loader
    */
   ```

### Short-term Improvements

1. **Switch to SystemJS for Module Loading:**
   - Replace custom `require()` with SystemJS
   - Better error handling and debugging
   - Standard module resolution

2. **Add Component Validation:**
   ```typescript
   // Before execution, validate compiled code structure
   function validateCompiledCode(code: string): ValidationResult {
     // Check for exports.ComponentName pattern
     // Verify no dangerous patterns (eval, Function constructor)
     // Ensure React is available
   }
   ```

3. **Implement Better Caching:**
   ```typescript
   // Use Service Worker for persistent client-side cache
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.register('/component-cache-sw.js');
   }
   ```

### Long-term Architecture Considerations

1. **Server-Side Rendering Service (Already Implemented ✅)**
   - Your Phase 4 implementation is excellent
   - Pre-render components to HTML
   - Cache in database for fast delivery
   - Good for SEO and performance

2. **Hybrid Approach:**
   ```
   ┌─────────────────────────────────────────┐
   │ Static Components (build-time compiled)│
   │ - Loaded as regular imports            │
   │ - CSP-safe, type-safe                  │
   └─────────────────────────────────────────┘
                     +
   ┌─────────────────────────────────────────┐
   │ Dynamic Components (database-stored)   │
   │ - Server-side rendered to HTML         │
   │ - Cached and served as strings         │
   │ - Used for customization only          │
   └─────────────────────────────────────────┘
   ```

3. **Consider Vercel Edge Functions:**
   - Compile components at the edge
   - Closer to users globally
   - Built-in caching and security

---

## Code Examples and Patterns

### Pattern 1: CSP-Safe Dynamic Component Loading

```typescript
// components/DynamicComponent.tsx
import React from 'react';
import { ComponentRegistry } from '@/lib/component-registry';

interface DynamicComponentProps {
  blockType: string;
  content: any;
  brand: string;
}

export function DynamicComponent({ blockType, content, brand }: DynamicComponentProps) {
  // Get pre-compiled component from registry
  const Component = ComponentRegistry[blockType];

  if (!Component) {
    return <ComponentNotFound blockType={blockType} />;
  }

  return <Component content={content} brand={brand} />;
}

// lib/component-registry.ts
export const ComponentRegistry = {
  HERO: dynamic(() => import('@/components/blocks/HeroBlock')),
  PRICING_TABLE: dynamic(() => import('@/components/blocks/PricingTableBlock')),
  VALUE_PROP: dynamic(() => import('@/components/blocks/ValuePropBlock')),
  // ... all other components
} as const;
```

**When to use:** Production environments with strict CSP

### Pattern 2: Server-Side Compilation Service

```typescript
// app/api/components/compile/route.ts
import { compileTypeScript } from '@/lib/compiler';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const { blockType, sourceCode } = await request.json();

  // Compile on server
  const result = compileTypeScript(sourceCode, {
    jsx: true,
    typescript: true,
    production: true
  });

  if (!result.success) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  // Save to database
  await prisma.componentSource.upsert({
    where: { blockType },
    update: {
      sourceCode,
      compiledCode: result.compiledCode,
      lastCompiledAt: new Date()
    },
    create: {
      blockType,
      name: `${blockType} Component`,
      sourceCode,
      compiledCode: result.compiledCode,
      schema: {},
      version: 1
    }
  });

  return Response.json({ success: true });
}
```

**When to use:** Admin interface for updating components

### Pattern 3: Iframe Sandboxing for Security

```typescript
// lib/secure-component-loader.ts
export class SecureComponentLoader {
  private iframe: HTMLIFrameElement;

  constructor() {
    this.iframe = document.createElement('iframe');
    this.iframe.sandbox.add('allow-scripts');
    this.iframe.style.display = 'none';
    document.body.appendChild(this.iframe);

    // Listen for rendered output
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  async loadComponent(blockType: string, props: any): Promise<string> {
    const response = await fetch(`/api/components/load/${blockType}`);
    const { code } = await response.json();

    return new Promise((resolve, reject) => {
      const messageId = Math.random().toString(36);

      this.iframe.contentWindow?.postMessage({
        type: 'EXECUTE_COMPONENT',
        messageId,
        code,
        props
      }, '*');

      const timeout = setTimeout(() => {
        reject(new Error('Component execution timeout'));
      }, 5000);

      this.pendingMessages.set(messageId, { resolve, reject, timeout });
    });
  }

  private handleMessage(event: MessageEvent) {
    if (event.data.type === 'COMPONENT_RESULT') {
      const pending = this.pendingMessages.get(event.data.messageId);
      if (pending) {
        clearTimeout(pending.timeout);
        pending.resolve(event.data.html);
        this.pendingMessages.delete(event.data.messageId);
      }
    }
  }
}
```

**When to use:** Maximum security requirements, untrusted code

---

## Testing Recommendations

### Test Coverage Needed

1. **Component Compilation Tests:**
   ```typescript
   describe('Component Compilation', () => {
     it('should compile TypeScript to CommonJS', () => {
       const source = `export const Test = () => <div>Test</div>`;
       const result = compileTypeScript(source);
       expect(result.success).toBe(true);
       expect(result.compiledCode).toContain('exports.Test');
     });

     it('should handle React hooks', () => {
       const source = `
         export const Test = () => {
           const [state, setState] = useState(0);
           return <div>{state}</div>;
         }
       `;
       const result = compileTypeScript(source);
       expect(result.success).toBe(true);
     });
   });
   ```

2. **Runtime Execution Tests:**
   ```typescript
   describe('Component Execution', () => {
     it('should execute compiled code safely', async () => {
       const component = await loadComponent('HERO', null);
       expect(typeof component).toBe('function');

       const result = component({ content: { title: 'Test' } });
       expect(result).toBeDefined();
     });

     it('should handle missing dependencies gracefully', async () => {
       // Test component that requires 'lucide-react'
       const component = await loadComponent('ICON_COMPONENT', null);
       expect(() => component({})).not.toThrow();
     });
   });
   ```

3. **Database Integration Tests:**
   ```typescript
   describe('Component Storage', () => {
     it('should retrieve HERO component', async () => {
       const component = await prisma.componentSource.findUnique({
         where: { blockType: 'HERO' }
       });
       expect(component).toBeDefined();
       expect(component?.compiledCode).toBeTruthy();
     });

     it('should return 404 for missing components', async () => {
       const response = await fetch('/api/components/load/NONEXISTENT');
       expect(response.status).toBe(404);
     });
   });
   ```

---

## Security Checklist

- [ ] **CSP Headers Configured**
  ```typescript
  // next.config.js
  headers: async () => [{
    source: '/:path*',
    headers: [{
      key: 'Content-Security-Policy',
      value: "script-src 'self' 'unsafe-eval';" // Required for new Function()
    }]
  }]
  ```

- [ ] **Input Validation**
  ```typescript
  // Validate source code before compilation
  function validateSourceCode(code: string): ValidationResult {
    // Check for dangerous patterns
    const dangerousPatterns = [
      /eval\(/,
      /Function\(/,
      /import\s+{.*}\s+from\s+['"](?!(@\/|react|lucide))/,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        return { valid: false, error: 'Dangerous pattern detected' };
      }
    }

    return { valid: true };
  }
  ```

- [ ] **Access Control**
  ```typescript
  // Only SUPER_ADMIN can update component source
  if (session.user?.role !== 'SUPER_ADMIN') {
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }
  ```

- [ ] **Rate Limiting**
  ```typescript
  // Prevent abuse of compilation API
  import { Ratelimit } from '@upstash/ratelimit';

  const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
  });
  ```

- [ ] **Audit Logging**
  ```typescript
  // Log all component updates
  await prisma.auditLog.create({
    data: {
      action: 'COMPONENT_UPDATE',
      blockType,
      userId: session.user.id,
      changes: { sourceCode, compiledCode },
      timestamp: new Date()
    }
  });
  ```

---

## Performance Optimization

### 1. Caching Strategy

**Multi-layer Caching:**
```typescript
// Layer 1: Browser Cache (Service Worker)
// Layer 2: API Route Memory Cache (5 min TTL)
// Layer 3: Database Cache (compiled code)
// Layer 4: CDN Cache (for production)

// Implement cache invalidation
export async function invalidateComponentCache(blockType: string) {
  // Clear API cache
  await fetch(`/api/components/load/${blockType}`, { method: 'DELETE' });

  // Clear service worker cache
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.active?.postMessage({
      type: 'CLEAR_COMPONENT_CACHE',
      blockType
    });
  }
}
```

### 2. Code Splitting

```typescript
// Load components on-demand
export function useBlockComponent(blockType: string) {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadComponent(blockType)
      .then(setComponent)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [blockType]);

  return { Component, loading, error };
}
```

### 3. Preloading Strategy

```typescript
// Preload components that are likely to be used
export function PreloadComponents({ blockTypes }: { blockTypes: string[] }) {
  useEffect(() => {
    // Preload in background after initial render
    setTimeout(() => {
      preloadComponents(blockTypes);
    }, 1000);
  }, [blockTypes]);

  return null;
}
```

---

## Migration Path

If you decide to move away from `new Function()` to a more secure approach:

### Phase 1: Parallel System (Recommended First)
```typescript
// Keep existing dynamic system
// Add static component registry alongside it
const Component = blockType in ComponentRegistry
  ? ComponentRegistry[blockType]  // Static (CSP-safe)
  : await loadComponent(blockType); // Dynamic (current system)
```

### Phase 2: Gradual Migration
```typescript
// Mark components as "stable" when ready
model ComponentSource {
  isStable Boolean @default(false)
  // Stable components get compiled into app at build time
}
```

### Phase 3: Full Transition
```typescript
// All stable components use registry
// Only customized proposal components use dynamic loading
// Or: All components server-side rendered to HTML
```

---

## Conclusion

### Your Current Setup Assessment

**Strengths:**
- ✅ Well-architected database schema
- ✅ Clean separation of concerns
- ✅ Effective caching strategy
- ✅ Comprehensive version history
- ✅ Server-side rendering capability (Phase 4)

**Areas for Improvement:**
- ⚠️ CSP compatibility (requires 'unsafe-eval')
- ⚠️ Custom module system (consider SystemJS)
- ⚠️ Missing components in database (seed scripts needed)
- ⚠️ Error messages could be more helpful

### Recommended Next Steps

**Immediate (This Week):**
1. Create seed scripts for all BlockType enum values
2. Add better error messages with available components list
3. Test all component types in database

**Short-term (This Month):**
1. Evaluate SystemJS vs current custom require
2. Add comprehensive tests for compilation and execution
3. Implement component validation before execution
4. Document CSP requirements clearly

**Long-term (Next Quarter):**
1. Consider hybrid approach (static + dynamic)
2. Evaluate iframe sandboxing for untrusted code
3. Optimize with CDN storage for compiled components
4. Implement monitoring and performance tracking

### Final Verdict

Your architecture is **fundamentally sound** and follows similar patterns to industry leaders like CodeSandbox and StackBlitz. The main issues are:

1. **Missing data** (not Prisma bugs) → Seed scripts
2. **Security trade-offs** (CSP) → Document and accept, or migrate to alternatives
3. **Module system** → Consider SystemJS for better standard compliance

You're on the right track! 🚀

---

## References

### Primary Sources

1. [Prisma findUnique enum issue](https://github.com/prisma/prisma/issues/20227) - Known Prisma 5.0 bug
2. [MDN CSP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) - Security restrictions
3. [Sandpack Architecture](https://sandpack.codesandbox.io/docs/architecture/overview) - CodeSandbox approach
4. [WebContainers Introduction](https://blog.stackblitz.com/posts/introducing-webcontainers/) - StackBlitz architecture
5. [SystemJS GitHub](https://github.com/systemjs/systemjs) - Module loader standard
6. [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/) - Runtime module loading
7. [Sucrase NPM](https://www.npmjs.com/package/sucrase) - Fast TypeScript compiler
8. [vm2 Security Advisory](https://github.com/n8n-io/vm2) - Sandbox security issues
9. [Stack Overflow: Dynamic React Components](https://stackoverflow.com/questions/42651398/dynamic-rendering-of-react-components-without-using-evil-eval) - CSP-safe patterns

### Additional Reading

- [Content Security Policy Guide](https://content-security-policy.com/unsafe-inline/)
- [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [Module Federation with SystemJS Example](https://github.com/FlorianRappl/module-federation-with-systemjs-importmap)
- [Sucrase InfoQ Article](https://www.infoq.com/news/2019/06/sucrase-fast-babel-modern-js/)

---

**Document Version:** 1.0
**Last Updated:** 2025-11-26
**Author:** Research conducted for proposal-builder dynamic code execution system
