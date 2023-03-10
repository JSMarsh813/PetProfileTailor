import React from 'react'
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu"
import { authOptions } from "../pages/api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import PageTitleWithImages from '../components/ReusableSmallComponents/PageTitleWithImages'


export const getServerSideProps = async (context) => {

  // let response = await fetch('http://localhost:3000/api/name-categories');
  // let data = await response.json()


  // let nameResponse= await fetch('http://localhost:3000/api/individualnames');  
  // let nameData = await nameResponse.json()

  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  const UserId = session.user._id

 
  // const client =  await connectDatabase();
  // const user = await client.db.collection('users').findOne({ _id: UserId }) 

  // console.log(user)
  // const userEmail = await session.user.email;


                                //USERS FAVED NAMES //

  // let filterednames=""
  //      if(session){
  //            let filteringNames= await fetch(`http://localhost:3000/api/individualnames/namesContainingUserId/${session.user._id}`);

  //            filterednames= await filteringNames.json()   
  //            }



  // await db.connect()

  // const result = await User.find({_id:UserId})


  return {
    props: {
      // category: data,
      // nameList: nameData,
      // favNames:filterednames,
      sessionFromServer: session,
   
         },
    }

}


function FetchDescriptions({sessionFromServer}) {

     //for Nav menu profile name and image
        //let section exists in case the user is not signed in
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
           imgSrc= "bg-[url('https://images.pexels.com/photos/1599452/pexels-photo-1599452.jpeg?auto=compress&cs=tinysrgb&w=400')]"
          title="Fetch "
          title2="Descriptions"
       />
 
        To be added Later!
    </div>
  )
}

export default FetchDescriptions