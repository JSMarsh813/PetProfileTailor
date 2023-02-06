import React from 'react'
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu"
import PageTitleWithImages from '../components/ReusableSmallComponents/PageTitleWithImages'

function AddDescriptions() {
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

             <PageTitleWithImages
            imgSrc= "bg-[url('https://images.wagwalkingweb.com/media/daily_wag/blog_articles/hero/1602871850.792525/best-dog-halloween-costumes-of-2018.jpg')]"
            title="Batsignal &"
            title2="Play-yard"            
            />

        To be added later! </div>
  )
}

export default AddDescriptions