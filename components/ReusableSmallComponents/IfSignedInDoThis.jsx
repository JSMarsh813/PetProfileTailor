import React from 'react'

export default function IfSignedInDoThis({thingToDo} ) {
  return (
    <>
    {((sessionFromServer)&&
        (post.createdby._id==sessionFromServer.user._id))&&

          {thingToDo}               
  }
  </>
  )
  
}
