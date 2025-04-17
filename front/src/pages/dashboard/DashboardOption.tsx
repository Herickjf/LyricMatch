import "../../css/initialpages/dashboard/dashboardoptions.css"
import React from "react";

interface DashboardOptionProps{
    title: string;
    selected?: boolean;
    func?: () => void;
}

const DashboardOption: React.FC<DashboardOptionProps> = ({title, selected, func}) => {
    return (
        <div 
            className={`dashboard_option` + (selected ? " dashb_selected" : "")}
            onClick={ func }
        >
            {
                title.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                        {line}
                        <br />
                    </React.Fragment>
                ))
            }
        </div>
    )
}

export default DashboardOption;