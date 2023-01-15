import React from 'react'

function RankNames(points) {

  let rankName=""
  let rankTitlesByPoints ={
    0: "Possessor of the Babiest Toe Beans",
    1: "Autodromkatzerl/Bumper Car Tail Kitten",
    2: "The Tiniest Woofer",
    3: "World Class Shoe Chewer",
    4: "Baby Gate Jumper Extraordinaire",    
  }
let pointsDividedBy10=Math.floor(+Object.values(points)/10)

      rankName= rankTitlesByPoints[pointsDividedBy10]||"A good pupper"
   
  return (
    <span className="text-yellow-400">{` ${rankName}`}</span>
  )
}

export default RankNames