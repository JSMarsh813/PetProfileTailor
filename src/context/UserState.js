// import React, { useContext, createContext, useState, useEffect } from 'react'

// // create context
// const UserSessionContext = createContext(null)
// // https://www.youtube.com/watch?v=t9WmZFnE6Hg&ab_channel=PedroTech
// // 6:53 null is good for testing


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

// export { UserSessionContext , UserContextProvider };

// //https://devtrium.com/posts/how-use-react-context-pro
// //UserContext.jsx

// //export default? https://www.youtube.com/watch?v=ngVvDegsAW8&ab_channel=DaveGray 3:47