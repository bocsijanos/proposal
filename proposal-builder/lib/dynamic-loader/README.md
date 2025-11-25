# Dynamic Component Loader

A robust system for dynamically loading React components from the API with caching, error handling, and loading states.

## Features

- **Dynamic Loading**: Components are fetched from API on-demand
- **Client-Side Caching**: Automatic caching with TTL (Time To Live)
- **Error Handling**: Comprehensive error boundaries and retry logic
- **Loading States**: Smooth skeleton loaders during component fetch
- **Type Safety**: Full TypeScript support
- **Performance**: Optimized with automatic cache cleanup

## Architecture

```
┌─────────────────┐
│  BlockRenderer  │
│   (Component)   │
└────────┬────────┘
         │
         ↓
┌─────────────────────┐
│   loadComponent()   │
│  (Dynamic Loader)   │
└────────┬────────────┘
         │
    ┌────┴─────┐
    │          │
    ↓          ↓
┌────────┐  ┌──────────────────┐
│ Cache  │  │  API Endpoint    │
│        │  │  /api/components │
└────────┘  │  /load/[type]    │
            └──────────────────┘
```

## Usage

### Basic Usage in BlockRenderer

```tsx
import { loadComponent } from '@/lib/dynamic-loader';

const component = await loadComponent('HERO');
```

### Configuration

```tsx
import { configureLoader } from '@/lib/dynamic-loader';

configureLoader({
  cacheEnabled: true,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: 10000,
});
```

### Preloading Components

```tsx
import { preloadComponents } from '@/lib/dynamic-loader';

// Preload multiple components
await preloadComponents(['HERO', 'PRICING_TABLE', 'CTA']);
```

### Cache Management

```tsx
import { clearCache, getCacheStats } from '@/lib/dynamic-loader';

// Clear all cached components
clearCache();

// Get cache statistics
const stats = getCacheStats();
console.log(stats); // { size: 5, entries: ['HERO', 'CTA', ...] }
```

## Component States

### 1. Loading State
- Displays animated skeleton loader
- Shown while component code is being fetched

### 2. Success State
- Component successfully loaded and rendered
- Wrapped in ErrorBoundary for runtime safety

### 3. Error State
- Red border with error message
- Retry button for re-attempting load
- Detailed error info in development mode

## API Endpoint

### GET `/api/components/load/[blockType]`

Fetches compiled component code for a specific block type.

**Response:**
```json
{
  "success": true,
  "code": "function HeroBlock() { ... }",
  "blockType": "HERO",
  "cached": false,
  "timestamp": 1234567890
}
```

### DELETE `/api/components/load/[blockType]`

Clears cache entry for a specific block type or all blocks.

**Example:**
```bash
# Clear specific block
DELETE /api/components/load/HERO

# Clear all blocks
DELETE /api/components/load/all
```

## Type Definitions

### BlockComponentProps

```typescript
interface BlockComponentProps {
  content: Record<string, any>;
  brand: 'BOOM' | 'AIBOOST';
  proposalData?: {
    clientName: string;
    createdByName?: string | null;
  };
}
```

### ComponentLoadError

```typescript
interface ComponentLoadError {
  message: string;
  blockType: string;
  timestamp: number;
  details?: any;
}
```

## Error Handling

### Component-Level Errors

Each dynamic component is wrapped in an ErrorBoundary:

```tsx
<ComponentErrorBoundary blockType={blockType}>
  <DynamicComponent {...props} />
</ComponentErrorBoundary>
```

### Network Errors

Automatic retry with exponential backoff:
- Default: 3 attempts
- Delay between retries: 1 second
- Timeout: 10 seconds

## Performance

### Caching Strategy

- **Client-Side**: In-memory Map cache with TTL
- **Server-Side**: API endpoint caches transformed code
- **Automatic Cleanup**: Expired entries are removed periodically

### Cache TTL

- Default: 5 minutes
- Configurable per environment
- Production: Consider longer TTL (15-30 minutes)
- Development: Shorter TTL (1-5 minutes)

## Security

### Code Execution

Components are executed in a controlled context:

```typescript
const context = {
  React,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
};
```

### Sandboxing

- No access to global window objects
- No dynamic imports allowed
- No eval() or Function() in component code

## Development

### Adding New Block Types

1. Create component in `/components/blocks/`
2. Add to `COMPONENT_PATHS` in API route:

```typescript
const COMPONENT_PATHS: Record<string, string> = {
  MY_NEW_BLOCK: 'components/blocks/MyNewBlock.tsx',
  // ...
};
```

3. Component will be automatically available

### Debugging

Enable verbose logging:

```typescript
// In browser console
localStorage.setItem('DEBUG_DYNAMIC_LOADER', 'true');
```

### Testing

```bash
# Test component loading
npm run test:dynamic-loader

# Test API endpoint
curl http://localhost:3000/api/components/load/HERO
```

## Troubleshooting

### Component Not Loading

1. Check browser console for errors
2. Verify block type exists in `COMPONENT_PATHS`
3. Check API endpoint response
4. Clear cache: `clearCache()`

### Slow Loading

1. Increase cache TTL
2. Preload components on route load
3. Optimize component code size

### Runtime Errors

1. Check ErrorBoundary logs
2. Verify component props interface
3. Test component in isolation

## Best Practices

1. **Preload Critical Components**: Load above-the-fold components early
2. **Handle Loading States**: Always show skeleton loaders
3. **Implement Error Boundaries**: Wrap all dynamic components
4. **Monitor Cache Size**: Use `getCacheStats()` for monitoring
5. **Configure TTL**: Adjust based on component update frequency

## Future Enhancements

- [ ] WebWorker-based code transformation
- [ ] Progressive component streaming
- [ ] Hot module replacement in development
- [ ] Service Worker caching for offline support
- [ ] Component versioning system
- [ ] A/B testing support
- [ ] Performance metrics collection
