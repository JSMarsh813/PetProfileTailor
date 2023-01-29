import React, {useEffect,useState} from 'react'
import Layout from "../../components/NavBar/NavLayoutwithSettingsMenu"
import Namelisting from '../../components/ShowingListOfContent/Namelisting'
import { authOptions } from "../../pages/api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import NameListingAsSections from '../../components/ShowingListOfContent/NameListingAsSections'

import {useRouter} from 'next/router'

export const getServerSideProps = async (context) => {

  //allows us to grab the dynamic value from the url
  const id=context.params.id


  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  const UserId = session.user._id

 

    let nameResponse= await fetch('http://localhost:3000/api/individualnames/namesContainingUserId/'+id)
     let nameData = await nameResponse.json()


     let userResponse= await fetch('http://localhost:3000/api/user/getASpecificUser/'+id)
     let userData = await userResponse.json()

     console.log(userData)

    


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
 
      nameList: nameData,
      id: id,
      // favNames:filterednames,
      sessionFromServer: session,
   
         },
    }

}

function ProfilePage({sessionFromServer, nameList,id,nameList2 }) {


console.log(nameList2 )


  return (
    <div >
 
       <Layout></Layout>     

   

<div className="flex flex-col md:flex-row">
                          {/* ############## BIO ############## */}
<section className="bg-blueGray-50 w-96 ">
<div className="px-4 ">
  <div className="relative flex flex-col min-w-0 break-words bg-white mb-6 shadow-xl rounded-lg mt-16">
    <div className="px-6">
      <div className="flex flex-wrap justify-center">
        <div className="w-full px-4 flex justify-center">
          <div className="relative">
            <img alt="..." src="https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg" className="shadow-xl rounded-full align-middle -mt-16 h-60"/>

          </div>
        </div>
        <div className="w-full px-4 text-center mt-2">
          <div className="flex justify-center py-4">
            
            <div className="mr-4 text-center">
              <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                22
              </span>
              <span className="text-sm text-blueGray-400">Treats</span>
            </div>

            <div className="mr-4 text-center">
              <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                10
              </span>
              <span className="mr-4 text-sm text-blueGray-400">Photos</span>
            </div>


            <div className="text-center">
              <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                89
              </span>
              <span className="text-sm text-blueGray-400">Comments</span>
            </div>
          </div>
        </div>
      </div>


      <div className="text-center">

        <h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
          Jenna Stones
        </h3>

        <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
          <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
          Los Angeles, California
        </div>

        <div className="mb-2 text-blueGray-600">
          <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
          Current Rank Title
        </div>

        <div className="mb-6 text-blueGray-600">
          <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
          University of Computer Science
        </div>
      </div>


      
      <div className="py-10 border-t border-blueGray-200 text-center">
        <div className="flex flex-wrap justify-center">
          <div className="w-full lg:w-9/12 px-4">
            <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
              An artist of considerable range, Jenna the name taken
              by Melbourne-raised, Brooklyn-based Nick Murphy
              writes, performs and records all of his own music,
              giving it a warm, intimate feel with a solid groove
              structure. An artist of considerable range.
            </p>
       
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
                      {/* ###########  FOOTER  ########### */}
                      
<footer className="relative  pt-8 pb-6 mt-8">
  <div className="container mx-auto px-4">
    <div className="flex flex-wrap items-center md:justify-between justify-center">
      <div className="w-full md:w-6/12 px-4 mx-auto text-center">
        <div className="text-sm text-blueGray-500 font-semibold py-1">
          Made with <a href="https://www.creative-tim.com/product/notus-js" className="text-blueGray-500 hover:text-gray-800" target="_blank">Notus JS</a> by <a href="https://www.creative-tim.com" className="text-blueGray-500 hover:text-blueGray-800" target="_blank"> Creative Tim</a>.
        </div>
      </div>
    </div>
  </div>
</footer>

</section>


      <div
            className=" flex-1 grid grid-cols-1 gap-4 mr-2">
        
          {(!nameList.length)?

                <section className="border-2 border-amber-300"> 
                 <h2> Names Added</h2>
                <span>  no names added yet! </span>

                </section>:

               <section className="border-2 border-amber-300 w-full"> 
                           <h2
                            className="w-full text-center font-semibold text-amber-300 
                            text-xl
                            bg-darkPurple p-2 
                            "> Names Added</h2>

                    <section 
                          className="grid grid-cols-4 gap-4 
                          bg-purple-100
                          text-darkPurple p-2"> 
                        <span> Like </span>
                        <span> Name </span>
                        <span> Description</span>
                        <span> Tags </span>
                     </section>
                     {nameList.map((name)=>{
                    return <NameListingAsSections
                    name={name}
                    sessionFromServer={sessionFromServer}/>
                   
                  }
                
                    )}
                    </section>
            }
                    
                    
{console.log(nameList)}
              <section> testtest</section>
              <section> testtest</section>
              <section> testtest</section>

      </div>

</div>




       
        {/* ############## CONTRIBUTIONS ##############*/}
<section>

</section>
       
       
       
       </div>
  )
}

export default ProfilePage