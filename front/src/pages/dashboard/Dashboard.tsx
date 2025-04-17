import React from "react";

import "../../css/initialpages/dashboard/dashboard.css"
import DashboardOption from "./DashboardOption";
import useWindowSize from "../game/ScreenSize";

import Requests from "./Requests";
import PlayersMap from "./PlayersMap";
import ServerData from "./ServerData";


const Dashboard: React.FC = () => {
    const [content, setContent] = React.useState("requests");
    const { width } = useWindowSize();

    return(
        <div id="dashboard_box">
            {width > 1300 ? (
                <div id="dashboard_options_box">
                    <DashboardOption title="Users Distribution" func={() => setContent("users_map")} selected={content === "users_map"} />
                    <DashboardOption title={"Real time\nRequests"} func={() => setContent("requests")} selected={content === "requests"} />
                    <DashboardOption title="Server Data" func={() => setContent("server_data")} selected={content === "server_data"} />
                </div>
            ) : (
                <div id="dashboard_select_box">
                <select onChange={(e) => setContent(e.target.value)} id="dashboard_select" value={content}>
                    <option value="users_map">Users Distribution</option>
                    <option value="requests">Real time Requests</option>
                    <option value="server_data">Server Data</option>
                </select>
                </div>
            )}

            <div id="dashboard_content_box">
                {content === "users_map"   && <PlayersMap />}
                {content === "requests"    && <Requests   />}
                {content === "server_data" && <ServerData />}
            </div>
        </div>
    )
}

export default Dashboard;