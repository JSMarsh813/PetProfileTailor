import React, { useContext, createContext, useState, useEffect } from 'react'
// import { unstable_getServerSession } from "next-auth/next";

// import { authOptions } from "./auth/[...nextauth]";'@fortawesome/fontawesome-svg-core'
// // create context
const UserSessionContext = createContext("null")






// https://www.youtube.com/watch?v=t9WmZFnE6Hg&ab_channel=PedroTech
// 6:53 null is good for testing

//The defaultValue argument is only used when a component does not have a matching Provider above it in the tree. https://reactjs.org/docs/context.html


//We then create the prop that we're going to insert into UserSessionContext
// function UserSessionContext() {
//     const [user, setUser] = useState({})
  
//     return (
//       <ThemeContext.Provider value={{ theme, setTheme }}>
//         <ChildComponent />
//       </ThemeContext.Provider>
//     )
//   }



// const UserContextProvider = ({ children }) => {
//     // the value that will be given to the context https://devtrium.com/posts/how-use-react-context-pro

//     //these children refer to the components WITHIN the data provider https://www.youtube.com/watch?v=ngVvDegsAW8&ab_channel=DaveGray 2:32, see the return statement

//     const [user, setUser] = useState(null);

//       // fetch a user from a fake backend API
//   useEffect(() => {
//     const fetchUser = () => {
//       // this would usually be your own backend, or localStorage
//       // for example
//       fetch("https://randomuser.me/api/")
//         .then((response) => response.json())
//         .then((result) => setUser(result.results[0]))
//         .catch((error) => console.log("An error occured"));
//     };

//     fetchUser();
//   }, []);

//   return (
//     // the Provider gives access to the context to its children
//     <UserSessionContext.Provider value={user}>
//       {children}
//     </UserSessionContext.Provider>
//   );
// };

export default UserSessionContext

// export { UserSessionContext , UserContextProvider };

// //https://devtrium.com/posts/how-use-react-context-pro
// //UserContext.jsx

// //export default? https://www.youtube.com/watch?v=ngVvDegsAW8&ab_channel=DaveGray 3:47