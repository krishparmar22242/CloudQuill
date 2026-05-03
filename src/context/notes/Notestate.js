import React from 'react'
import Notecontext from '../notes/notecontext.js';
import { useState } from 'react';

const Notestate = (props) => {
  // We use the env variable if provided (like in K8s), otherwise fallback to localhost for development
const hosturl = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/notes` : 'http://localhost:5000/api/notes';
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
          'auth-token': localStorage.getItem('token')
        }
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
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({title, description, tag})
      });
      const json= await response.json()
      console.log(json)
      
      // Update state correctly by creating a new array
      const newNotes = JSON.parse(JSON.stringify(notes))
      for (let index = 0; index < newNotes.length; index++) {
        const element = newNotes[index];
        if (element._id === noteid) {
          element.title = title
          element.description = description
          element.tag = tag
          break;
        }
      }
      setNotes(newNotes);
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
