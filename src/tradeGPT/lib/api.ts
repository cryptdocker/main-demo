import { getApiErrorMessage } from "./apiError";
import { mockBackendRequest } from "../../mocks/mockBackend";

async function mockJson<T = any>(url: string, init?: RequestInit): Promise<T> {
  const method = String(init?.method ?? "GET").toUpperCase();
  const headersInit = init?.headers ?? {};
  const headers: Record<string, string> = {};

  if (headersInit instanceof Headers) {
    headersInit.forEach((value, key) => {
      headers[key] = value;
    });
  } else if (Array.isArray(headersInit)) {
    for (const [k, v] of headersInit) headers[k] = v;
  } else {
    Object.assign(headers, headersInit as Record<string, string>);
  }

  const reply = await mockBackendRequest({
    url,
    method: method as any,
    headers,
    body: init?.body,
  });

  if (!reply.ok) {
    throw new Error(getApiErrorMessage(reply.body, `Request failed (${reply.status}).`));
  }
  return reply.body as T;
}

export type AuthUser = {
  uuid: string;
  email: string;
  fullName?: string;
  avatar?: string;
  balance?: number;
};

export type SubscriptionInfo = {
  plan: "free" | "pro";
  label: string;
  trialActive: boolean;
  trialDaysLeft: number;
  trialEndsAt: string;
  accountCreatedAt: string;
  balance: number;
};

export async function apiRegister(body: {
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<{ message: string; email: string }> {
  return await mockJson(`/trade-gpt/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function apiVerifyEmail(body: {
  email: string;
  code: string;
}): Promise<{ token: string; user: AuthUser; subscription?: SubscriptionInfo }> {
  return await mockJson(`/trade-gpt/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function apiResendCode(body: {
  email: string;
}): Promise<{ message: string }> {
  return await mockJson(`/trade-gpt/auth/resend-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function apiLogin(body: {
  email: string;
  password: string;
}): Promise<{ token: string; user: AuthUser; subscription?: SubscriptionInfo }> {
  return await mockJson(`/trade-gpt/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function apiGoogleLogin(body: {
  idToken: string;
}): Promise<{ token: string; user: AuthUser; subscription?: SubscriptionInfo }> {
  return await mockJson(`/trade-gpt/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function apiGoogleCodeLogin(body: {
  code: string;
}): Promise<{ token: string; user: AuthUser; subscription?: SubscriptionInfo }> {
  return await mockJson(`/trade-gpt/auth/google/code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function apiMe(token: string): Promise<{ user: AuthUser; subscription?: SubscriptionInfo }> {
  return await mockJson(`/trade-gpt/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function apiChangePassword(
  token: string,
  body: { currentPassword: string; newPassword: string; confirmPassword: string },
): Promise<{ message: string }> {
  return await mockJson(`/trade-gpt/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

export async function apiGetSubscription(token: string): Promise<SubscriptionInfo> {
  const data = await mockJson<{ subscription: SubscriptionInfo }>(`/trade-gpt/subscription/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.subscription;
}

export async function apiUpgradeSubscription(token: string): Promise<{
  subscription: SubscriptionInfo;
  message?: string;
}> {
  return await mockJson(`/trade-gpt/subscription/upgrade`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export type TopUpPaymentResult = {
  uuid: string;
  addressIn: string;
  amount: number;
  ticker: string;
  minimumTransactionCoin: number;
  status: string;
};

export type TopUpPaymentStatus = {
  uuid: string;
  status: string;
  addressIn: string | null;
  amount: number;
  ticker: string;
  minimumTransactionCoin: number | null;
};

export async function apiCreateTopUpPayment(
  userUuid: string,
  amount: number,
  ticker: string,
): Promise<TopUpPaymentResult> {
  return await mockJson(`/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userUuid, amount, ticker }),
  });
}

export async function apiGetTopUpPaymentStatus(paymentUuid: string): Promise<TopUpPaymentStatus> {
  return await mockJson(`/payment/${paymentUuid}/status`);
}

export type PaymentNetworkId = "eth" | "bsc" | "tron" | "sol";
export type PaymentTokenId = "usdt" | "usdc";

export type NetworkOption = {
  id: PaymentNetworkId;
  label: string;
  tokens: PaymentTokenId[];
};

export type CheckoutInfo = {
  paymentId: string;
  addressIn: string;
  amount: number;
  network: PaymentNetworkId;
  token: PaymentTokenId;
  networkLabel: string;
  qrCode: string | null;
  expiresAt: string;
  status: string;
};

export type PaymentStatusInfo = {
  paymentId: string;
  status: "pending" | "confirming" | "confirmed" | "expired";
  amount: number;
  network: PaymentNetworkId;
  token: PaymentTokenId;
  addressIn: string;
  expiresAt: string;
  subscription?: SubscriptionInfo;
};

export async function apiFetchPaymentNetworks(): Promise<{ networks: NetworkOption[]; price: number }> {
  return await mockJson(`/trade-gpt/payment/networks`);
}

export type CheckoutResult =
  | (CheckoutInfo & { confirmed?: never })
  | { confirmed: true; subscription: SubscriptionInfo };

export async function apiCreateCheckout(
  token: string,
  network: PaymentNetworkId,
  payToken: PaymentTokenId,
): Promise<CheckoutResult> {
  return await mockJson(`/trade-gpt/payment/create-checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ network, token: payToken }),
  });
}

export async function apiGetPaymentStatus(token: string, paymentId: string): Promise<PaymentStatusInfo> {
  return await mockJson(`/trade-gpt/payment/status/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function apiCancelPayment(token: string, paymentId: string): Promise<void> {
  await mockJson(`/trade-gpt/payment/cancel/${paymentId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function apiCheckPaymentLogs(token: string, paymentId: string): Promise<PaymentStatusInfo> {
  return await mockJson(`/trade-gpt/payment/check-logs/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/* ── Notification preferences ────────────────────────────── */

export type NotificationPrefs = {
  productUpdates: boolean;
  marketing: boolean;
};

export async function apiGetNotificationPrefs(token: string): Promise<NotificationPrefs> {
  const data = await mockJson<{ notifications: NotificationPrefs }>(`/trade-gpt/user/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.notifications;
}

export async function apiUpdateNotificationPrefs(
  token: string,
  prefs: Partial<NotificationPrefs>,
): Promise<NotificationPrefs> {
  const data = await mockJson<{ notifications: NotificationPrefs }>(`/trade-gpt/user/notifications`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(prefs),
  });
  return data.notifications;
}
