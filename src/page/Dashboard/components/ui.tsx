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
import { createPortal } from "react-dom";
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
	title,
	subtitle,
	children,
	badge,
}: {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
	badge?: React.ReactNode;
}) {
	return (
		<section className="glass-strong rounded-2xl border border-white/8 p-6 max-h-min">
			<div className="flex items-start justify-between gap-4 mb-5">
				<div className="min-w-0">
					<h2 className="text-base font-semibold text-white">{title}</h2>
					{subtitle && (
						<p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
					)}
				</div>
				{badge && <div className="shrink-0">{badge}</div>}
			</div>
			{children}
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
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const menuRef = useRef<HTMLDivElement | null>(null);
	const [open, setOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState<number>(-1);
	const [menuPos, setMenuPos] = useState<{ left: number; top: number; width: number }>({
		left: 0,
		top: 0,
		width: 240,
	});

	const options = useMemo(() => {
		return Children.toArray(children)
			.map((n) => {
				if (!isValidElement(n)) return null;
				// Supports <option value="...">Label</option>
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
		if (!open) return;
		const btn = buttonRef.current;
		if (btn) {
			const r = btn.getBoundingClientRect();
			setMenuPos({
				left: Math.max(16, r.left - 16),
				top: r.bottom + 8,
				width: Math.max(192, r.width),
			});
		}
		const onDown = (e: MouseEvent) => {
			const t = e.target as Node | null;
			if (!t) return;
			if (menuRef.current?.contains(t)) return;
			if (buttonRef.current?.contains(t)) return;
			setOpen(false);
		};
		const onReposition = () => {
			const b = buttonRef.current;
			if (!b) return;
			const r = b.getBoundingClientRect();
			setMenuPos({
				left: Math.max(8, r.left),
				top: r.bottom + 8,
				width: Math.max(192, r.width),
			});
		};
		window.addEventListener("mousedown", onDown);
		window.addEventListener("scroll", onReposition, true);
		window.addEventListener("resize", onReposition);
		return () => {
			window.removeEventListener("mousedown", onDown);
			window.removeEventListener("scroll", onReposition, true);
			window.removeEventListener("resize", onReposition);
		};
	}, [open]);

	useEffect(() => {
		if (!open) setActiveIndex(-1);
	}, [open]);

	return (
		<div
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
						setActiveIndex((p) => {
							const next = Math.min(options.length - 1, p < 0 ? 0 : p + 1);
							return next;
						});
						return;
					}
					if (e.key === "ArrowUp") {
						e.preventDefault();
						setOpen(true);
						setActiveIndex((p) => {
							const next = Math.max(0, p < 0 ? options.length - 1 : p - 1);
							return next;
						});
					}
				}}
				className={cx(
					"w-full inline-flex items-center justify-between gap-2 bg-transparent pr-7 text-xs text-slate-100 focus:outline-none",
					!selected && "text-slate-500",
				)}>
				<span className="truncate">{selected?.label ?? "Select…"}</span>
				<IoChevronDownOutline
					className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 transition-all"
					style={{rotate: open ? "180deg" : "0deg"}}
				/>
			</button>

			{open &&
				typeof document !== "undefined" &&
				createPortal(
					<div
						ref={menuRef}
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
						style={{
							position: "fixed",
							left: menuPos.left,
							top: menuPos.top,
							width: menuPos.width,
							zIndex: 1200,
						}}
						className="overflow-hidden rounded-xl border border-white/10 bg-dark-card/95 shadow-lg shadow-black/30 backdrop-blur"
					>
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
										)}
									>
										<span className="truncate">{opt.label}</span>
									</button>
								);
							})}
						</div>
					</div>,
					document.body,
				)}
		</div>
	);
}
