"use client";
import React, { memo, useMemo } from "react";
// Memoized wrapper for performance optimization
export const PerformanceWrapper = memo(({ children, className = "", ...props }) => {
    const memoizedClassName = useMemo(() => className, [className]);

    return (
        <div className={memoizedClassName} {...props}>
            {children}
        </div>
    );
});

PerformanceWrapper.displayName = "PerformanceWrapper";

// Memoized button component
export const MemoizedButton = memo(({
    children,
    onClick,
    disabled = false,
    className = "",
    ariaLabel,
    ...props
}) => {
    const buttonClasses = useMemo(() => {
        const baseClasses = "disabled:opacity-50 disabled:cursor-not-allowed";
        return `${baseClasses} ${className}`;
    }, [className]);

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={buttonClasses}
            aria-label={ariaLabel}
            {...props}
        >
            {children}
        </button>
    );
});

MemoizedButton.displayName = "MemoizedButton";

// Memoized image component with lazy loading
export const MemoizedImage = memo(({
    src,
    alt,
    className = "",
    loading = "lazy",
    ...props
}) => {
    const imageClasses = useMemo(() => className, [className]);

    return (
        <img
            src={src}
            alt={alt}
            className={imageClasses}
            loading={loading}
            decoding="async"
            {...props}
        />
    );
});

MemoizedImage.displayName = "MemoizedImage";
