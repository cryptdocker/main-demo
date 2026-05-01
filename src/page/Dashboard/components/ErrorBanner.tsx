export function ErrorBanner({
	error,
	onDismiss,
}: {
	error: string | null;
	onDismiss: () => void;
}) {
	if (!error) return null;

	return (
		<div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/8 px-5 py-3.5 text-sm text-red-300">
			{error}
			<button
				className="ml-3 underline opacity-70 hover:opacity-100"
				onClick={onDismiss}>
				Dismiss
			</button>
		</div>
	);
}

