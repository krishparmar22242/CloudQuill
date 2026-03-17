import React from 'react'
import notecontext from '../context/notes/notecontext'
import { useContext, useEffect, useRef, useState } from 'react'
import Notes from './Notes'
import { useNavigate } from 'react-router-dom'

const Notecontainer = (props) => {
    let navigate=useNavigate()
    const context = useContext(notecontext)
    useEffect(() => {
        if (localStorage.getItem('token'))
        {
            context.fetchnote()
        }
        else{
            navigate("/login")
        }
        // eslint-disable-next-line
    }, [])

    const [searchQuery, setSearchQuery] = useState("");
    const [note, setNote] = useState({
        "etitle": "",
        "edescription": "",
        "etag": "default",
        "eid":""
    });


    const ref = useRef(null)
    const refclose = useRef(null)

    const updatenote = (currentnote) => {
        try {
            ref.current.click()
            setNote({eid:currentnote._id,etitle:currentnote.title,edescription:currentnote.description,etag:currentnote.tag})
            props.showalert("success","Note Edited Successfully")
        } 
        catch (error) 
        {
            props.showalert("danger","Sorry Note cannot be edited Some Error Occured!!!!")
        }
    }


    const handleonchange = (event) => {
        setNote({ ...note, [event.target.name]: event.target.value })
    }

    const handleonclick=(e)=>{
        console.log("Updating Data ",note)
        context.editnote(note.eid, note.etitle, note.edescription, note.etag)
        e.preventDefault()
        refclose.current.click()
    }

    return (
        <>
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" aria-describedby="email_Help" value={note.etitle} onChange={handleonchange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={handleonchange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input type="text" placeholder="By default it is Personal " className="form-control" id="etag" name="etag"  value={note.etag} onChange={handleonchange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refclose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={(note.etitle.length<5)||(note.edescription.length<10)} type="button" className="btn btn-primary" onClick={handleonclick} >Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row md-3 my-5'>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3>Your Notes</h3>
                    <div className="w-50">
                        <input 
                            type="search" 
                            className="form-control" 
                            placeholder="🔍 Search notes by title or description..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="container text-muted">
                    {context.notes.length === 0 && "No Notes to be Displayed. ADD Notes"}
                    {context.notes.length > 0 && context.notes.filter(note => 
                        note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        note.description.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length === 0 && "No notes match your search."}
                </div>
                {context.notes && context.notes.filter(note => 
                    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    note.description.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((note) => {
                    return <Notes key={note._id} updatenote={updatenote} note={note} />
                })}
            </div>
        </>
    )
}

export default Notecontainer
