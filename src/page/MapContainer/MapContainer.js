import { useEffect } from "react";
import styles from "./MapContainer.css";
import AMapLoader from "@amap/amap-jsapi-loader";
import {Button} from "antd";
import {useLocation, useNavigate} from "react-router-dom";

export default function MapContainer() {
    let map = null;
    const params = useLocation();
    const navigate = useNavigate();
    let { state: { userId, token, userName, messages, currentD } } = params;

    const onclick = () => {
        navigate('/main', {state: {userId: userId, token: token, userName: userName, currentD: currentD}});
    }

    function formatTimestamp(timestampString) {
        const date = new Date(timestampString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    useEffect(() => {
        AMapLoader.load({
            key: "afaf17c8d0abcf67fb56e4b449d682a7", // 申请好的Web端开发者Key，首次调用 load 时必填
            version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        })
            .then((AMap) => {
                map = new AMap.Map("container", {
                    // 设置地图容器id
                    viewMode: "3D", // 是否为3D地图模式
                    zoom: 11, // 初始化地图级别
                    center: [messages[0].longitude, messages[0].latitude], // 初始化地图中心点位置
                });
                const lineArr = messages.map(message => [message.longitude, message.latitude]);
                const polyline = new AMap.Polyline({
                    path: lineArr,
                    borderWeight: 2,
                    strokeColor: "#3366FF",
                    lineJoin: 'round',
                    lineCap: 'round',
                });
                polyline.setMap(map);
                messages.forEach((message) => {
                    const marker = new AMap.Marker({
                        position: [message.longitude, message.latitude],
                        map: map,
                    });

                    const infoWindowContent = `
                        <div>
                            <p>消息内容：${message.information}</p>
                            <p>经度：${message.longitude}</p>
                            <p>纬度：${message.latitude}</p>
                            <p>是否警告：${message.alarm ? '是' : '否'}</p>
                            <p>发送时间：${formatTimestamp(message.sendTime)}</p>
                        </div>
                    `;

                    const infoWindow = new AMap.InfoWindow({
                        content: infoWindowContent,
                        offset: new AMap.Pixel(0, -30),
                    });

                    marker.on('mouseover', () => {
                        infoWindow.open(map, marker.getPosition());
                    });

                    marker.on('mouseout', () => {
                        infoWindow.close();
                    });
                });
            })
            .catch((e) => {
                console.log(e);
            });

        return () => {
            map?.destroy();
        };
    }, []);

    return (
        <div>
            <Button type={"primary"} onClick={onclick}>返回</Button>
            <div
                id="container"
                className={styles.mapContainer}
                style={{ height: "850px" }}
            ></div>
        </div>

    );
}