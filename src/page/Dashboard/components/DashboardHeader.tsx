import { Link } from "react-router-dom";
import { Button } from "../../../component/Button";
import { PATH } from "../../../const";

export function DashboardHeader() {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
			<div>
				<h1 className="text-2xl font-bold text-white">My Account</h1>
			</div>
			<div className="flex items-center gap-2 shrink-0">
				<Link to={PATH.HOME}>
					<Button variant="outline" size="sm">
						← Back to site
					</Button>
				</Link>
			</div>
		</div>
	);
}

