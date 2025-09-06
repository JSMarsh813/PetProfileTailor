// import Select from "react-select";
// import React, { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import Image from "next/image";

// function NewNameWithTagsData({ tagList, userId, sessionFromServer }) {
//   const { data: session, status } = useSession();

//   const [newName, setNewName] = useState("");
//   const [tags, setTags] = useState([]);
//   const [isPending, setIsPending] = useState(false);
//   const [nameAlreadyExists, setNameExists] = useState(false);
//   const [description, setDescription] = useState("");

//   function handleNameSubmission(e) {
//     e.preventDefault();
//     setIsPending(true);

//     const nameSubmission = {
//       name: newName,
//       description: description,
//       tags: tags,
//       createdby: userId.toString(),
//     };

//     // #######if the collection does not have the name, do this (allow post): otherwise update setNameExists to true and do not allow the post
//     axios
//       .post("/api/individualnames", nameSubmission)
//       .then((response) => {
//         setIsPending(false);
//         toast.success(
//           `Successfully added name: ${newName}. Heres 3 treat points as thanks for your contribution ${sessionFromServer.user.name}!`
//         );
//       })
//       .catch((error) => {
//         console.log("this is error", error);
//         setNameExists(true);
//         setIsPending(false);
//         toast.error(`Ruh Roh! ${newName} not added`);
//       });
//   }

//   return (
//     <div
//       style={{ width: "700px" }}
//       className="mx-auto"
//     >
//       <section className="my-6">
//         <p> Add a name with one or more tags. </p>

//         <h6 className="mt-4 ml-4"> Example: A dog named batman </h6>

//         <div className="w-52 mx-auto">
//           <Image
//             className="w-52 ml-6
//                 mb-4"
//             src="https://i.pinimg.com/originals/19/44/92/194492b23b8f04d3e624eb7b6148c1be.jpg"
//             width={100}
//             height={100}
//             layout="responsive"
//             alt="React Image"
//           />
//         </div>
//         <p className="ml-6">
//           Batman could have the tags: comics, superheroes, batman, male, edgy
//         </p>

//         <form onSubmit={handleNameSubmission}>
//           {/* needs label and value for Select to work  */}
//           <label
//             className="font-bold block mt-4"
//             htmlFor="nameInput"
//           >
//             New Name
//           </label>
//           <input
//             type="text"
//             id="nameInput"
//             className="text-secondary"
//             placeholder="enter a name to add"
//             onChange={(e) => setNewName(e.target.value.toLowerCase())}
//             disabled={sessionFromServer ? "" : "disabled"}
//             onClick={(e) => setNameExists(false)}
//           ></input>
//           {nameAlreadyExists == true && (
//             <p className="text-red-500 font-bold">Name already exists</p>
//           )}

//           {/* Description */}
//           <label
//             className="font-bold block mt-4"
//             htmlFor="nameDescription"
//           >
//             Description (optional)
//           </label>
//           <textarea
//             type="text"
//             id="nameDescription"
//             className="text-secondary block w-full"
//             placeholder="optional description: please add anything that would be useful to know. Examples: the name's meaning, popular fictional or historical figures with this name, ect"
//             onChange={(e) => setDescription(e.target.value.trim())}
//           ></textarea>

//           <label
//             className="font-bold block mt-4"
//             htmlFor="nameTags"
//           >
//             Tags
//           </label>
//           <Select
//             className="text-secondary mb-4"
//             id="nameTags"
//             options={tagList.map((opt, index) => ({
//               label: opt.nameTag,
//               value: opt.nameTag,
//             }))}
//             isMulti
//             isSearchable
//             placeholder="If you type in the tags field, it will filter the tags"
//             onChange={(opt) => setTags(opt.map((tag) => tag.label))}
//           />

//           {/* BUTTON */}

//           {!isPending && (
//             <button
//               className={`font-bold py-2 px-4 border-b-4 mt-2 rounded

//                 ${
//                   sessionFromServer
//                     ? "mt-4 bg-yellow-300 text-violet-800 border-yellow-100                         hover:bg-blue-400                       hover:text-white                     hover:border-blue-500"
//                     : "bg-slate-800"
//                 }`}
//               disabled={sessionFromServer ? "" : "disabled"}
//               onClick={handleNameSubmission}
//             >
//               Add name {!sessionFromServer && "(disabled)"}
//             </button>
//           )}

//           {isPending && (
//             <button
//               className="btn"
//               disabled
//             >
//               {" "}
//               Adding name ...{" "}
//             </button>
//           )}

//           {!sessionFromServer && (
//             <span className="mt-4 bg-red-800 p-2 text-white font-bold border-2 border-yellow-300 block text-center">
//               Please sign in to submit a name{" "}
//             </span>
//           )}
//         </form>
//       </section>
//     </div>
//   );
// }

// export default NewNameWithTagsData;
