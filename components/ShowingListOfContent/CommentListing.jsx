import React from 'react'

function CommentListing() {
  return (
<div
    className="flex-col w-2/3 mx-auto py-4 bg-violet-50 
                rounded-lg px-4 mb-8">

{/*  w-full my-2 
    border-b-2 border-r-2 border-gray-200 
    sm:px-4 sm:py-4 md:px-4  sm:shadow-sm md:w-2/3 
    pb-10 */}

        <div className="flex flex-row">
                 <img className="w-12 h-12 border-2 border-gray-300 rounded-full" alt="Noob master's avatar"
                  src="https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&faces=1&faceindex=1&facepad=2.5&w=500&h=500&q=80"/>

                 <div className="flex-col mt-1">
                       <div className="flex items-center flex-1 px-4 font-bold  text-black leading-tight">Corgi Butts
                                <span className="ml-2 text-xs font-normal text-gray-500">2 weeks ago</span>
                       </div>
                        <div className="flex-1 px-2 ml-2 text-sm font-medium leading-loose text-gray-600">Wow!!! how you did you
                              create this?
                        </div>
   
                  </div>
        </div>

</div>


  )
}

export default CommentListing