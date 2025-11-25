'use client';

/**
 * Skeleton loader for dynamic components
 *
 * Displays animated loading state while component is being fetched
 */

interface ComponentSkeletonProps {
  blockType: string;
  height?: string;
}

export function ComponentSkeleton({
  blockType,
  height = 'min-h-[400px]',
}: ComponentSkeletonProps) {
  return (
    <div
      className={`bg-gray-100 rounded-lg ${height} p-8 animate-pulse`}
      role="status"
      aria-label={`Loading ${blockType} component`}
    >
      <div className="flex flex-col gap-4">
        {/* Header skeleton */}
        <div className="space-y-3">
          <div className="h-8 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-2 mt-6">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>

        {/* Additional elements */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="h-32 bg-gray-300 rounded"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Loading text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Loading <span className="font-semibold">{blockType}</span>...
        </p>
      </div>

      {/* Accessibility */}
      <span className="sr-only">Loading component</span>
    </div>
  );
}

/**
 * Simple skeleton for smaller components
 */
export function SimpleComponentSkeleton({ blockType }: { blockType: string }) {
  return (
    <div
      className="bg-gray-100 rounded-lg min-h-[200px] p-6 animate-pulse flex items-center justify-center"
      role="status"
      aria-label={`Loading ${blockType} component`}
    >
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-gray-500">
          Loading <span className="font-semibold">{blockType}</span>
        </p>
      </div>
    </div>
  );
}
