import React, {useEffect, useState} from 'react'
import { useSession, getSession } from "next-auth/react"
import Layout from '../components/NavBar/NavLayoutwithSettingsMenu'

import { authOptions } from "../pages/api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import { useRouter } from 'next/router';
import BatsignalPost from "../components/ShowingListOfContent/batsignalPost"
import FilteringSidebar from '../components/Filtering/FilteringSidebar';
import { Pagination } from '@nextui-org/react'
import GeneralButton from '../components/GeneralButton'
import AddPost from '../components/AddingNewData/AddPost'

// import Pagination from '@etchteam/next-pagination'
// import paginationStyles from '../styles/paginationstyles.module.css'

export const getServerSideProps = async (context) => {

  const session = await unstable_getServerSession(context.req, context.res, authOptions)
  // let response = await fetch('http://localhost:3000/api/name-categories');
   
  // let data = await response.json()


  return {
    props: {    
      sessionFromServer: session,
      // category: data,
         },
    }
}



export default function batsignal({nameList, sessionFromServer, pageProps}) {

          // ##################### Category Objects List for Batsignal ###########################
   const category=[
    {
      name:"BatSignal!",
      _id:"1",
      links: ["name suggestions", "description suggestions","fundraising ideas","social media ideas","photography ideas", "other ideas"]
    },
    {
      name:"PlayYard & Community",
      _id:"2",
      links: ["General ChitChat","showoff your pets!"]
    },
    { name:"Bugs & Feedback",
      _id:"3",
      links: ["bugs","feedback"]
    }
   ]
  

  //                             

  //  [PlayYard&Community]: 

  //  Bugs&Feedback ["bugs","site feedback"]


//  const router = useRouter();

//  useEffect(() => {

//      if (!sessionFromServer) {

//        router.push('/login')}
//    }, [router, sessionFromServer]);
  

   let userName=""
   let profileImage=""

   if (sessionFromServer){
       userName=sessionFromServer.user.name
    profileImage=sessionFromServer.user.profileimage
  }

    // let [userId,setUserId]=useState()

    // useEffect(() => {
    //     const data = localStorage.getItem("session") 
    //     // console.log(data);
    //     setUserId(data)
    // }, [])

    //  ###################   State for filter menu ##########################

    const[IsOpen,SetIsOpen] = useState(true)
    //if true, the className for the filter div will be "" (visible)
    //if false, the className for the filter div will be hidden
    const[addingPost,setAddingPost]=useState(false)

    let tagList=["names","photography"]

    const handleFilterChange = (e) => {
    }
    
  return (
    <div className="pb-8 w-screen " >
        <Layout profileImage={profileImage} userName={userName}  /> 
        
        <img className="h-32 mx-auto" 
                   src="https://images.wagwalkingweb.com/media/daily_wag/blog_articles/hero/1602871850.792525/best-dog-halloween-costumes-of-2018.jpg"/>

{/* https://images.unsplash.com/photo-1560160922-6019c26a2523 */}

        <h1 className="text-center text-white font-semibold text-3xl mt-4 mb-4">  BatSignal and PlayYard </h1>

     {/* posts section */}
        <section className="flex w-full h-fit bg-darkPurple  rounded-box">
      
             <FilteringSidebar
                 category={category} 
                 handleFilterChange={handleFilterChange}
                 IsOpen={IsOpen}
                 />
    
             <section className="mb-0 w-max flex-1 border-2 border-violet-400 ">
      
                    {/* Button that toggles the filter div */}
                     <GeneralButton 
                            text={`${IsOpen?"Close Filters":"Open Filters"}`}
                            onClick={()=>SetIsOpen(!IsOpen)}/>

                         
                           
                                 <div 
                                    className="mx-auto bg-violet-900 max-w-3xl text-center py-4 border-2 border-violet-400 border-dotted 
                                    shadow-lg shadow-slate-900/100" >
                                  <img 
                                      className="max-h-32 mx-auto rounded-full"src="https://images.unsplash.com/photo-1602067340370-bdcebe8d1930?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"/>
                                  
                                   <p 
                                        className="w-max text-white text-xl mx-auto mt-2"> 
                                        Come join us in playyard! Ask for advice, share ideas, or just chitchat! </p>
                                      
                                        <GeneralButton 
                                            text="Add a Post"
                                            className="ml-2 mt-2"
                                            onClick={()=>{setAddingPost(!addingPost)}}/>
                                  </div>

                                  {addingPost&& <AddPost/> }
                            
                            <BatsignalPost 
                                image="https://media.tenor.com/1wU92N1rXhwAAAAM/cute-cute-dog.gif"
                                title="Names ideas for this cool dude? 😎"
                                paragraphText="Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora reiciendis ad architecto at aut placeat quia, minus dolor praesentium officia maxime deserunt porro amet ab debitis deleniti modi soluta similique..."
                                postersProfileImage="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=731&q=80"
                                postersName="Bob"
                                postDate="friday the 13th"
                                amountOfComments="2"
                                tagList={tagList.map(tag=>"#"+tag).join(", ")}
                                className="mx-auto"
                                />

<BatsignalPost 
        image="https://media.tenor.com/1wU92N1rXhwAAAAM/cute-cute-dog.gif"
        title="Names ideas for this cool dude? 😎"
        paragraphText="Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora reiciendis ad architecto at aut placeat quia, minus dolor praesentium officia maxime deserunt porro amet ab debitis deleniti modi soluta similique..."
        postersProfileImage="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=731&q=80"
        postersName="Bob"
        postDate="friday the 13th"
        amountOfComments="2"
        tagList={tagList.map(tag=>"#"+tag).join(", ")}
        />
             

        
              <div className="text-center mb-4">
                    <Pagination rounded total={20} initialPage={1}/>
             </div>
        </section>


        </section>
        </div>
  )

  }
