import React, { useContext,useState } from 'react'
import notecontext from '../context/notes/notecontext'
const Addnote = (props) => {

    const context=useContext(notecontext)
    const {addnote}=context

    const [note, setNote] = useState(
        {
        title:"",
        description:"",
        tag:""
        }
    )
    const handleaddnote=(e)=>{
        try {
          e.preventDefault()
          const tag = note.tag.trim() === "" ? "Personal" : note.tag;
          addnote(note.title,note.description,tag)
          setNote({title:"",description:"",tag:""})
          props.showalert("success","Note Added Successfully")
        } 
        catch (error) 
        {
            props.showalert("danger","Sorry Note cannot be Added Some Error Occured!!!")
        }
       

    }
    const handleonchange=(event)=>{
        setNote({...note,[event.target.name]:event.target.value})        
        }

  return (
    <div className='container my-3'>
      <h3>Add A Note </h3>
      <form>
        <div className="mb-3">
          <label forhtml="title" className="form-label">Title</label>
          <input type="text" className="form-control" id="title" name="title" aria-describedby="email_Help" onChange={handleonchange} value={note.title}/>
        </div>
        <div className="mb-3">
          <label forhtml="description" className="form-label">Description</label>
          <input type="text" className="form-control" id="description" name="description" onChange={handleonchange} value={note.description}/>
        </div>
        <div className="mb-3">
          <label forhtml="tag" className="form-label">Tag</label>
          <input type="text" placeholder="By default it is Personal "className="form-control" id="tag" name="tag" onChange={handleonchange} value={note.tag}/>
        </div>
        <button disabled={(note.title.length<5)||(note.description.length<10)} type="submit" className="btn btn-primary" onClick={handleaddnote}>Add Note</button>
      </form>
    </div>
  )
}

export default Addnote