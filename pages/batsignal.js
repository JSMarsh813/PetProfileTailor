import React, {useEffect, useState, useMemo} from 'react'
import { useSession, getSession } from "next-auth/react"
import Layout from '../components/NavBar/NavLayoutwithSettingsMenu'

import { authOptions } from "../pages/api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import { useRouter } from 'next/router';
import BatsignalPost from "../components/ShowingListOfContent/BatsignalPost"
import FilteringSidebar from '../components/Filtering/FilteringSidebar';
import { Pagination } from '@nextui-org/react'
import GeneralButton from '../components/GeneralButton'
import AddPost from '../components/AddingNewData/AddPost'

// import Pagination from '@etchteam/next-pagination'
// import paginationStyles from '../styles/paginationstyles.module.css'

export const getServerSideProps = async (context) => {

  const session = await unstable_getServerSession(context.req, context.res, authOptions)

   let postResponse= await fetch('http://localhost:3000/api/individualposts');
   let postData = await postResponse.json()

   let commentResponse= await fetch('http://localhost:3000/api/individualbatsignalcomments');
   let commentData = await commentResponse.json()

   console.log(postData)
  return {
    props: {    
      sessionFromServer: session,
      postList: postData,
      commentList: commentData
     
         },
    }
}



export default function BatSignal({sessionFromServer, pageProps,postList,commentList}) {
  
  // console.log(`this is postlist2 ${JSON.stringify(postList)}`)
  // console.log(`this is commentlist ${JSON.stringify(commentList)}`)
// let postList=[
//   {
//     _id: '63d42a6066fe90a742f8edbc',
//     image: [],
//     title: '',
//     description: 'comment',
//     createdby: {
//       _id: '63a90c2e83e6366b179ffc40',
//       name: 'GhibliM',
//       profileimage: 'https://res.cloudinary.com/dujellms1/image/upload/v1674006701/profileimage/gxxcmwg0lrwdwsmqodng.jpg',
//       profilename: 'ghiblimagic'
//     },
//     comments: [
//       '63d42a8866fe90a742f8edc0',
//       '63d42b4366fe90a742f8edc9',
//       '63d43a9566fe90a742f8ee14',
//       '63d4482666fe90a742f8ef4c',
//       '63d448b766fe90a742f8ef70',
//       '63d44bbc66fe90a742f8efc8'
//     ],
//     shares: [],
//     likes: [],
//     taglist: [ 'photography ideas' ],
//     createdAt: '2023-01-27T19:47:44.426Z',
//     updatedAt: '2023-01-27T22:10:04.827Z',
//     __v: 6
//   },
//   {
//     _id: '63d423e252c89332d426b061',
//     image: [
//       'https://res.cloudinary.com/dujellms1/image/upload/v1674847201/posts/khgbk3ufwzieuzocxxcp.jpg'
//     ],
//     title: 'test',
//     description: 'test',
//     createdby: {
//       _id: '63a90c2e83e6366b179ffc40',
//       name: 'GhibliM',
//       profileimage: 'https://res.cloudinary.com/dujellms1/image/upload/v1674006701/profileimage/gxxcmwg0lrwdwsmqodng.jpg',
//       profilename: 'ghiblimagic'
//     },
//     comments: [
//       '63d4242352c89332d426b067',
//       '63d4493d66fe90a742f8ef8a',
//       '63d4494e66fe90a742f8ef95'
//     ],
//     shares: [],
//     likes: [],
//     taglist: [ 'name suggestions' ],
//     createdAt: '2023-01-27T19:20:02.866Z',
//     updatedAt: '2023-01-27T21:59:43.049Z',
//     __v: 3
//   }
// ]
 


          // ##################### Category Objects List for Batsignal ###########################
          
          // let newestPostsFirstList=postList
          
          // .slice().sort((a,b)=>{
          //   if (a.createdAt>b.createdAt){
          //     return 0
          //   }})

   const category=[
    {
      name:"BatSignal!",
      _id:"1",
      tags: ["name suggestions", "description suggestions","fundraising ideas","social media ideas","photography ideas", "other ideas"]
    },
    {
      name:"PlayYard & Community",
      _id:"2",
      tags: ["General ChitChat","showoff your pets!"]
    },
    { name:"Bugs & Feedback",
      _id:"3",
      tags: ["bugs","feedback"]
    }
   ]
  


   let tagListProp=category.map(category=>category.tags).reduce((sum,value)=>sum.concat(value),[])

   const[tagFilters,setFiltersState] = useState([])
                    //array above is filled with tags
                    // ex ["christmas", "male"]

   const[filteredPosts,setFilteredPosts]=useState([...postList])


//  useEffect(() => {

//      if (!sessionFromServer) {

//        router.push('/login')}
//    }, [router, sessionFromServer]);
  

   //for Nav menu profile name and image
        //let section exists in case the user is not signed in
   let userName=""
   let profileImage=""
 
   if (sessionFromServer){
       userName=sessionFromServer.user.name
    profileImage=sessionFromServer.user.profileimage
  }
 //end of section for nav menu

    const[IsOpen,SetIsOpen] = useState(true)
    //if true, the className for the filter div will be "" (visible)
    //if false, the className for the filter div will be hidden

    const[addingPost,setAddingPost]=useState(false)

    // let tagListForPost=["names","photography"]

    
  
          // const[tagFilters,setTagFilters] = useState([])
          //           //array above is filled with tags
          //           // ex ["name suggestions", "description suggestions"]
          // const[filteredposts,setFilteredPosts]=useState([...postList])
          //          //filled with all names on default aka, not actually filtered yet

   const handleFilterChange = (e) => {

       

                const { value, checked } = e.target;

                // //copy filteredNames then set it to an empty array, so we "delete" the previous names in the state
                
               
            
                setFilteredPosts(postList);

                    //every time we click, lets reset filteredNames to nameList aka its initial state. This way if we go backwards/unclick options, we'll regain the names we lost so future filtering is correct.
                         // aka round: 1, we click christmas and male. So we lost all female names since they had no male tag
                        //      round: 2, we unclick male
                                  //we need to reset the nameList, so that it will give us ALL christmas names
                                       // so reset the list with all the names
                                       // then the filter function in useEffect runs since the filteredtag array was changed

              
                // name.tags.includes(tag))))
 //We want ONE result for each name, so map through names
                  //names ex: beans, santa
                  //then we want to look through EVERY tag filter ONCE
                          //ex filters: Male and christmas
                              // does the name have all of these tags?
                                   //ex: beans has male, but not christmas. so it'd return false
                                  //while santa would return true so it's rendered
            
          
          // console.log(`${value} is ${checked}`);

          //if checked, it will add the new tag to the state/list. If not checked, it will filter it out and replace the state with the new tagfilter array
                
                (checked)?   
                setFiltersState([...tagFilters,value],):( 
                setFiltersState(tagFilters.filter((tag) => tag!=value)))
              // console.log(tagFilters)
                         
          }      
         
            // every time a new tag is added to the tagsFilter array, we want to filter the names and update the filteredNames state, so we have useEffect run every time tagFilters is changed 
          useEffect(()=>{
            let currenttags=tagFilters
            
            setFilteredPosts( filteredPosts.filter((post)=>
                      (currenttags.every((tag)=>
                                 post.taglist.includes(tag)))))

            // console.log((`useEffect filterednames ${JSON.stringify(filterednames)}`))
        },[tagFilters]
          ) 
           







    
  return (
    <div className="pb-8 w-screen " >
        <Layout 
            profileImage={profileImage} 
            userName={userName}  /> 
        
        <div
        className="h-32 
        bg-[url('https://images.wagwalkingweb.com/media/daily_wag/blog_articles/hero/1602871850.792525/best-dog-halloween-costumes-of-2018.jpg')] bg-repeat-x bg-contain 
        ">
       

{/* https://images.unsplash.com/photo-1560160922-6019c26a2523 */}

        <h1 className="text-center 
    w-96 mx-auto  h-32
    text-4xl text-yellow-300   bg-darkPurple font-semibold
    border-y-4 border-amber-300"

         style={{marginBottom: "-90px", background: "hsla(260, 90%, 60%, 0.6)", backdropFilter: "blur(20px)"}}
        > 
        BatSignal and Playyard </h1>
        </div>
     {/* posts section */}
        <section className="flex w-full h-fit bg-darkPurple  rounded-box">
      
             <FilteringSidebar
                 category={category} 
                 handleFilterChange={handleFilterChange}
                 IsOpen={IsOpen}
                 />
    
             <section className="mb-0 w-full flex-1 border-2 border-violet-400 ">
      
                    {/* Button that toggles the filter div */}
                     <GeneralButton 
                            className="rounded-l-none"
                            text={`${IsOpen?"Close Filters":"Open Filters"}`}
                            onClick={()=>SetIsOpen(!IsOpen)}/>

                         
                           
                                 <div 
                                    className="mx-auto bg-violet-900 max-w-3xl text-center py-4 border-2 border-violet-400 border-dotted 
                                    shadow-lg shadow-slate-900/100" >
                                  <img 
                                      className="max-h-32 mx-auto rounded-full"src="https://images.unsplash.com/photo-1602067340370-bdcebe8d1930?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"/>
                                  
                                   <p 
                                        className="w-full text-white text-xl mx-auto mt-2"> 
                                        Come join us in the play yard! Ask for advice, share ideas, or just chat! </p>
                                      
                                        <GeneralButton 
                                            text="Add a Post"
                                            className="ml-2 mt-2"
                                            onClick={()=>{setAddingPost(!addingPost)}}/>
                                  </div>

                                  {addingPost&& 
                                  
                    <AddPost 
                           tagListProp={tagListProp}
                            sessionFromServer={sessionFromServer}/> }
             {filteredPosts.map((post)=>{ 
              
                    return <BatsignalPost 
                                post={post}
                                key={post._id}             
                                className="mx-auto"
                                sessionFromServer={sessionFromServer}
                                commentList={commentList}
                                tagListProp={tagListProp}
                                />
                 } ) }  
        
              <div className="text-center mb-4">
                    <Pagination 
                      rounded total={20} 
                      // page={}
                      initialPage={1}/>
             </div>
        </section>


        </section>
        </div>
  )

  }
