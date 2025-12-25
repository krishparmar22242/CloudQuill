import React,{useState} from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './components/About'
import Login from './components/Login'
import Home from './components/Home'
import Signup from './components/Signup'
import Notestate from './context/notes/Notestate';
import Alert from './components/Alert';
const App = () => {

  const [alert, setAlert] = useState(null)

  const showalert=(type,msg)=>
    {
      setAlert({
        type:type,
        msg:msg
      });setTimeout(() => {
        setAlert(null)
      },1500);
    }
  return (
    <>
      <Notestate showalert={showalert} >
        <BrowserRouter>
          <Navbar showalert={showalert}/>
          <Alert alert={alert}/>
          <div className="container">
            <Routes>
              <Route exact path="/" element={<Home showalert={showalert}/>} />
              <Route exact path="/about" element={<About/>} />
              <Route exact path="/login" element={<Login showalert={showalert}/>} />
              <Route exact path="/signup" element={<Signup showalert={showalert}/>} />
            </Routes>
            </div>
        </BrowserRouter>
      </Notestate>
    </>
  )
}

export default App
