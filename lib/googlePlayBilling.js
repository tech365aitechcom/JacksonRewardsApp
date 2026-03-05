import { Capacitor } from '@capacitor/core'
import { NativePurchases, PURCHASE_TYPE } from '@capgo/native-purchases'

// Product ID mapping: tierId_plan → { productId, basePlanId }
// productId = parent subscription ID, basePlanId = base plan ID from Play Console
export const GOOGLE_PLAY_PRODUCT_IDS = {
  bronze_weekly: { productId: 'bronze_weekly', basePlanId: 'bronzeweekly' },
  bronze_monthly: { productId: 'bronze_weekly', basePlanId: 'bronzemonthly' },
  bronze_yearly: { productId: 'bronze_weekly', basePlanId: 'bronzeyearly' },
  gold_weekly: { productId: 'gold_monthly', basePlanId: 'goldweekly' },
  gold_monthly: { productId: 'gold_monthly', basePlanId: 'monthly' },
  gold_yearly: { productId: 'gold_monthly', basePlanId: 'goldyearly' },
  platinum_weekly: { productId: 'platinum', basePlanId: 'platinumweekly' },
  platinum_monthly: { productId: 'platinum', basePlanId: 'platinummonthly' },
  platinum_yearly: { productId: 'platinum', basePlanId: 'platinumyearly' },
}

/**
 * Returns the Google Play product ID for a given tier and plan.
 */
export function getProductId(tierId, plan) {
  const key = `${tierId}_${plan}`
  return GOOGLE_PLAY_PRODUCT_IDS[key] || null
}

/**
 * Returns true only on a native Android build where Google Play Billing is available.
 */
export async function isGooglePlayAvailable() {
  try {
    if (!Capacitor.isNativePlatform()) return false
    const platform = Capacitor.getPlatform()
    if (platform !== 'android') return false

    const { isBillingSupported } = await NativePurchases.isBillingSupported()
    return isBillingSupported === true
  } catch (err) {
    console.warn('[GooglePlayBilling] isBillingSupported check failed:', err)
    return false
  }
}

/**
 * Fetches product details for the given product ID from the Play Store.
 * Returns the product object or null if not found.
 * @param {object} productInfo - Object with { productId, basePlanId }
 */
export async function getSubscriptionProduct(productInfo) {
  try {
    const { products } = await NativePurchases.getProducts({
      productIdentifiers: [productInfo.productId],
      productType: PURCHASE_TYPE.SUBS,
    })
    return products && products.length > 0 ? products[0] : null
  } catch (err) {
    console.error('[GooglePlayBilling] getSubscriptionProduct error:', err)
    throw err
  }
}

/**
 * Launches the Google Play purchase flow for a subscription product.
 * Returns an object with { purchaseToken, productId, basePlanId, orderId }.
 * @param {object} productInfo - Object with { productId, basePlanId }
 */
export async function purchaseSubscription(productInfo) {
  try {
    console.log('🛒 [GooglePlayBilling] Initiating purchase:', {
      productIdentifier: productInfo.productId,
      planIdentifier: productInfo.basePlanId,
      productType: 'SUBS'
    })

    const result = await NativePurchases.purchaseProduct({
      productIdentifier: productInfo.productId,
      planIdentifier: productInfo.basePlanId,
      productType: PURCHASE_TYPE.SUBS,
    })

    console.log('✅ [GooglePlayBilling] Purchase successful from Google Play:', {
      purchaseToken: result.transactionId ? `${result.transactionId.substring(0, 20)}...` : 'missing',
      orderId: result.orderId
    })

    // result.transactionId is the purchase token on Android
    return {
      purchaseToken: result.transactionId,
      productId: productInfo.productId,
      basePlanId: productInfo.basePlanId,
      orderId: result.orderId || result.transactionId,
    }
  } catch (err) {
    // User cancelled — propagate so the caller can handle it gracefully
    console.error('[GooglePlayBilling] purchaseSubscription error:', {
      message: err?.message,
      code: err?.code,
      productId: productInfo.productId,
      basePlanId: productInfo.basePlanId,
      fullError: JSON.stringify(err)
    })
    throw err
  }
}

/**
 * Restores existing purchases for the current user.
 * Returns list of purchases.
 */
export async function restorePurchases() {
  try {
    const result = await NativePurchases.restorePurchases()
    return result
  } catch (err) {
    console.error('[GooglePlayBilling] restorePurchases error:', err)
    throw err
  }
}
