import './App.css';
import { useEffect, useState, useContext } from "react";
import { GlobalContext } from './context/Context';
import axios from 'axios'
import { Routes, Route, Link, Navigate } from "react-router-dom";
import profilePhoto from './img/profile.jpg';
import twitter from './img/twitter.png'

import Home from "./components/home";
import Profile from "./components/profile";
import Login from "./components/login";
import Signup from "./components/signup";
import ChangePassword from "./components/changePassword";
import ForgetPassword from "./components/forgetPassword";


function App() {
  let { state, dispatch } = useContext(GlobalContext);

  console.log("state: ", state);
  const [fullName, setFullName] = useState("");


  const logoutHandler = async () => {

    try {
      let response = await axios.post(`${state.baseUrl}/logout`,
        {},
        {
          withCredentials: true
        })
      console.log("response: ", response);

      dispatch({
        type: 'USER_LOGOUT'
      })
    } catch (error) {
      console.log("axios error:  ", error);
    }

  }

  useEffect(() => {

    const getProfile = async () => {
      try {
        let response = await axios.get(
          `${state.baseUrl}/profile`,
          {
            withCredentials: true,
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
              'Expires': '0',
            }
          });

        console.log("response: ", response);

        dispatch({
          type: 'USER_LOGIN',
          payload: response.data
        })
      } catch (error) {

        console.log("axios error: ", error);

        dispatch({
          type: 'USER_LOGOUT'
        })
      }
    }
    getProfile();

  }, [])

  useEffect(() => {

    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
      // Do something before request is sent
      console.log("interceptor");
      config.withCredentials = true;
      return config;
    }, function (error) {
      // Do something with request error
      return Promise.reject(error);
    });

    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    }, function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      if (error.response.status === 401) {
        dispatch({
          type: 'USER_LOGOUT'
        })
      }
      return Promise.reject(error);
    });
  }, [])


  return (
    <div>
      {
        (state.isLogin === true) ?
          <nav className='navbar'>
            <ul className='flex'>
              <li className='twitter'>
                <Link to={`/`}><img height={50} src={twitter} alt=""></img></Link>
                <h2>Home</h2>
              </li>
              
              <li className='user'>
                <Link to={`/profile`}><img className='img' src={profilePhoto} alt=""></img></Link>
                <div>
                  {state?.user?.firstName}
                  {state?.user?.lastName}
                  <button className='logout' onClick={logoutHandler}>Logout</button>
                </div>
              </li>
            </ul>
          </nav>
          : null
      }

      {(state.isLogin === true) ?
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
        : null}

      {(state.isLogin === false) ?
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes> : null
      }

      {(state.isLogin === null) ?
        <div id='preloader'></div> : null}

    </div>
  );
}

export default App;