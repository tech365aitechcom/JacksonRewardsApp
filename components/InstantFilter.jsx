/**
 * ============================================================================
 * INSTANT FILTER COMPONENT
 * ============================================================================
 *
 * This component provides instant client-side filtering without API calls
 * to prevent loading issues when users click on filter buttons.
 *
 * Key Features:
 * - Instant filtering without API calls
 * - Smooth transitions
 * - No loading states for filter changes
 * - Optimized for Android performance
 *
 * @author Jackson Rewards Team
 * @version 1.0.0
 * @since 2024
 */

import React, { memo, useCallback } from "react";

// ============================================================================
// FILTER BUTTON COMPONENT
// ============================================================================
export const FilterButton = memo(({
    filter,
    isActive,
    onClick,
    className = ""
}) => {
    const handleClick = useCallback((e) => {
        e.preventDefault();
        onClick(filter.id);
    }, [onClick, filter.id]);

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={handleClick}
            className={`inline-flex items-center justify-center gap-2.5 p-2.5 relative flex-1 rounded overflow-hidden transition-all duration-200 ${isActive
                ? "bg-[#716ae7] [font-family:'Poppins',Helvetica] font-medium"
                : "bg-[#3b3b3b] [font-family:'Poppins',Helvetica] font-normal hover:bg-[#4a4a4a]"
                } ${className}`}
            style={{
                // Hardware acceleration for smooth transitions
                transform: 'translateZ(0)',
                willChange: 'background-color',
                // Touch-friendly sizing
                minHeight: '44px',
            }}
        >
            <span className="relative w-fit mt-[-1.00px] text-white text-xs tracking-[0] leading-[14px] whitespace-nowrap">
                {filter.label}
            </span>
        </button>
    );
});

FilterButton.displayName = "FilterButton";

// ============================================================================
// FILTER NAVIGATION COMPONENT
// ============================================================================
export const FilterNavigation = memo(({
    filters,
    activeFilter,
    onFilterChange,
    className = ""
}) => {
    return (
        <nav
            className={`flex items-center gap-2 overflow-hidden ${className}`}
            role="tablist"
            aria-label="Ticket filters"
        >
            {filters.map((filter) => (
                <FilterButton
                    key={filter.id}
                    filter={filter}
                    isActive={activeFilter === filter.id}
                    onClick={onFilterChange}
                />
            ))}
        </nav>
    );
});

FilterNavigation.displayName = "FilterNavigation";

// ============================================================================
// INSTANT FILTER WRAPPER
// ============================================================================
export const InstantFilter = memo(({
    children,
    filters,
    activeFilter,
    onFilterChange,
    className = ""
}) => {
    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            <FilterNavigation
                filters={filters}
                activeFilter={activeFilter}
                onFilterChange={onFilterChange}
            />
            {children}
        </div>
    );
});

InstantFilter.displayName = "InstantFilter";

// ============================================================================
// MAIN EXPORT
// ============================================================================
export default {
    FilterButton,
    FilterNavigation,
    InstantFilter,
};

