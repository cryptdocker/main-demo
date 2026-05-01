/// <reference types="vite/client" />

declare module "*.md?raw" {
	const content: string;
	export default content;
}

declare global {
	interface Window {
		google?: {
			accounts: {
				oauth2: {
					initCodeClient: (config: {
						client_id: string;
						scope: string;
						ux_mode?: "popup" | "redirect";
						callback: (resp: { code?: string; error?: string }) => void;
						error_callback?: (err: unknown) => void;
					}) => { requestCode: () => void };
				};
			};
		};
	}
}

export {};
