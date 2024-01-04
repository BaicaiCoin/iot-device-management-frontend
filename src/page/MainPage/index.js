import React, {useState, useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Breadcrumb, Button, Checkbox, ConfigProvider, Flex, Form, Input, Layout, Menu, Tabs, theme} from 'antd';
import { NodeExpandOutlined, UserOutlined, MobileOutlined, FundProjectionScreenOutlined } from '@ant-design/icons';
import axios from "axios";
import "./index.css"
import Sider from "antd/es/layout/Sider";
import {Content, Header} from "antd/es/layout/layout";
import {Footer} from "antd/es/modal/shared";
import MainPageLogo from "../../image/mainlogo.png"
import UserPage from "../UserPage";
import DevicePage from "../DevicePage";
import DeviceInfoPage from "../DeviceInfoPage";
import MessageListPage from "../MessageListPage";
import RoutePage from "../RoutePage";

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
const items = [
    getItem('设备列表', '1', <MobileOutlined />),
    getItem('设备信息', '2', <FundProjectionScreenOutlined />, [
        getItem('详细信息', 'g1'),
        getItem('消息列表', 'g2'),
        getItem('历史轨迹', 'g3'),
    ]),
    getItem('个人中心', '3', <NodeExpandOutlined />),
];

const MainPage = () => {
    const params = useLocation();
    const navigate = useNavigate();
    let { state: { userId, token, userName, currentD } } = params;
    const [openKeys, setOpenKeys] = useState(['2']);
    const [currentPage, setCurrentPage] = useState('1');
    const [currentDevice, setCurrentDevice] = useState(currentD);

    const onClick = (e) => {
        setCurrentPage(e.key);
        if(e.key === "g3" && currentDevice !== 0) {
            axios.get(`http://localhost:8080/message/queryPath/${currentDevice}/${token}`)
                .then(response => {
                    if(response.data.existOrNot === 1) {
                        const messages = response.data.messages;
                        navigate('/map', {state: {userId: userId, token: token, userName: userName, messages: messages, currentD: currentDevice}});
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    };

    const updateCurrentDevice = (data) => {
        setCurrentDevice(data);
    }

    const updateCurrentPage = (data) => {
        setCurrentPage(data);
    }

    return (
    <Layout style={{ minHeight: '100vh' }}>
        <Sider width={"15vw"}>
            <div className="main-user-container">
                <div style={{ display: 'inline-block', background: 'rgb(34,88,184)', borderRadius: '50%', padding: '7px' }}>
                    <UserOutlined style={{ fontSize: '3vh', color: 'white'}}/>
                </div>
                <div className="main-user-name-container" >
                    Hello, {userName}!
                </div>
            </div>
            <Menu
                theme="dark"
                onClick={onClick}
                style={{
                    width: "15vw",
                }}
                selectedKeys={currentPage}
                defaultOpenKeys={['sub1']}
                mode="inline"
                items={items}
                openKeys={openKeys}
            />
            <div className="main-logo-container">
                <img src={MainPageLogo} alt="" width="235px"/>
            </div>
        </Sider>
        <Content className="main-content-container">
            {currentPage === '3' && <UserPage data={{userId, token}}/>}
            {currentPage === '1' && <DevicePage data={{userId, token, updateCurrentDevice, updateCurrentPage}}/>}
            {currentPage === 'g1' && <DeviceInfoPage data={{currentDevice, token}}/>}
            {currentPage === 'g2' && <MessageListPage data={{currentDevice, token}}/>}
            {currentPage === 'g3' && <h1>请先在设备列表界面选择要查看的设备，并点击查看详情！</h1>}
        </Content>
    </Layout>
    );
}

export default MainPage