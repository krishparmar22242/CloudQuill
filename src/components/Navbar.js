import React,{useEffect} from 'react'
import {Link,useLocation,useNavigate} from 'react-router-dom'
const Navbar = (props) => {
    let location=useLocation()
    useEffect(() => {
    }, [location])
    
    const navigate=useNavigate()
    const handlelogout=()=>{
        localStorage.removeItem('token')
        navigate("/login")
        props.showalert("success","User Logout Successfully")
    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">CloudQuill</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname==="/"?"active":""}`}aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname==="/about"?"active":""}`} to="/about">About</Link>
                            </li>
                        </ul>
                        {!localStorage.getItem('token')?<div className='d-flex '>
                            <Link className="btn btn-primary mx-3" to="/login" role="button">Login</Link>
                            <Link className="btn btn-primary mx-3" to="/signup" role="button">Sign Up</Link>
                        </div>:<button className="btn btn-primary" onClick={handlelogout}>LogOut</button>}
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
