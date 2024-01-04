import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, Input, message, Modal} from "antd";
import "./index.css"
import {UserOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import ReactEcharts from 'echarts-for-react';


const UserPage = ({data}) => {
    const {userId, token} = data;
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [deviceNum, setDeviceNum] = useState(0);
    const [deviceConnectedNum, setDeviceConnectedNum] = useState(0);
    const [messageNum, setMessageNum] = useState(0);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isPasswordAuModalOpen, setIsPasswordAuModalOpen] = useState(false);
    const [isEmailAuModalOpen, setIsEmailAuModalOpen] = useState(false);
    const [inputPassAu, setInputPassAu] = useState("");
    const [inputPass, setInputPass] = useState("");
    const [inputEmailAu, setInputEmailAu] = useState("");
    const [inputEmail, setInputEmail] = useState("");
    const [fault, setFault] = useState(0);
    const [latestWeekMessages, setLatestWeekMessages] = useState([]);
    const navigate = useNavigate();

    const getPieOption = (device, connectedDevice) => {
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
                data: ['在线设备', '离线设备']
            },
            title: {
                text: '用户在线设备统计',
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
                        { value: connectedDevice, name: '在线设备' },
                        { value: device-connectedDevice, name: '离线设备' },
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

    const getColOption = (latestWeek) => {
        return {
            tooltip: {},
            xAxis: {
                data: ["七天内", "六天内", "五天内", "四天内", "三天内", "两天内","一天内"]
            },
            yAxis: {},
            series: [{
                name: '收到的消息',
                type: 'bar',
                data: latestWeek
            }],
            title: {
                text: '用户一周内收到消息统计',
                left: 'center',
                textStyle: {
                    color: '#333',
                    fontSize: 18,
                },
            },
            color: 'rgb(66,127,209)',
        }
    };

    const changeEmailOnClick = () => {
        setIsEmailAuModalOpen(true);
    }

    const changePasswordOnClick = () => {
        setIsPasswordAuModalOpen(true);
    }

    const quitOnClick = () => {
        navigate(`/`);
    }

    const handlePasswordAuOk = () => {
        axios.get(`http://localhost:8080/user/passwordAuthen/${userName}/${token}/${inputPassAu}`)
            .then(response => {
                if(response.data === 0) {
                    setIsPasswordModalOpen(true);
                    setIsPasswordAuModalOpen(false);
                    setFault(0);
                } else if(response.data === 1) {
                    setFault(1);
                } else {
                    setFault(2);
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handlePasswordAuCancel = () => {
        setIsPasswordAuModalOpen(false);
    }

    const handlePasswordOk = () => {
        axios.get(`http://localhost:8080/user/changePassword/${userId}/${inputPass}`)
            .then(response => {
                if(response.data === 0) {
                    setIsPasswordModalOpen(false);
                    setFault(0);
                } else if(response.data === 1) {
                    setFault(1);
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handlePasswordCancel = () => {
        setIsPasswordModalOpen(false);
    }

    const handleEmailAuOk = () => {
        axios.get(`http://localhost:8080/user/passwordAuthen/${userName}/${token}/${inputEmailAu}`)
            .then(response => {
                if(response.data === 0) {
                    setIsEmailModalOpen(true);
                    setIsEmailAuModalOpen(false);
                    setFault(0);
                } else if(response.data === 1) {
                    setFault(1);
                } else {
                    setFault(2);
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleEmailAuCancel = () => {
        setIsEmailAuModalOpen(false);
    }

    const handleEmailOk = () => {
        axios.get(`http://localhost:8080/user/changeEmail/${userId}/${inputEmail}`)
            .then(response => {
                if(response.data === 0) {
                    setIsEmailModalOpen(false);
                    setFault(0);
                    setEmail(inputEmail);
                } else {
                    setFault(response.data);
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleEmailCancel = () => {
        setIsEmailModalOpen(false);
    }

    const OnChangePassAu = (e) => {
        setInputPassAu(e.target.value);
    }

    const OnChangePass = (e) => {
        setInputPass(e.target.value);
    }

    const OnChangeEmailAu = (e) => {
        setInputEmailAu(e.target.value);
    }

    const OnChangeEmail = (e) => {
        setInputEmail(e.target.value);
    }

    useEffect(()=>{
        axios.get(`http://localhost:8080/user/queryUser/${userId}`)
            .then(response => {
                setUserName(response.data.userName);
                setEmail(response.data.email);
            })
            .catch(error => {
                console.log(error);
            })
        axios.get(`http://localhost:8080/device/queryDeviceNum/${userId}/${token}`)
            .then(response => {
                setDeviceNum(response.data);
            })
            .catch(error => {
                console.log(error);
            })
        axios.get(`http://localhost:8080/device/queryConnectedDeviceNum/${userId}/${token}`)
            .then(response => {
                setDeviceConnectedNum(response.data);
            })
            .catch(error => {
                console.log(error);
            })
        axios.get(`http://localhost:8080/message/queryUserMessageNum/${userId}/${token}`)
            .then(response => {
                setMessageNum(response.data);
            })
            .catch(error => {
                console.log(error);
            })
        axios.get(`http://localhost:8080/user/latestWeekMessages/${userId}/${token}`)
            .then(response => {
                setLatestWeekMessages(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    }, [token, userId])

    return(
        <div className="user-container">
            <div className="user-header-container">
                <h1>个人中心</h1>
            </div>
            <div className="user-body-container">
                <div className="user-intro-container">
                    <div style={{ display: 'inline-block', background: 'rgb(34,88,184)', borderRadius: '50%', padding: '25px' }}>
                        <UserOutlined style={{ fontSize: '17vh', color: 'white'}}/>
                    </div>
                    <div className="user-info-container">
                        <div className="user-info-child-container">
                            <p style={{height: "10px"}}>&nbsp;&nbsp;&nbsp;用户UID: {userId}</p>
                            <p style={{height: "10px"}}>&nbsp;&nbsp;&nbsp;用户名: {userName}</p>
                            <p style={{height: "10px"}}>&nbsp;&nbsp;&nbsp;用户邮箱: {email}</p>
                            <div className="user-info-button-container">
                                <Button type="link" style={{fontSize: "17px"}} onClick={changeEmailOnClick} >修改邮箱</Button>
                                <Button type="link" style={{fontSize: "17px"}} onClick={changePasswordOnClick} >修改密码</Button>
                                <Button type="link" style={{fontSize: "17px"}} onClick={quitOnClick} >退出登录</Button>
                            </div>
                        </div>
                        <div className="user-other-info-container">
                            <p style={{height: "10px"}}>&nbsp;&nbsp;&nbsp;拥有设备总数: {deviceNum}</p>
                            <p style={{height: "10px"}}>&nbsp;&nbsp;&nbsp;收到消息总数: {messageNum}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="user-blank-container"></div>
            <div className="user-statistics-container">
                <div className="user-pie-container">
                    <ReactEcharts option={getPieOption(deviceNum, deviceConnectedNum)} style={{marginTop:"30px"}} />
                </div>
                <div className="user-col-container">
                    <ReactEcharts option={getColOption(latestWeekMessages)} style={{marginTop:"60px"}} />
                </div>
            </div>
            <Modal title="更改密码前请输入原密码" open={isPasswordAuModalOpen} onOk={handlePasswordAuOk} onCancel={handlePasswordAuCancel}
                   cancelText="取消" okText="确认">
                <Input placeholder="原密码" onChange={OnChangePassAu} />
                {fault === 1 && <p style={{color: "red"}}>密码错误！</p>}
                {fault === 2 && <p style={{color: "red"}}>登录超时！请重新登录！</p>}
            </Modal>
            <Modal title="输入新密码" open={isPasswordModalOpen} onOk={handlePasswordOk} onCancel={handlePasswordCancel}
                   cancelText="取消" okText="确认">
                <Input placeholder="新密码" onChange={OnChangePass} />
                {fault === 1 && <p style={{color: "red"}}>密码至少6个字符！</p>}
            </Modal>
            <Modal title="更改邮箱前请输入原密码" open={isEmailAuModalOpen} onOk={handleEmailAuOk} onCancel={handleEmailAuCancel}
                   cancelText="取消" okText="确认">
                <Input placeholder="原密码" onChange={OnChangeEmailAu} />
                {fault === 1 && <p style={{color: "red"}}>密码错误！</p>}
                {fault === 2 && <p style={{color: "red"}}>登录超时！请重新登录！</p>}
            </Modal>
            <Modal title="输入新邮箱" open={isEmailModalOpen} onOk={handleEmailOk} onCancel={handleEmailCancel}
                   cancelText="取消" okText="确认">
                <Input placeholder="新邮箱" onChange={OnChangeEmail} />
                {fault === 1 && <p style={{color: "red"}}>邮箱已存在！</p>}
                {fault === 2 && <p style={{color: "red"}}>邮箱格式错误！</p>}
            </Modal>
        </div>
    );
}

export default UserPage