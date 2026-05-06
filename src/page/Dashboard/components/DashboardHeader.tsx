import { Link } from "react-router-dom";
import { Button } from "../../../component/Button";
import { PATH } from "../../../const";
import { IoDownloadOutline } from "react-icons/io5";

export function DashboardHeader() {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
			<div>
				<h1 className="text-2xl font-bold text-white">Dashboard</h1>
			</div>
			<div className="flex items-center gap-2 shrink-0">
				<Link to={PATH.DOWNLOAD}>
					<Button size="sm">
						<span className="inline-flex items-center gap-2">
							<IoDownloadOutline className="text-base" />
							Download app
						</span>
					</Button>
				</Link>
				<Link to={PATH.HOME}>
					<Button variant="outline" size="sm">
						← Back to site
					</Button>
				</Link>
			</div>
		</div>
	);
}

