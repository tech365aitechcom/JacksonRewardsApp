"use client";
import React from "react";

const NotificationBanner = ({ notification, onDismiss }) => {
    if (!notification) return null;

    const getNotificationStyle = (type) => {
        switch (type) {
            case "success":
                return {
                    backgroundColor: "#10b981",
                    color: "#ffffff",
                };
            case "warning":
                return {
                    backgroundColor: "#f59e0b",
                    color: "#ffffff",
                };
            case "error":
                return {
                    backgroundColor: "#ef4444",
                    color: "#ffffff",
                };
            case "info":
            default:
                return {
                    backgroundColor: "#3b82f6",
                    color: "#ffffff",
                };
        }
    };

    const style = getNotificationStyle(notification.type);

    return (
        <div
            className="fixed top-0 left-0 right-0 z-[9999] px-4 py-3 shadow-lg"
            style={{ backgroundColor: style.backgroundColor }}
        >
            <div className="max-w-md mx-auto flex items-center justify-between gap-3">
                <p
                    className="flex-1 text-sm font-medium"
                    style={{ color: style.color }}
                >
                    {notification.message}
                </p>
                <button
                    onClick={() => onDismiss(notification._id)}
                    className="flex-shrink-0 p-1 hover:opacity-80 transition-opacity"
                    aria-label="Close notification"
                    style={{ color: style.color }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default NotificationBanner;

