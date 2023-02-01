import { useState, useContext } from "react";
import { GlobalContext } from '../context/Context';
import { Link } from "react-router-dom";

import './login.css'
import axios from "axios";


function Login() {
    let { state, dispatch } = useContext(GlobalContext);

    const [result, setResult] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginHandler = async (e) => {
        e.preventDefault();

        try {
            let response = await axios.post(`${state.baseUrl}/login`, {
                email: email,
                password: password
            }, {
                withCredentials: true
            })

            dispatch({
                type: 'USER_LOGIN',
                payload: response.data.profile
            })


            console.log("login successful");
            setResult("login successful")

        } catch (e) {
            console.log("e: ", e);
        }

        // e.reset();
    }


    return (
        <>
            <div className='main'>
                <form onSubmit={loginHandler} className="form">
                    <div className='left'></div>
                    <div className='right'>
                        <h1> Login to continue </h1>
                        <input
                            required
                            className="input"
                            id="email"
                            label="Email"
                            type="email"
                            name="username"
                            placeholder="email"
                            autoComplete="username"
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                        <br />
                        <input
                            required
                            className=" input"
                            id="password"
                            label="Password"
                            type="password"
                            name="current-password"
                            autoComplete="current-password"
                            placeholder="password"
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                        {(state.isLogin === false) ?
                            <p className=''>dont have an account? <Link className="a" to={`/signup`}>Signup</Link>
                                <Link className="forget" to={`/forget-password`}>Forget Password?</Link>
                            </p> : null}
                        <button className="button" type="submit">Login</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login;