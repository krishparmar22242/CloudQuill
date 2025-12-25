import React from 'react'
import Notescontainer from './Notecontainer.js'
import Addnote from './Addnote'
const Home = (props) => {

  return (
    <>
      <div>
      <Addnote showalert={props.showalert} />  
        <Notescontainer showalert={props.showalert}/>
      </div>
    </>
  )
}
export default Home
