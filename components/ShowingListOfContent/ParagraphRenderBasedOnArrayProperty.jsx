import React from 'react'

export default function TagListing({content, text}) {
  return (
    <p className="pb-2">  
    <span className="text-amber-100 font-bold">
      Tags: </span> 
    {content.tags[0] == null ? `no ${text}` : content.tags.map((tag) => tag.tag).join(",  ")}
</p>
  )
}

