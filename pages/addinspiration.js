import React from 'react'
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu"

function AddInspiration() {

     //for Nav menu profile name and image
     let userName=""
     let profileImage=""
   
     if (sessionFromServer){
         userName=sessionFromServer.user.name
      profileImage=sessionFromServer.user.profileimage
    }
   //end of section for nav menu

   
  return (
    <div>
           <Layout 
            profileImage={profileImage} 
            userName={userName}  /> 
        To be added later! </div>
  )
}

export default AddInspiration