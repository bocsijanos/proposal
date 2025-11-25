# Dynamic Component Loader - Quick Reference

## Import

```typescript
import {
  loadComponent,
  preloadComponents,
  clearCache,
  getCacheStats,
  configureLoader,
  useLoadComponent,
  usePreloadComponents,
} from '@/lib/dynamic-loader';
```

## Basic Usage

### Load Single Component
```typescript
const component = await loadComponent('HERO');
```

### Preload Multiple Components
```typescript
await preloadComponents(['HERO', 'CTA', 'PRICING_TABLE']);
```

### Configure Loader
```typescript
configureLoader({
  cacheTTL: 10 * 60 * 1000, // 10 minutes
  retryAttempts: 3,
});
```

## React Hooks

### useLoadComponent
```typescript
const { state, component, error, retry } = useLoadComponent('HERO');

// state: 'idle' | 'loading' | 'success' | 'error'
// component: BlockComponent | null
// error: ComponentLoadError | null
// retry: () => void
```

### usePreloadComponents
```typescript
const { loaded, failed, loading } = usePreloadComponents([
  'HERO',
  'CTA',
]);

// loaded: string[] - Successfully loaded types
// failed: string[] - Failed to load types
// loading: boolean
```

## Cache Management

### View Cache Stats
```typescript
const stats = getCacheStats();
console.log(stats);
// { size: 5, entries: ['HERO', 'CTA', ...] }
```

### Clear Cache
```typescript
clearCache();
```

## API Endpoints

### Load Component
```bash
GET /api/components/load/HERO
```

Response:
```json
{
  "success": true,
  "code": "function HeroBlock() { ... }",
  "blockType": "HERO",
  "cached": false,
  "timestamp": 1234567890
}
```

### Invalidate Cache
```bash
DELETE /api/components/load/HERO    # Specific type
DELETE /api/components/load/all     # All types
```

## Configuration Options

```typescript
{
  cacheEnabled: boolean;      // Enable/disable caching
  cacheTTL: number;          // Time to live in ms
  retryAttempts: number;     // Max retry attempts
  retryDelay: number;        // Delay between retries
  timeout: number;           // Request timeout
}
```

## Loading States

1. **idle**: Initial state
2. **loading**: Fetching component
3. **success**: Component ready
4. **error**: Loading failed

## Error Handling

### Component Error Boundary
```typescript
<ComponentErrorBoundary blockType="HERO">
  <HeroBlock {...props} />
</ComponentErrorBoundary>
```

### Custom Error Handler
```typescript
<ComponentErrorBoundary
  blockType="HERO"
  fallback={<CustomError />}
  onError={(error, info) => {
    console.error(error, info);
  }}
>
  <HeroBlock {...props} />
</ComponentErrorBoundary>
```

## Common Patterns

### Preload on Page Load
```typescript
useEffect(() => {
  preloadComponents(['HERO', 'CTA', 'PRICING_TABLE']);
}, []);
```

### Conditional Loading
```typescript
const { component } = useLoadComponent(
  shouldLoad ? 'HERO' : ''
);
```

### Retry on Error
```typescript
const { error, retry } = useLoadComponent('HERO');

if (error) {
  return <button onClick={retry}>Retry</button>;
}
```

## Debugging

### Enable Debug Logging
```javascript
// Browser console
localStorage.setItem('DEBUG_DYNAMIC_LOADER', 'true');
```

### View Cache in DevTools
```typescript
window.__dynamicLoaderCache = getCacheStats();
```

## Performance Tips

1. **Preload Critical Components**: Load above-the-fold blocks early
2. **Optimize Cache TTL**: Longer in production, shorter in development
3. **Use Hooks**: Leverage `usePreloadComponents` for automatic management
4. **Monitor Cache**: Regularly check `getCacheStats()` for optimization

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Components not loading | Check console, verify API endpoint |
| Slow loading | Increase cache TTL, preload components |
| Stale cache | Clear cache or invalidate specific types |
| Runtime errors | Check ErrorBoundary logs, test in isolation |

## File Locations

```
lib/dynamic-loader/
├── client.ts        # Core loader
├── cache.ts         # Cache layer
├── hooks.ts         # React hooks
├── config.ts        # Environment config
└── types.ts         # TypeScript types

app/api/components/load/[blockType]/
└── route.ts         # API endpoint

components/builder/
├── BlockRenderer.tsx             # Main renderer
├── ComponentErrorBoundary.tsx    # Error boundary
└── ComponentSkeleton.tsx         # Loading skeleton
```

## Environment Variables (Optional)

```env
DYNAMIC_LOADER_CACHE_TTL=1800000
DYNAMIC_LOADER_RETRY_ATTEMPTS=3
DYNAMIC_LOADER_TIMEOUT=10000
```
