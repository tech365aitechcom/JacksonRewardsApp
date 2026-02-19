import { Capacitor } from "@capacitor/core";
import { NativePurchases, PURCHASE_TYPE } from "@capgo/native-purchases";

// Product ID mapping: tierId_plan → Google Play product ID
// These must match exactly what is configured in Google Play Console
export const GOOGLE_PLAY_PRODUCT_IDS = {
  bronze_weekly: "vip_bronze_weekly",
  bronze_monthly: "vip_bronze_monthly",
  bronze_yearly: "vip_bronze_yearly",
  gold_weekly: "vip_gold_weekly",
  gold_monthly: "vip_gold_monthly",
  gold_yearly: "vip_gold_yearly",
  platinum_weekly: "vip_platinum_weekly",
  platinum_monthly: "vip_platinum_monthly",
  platinum_yearly: "vip_platinum_yearly",
};

/**
 * Returns the Google Play product ID for a given tier and plan.
 */
export function getProductId(tierId, plan) {
  const key = `${tierId}_${plan}`;
  return GOOGLE_PLAY_PRODUCT_IDS[key] || null;
}

/**
 * Returns true only on a native Android build where Google Play Billing is available.
 */
export async function isGooglePlayAvailable() {
  try {
    if (!Capacitor.isNativePlatform()) return false;
    const platform = Capacitor.getPlatform();
    if (platform !== "android") return false;

    const { isBillingSupported } = await NativePurchases.isBillingSupported();
    return isBillingSupported === true;
  } catch (err) {
    console.warn("[GooglePlayBilling] isBillingSupported check failed:", err);
    return false;
  }
}

/**
 * Fetches product details for the given product ID from the Play Store.
 * Returns the product object or null if not found.
 */
export async function getSubscriptionProduct(productId) {
  try {
    const { products } = await NativePurchases.getProducts({
      productIdentifiers: [productId],
      productType: PURCHASE_TYPE.SUBS,
    });
    return products && products.length > 0 ? products[0] : null;
  } catch (err) {
    console.error("[GooglePlayBilling] getSubscriptionProduct error:", err);
    throw err;
  }
}

/**
 * Launches the Google Play purchase flow for a subscription product.
 * Returns an object with { purchaseToken, productId, orderId }.
 */
export async function purchaseSubscription(productId) {
  try {
    const result = await NativePurchases.purchaseProduct({
      productIdentifier: productId,
      productType: PURCHASE_TYPE.SUBS,
    });

    // result.transactionId is the purchase token on Android
    return {
      purchaseToken: result.transactionId,
      productId: productId,
      orderId: result.orderId || result.transactionId,
    };
  } catch (err) {
    // User cancelled — propagate so the caller can handle it gracefully
    console.error("[GooglePlayBilling] purchaseSubscription error:", err);
    throw err;
  }
}

/**
 * Restores existing purchases for the current user.
 * Returns list of purchases.
 */
export async function restorePurchases() {
  try {
    const result = await NativePurchases.restorePurchases();
    return result;
  } catch (err) {
    console.error("[GooglePlayBilling] restorePurchases error:", err);
    throw err;
  }
}
