import React, {useState, useEffect} from "react";
import "./index.css"
import MapContainer from "../MapContainer/MapContainer";

const RoutePage = ({data}) => {
    const {currentDevice, token} = data;

    return (
        <div>
            {currentDevice === 0 && <h1>请先在设备列表界面选择要查看的设备，并点击查看详情！</h1>}
            {currentDevice !== 0 && <div>
                <div className="message-container">
                    <div className="message-header-container">
                        <h1>设备历史轨迹</h1>
                    </div>
                    <div className="message-body-container">
                    </div>
                </div>
            </div>}
        </div>
    );
}

export default RoutePage