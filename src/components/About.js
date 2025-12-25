import React from 'react'
import { useContext,useEffect } from 'react';
import notecontext from '../context/notes/notecontext'
const About = () => {
  const a =useContext(notecontext)
  return (
   <div>
    this is about secttion of clousquill
   </div>
  )
}

export default About
