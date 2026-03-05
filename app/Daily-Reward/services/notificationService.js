// Notification service for daily rewards
export class NotificationService {
  static async requestPermission() {
    if (!("Notification" in window)) {
      // This browser does not support notifications
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }

  static async showDailyRewardNotification() {
    const hasPermission = await this.requestPermission();

    if (!hasPermission) return;

    const notification = new Notification("🎁 Daily Reward Ready!", {
      body: "Your daily reward is ready to claim. Don't miss out!",
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: "daily-reward",
      requireInteraction: true,
      actions: [
        {
          action: "claim",
          title: "Claim Now",
        },
        {
          action: "later",
          title: "Later",
        },
      ],
    });

    notification.onclick = () => {
      window.focus();
      // Navigate to daily rewards page
      window.location.href = "/Daily-Reward";
      notification.close();
    };

    // Auto close after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);

    return notification;
  }

  static async scheduleDailyNotification() {
    // Schedule notification for next day at 9 AM
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    const timeUntilNotification = tomorrow.getTime() - now.getTime();

    setTimeout(() => {
      this.showDailyRewardNotification();
      // Reschedule for next day
      this.scheduleDailyNotification();
    }, timeUntilNotification);
  }
}
