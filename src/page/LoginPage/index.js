import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button, ConfigProvider, Form, Input} from 'antd';
import axios from "axios";
import "./index.css"

const LoginPage = () => {

    const navigate = useNavigate();
    const [loginFailed, setLoginFailed] = useState(0);

    const onFinish = (values) => {
        axios.get(`http://localhost:8080/user/login/0/${values.username}/${values.password}`)
            .then(response => {
                if(response.data.loginStatus === 0) {
                    navigate('/main', {state: {userId: response.data.userId, token: response.data.token, userName: response.data.userName, currentD: 0}});
                    //console.log(response);
                } else if(response.data.loginStatus === 1) {
                    setLoginFailed(1);
                } else if(response.data.loginStatus === 2) {
                    setLoginFailed(2);
                }
            })
            .catch(error => {
                console.log(error);
            })
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return(
        <div className="login-background-container">
            <div className="login-body-container">
                <div className="login-header-container">
                    <h1 style={{color: "white"}}>-用户登录-</h1>
                </div>
                <div className="login-form-container">
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
                                label="用户名"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名！',
                                    },
                                ]}
                                style={{
                                    width: "25vw",
                                    height: "10vh"
                                }}
                            >
                                <Input placeholder="请输入用户名" size="large"/>
                            </Form.Item>

                            <Form.Item
                                label="密码"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码！',
                                    },
                                ]}
                                style={{
                                    width: "25vw",
                                    height: "20vh"
                                }}
                            >
                                <Input.Password placeholder="请输入密码" size="large"/>
                            </Form.Item>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Form.Item style={{
                                    height: "2vh"
                                }}>
                                    {loginFailed === 2 && <p style={{color: "red"}}>用户不存在！</p>}
                                    {loginFailed === 1 && <p style={{color: "red"}}>密码错误！</p>}
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
                                        登录
                                    </Button>
                                </ConfigProvider>
                            </Form.Item>

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
                                        type="primary"
                                        onClick={()=>{navigate(`/emaillogin`);}}
                                        style={{
                                            width: "25vw",
                                            height: "4.3vh",
                                            fontSize: "20px",
                                        }}>
                                        使用邮箱登录
                                    </Button>
                                </ConfigProvider>
                            </Form.Item>

                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Link to="/register">没有账户？点击立即注册</Link>
                            </Form.Item>
                        </Form>
                    </ConfigProvider>
                </div>
            </div>
        </div>
    );
}

export default LoginPage