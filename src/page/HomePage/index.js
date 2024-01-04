import React from "react";
import {useNavigate} from "react-router-dom";
import { Button } from 'antd';
import "./index.css"
import logo from "../../image/logo.png";

const HomePage = () => {

    const navigate = useNavigate();

    const loginOnClick = () => {
        navigate(`/login`);
    }

    const registerOnClick = () => {
        navigate(`/register`);
    }

    return(
        <div className="home-background-container">
            <div className="home-logo-father-container">
                <img src={logo} alt=""/>
                <div className="home-buttons-container">
                    <div className="home-buttons-child-container">
                        <Button ghost style={{ width: '500px', height: '47px', fontSize: "21px" }} onClick={loginOnClick}>用户登录</Button>
                        <Button ghost style={{ width: '500px', height: '47px', fontSize: "21px" }} onClick={registerOnClick}>用户注册</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage