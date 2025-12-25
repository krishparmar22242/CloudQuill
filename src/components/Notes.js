import React ,{useContext} from 'react'
import notecontext from '../context/notes/notecontext'

const Notes = (props) => {
    const context=useContext(notecontext)

    const { note } = props //desctructuring for easy access of the same variable
    return (
        <div className='col md-3 my-4'>
            <div className="card" style={{ width: "18rem" }}>
                <div className="card-body" >
                    <h5 className="card-title">{note.title}
                    </h5>
                    <p className="card-text">{note.description}</p>
                    <i className="fa-regular fa-trash-can mx-3" onClick={()=>{context.deletenote(note._id)}}></i>
                    <i className="fa-regular fa-pen-to-square mx-3" onClick={()=>{props.updatenote(note)}}></i>
                    <span className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-secondary">
                        {note.tag}
                    </span>
                </div>
            </div>
        </div>
    )
}


export default Notes
