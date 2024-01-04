import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button, ConfigProvider, Form, Input, message} from 'antd';
import axios from "axios";
import "./index.css"

const RegisterPage = () => {

    const navigate = useNavigate();
    const [registerFailed, setRegisterFailed] = useState(0);

    const onFinish = (values) => {
        if(values.password !== values.repeatPassword) {
            setRegisterFailed(6);
        } else {
            axios.get(`http://localhost:8080/user/createUser/${values.username}/${values.email}/${values.password}`)
                .then(response => {
                    if(response.data !== 0) {
                        setRegisterFailed(response.data);
                    } else {
                        message.success('注册成功！');
                        navigate("/login");
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return(
        <div className="register-background-container">
            <div className="register-body-container">
                <div className="register-header-container">
                    <h1 style={{color: "white"}}>-用户注册-</h1>
                </div>
                <div className="register-form-container">
                        <ConfigProvider
                            theme={{
                                components: {
                                    Form: {
                                        labelFontSize: 20,
                                        labelColor: "white",
                                    },
                                },
                            }}
                        >
                            <Form
                                name="basic"
                                layout="vertical"
                                labelCol={{
                                    span: 10,
                                }}
                                wrapperCol={{
                                    span: 100,
                                }}
                                style={{
                                    maxWidth: 800,
                                }}
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                                requiredMark={false}
                            >
                                <Form.Item
                                    label="注册用户名"
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入注册用户名！',
                                        },
                                    ]}
                                    style={{
                                        width: "25vw",
                                        height: "8vh"
                                    }}
                                >
                                    <Input placeholder="请输入注册用户名" size="large"/>
                                </Form.Item>

                                <Form.Item
                                    label="注册用户邮箱"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入注册邮箱！',
                                        },
                                    ]}
                                    style={{
                                        width: "25vw",
                                        height: "8vh"
                                    }}
                                >
                                    <Input placeholder="请输入注册邮箱" size="large"/>
                                </Form.Item>

                                <Form.Item
                                    label="注册密码"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入注册密码！',
                                        },
                                    ]}
                                    style={{
                                        width: "25vw",
                                        height: "8vh"
                                    }}
                                >
                                    <Input.Password placeholder="请输入注册密码" size="large"/>
                                </Form.Item>

                                <Form.Item
                                    label="重复密码"
                                    name="repeatPassword"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请重复输入密码！',
                                        },
                                    ]}
                                    style={{
                                        width: "25vw",
                                        height: "8vh"
                                    }}
                                >
                                    <Input.Password placeholder="请重复输入密码" size="large"/>
                                </Form.Item>

                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Form.Item style={{
                                        height: "2vh"
                                    }}>
                                        {registerFailed === 1 && <p style={{color: "red"}}>用户名已存在！</p>}
                                        {registerFailed === 2 && <p style={{color: "red"}}>邮箱已被注册！</p>}
                                        {registerFailed === 3 && <p style={{color: "red"}}>用户名长度过短！</p>}
                                        {registerFailed === 4 && <p style={{color: "red"}}>密码长度过短！</p>}
                                        {registerFailed === 5 && <p style={{color: "red"}}>邮箱格式错误！</p>}
                                        {registerFailed === 6 && <p style={{color: "red"}}>两次输入密码不一致！</p>}
                                    </Form.Item>
                                </div>

                                <Form.Item
                                    wrapperCol={{
                                        offset: 0,
                                        span: 16,
                                    }}
                                >
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Button: {
                                                    colorPrimary: "rgb(34,88,184)",
                                                    algorithm: true,
                                                },
                                            },
                                        }}
                                    >
                                        <Button
                                            type="primary" htmlType="submit"
                                            style={{
                                                width: "25vw",
                                                height: "4.3vh",
                                                fontSize: "20px",
                                            }}>
                                            注册
                                        </Button>
                                    </ConfigProvider>
                                </Form.Item>

                                <Form.Item
                                    wrapperCol={{
                                        offset: 7,
                                        span: 16,
                                    }}
                                >
                                    <Link to="/login">已经有账户了？点击立即登录</Link>
                                </Form.Item>
                            </Form>
                        </ConfigProvider>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage