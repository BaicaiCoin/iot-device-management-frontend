import React, {useState, useEffect} from "react";
import "./index.css"
import {Button, ConfigProvider, Descriptions} from "antd";
import ReactEcharts from "echarts-for-react";
import axios from "axios";

const DeviceInfoPage = ({data}) => {
    const {currentDevice, token} = data;
    const [currentDeviceObject, setCurrentDeviceObject] = useState({});
    const [descriptionItem, setDescriptionItem] = useState([]);
    const [latestWeekMessage, setLatestWeekMessage] = useState([0,0,0,0,0,0,0]);
    const [alarm, setAlarm] = useState([0,0]);

    const typeToString = {
        1: '手机',
        2: '电脑',
        3: '智能家电',
        4: '工业传感器',
        5: '其他设备'
    };

    const getPieOption = (alarm) => {
        return {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                textStyle: {
                    fontSize: 15,
                    color: 'black',
                },
                data: ['正常消息', '警告消息']
            },
            title: {
                text: '设备消息状态统计',
                left: 'center',
                textStyle: {
                    color: '#333',
                    fontSize: 18,
                },
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '70%',
                    center: ['50%', '60%'],
                    data: [
                        { value: alarm[0], name: '正常消息' },
                        { value: alarm[1], name: '警告消息' },
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    color: ['rgb(66,127,209)', 'rgb(230,230,230)']
                }
            ]
        }
    };

    const getColOption = (latestWeekMessage) => {
        return {
            tooltip: {},
            xAxis: {
                data: ["七天内", "六天内", "五天内", "四天内", "三天内", "两天内","一天内"]
            },
            yAxis: {},
            series: [{
                name: '收到的消息',
                type: 'bar',
                data: latestWeekMessage
            }],
            title: {
                text: '设备一周内收到消息统计',
                left: 'center',
                textStyle: {
                    color: '#333',
                    fontSize: 18,
                },
            },
            color: 'rgb(66,127,209)',
        }
    };

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

    useEffect(()=>{
        if(currentDevice !== 0) {
            axios.get(`http://localhost:8080/device/queryDevice/${currentDevice}/${token}`)
                .then(response => {
                    if(response.data.existOrNot === 1) {
                        const deviceList = response.data.devices.map(device => {
                            const typeString = typeToString[device.type];
                            const create = formatTimestamp(device.createTime);
                            const lastActive = formatTimestamp(device.lastActiveTime);
                            const descript = device.description.substring(0,17)+(device.description.length<18?"":"...");
                            return {...device, type: typeString, createTimeString: create, lastActiveTimeString: lastActive, description: descript};
                        })
                        setCurrentDeviceObject(deviceList[0]);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            axios.get(`http://localhost:8080/message/latestWeekMessages/${currentDevice}/${token}`)
                .then(response => {
                    console.log(response);
                    setLatestWeekMessage(response.data);
                })
                .catch(error => {
                    console.log(error);
                })
            axios.get(`http://localhost:8080/message/alarmNum/${currentDevice}/${token}`)
                .then(response => {
                    console.log(response);
                    setAlarm(response.data);
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }, [currentDevice])

    useEffect(()=>{
        const items = [
            {
                key: '1',
                label: '设备ID',
                children: currentDeviceObject.deviceId,
            },
            {
                key: '2',
                label: '设备名称',
                children: currentDeviceObject.deviceName,
            },
            {
                key: '3',
                label: '设备类型',
                children: currentDeviceObject.type,
            },
            {
                key: '4',
                label: '设备描述',
                children: currentDeviceObject.description,
                span: 3,
            },
            {
                key: '5',
                label: '设备添加时间',
                children: currentDeviceObject.createTimeString,
            },
            {
                key: '5',
                label: '设备最近活跃时间',
                children: currentDeviceObject.lastActiveTimeString,
            },
            {
                key: '5',
                label: '设备mqtt客户端ID',
                children: currentDeviceObject.clientId,
            },
        ]
        setDescriptionItem(items);
    }, [currentDeviceObject])

    return (
        <div>
            {currentDevice === 0 && <h1>请先在设备列表界面选择要查看的设备，并点击查看详情！</h1>}
            {currentDevice !== 0 && <div className="device-info-container">
                <div className="device-info-header-container">
                    <h1>设备详细信息</h1>
                </div>
                <div className="device-info-body-container">
                    <div className="device-info-intro-container">
                        <ConfigProvider
                            theme={{
                                components: {
                                    Descriptions: {
                                        fontSize: 18,
                                    },
                                },
                            }}
                        >
                            <Descriptions layout="vertical" bordered items={descriptionItem} />
                        </ConfigProvider>
                    </div>
                </div>
                <div className="device-info-blank-container"></div>
                <div className="device-info-statistics-container">
                    <div className="user-pie-container">
                        <ReactEcharts option={getPieOption(alarm)} style={{marginTop:"60px"}} />
                    </div>
                    <div className="user-col-container">
                        <ReactEcharts option={getColOption(latestWeekMessage)} style={{marginTop:"90px"}} />
                    </div>
                </div>
            </div>}
        </div>
    );
}

export default DeviceInfoPage