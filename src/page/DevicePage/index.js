import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, Table, message, Modal, Space, Input} from "antd";
import "./index.css"
import {useNavigate} from "react-router-dom";
import ReactEcharts from 'echarts-for-react';



const DevicePage = ({data}) => {
    const {userId, token, updateCurrentDevice, updateCurrentPage} = data;
    const [deviceList, setDeviceList] = useState([]);
    const [refresh, setRefresh] = useState(0);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addName, setAddName] = useState("");
    const [addType, setAddType] = useState("");
    const [addTypeNum, setAddTypeNUm] = useState(0);
    const [addDes, setAddDes] = useState("");
    const [addClient, setAddClient] = useState("");
    const [addFault, setAddFault] = useState(0);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updateName, setUpdateName] = useState("");
    const [updateType, setUpdateType] = useState("");
    const [updateDes, setUpdateDes] = useState("");
    const [updateFault, setUpdateFault] = useState(0);
    const [updateTypeNum, setUpdateTypeNum] = useState("0");
    const [chooseDevice, setChooseDevice] = useState(0);

    const columns = [
        {
            title: '设备ID',
            dataIndex: 'deviceId',
        },
        {
            title: '设备名称',
            dataIndex: 'deviceName',
        },
        {
            title: '设备类型',
            dataIndex: 'type',
            filters: [
                {
                    text: '手机',
                    value: '手机',
                },
                {
                    text: '电脑',
                    value: '电脑',
                },
                {
                    text: '智能家电',
                    value: '智能家电',
                },
                {
                    text: '工业传感器',
                    value: '工业传感器',
                },
                {
                    text: '其他设备',
                    value: '其他设备',
                },
            ],
            onFilter: (value, record) => record.type.indexOf(value) === 0,
        },
        {
            title: '设备描述',
            dataIndex: 'description',
        },
        {
            title: 'mqtt客户端ID',
            dataIndex: 'clientId',
        },
        {
            title: '设备添加时间',
            dataIndex: 'createTimeString',
            sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
        },
        {
            title: '设备最近活跃时间',
            dataIndex: 'lastActiveTimeString',
            sorter: (a, b) => new Date(a.lastActiveTime) - new Date(b.lastActiveTime),
        },
        {
            title: '操作',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => onClickUpdate(record)} type="link">修改信息</Button>
                    <Button onClick={() => onClickCheck(record)} type="link">查看详情</Button>
                </Space>
            )
        },
    ];

    const typeToString = {
        1: '手机',
        2: '电脑',
        3: '智能家电',
        4: '工业传感器',
        5: '其他设备'
    };

    const onClickUpdate = (record) => {
        setIsUpdateModalOpen(true);
        setUpdateName(record.deviceName);
        setUpdateType(record.type);
        setUpdateDes(record.description);
        setChooseDevice(record.deviceId);
    }

    const handleUpdateOk = () => {
        if(updateName === "") setUpdateFault(20)
        else if(updateType === "") setUpdateFault(21)
        else if(updateDes === "") setUpdateFault(22)
        else {
            if(updateType === "手机") setUpdateTypeNum("1");
            else if(updateType === "电脑") setUpdateTypeNum("2");
            else if(updateType === "智能家电") setUpdateTypeNum("3");
            else if(updateType === "工业传感器") setUpdateTypeNum("4");
            else if(updateType === "其他设备") setUpdateTypeNum("5");
            else {setUpdateTypeNum("0"); setUpdateFault(3)}
            axios.get(`http://localhost:8080/device/changeDevice/${chooseDevice}/name/${updateName}/${token}`)
                .then(response => {
                    console.log(response);
                    const result = response.data;
                    if(result >= 10 && result < 20) setAddFault(10);
                    else if(result === 2 || result === 0) setAddFault(1);
                    else if(result === 1) {
                        setUpdateFault(0);
                        setIsUpdateModalOpen(false);
                        setRefresh(refresh+1);
                    }
                })
                .catch(error => {
                    console.log(error);
                })

            axios.get(`http://localhost:8080/device/changeDevice/${chooseDevice}/description/${updateDes}/${token}`)
                .then(response => {
                    console.log(response);
                    const result = response.data;
                    if(result >= 10 && result < 20) setAddFault(10);
                    else if(result === 2 || result === 0) setAddFault(1);
                    else if(result === 1) {
                        setUpdateFault(0);
                        setIsUpdateModalOpen(false);
                        setRefresh(refresh+1);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

    useEffect(()=>{
        if(updateTypeNum !== "0") {
            axios.get(`http://localhost:8080/device/changeDevice/${chooseDevice}/type/${updateTypeNum}/${token}`)
                .then(response => {
                    console.log(response);
                    const result = response.data;
                    if(result >= 10 && result < 20) setAddFault(10);
                    else if(result === 2 || result === 0) setAddFault(1);
                    else if(result === 1) {
                        setUpdateFault(0);
                        setIsUpdateModalOpen(false);
                        setRefresh(refresh+1);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    },[updateTypeNum])

    const handleUpdateCancel = () => {
        setIsUpdateModalOpen(false);
    }

    const OnChangeUpdateName = (e) => {
        setUpdateName(e.target.value)
    }

    const OnChangeUpdateType = (e) => {
        setUpdateType(e.target.value)
    }

    const OnChangeUpdateDes = (e) => {
        setUpdateDes(e.target.value)
    }

    const onClickCheck = (record) => {
        updateCurrentDevice(record.deviceId);
        updateCurrentPage("g1");
    }

    const handleAddOk = () => {
        if(addName === "") setAddFault(20)
        else if(addType === "") setAddFault(21)
        else if(addDes === "") setAddFault(22)
        else if(addClient === "") setAddFault(23)
        else {
            if(addType === "手机") setAddTypeNUm(1);
            else if(addType === "电脑") setAddTypeNUm(2);
            else if(addType === "智能家电") setAddTypeNUm(3);
            else if(addType === "工业传感器") setAddTypeNUm(4);
            else if(addType === "其他设备") setAddTypeNUm(5);
            else {setAddTypeNUm(0); setAddFault(3)}
            if(addTypeNum !== 0) {
                axios.get(`http://localhost:8080/device/addDevice/${addName}/${addTypeNum}/${addDes}/${userId}/${addClient}/${token}`)
                    .then(response => {
                        console.log(response);
                        const result = response.data;
                        if(result >= 10 && result < 20) setAddFault(10);
                        else if(result === 2) setAddFault(2);
                        else if(result === 1) setAddFault(1);
                        else {
                            setAddFault(0);
                            setIsAddModalOpen(false);
                            setRefresh(refresh+1);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        }
    }

    const handleAddCancel = () => {
        setIsAddModalOpen(false)
    }

    const OnChangeName = (e) => {
        setAddName(e.target.value)
    }

    const OnChangeType = (e) => {
        setAddType(e.target.value)
    }

    const OnChangeDes = (e) => {
        setAddDes(e.target.value)
    }

    const OnChangeClient = (e) => {
        setAddClient(e.target.value)
    }

    const onClickAdd = () => {
        setIsAddModalOpen(true)
    }

    const onClickRefresh = () => {
        setRefresh(refresh+1);
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

    useEffect(()=>{
        axios.get(`http://localhost:8080/device/queryDevices/${userId}/${token}`)
            .then(response => {
                if(response.data.existOrNot === 1) {
                    setDeviceList(response.data.devices.map(device => {
                        const typeString = typeToString[device.type];
                        const create = formatTimestamp(device.createTime);
                        const lastActive = formatTimestamp(device.lastActiveTime);
                        const descript = device.description.substring(0,17)+(device.description.length<18?"":"...");
                        return {...device, type: typeString, createTimeString: create, lastActiveTimeString: lastActive, description: descript};
                    }));
                }
            })
            .catch(error => {
                console.log(error);
            })
    }, [token, userId, refresh])

    return(
        <div className="device-container">
            <div className="device-header-container">
                <h1>设备列表</h1>
            </div>
            <div className="device-body-container">
                <div className="device-add-container">
                    <div className="device-add-child-container">
                        <Button onClick={onClickAdd} size="large" type="primary">添加设备</Button>
                        <Button onClick={onClickRefresh} size="large" type="primary">刷新</Button>
                    </div>
                </div>
                <div className="device-table-container">
                    <Table columns={columns} dataSource={deviceList} pagination={{
                        pageSize: 9,
                        showSizeChanger: false,
                        align: "start",
                    }} />
                </div>
            </div>
            <Modal title="输入新设备信息" open={isAddModalOpen} onOk={handleAddOk} onCancel={handleAddCancel}
                   cancelText="取消" okText="确认">
                <div className="device-add-input-header">设备名:</div>
                <Input placeholder="设备名" onChange={OnChangeName} />
                <div className="device-add-input-header">设备类型:</div>
                <Input placeholder="设备类型" onChange={OnChangeType} />
                <div className="device-add-input-header">设备描述:</div>
                <Input placeholder="设备描述" onChange={OnChangeDes} />
                <div className="device-add-input-header">mqtt客户端ID:</div>
                <Input placeholder="mqtt客户端ID" onChange={OnChangeClient} />
                {addFault === 20 && <p style={{color: "red"}}>请填写设备名称！</p>}
                {addFault === 21 && <p style={{color: "red"}}>请填写设备类型！</p>}
                {addFault === 22 && <p style={{color: "red"}}>请填写设备描述！</p>}
                {addFault === 23 && <p style={{color: "red"}}>请填写mqtt客户端ID！</p>}
                {addFault === 10 && <p style={{color: "red"}}>登录过期！</p>}
                {addFault === 1 && <p style={{color: "red"}}>添加失败！</p>}
                {addFault === 2 && <p style={{color: "red"}}>mqtt客户端已存在！</p>}
                {addFault === 3 && <p style={{color: "red"}}>请输入有效类型！</p>}
            </Modal>
            <Modal title="修改设备信息" open={isUpdateModalOpen} onOk={handleUpdateOk} onCancel={handleUpdateCancel}
                   cancelText="取消" okText="确认">
                <div className="device-add-input-header">设备名:</div>
                <Input placeholder="设备名" onChange={OnChangeUpdateName} value={updateName}/>
                <div className="device-add-input-header">设备类型:</div>
                <Input placeholder="设备类型" onChange={OnChangeUpdateType} value={updateType}/>
                <div className="device-add-input-header">设备描述:</div>
                <Input placeholder="设备描述" onChange={OnChangeUpdateDes} value={updateDes}/>
                {addFault === 20 && <p style={{color: "red"}}>请填写设备名称！</p>}
                {addFault === 21 && <p style={{color: "red"}}>请填写设备类型！</p>}
                {addFault === 22 && <p style={{color: "red"}}>请填写设备描述！</p>}
                {addFault === 10 && <p style={{color: "red"}}>登录过期！</p>}
                {addFault === 1 && <p style={{color: "red"}}>修改失败！</p>}
                {addFault === 3 && <p style={{color: "red"}}>请输入有效类型！</p>}
            </Modal>
        </div>
    );
}

export default DevicePage