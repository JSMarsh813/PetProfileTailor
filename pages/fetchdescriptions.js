import React from 'react'
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu"
import { authOptions } from "../pages/api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"


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


function FetchDescriptions() {
  return (
    <div>
        <Layout></Layout>
        
  <div
    className="h-32 mb-4 bg-[url('https://images.pexels.com/photos/1599452/pexels-photo-1599452.jpeg?auto=compress&cs=tinysrgb&w=400')] bg-repeat-x bg-contain"
    >

    <div className="text-center
    w-96 mx-auto  h-32
    text-4xl text-yellow-300   bg-darkPurple
    font-semibold
    border-y-4 border-amber-300"
     style={{background: "hsla(260, 90%, 60%, 0.6)", backdropFilter: "blur(20px)"}}
     > 
      <span>Fetch </span>
      <span 
      className="block"> Descriptions </span>

    </div>
     

  </div>
        To be added Later!
    </div>
  )
}

export default FetchDescriptions