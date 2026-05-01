import { Link } from "react-router-dom";
import { Button } from "../../../component/Button";
import { PATH } from "../../../const";

export function DashboardHeader({
	loading,
	onRefresh,
}: {
	loading: boolean;
	onRefresh: () => void;
}) {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
			<div>
				<h1 className="text-2xl font-bold text-white">Dashboard</h1>
				<p className="mt-1 text-sm text-slate-500">
					Your profile, plan, apps, workspaces, and linked devices.
				</p>
			</div>
			<div className="flex items-center gap-2 shrink-0">
				<Link to={PATH.HOME}>
					<Button variant="outline" size="sm">
						← Back to site
					</Button>
				</Link>
				<Button variant="secondary" size="sm" onClick={onRefresh} disabled={loading}>
					{loading ? "Loading…" : "Refresh"}
				</Button>
			</div>
		</div>
	);
}

