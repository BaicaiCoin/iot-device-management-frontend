import logo from './logo.svg';
import './App.css';
import React, {Component} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import EmailLoginPage from "./page/EmailLoginPage";
import MainPage from "./page/MainPage";
import MapContainer from "./page/MapContainer/MapContainer";

class App extends Component {
  render() {
    return (
        <BrowserRouter>
          <Routes>
              <Route path='/' element={<HomePage />}></Route>
              <Route path='/login' element={<LoginPage />}></Route>
              <Route path='/emaillogin' element={<EmailLoginPage />}></Route>
              <Route path='/register' element={<RegisterPage />}></Route>
              <Route path='/main' element={<MainPage />}></Route>
              <Route path='/map' element={<MapContainer/>}></Route>
          </Routes>
        </BrowserRouter>
    );
  }
}

export default App;
