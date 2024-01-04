import React, {useState, useEffect} from "react";
import "./index.css"
import {Button, Input, Modal, Space, Table} from "antd";
import axios from "axios";

const MessageListPage = ({data}) => {
    const {currentDevice, token} = data;
    const [messages, setMessages] = useState([]);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [wholeInfo, setWholeInfo] = useState("");

    const columns = [
        {
            title: '消息ID',
            dataIndex: 'messageId',
        },
        {
            title: '消息内容',
            dataIndex: 'showInformation',
        },
        {
            title: '消息状态',
            dataIndex: 'alarm',
            filters: [
                {
                    text: '正常',
                    value: '正常',
                },
                {
                    text: '警告',
                    value: '警告',
                }
            ],
            onFilter: (value, record) => record.alarm.indexOf(value) === 0,
        },
        {
            title: '消息发送时间',
            dataIndex: 'sendTimeString',
            sorter: (a, b) => new Date(a.sendTime) - new Date(b.sendTime),
        },
        {
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => onClickInfo(record)} type="link">查看完整消息内容</Button>
                </Space>
            ),
            width: "5vw",
        },
    ];

    const onClickInfo = (record) => {
        setIsInfoModalOpen(true);
        setWholeInfo(record.information);
    }

    const handleInfoOk = () => {
        setIsInfoModalOpen(false);
    }

    const handleInfoCancel = () => {
        setIsInfoModalOpen(false);
    }

    const alarmToString = {
        0: '正常',
        1: '警告'
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
        axios.get(`http://localhost:8080/message/queryMessages/${currentDevice}/${token}`)
            .then(response => {
                if(response.data.existOrNot === 1) {
                    setMessages(response.data.messages.map(message => {
                        const alarmString = alarmToString[message.alarm];
                        const infor = message.information.substring(0,40)+(message.information.length<41?"":"...");
                        const send = formatTimestamp(message.sendTime);
                        return {...message, alarm: alarmString, showInformation: infor, sendTimeString: send};
                    }));
                }
            })
    },[])


    return (
        <div>
            {currentDevice === 0 && <h1>请先在设备列表界面选择要查看的设备，并点击查看详情！</h1>}
            {currentDevice !== 0 && <div>
                <div className="message-container">
                    <div className="message-header-container">
                        <h1>设备消息列表</h1>
                    </div>
                    <div className="message-body-container">
                        <div className="message-table-container">
                            <Table columns={columns} dataSource={messages} pagination={{
                                pageSize: 10,
                                showSizeChanger: false,
                                align: "start",
                            }} />
                        </div>
                    </div>
                </div>
                <Modal title="完整消息内容" open={isInfoModalOpen} onOk={handleInfoOk} onCancel={handleInfoCancel}
                       cancelText="取消" okText="确认">
                    {wholeInfo}
                </Modal>
            </div>}
        </div>
    );
}

export default MessageListPage