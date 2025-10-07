export interface NotificationPreferences {
  enabled: boolean;
  prayerNotifications: boolean;
  reminderMinutes: number;
  soundEnabled: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  prayerNotifications: true,
  reminderMinutes: 15,
  soundEnabled: true,
};

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
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

export function getNotificationPermissionStatus(): string {
  if (!("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

export function showNotification(title: string, body: string, tag?: string) {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: tag || "islamic-companion",
      requireInteraction: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }
}

export function getNotificationPreferences(): NotificationPreferences {
  const stored = localStorage.getItem("notificationPreferences");
  if (stored) {
    try {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    } catch (e) {
      return DEFAULT_PREFERENCES;
    }
  }
  return DEFAULT_PREFERENCES;
}

export function saveNotificationPreferences(prefs: Partial<NotificationPreferences>) {
  const current = getNotificationPreferences();
  const updated = { ...current, ...prefs };
  localStorage.setItem("notificationPreferences", JSON.stringify(updated));
}

let activeTimeouts: number[] = [];

export function schedulePrayerNotifications(prayers: Array<{ name: string; time: string }>) {
  const prefs = getNotificationPreferences();
  
  if (!prefs.enabled || !prefs.prayerNotifications) {
    clearPrayerNotifications();
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  clearPrayerNotifications();

  const now = new Date();
  const today = now.toDateString();
  const newTimeouts: number[] = [];

  prayers.forEach((prayer) => {
    if (prayer.name === "Sunrise") {
      return;
    }

    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0, 0);

    if (prayerTime.toDateString() === today && prayerTime.getTime() > now.getTime()) {
      const timeUntilPrayer = prayerTime.getTime() - now.getTime();
      
      const timeoutId = window.setTimeout(() => {
        showNotification(
          `${prayer.name} Prayer Time`,
          `It's time for ${prayer.name} prayer. May Allah accept your prayers.`,
          `prayer-${prayer.name}`
        );
      }, timeUntilPrayer);

      newTimeouts.push(timeoutId);

      if (prefs.reminderMinutes > 0) {
        const reminderTime = prayerTime.getTime() - (prefs.reminderMinutes * 60 * 1000);
        const timeUntilReminder = reminderTime - now.getTime();
        
        if (timeUntilReminder > 0) {
          const reminderTimeoutId = window.setTimeout(() => {
            showNotification(
              `${prayer.name} Reminder`,
              `${prayer.name} prayer is in ${prefs.reminderMinutes} minutes. Prepare for prayer.`,
              `reminder-${prayer.name}`
            );
          }, timeUntilReminder);

          newTimeouts.push(reminderTimeoutId);
        }
      }
    }
  });

  activeTimeouts = newTimeouts;
}

export function clearPrayerNotifications() {
  activeTimeouts.forEach((timeoutId) => {
    window.clearTimeout(timeoutId);
  });
  activeTimeouts = [];
}
