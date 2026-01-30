"use client";
import { useState, useEffect } from "react";
import { getUserNotifications, dismissNotification } from "@/lib/api";
import { useSelector } from "react-redux";

/**
 * Custom hook to manage user notifications
 * Fetches notifications on mount and provides dismiss functionality
 * Only shows notifications if user has notifications enabled in profile
 */
export const useNotifications = (token) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user profile to check notification preference
  const { details: profile } = useSelector((state) => state.profile);
  const notificationsEnabled =
    (profile?.profile?.notifications ?? false) === true;

  const fetchNotifications = async () => {
    if (!token) {
      setNotifications([]);
      return;
    }

    if (!notificationsEnabled) {
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      

      const response = await getUserNotifications(token);


      if (response && response.success && response.data) {
        // Filter out only dismissed notifications (not read ones)
        // According to docs, we should show notifications that are not dismissed
        const unreadNotifications = Array.isArray(response.data)
          ? response.data.filter((notif) => !notif.dismissed)
          : [];

        

        setNotifications(unreadNotifications);
      } else if (response && !response.success) {
       
        setError(
          response.error || response.message || "Failed to fetch notifications"
        );
        setNotifications([]);
      } else {
        
        setNotifications([]);
      }
    } catch (err) {
      console.error("🔔 [Notifications] Error fetching notifications:", err);
      setError(err.message || "Failed to fetch notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (notificationId) => {
    if (!token) return;

    try {
      const response = await dismissNotification(notificationId, token);

      if (response.success) {
        // Remove dismissed notification from state
        setNotifications((prev) =>
          prev.filter((notif) => notif._id !== notificationId)
        );
      } else {
        // Even if API call fails, remove from UI to prevent re-showing
        setNotifications((prev) =>
          prev.filter((notif) => notif._id !== notificationId)
        );
      }
    } catch (error) {
      console.error("Error dismissing notification:", error);
      // Remove from UI anyway to prevent showing again
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );
    }
  };

  // Fetch notifications when token or notification preference changes
  useEffect(() => {
    // Wait a bit for profile to load if it's not available yet
    if (!profile) {
      const timer = setTimeout(() => {
        if (token) {
          fetchNotifications();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (token && notificationsEnabled) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, notificationsEnabled, profile?.profile?.notifications]);

  // Get the first (newest) unread notification
  const currentNotification =
    notifications.length > 0 ? notifications[0] : null;

  console.log("🔔 [Notifications] Current state:", {
    notificationsCount: notifications.length,
    currentNotification: currentNotification
      ? {
          id: currentNotification._id,
          message: currentNotification.message,
          type: currentNotification.type,
        }
      : null,
    loading,
    error,
    notificationsEnabled,
    hasProfile: !!profile,
  });

  return {
    notifications,
    currentNotification,
    loading,
    error,
    refetch: fetchNotifications,
    dismiss: handleDismiss,
  };
};
