import { demoDelay, mockCreatePayment, mockGetPaymentStatus } from "../demo/mockBackend";

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
	createPayment: async (body: CreatePaymentInput) => {
		await demoDelay();
		return mockCreatePayment(body);
	},
	getPaymentStatus: async (paymentUuid: string) => {
		await demoDelay();
		return mockGetPaymentStatus(paymentUuid);
	},
};
