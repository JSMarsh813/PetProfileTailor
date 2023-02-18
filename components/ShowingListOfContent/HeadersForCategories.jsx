import React from 'react'

export default function HeadersForCategories() {
  return (
                   
    <section 
          className="grid lg:grid-cols-5
          grid-cols-3 gap-4 
          bg-purple-100
          text-darkPurple p-2"> 
        <span> Like </span>
        <span> Description</span>
        <span> Notes </span>
        <span> Tags </span>
        <span> Created By </span>
     </section>


  )
}
