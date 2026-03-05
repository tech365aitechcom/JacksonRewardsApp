export const isAndroid = () => {
  if (typeof window === "undefined") return false;

  const userAgent = window.navigator.userAgent;
  return userAgent.includes("Android") || userAgent.includes("Mobile");
};

export const isIOS = () => {
  if (typeof window === "undefined") return false;

  const userAgent = window.navigator.userAgent;
  return (
    userAgent.includes("iPhone") ||
    userAgent.includes("iPad") ||
    userAgent.includes("iPod")
  );
};

export const getPlatform = () => {
  if (isAndroid()) return "android";
  if (isIOS()) return "ios";
  return "android";
};

export const isCapacitorAvailable = () => {
  return typeof window !== "undefined" && window.Capacitor;
};

export const getDeviceId = async () => {
  try {
    if (isCapacitorAvailable()) {
      const { Device } = await import("@capacitor/device");
      const deviceInfo = await Device.getId();
      return deviceInfo.identifier;
    }
  } catch (error) {
    console.log("Device ID not available:", error);
  }
  return null;
};
