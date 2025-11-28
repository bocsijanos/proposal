/**
 * Admin button component for triggering server-side rendering
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface RenderButtonProps {
  proposalId: string;
  proposalSlug?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function RenderButton({
  proposalId,
  proposalSlug,
  variant = 'outline',
  size = 'sm',
  className = '',
}: RenderButtonProps) {
  const [isRendering, setIsRendering] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleRender = async () => {
    setIsRendering(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch(`/api/proposals/${proposalId}/render`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(
          `Rendered ${data.stats.successCount}/${data.stats.totalBlocks} blocks in ${data.stats.totalTime}ms`
        );

        // Auto-clear success message after 3 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to render proposal');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsRendering(false);
    }
  };

  const getButtonText = () => {
    if (isRendering) return 'Rendering...';
    if (status === 'success') return 'Rendered!';
    if (status === 'error') return 'Failed';
    return 'Render to HTML';
  };

  const getButtonVariant = () => {
    if (status === 'success') return 'default';
    if (status === 'error') return 'destructive';
    return variant;
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleRender}
        disabled={isRendering}
        variant={getButtonVariant() as any}
        size={size}
        className={className}
      >
        {isRendering && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {getButtonText()}
      </Button>

      {message && (
        <p
          className={`text-xs ${
            status === 'success'
              ? 'text-green-600'
              : status === 'error'
              ? 'text-red-600'
              : 'text-gray-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
