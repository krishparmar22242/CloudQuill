import React from 'react'
import Notecontext from '../notes/notecontext.js';
import { useState } from 'react';

const Notestate = (props) => {
  const hosturl='http://localhost:5000/api/notes'
  const initialnotes =[]
  //eslint-disable-next-line
  const [notes, setNotes] = useState(initialnotes);

  //Add a note functionality
  const addnote = async (title, description, tag) => {
    const response=await fetch(`${hosturl}/addnotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token':localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag})
    });
    const note=await response.json()
    setNotes((prevNotes) => [...prevNotes, note])
  }


  //Fetch a note functionality
  const fetchnote = async () => {
    const response=await fetch(`${hosturl}/fetchnotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token':localStorage.getItem('token')
      },
      body: JSON.stringify()
    });
      const json=await response.json()
      setNotes(json)
  }

  //Delete a note functionality
  const deletenote = async (noteid) => {
    try 
    {
      const response=await fetch(`${hosturl}/deletenote/${noteid}`, {
        method: 'DELETE',
        headers: {
          'auth-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc3ZjhlMDYzMzhiNWJiYmI5MTU0NjNjIn0sImlhdCI6MTczNjQzOTY4N30.WLLWPaDzRHrzdFHveV_5kKOTjzdUu1lPt0NmJ5QUkB4'
        },
        body: JSON.stringify()
      });
      const json= await response.json()
      console.log(json)
      const newnote = notes.filter((note) => { return note._id !== noteid })
      setNotes(newnote)
      console.log("Note Deleted with id", noteid)
      props.showalert("success","Note Deleted Successfully")
    } 
    catch (error) 
    {
      props.showalert("danger","Sorry Note cannot be Deleted Some Error Occured!!!!")
    }
  }


  //Edit a note functionality
  const editnote = async (noteid, title, description, tag) => {
    try {
      const response=await fetch(`${hosturl}/updatenote/${noteid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc3ZjhlMDYzMzhiNWJiYmI5MTU0NjNjIn0sImlhdCI6MTczNjQzOTY4N30.WLLWPaDzRHrzdFHveV_5kKOTjzdUu1lPt0NmJ5QUkB4'
        },
        body: JSON.stringify({title, description, tag})
      });
      const json= await response.json()
      console.log(json)
      for (let index = 0; index < notes.length; index++) {
        const element = notes[index];
        if (element._id === noteid) {
          element.title = title
          element.description = description
          element.tag = tag
        }
      }
      props.showalert("success","Note Edited Successfully")
    } 
    catch (error) 
    {
      props.showalert("danger","Sorry Note cannot be edited Some Error Occured!!!!")

    }
    
  }

  return (
    <div>
      <Notecontext.Provider value={{ notes, setNotes, addnote,fetchnote, deletenote, editnote}}>
        {props.children}
      </Notecontext.Provider>
    </div>
  )
}
export default Notestate
