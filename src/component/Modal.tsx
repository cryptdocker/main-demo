import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoCloseOutline } from "react-icons/io5";

function cx(...c: Array<string | false | null | undefined>) {
	return c.filter(Boolean).join(" ");
}

export function Modal({
	open,
	title,
	onClose,
	children,
	size = "2xl",
	closeOnOverlayClick = true,
	closeButton = true,
}: {
	open: boolean;
	title: string;
	onClose: () => void;
	children: React.ReactNode;
	size?: "2xl" | "6xl";
	closeOnOverlayClick?: boolean;
	closeButton?: boolean;
}) {
	useEffect(() => {
		if (!open) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open, onClose]);

	if (!open) return null;
	if (typeof document === "undefined") return null;

	return createPortal(
		<div
			className="fixed inset-0 z-1100 flex items-center justify-center p-4"
			role="dialog"
			aria-modal="true"
			aria-label={title}>
			<button
				type="button"
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				aria-label="Close modal"
				onClick={closeOnOverlayClick ? onClose : undefined}
			/>
			<div
				className={cx(
					"relative w-full rounded-2xl border border-white/10 bg-dark-card/95 shadow-2xl shadow-black/40 backdrop-blur",
					size === "6xl" ? "max-w-6xl" : "max-w-2xl",
				)}>
				<div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/8">
					<h3 className="text-base font-semibold text-white">{title}</h3>
					{closeButton && (
						<button
							type="button"
							onClick={onClose}
							className={cx(
								"inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-slate-200 hover:bg-white/10",
							)}
							aria-label="Close">
							<IoCloseOutline className="text-lg" />
						</button>
					)}
				</div>
				<div className="px-5 py-4 h-full">{children}</div>
			</div>
		</div>,
		document.body,
	);
}
