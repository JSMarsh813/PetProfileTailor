// import React, { useState } from "react";
// import axios from "axios";
// import Select from "react-select";

// function AddNewTag({ categoryList }) {
//   const [newTag, setNewTag] = useState("");
//   const [category, setCategory] = useState([]);
//   const [isPending, setIsPending] = useState(false);

//   function handleNameSubmission(e) {
//     console.log({ categoryList });
//     e.preventDefault();
//     //prevent buttons default behavior

//     setIsPending(true);

//     const tagSubmission = [newTag];

//     // const tagSubmission= {
//     //    individualTag: newTag,
//     //    categories: category}
//     //    //from state

//     //  axios.post("http://localhost:3000/api/individualtags", tagSubmission).then(response => {
//     //        console.log(response)
//     //       setIsPending(false);
//     // }).catch(error => {
//     //  console.log("this is error", error);
//     // });
//     const categoryID = [];
//     //#########map through categories chosen, for those category id's add a new value to the tags array######
//     axios
//       .put("http://localhost:3000/api/individualtags", { tagSubmission })
//       .then((response) => {
//         console.log(response);
//         setIsPending(false);
//       })
//       .catch((error) => {
//         console.log("this is error", error);
//       });
//   }

//   return (
//     <div>
//       {console.log(categoryList[0])}

//       <section>
//         <h4 className="text-xl text-white"> Can't find the tag you need?</h4>
//         <p className="text-white">Click here to add the tag to our database </p>

//         <form onSubmit={handleNameSubmission}>
//           <input
//             type="text"
//             placeholder="*required enter a single tag"
//             onChange={(e) => setNewTag(e.target.value.toLowerCase())}
//           ></input>

//           <p>
//             {" "}
//             For example, the superhero tag can be under the "popular culture"
//             and "fiction" categories.{" "}
//           </p>
//           <p>
//             {" "}
//             If a suitable category is not available, select the "other" category
//           </p>

//           <Select
//             options={categoryList.map((opt, index) => ({
//               label: opt.name,
//               value: opt.individualname,
//             }))}
//             isMulti
//             isSearchable
//             placeholder="Add a category/categories"
//             onChange={(opt) =>
//               setCategory(opt.map((category) => category.label))
//             }
//           />
//           <button className="btn"> Add Tag here </button>
//         </form>
//       </section>
//     </div>
//   );
// }

// export default AddNewTag;
