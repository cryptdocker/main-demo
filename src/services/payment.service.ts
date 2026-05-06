import { apiFetch } from "./api";

export type CreatePaymentInput = {
	userUuid: string;
	amount: number;
	ticker: string;
};

export type CreatePaymentResult = {
	uuid: string;
	addressIn: string;
	amount: number;
	ticker: string;
	minimumTransactionCoin: number;
	status: string;
};

export type PaymentStatusResult = {
	uuid: string;
	status: string;
	addressIn: string | null;
	amount: number;
	ticker: string;
	minimumTransactionCoin: number | null;
};

export const paymentService = {
	createPayment: (body: CreatePaymentInput) =>
		apiFetch<CreatePaymentResult>("/payment", {
			method: "POST",
			body: JSON.stringify(body),
		}),
	getPaymentStatus: (paymentUuid: string) =>
		apiFetch<PaymentStatusResult>(`/payment/${paymentUuid}/status`),
};

