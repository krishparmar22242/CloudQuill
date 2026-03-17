import React ,{useContext} from 'react'
import notecontext from '../context/notes/notecontext'

const Notes = (props) => {
    const context=useContext(notecontext)

    const { note } = props //desctructuring for easy access of the same variable
    return (
        <div className='col-md-4 col-lg-3 my-4'>
            <div className="card h-100">
                <div className="card-body">
                    <span className="position-absolute top-0 end-0 translate-middle-y badge rounded-pill" style={{ marginRight: '10px', marginTop: '10px' }}>
                        {note.tag}
                    </span>
                    <h5 className="card-title mt-2">{note.title}</h5>
                    <p className="card-text">{note.description}</p>
                    <i className="fa-regular fa-trash-can mx-3" onClick={()=>{context.deletenote(note._id)}}></i>  
                    <i className="fa-regular fa-pen-to-square mx-3" onClick={()=>{props.updatenote(note)}}></i>    
                </div>
            </div>
        </div>
    )
}


export default Notes
