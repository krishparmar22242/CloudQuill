import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
const Signup = (props) => {

    const navigate = useNavigate()
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "" })

    const handleonchange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value })
    }
    const hosturl = "http://localhost:5000/api/auth"

    const handlesubmit = async (e) => {
        e.preventDefault()
        const response = await fetch(`${hosturl}/createuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password })
        });
        const responseapi = await response.json()
        console.log(responseapi)
        if (responseapi.success) {
            localStorage.setItem('token',responseapi.auth_token)
            props.showalert("success","User created & Logged in Successfully")
            navigate("/dashboard")

        }
        else {
            props.showalert("danger","User Signed in Failed")
        }
    }

    return (
        <>
        <h1>Signup to Continue Using CloudQuill</h1>
            <form>
                <div className="mb-3 my-5">
                    <label htmlFor="exampleInputName1" className="form-label">Name</label>
                    <input type="text" className="form-control" id="exampleInputName1" aria-describedby="emailHelp" name="name" value={credentials.name} onChange={handleonchange} />
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="email" value={credentials.email} onChange={handleonchange} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" name="password" value={credentials.password} onChange={handleonchange} />
                </div>
                <button type="submit" className="btn btn-primary" onClick={handlesubmit}>Sign Up</button>
            </form>

        </>
    )
}

export default Signup
