import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
const Login = (props) => {
    const navigate=useNavigate()
    const [credentials, setCredentials] = useState({email:"" , password:""})

    const handleonchange=(event)=>{
        setCredentials({...credentials,[event.target.name]:event.target.value})
    }
    // Use env variable injected during Docker build if present, otherwise fallback to localhost
    const hosturl = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/auth/` : "http://localhost:5000/api/auth/";
    const handlesubmit = async (e) => {
        e.preventDefault()
        const response = await fetch(`${hosturl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email:credentials.email, password:credentials.password })
        });
        const responseapi = await response.json()
        console.log(responseapi)
        if(responseapi.success)
        {
            localStorage.setItem('token',responseapi.auth_token)
            props.showalert("success","User Logged in Successfully")
            navigate("/dashboard")
        }
        else{
            props.showalert("danger","User Logged in Failed")
        }
        
    }
    return (
        <>
        <h1>Login to Continue Using CloudQuill</h1>
            <form>
                <div className="mb-3 my-5">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="email" value={credentials.email} onChange={handleonchange}/>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" name="password" value={credentials.password} onChange={handleonchange}/>
                </div>
                <button type="submit" className="btn btn-primary" onClick={handlesubmit}>Login</button>
            </form>
        </>

    )
}

export default Login