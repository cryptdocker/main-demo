import {
	Children,
	isValidElement,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import type React from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import { cx } from "./shared";

export function Badge({
	children,
	variant = "neutral",
}: {
	children: React.ReactNode;
	variant?: "neutral" | "good" | "warn";
}) {
	return (
		<span
			className={cx(
				"inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border",
				variant === "good" &&
					"bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
				variant === "warn" &&
					"bg-amber-500/10 text-amber-300 border-amber-500/25",
				variant === "neutral" && "bg-white/5 text-slate-300 border-white/10",
			)}>
			{children}
		</span>
	);
}

export function Stat({
	label,
	icon,
	value,
}: {
	label: string;
	icon?: React.ReactNode;
	value: React.ReactNode;
}) {
	return (
		<div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
			<p className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
				{icon && <span className="text-slate-500/90">{icon}</span>}
				{label}
			</p>
			<p className="mt-1 text-base font-semibold text-white leading-snug">
				{value}
			</p>
		</div>
	);
}

export function Section({
	children,
	badge,
}: {
	title: string;
	icon?: React.ReactNode;
	subtitle?: string;
	children: React.ReactNode;
	badge?: React.ReactNode;
}) {
	return (
		<section className="glass-strong rounded-2xl border border-white/8 h-full p-6 flex flex-col">
			<div className="absolute top-2 right-2">
				{badge && <div className="shrink-0">{badge}</div>}
			</div>
			<div className="flex-1 min-h-0">{children}</div>
		</section>
	);
}

export function ToggleControl({
	label,
	icon,
	checked,
	disabled,
	onChange,
}: {
	label: string;
	icon?: React.ReactNode;
	checked: boolean;
	disabled: boolean;
	onChange: (v: boolean) => void;
}) {
	return (
		<label
			className={cx(
				"flex items-center justify-between gap-2 rounded-xl border px-3 py-2 cursor-pointer transition-colors",
				checked
					? "border-teal-500/30 bg-teal-500/5"
					: "border-white/10 bg-dark-card/40",
			)}>
			<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300">
				{icon && <span className="text-slate-400">{icon}</span>}
				{label}
			</span>
			<input
				type="checkbox"
				checked={checked}
				disabled={disabled}
				onChange={(e) => onChange(e.target.checked)}
				className="accent-teal-500"
			/>
		</label>
	);
}

export function Select({
	value,
	onChange,
	disabled,
	children,
}: {
	value: string;
	onChange: (v: string) => void;
	disabled?: boolean;
	children: React.ReactNode;
}) {
	const id = useId();
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [open, setOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState<number>(-1);

	const options = useMemo(() => {
		return Children.toArray(children)
			.map((n) => {
				if (!isValidElement(n)) return null;
				const props = n.props as {
					value?: string;
					children?: React.ReactNode;
					disabled?: boolean;
				};
				const optValue = props.value ?? "";
				const label = String(props.children ?? "");
				return { value: String(optValue), label, disabled: !!props.disabled };
			})
			.filter(Boolean) as Array<{
			value: string;
			label: string;
			disabled: boolean;
		}>;
	}, [children]);

	const selected = useMemo(() => {
		return options.find((o) => o.value === value) ?? options[0] ?? null;
	}, [options, value]);

	useEffect(() => {
		if (!open) {
			setActiveIndex(-1);
			return;
		}
		const onDown = (e: MouseEvent) => {
			const t = e.target as Node | null;
			if (t && wrapperRef.current?.contains(t)) return;
			setOpen(false);
		};
		window.addEventListener("mousedown", onDown);
		return () => window.removeEventListener("mousedown", onDown);
	}, [open]);

	return (
		<div
			ref={wrapperRef}
			className={cx(
				"relative w-full",
				disabled && "opacity-60 cursor-not-allowed",
			)}>
			<button
				ref={buttonRef}
				type="button"
				disabled={disabled}
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-controls={id}
				onClick={() => !disabled && setOpen((p) => !p)}
				onKeyDown={(e) => {
					if (disabled) return;
					if (e.key === "Escape") {
						setOpen(false);
						return;
					}
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						setOpen(true);
						return;
					}
					if (e.key === "ArrowDown") {
						e.preventDefault();
						setOpen(true);
						setActiveIndex((p) =>
							Math.min(options.length - 1, p < 0 ? 0 : p + 1),
						);
						return;
					}
					if (e.key === "ArrowUp") {
						e.preventDefault();
						setOpen(true);
						setActiveIndex((p) =>
							Math.max(0, p < 0 ? options.length - 1 : p - 1),
						);
					}
				}}
				className={cx(
					"w-full rounded-lg border border-th-border bg-th-input px-3 py-2 text-sm text-th-text outline-none focus:border-teal-500 text-left",
					!selected && "text-slate-500",
				)}>
				<span className="truncate">{selected?.label ?? "Select…"}</span>
				<IoChevronDownOutline
					className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 transition-all"
					style={{ rotate: open ? "180deg" : "0deg" }}
				/>
			</button>

			{open && (
				<div
					id={id}
					role="listbox"
					aria-label="Select"
					tabIndex={-1}
					onKeyDown={(e) => {
						if (e.key === "Escape") {
							e.preventDefault();
							setOpen(false);
							buttonRef.current?.focus();
							return;
						}
						if (e.key === "ArrowDown") {
							e.preventDefault();
							setActiveIndex((p) =>
								Math.min(options.length - 1, p < 0 ? 0 : p + 1),
							);
							return;
						}
						if (e.key === "ArrowUp") {
							e.preventDefault();
							setActiveIndex((p) => Math.max(0, p < 0 ? 0 : p - 1));
							return;
						}
						if (e.key === "Enter") {
							e.preventDefault();
							const opt = options[activeIndex];
							if (opt && !opt.disabled) {
								onChange(opt.value);
								setOpen(false);
								buttonRef.current?.focus();
							}
						}
					}}
					className="absolute left-0 top-[calc(100%+6px)] w-full min-w-48 z-50 overflow-hidden rounded-xl border border-white/10 bg-dark-card/95 shadow-lg shadow-black/30 backdrop-blur">
					<div className="max-h-56 overflow-auto py-1">
						{options.map((opt, idx) => {
							const isSelected = opt.value === value;
							const isActive = idx === activeIndex;
							return (
								<button
									key={opt.value || `opt-${idx}`}
									type="button"
									role="option"
									aria-selected={isSelected}
									disabled={opt.disabled}
									onMouseEnter={() => setActiveIndex(idx)}
									onClick={() => {
										if (opt.disabled) return;
										onChange(opt.value);
										setOpen(false);
										buttonRef.current?.focus();
									}}
									className={cx(
										"w-full text-left px-3 py-2 text-xs transition-colors",
										opt.disabled
											? "text-slate-600 cursor-not-allowed"
											: "text-slate-200 hover:bg-white/6",
										isSelected && "bg-white/5 text-white",
										isActive && !opt.disabled && "bg-white/6",
									)}>
									<span className="truncate">{opt.label}</span>
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
