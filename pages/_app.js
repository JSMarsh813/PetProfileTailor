// import "../styles/globals.css";
// import { SessionProvider } from "next-auth/react";
// import { Analytics } from "@vercel/analytics/next";

// import "@etchteam/next-pagination/dist/index.css";

// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Router from "next/router";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEnvelope, faMessage } from "@fortawesome/free-solid-svg-icons";

// import Head from "next/head";
// import { CategoriesAndTagsProvider } from "@/context/CategoriesAndTagsContext";

// import dbConnect from "@utils/db";
// import NameCategory from "@models/NameCategory";
// import DescriptionCategory from "@/models/DescriptionCategory";

// export async function getServerSideProps(context) {
//   await dbConnect.connect();

//   const nameCategory = await NameCategory.find()
//     .populate("tags")
//     .sort({ order: 1, _id: 1 })
//     .lean();
//   // _id:1 is there just in case a category doesn't have an order property, it will appear at the end

//   console.log("nameCategory", nameCategory);
//   const nameCategoryJSON = await JSON.parse(JSON.stringify(nameCategory));

//   const descrCategory = await DescriptionCategory.find()
//     .populate("tags")
//     .sort({ order: 1, _id: 1 })
//     .lean();

//   const descCategoryJSON = await JSON.parse(JSON.stringify(descrCategory));

//   return {
//     props: {
//       nameCategoryJSON,
//       descCategoryJSON,
//     },
//   };
// }

// function MyApp({
//   Component,
//   pageProps: { session, nameCategoryJSON, descCategoryJSON, ...pageProps },
// }) {
//   return (
//     <SessionProvider
//       session={session}
//       limit={1}
//     >
//       <CategoriesAndTagsProvider
//         descrCateg={descCategoryJSON}
//         nameCateg={nameCategoryJSON}
//       >
//         <Head>
//           <title>
//             Improve Adoption Rates by Creating Impactful, Fun, and Tailor-Fitted
//             Pet Adoption Profiles!
//           </title>
//           <meta
//             name="Tailored Pet Names"
//             content="Tailored Pet Names is a community powered assistant which helps you find the perfect pet name or create pet profiles which are impactful, fun, and tailor fitted. Animal welfare professionals can use the community submitted names or descriptions to create engaging pet profiles to improve adoption rates!"
//           />
//         </Head>
//         <Component {...pageProps} />
//         <Analytics />
//         <ToastContainer />
//         <footer className="text-white py-4 px-4 bg-secondary border-t-2 border-violet-400 flex">
//           <div className="flex-1">
//             <h6> Credits: </h6>
//             <a
//               className="text-xs block"
//               href="https://thenounproject.com/icon/bat-72023/"
//             >
//               <span> Bat icon by Megan Mitchell, from thenounproject.com.</span>
//             </a>

//             <a
//               className="text-xs block"
//               href="https://www.freepik.com/author/freepik/icons/kawaii-flat_45#from_element=resource_detail"
//             >
//               <span className="text-xs inline-block">
//                 Default user icons created by freepik, Kawaii Flat family
//               </span>
//             </a>
//           </div>

//           <div className="flex-end">
//             <h4> Contact: </h4>

//             <span className="block">
//               <FontAwesomeIcon
//                 icon={faEnvelope}
//                 className="mr-2"
//               />
//               <button
//                 type="button"
//                 onClick={() => Router.push("mailto:petprofiletailor@gmail.com")}
//               >
//                 Email
//               </button>
//             </span>

//             <span className="block">
//               <a href="https://twitter.com/Janetthedev">
//                 <FontAwesomeIcon
//                   icon={faMessage}
//                   className="mr-2"
//                 />
//                 Message On Twitter
//               </a>
//             </span>
//           </div>
//         </footer>
//       </CategoriesAndTagsProvider>
//     </SessionProvider>
//   );
// }

// export default MyApp;
