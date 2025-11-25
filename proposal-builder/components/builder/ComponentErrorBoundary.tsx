'use client';

/**
 * Error Boundary for dynamic components
 *
 * Catches errors during rendering and displays a fallback UI
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  blockType: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ComponentErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary] Component error:', {
        blockType: this.props.blockType,
        error,
        errorInfo,
      });
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="border-2 border-red-300 bg-red-50 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Component Error
              </h3>
              <p className="text-sm text-red-700 mb-3">
                Failed to render block type: <strong>{this.props.blockType}</strong>
              </p>

              {this.state.error && (
                <div className="bg-white rounded border border-red-200 p-3 mb-3">
                  <p className="text-xs font-mono text-red-800 break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              {process.env.NODE_ENV === 'development' &&
                this.state.errorInfo && (
                  <details className="text-xs text-red-600 mt-2">
                    <summary className="cursor-pointer hover:text-red-800 font-semibold mb-2">
                      Stack trace
                    </summary>
                    <pre className="bg-white rounded border border-red-200 p-3 overflow-auto max-h-48 text-[10px] leading-relaxed">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}

              <button
                onClick={this.handleReset}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Functional wrapper for easier usage
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  blockType: string
): React.ComponentType<P> {
  return function WithErrorBoundary(props: P) {
    return (
      <ComponentErrorBoundary blockType={blockType}>
        <Component {...props} />
      </ComponentErrorBoundary>
    );
  };
}
