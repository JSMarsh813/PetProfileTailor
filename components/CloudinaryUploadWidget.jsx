// import React, { Component } from "react";

// class CloudinaryUploadWidget extends Component {

//   componentDidMount() {
//     var myWidget = window.cloudinary.createUploadWidget(
//       {
//         cloudName: "dujellms1",
//         uploadPreset: "noyhrbxs"
//       },

//        // cloudName: process.env.cloud_name,
//         // uploadPreset: "noyhrbxs"
//       (error, result) => {
//         if (!error && result && result.event === "success") {
//           console.log("Done! Here is the image info: ", result.info);
//         }
//       }
//     );
//     document.getElementById("upload_widget").addEventListener(
//       "click",
//       function () {
//         myWidget.open();
//       },
//       false
//     );
//   }

//   render() {
//     return (
//       <button id="upload_widget" className="cloudinary-button">
//         Upload
//       </button>
//     );
//   }
// }

// export default CloudinaryUploadWidget;
