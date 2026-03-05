/**
 * ============================================================================
 * ANDROID OPTIMIZED LOADER COMPONENT
 * ============================================================================
 *
 * This component provides optimized loading states specifically designed
 * for Android devices to ensure smooth rendering and performance.
 *
 * Key Features:
 * - Hardware acceleration optimized animations
 * - Reduced memory footprint
 * - Smooth 60fps animations
 * - Touch-friendly loading indicators
 * - Reduced layout shifts
 *
 * @author Jackson Rewards Team
 * @version 1.0.0
 * @since 2024
 */

import React, { memo } from "react";

// ============================================================================
// LOADING SKELETON COMPONENT
// ============================================================================
export const LoadingSkeleton = memo(({ count = 3, className = "" }) => {
    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            {[...Array(count)].map((_, index) => (
                <div
                    key={index}
                    className="flex w-full items-center justify-between pt-0 pb-4 px-0 border-b border-[#4d4d4d]"
                    style={{
                        // Hardware acceleration for smooth animations
                        transform: 'translateZ(0)',
                        willChange: 'opacity',
                    }}
                >
                    <div className="flex flex-1 items-center gap-2 relative">
                        <div className="flex flex-col items-start relative flex-1 grow space-y-2">
                            <div
                                className="h-4 bg-gray-700 rounded w-32 animate-pulse"
                                style={{
                                    animation: 'pulse 1.5s ease-in-out infinite',
                                    animationDelay: `${index * 0.1}s`,
                                }}
                            />
                            <div
                                className="h-4 bg-gray-700 rounded w-24 animate-pulse"
                                style={{
                                    animation: 'pulse 1.5s ease-in-out infinite',
                                    animationDelay: `${index * 0.1 + 0.2}s`,
                                }}
                            />
                            <div
                                className="h-3 bg-gray-700 rounded w-full max-w-[200px] animate-pulse"
                                style={{
                                    animation: 'pulse 1.5s ease-in-out infinite',
                                    animationDelay: `${index * 0.1 + 0.4}s`,
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <div
                            className="w-2 h-2 bg-gray-700 rounded animate-pulse"
                            style={{
                                animation: 'pulse 1.5s ease-in-out infinite',
                                animationDelay: `${index * 0.1 + 0.6}s`,
                            }}
                        />
                        <div
                            className="h-4 bg-gray-700 rounded w-16 animate-pulse"
                            style={{
                                animation: 'pulse 1.5s ease-in-out infinite',
                                animationDelay: `${index * 0.1 + 0.8}s`,
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
});

LoadingSkeleton.displayName = "LoadingSkeleton";

// ============================================================================
// SPINNER COMPONENT
// ============================================================================
export const OptimizedSpinner = memo(({ size = "md", className = "" }) => {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
    };

    return (
        <div
            className={`${sizeClasses[size]} ${className}`}
            style={{
                // Hardware acceleration
                transform: 'translateZ(0)',
                willChange: 'transform',
            }}
        >
            <div
                className="w-full h-full border-2 border-purple-500 border-t-transparent rounded-full animate-spin"
                style={{
                    animation: 'spin 1s linear infinite',
                    // Optimize for Android
                    backfaceVisibility: 'hidden',
                    perspective: '1000px',
                }}
            />
        </div>
    );
});

OptimizedSpinner.displayName = "OptimizedSpinner";

// ============================================================================
// LOADING OVERLAY
// ============================================================================
export const LoadingOverlay = memo(({
    isLoading,
    children,
    message = "Loading...",
    className = ""
}) => {
    if (!isLoading) return children;

    return (
        <div
            className={`relative ${className}`}
            style={{
                // Prevent layout shifts
                minHeight: '200px',
            }}
        >
            {children}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                style={{
                    // Hardware acceleration
                    transform: 'translateZ(0)',
                    willChange: 'opacity',
                }}
            >
                <div className="flex flex-col items-center gap-3 bg-black/80 rounded-lg p-6">
                    <OptimizedSpinner size="lg" />
                    <p className="text-white text-sm font-poppins">{message}</p>
                </div>
            </div>
        </div>
    );
});

LoadingOverlay.displayName = "LoadingOverlay";

// ============================================================================
// FILTERING INDICATOR
// ============================================================================
export const FilteringIndicator = memo(({ isFiltering, className = "" }) => {
    if (!isFiltering) return null;

    return (
        <div
            className={`flex items-center justify-center py-2 ${className}`}
            style={{
                // Smooth transitions
                transition: 'all 0.3s ease-in-out',
                transform: 'translateZ(0)',
            }}
        >
            <div className="flex items-center gap-2">
                <OptimizedSpinner size="sm" />
                <span className="text-purple-400 text-sm font-poppins">Filtering...</span>
            </div>
        </div>
    );
});

FilteringIndicator.displayName = "FilteringIndicator";

// ============================================================================
// ERROR RETRY BUTTON
// ============================================================================
export const ErrorRetryButton = memo(({
    error,
    onRetry,
    retryCount = 0,
    className = ""
}) => {
    if (!error) return null;

    return (
        <div
            className={`flex flex-col items-center justify-center py-8 space-y-4 ${className}`}
            style={{
                // Smooth animations
                transform: 'translateZ(0)',
                willChange: 'opacity',
            }}
        >
            <p className="text-red-400 text-center font-poppins text-sm px-4">
                {error}
            </p>
            <button
                onClick={onRetry}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-poppins font-medium"
                style={{
                    // Touch-friendly sizing for Android
                    minHeight: '44px',
                    minWidth: '120px',
                    // Hardware acceleration
                    transform: 'translateZ(0)',
                }}
            >
                Retry {retryCount > 0 && `(${retryCount})`}
            </button>
            {retryCount > 2 && (
                <p className="text-yellow-400 text-xs text-center font-poppins px-4">
                    If the problem persists, please contact support.
                </p>
            )}
        </div>
    );
});

ErrorRetryButton.displayName = "ErrorRetryButton";

// ============================================================================
// PAGINATION LOADER
// ============================================================================
export const PaginationLoader = memo(({ isLoading, className = "" }) => {
    if (!isLoading) return null;

    return (
        <div
            className={`flex items-center justify-center py-4 ${className}`}
            style={{
                // Smooth loading animation
                transform: 'translateZ(0)',
                willChange: 'opacity',
            }}
        >
            <div className="flex items-center gap-2">
                <OptimizedSpinner size="sm" />
                <span className="text-purple-400 text-sm font-poppins">Loading more...</span>
            </div>
        </div>
    );
});

PaginationLoader.displayName = "PaginationLoader";

// ============================================================================
// MAIN EXPORT
// ============================================================================
export default {
    LoadingSkeleton,
    OptimizedSpinner,
    LoadingOverlay,
    FilteringIndicator,
    ErrorRetryButton,
    PaginationLoader,
};

