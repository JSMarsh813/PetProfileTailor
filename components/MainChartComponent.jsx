import React from "react";
import NameListing from "../components/ShowingListOfContent/Namelisting";

function ChartComponent({ nameList, session }) {
  return (
    <table className="min-w-full divide-y divide-gray-100 text-base">
      {console.log(nameList)}

      <thead className="bg-purple-100">
        <tr>
          <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-purple-900 ">
            Like
          </th>

          <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-purple-900 ">
            Name
          </th>

          <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-purple-900">
            Meaning
          </th>

          <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-purple-900">
            tags
          </th>
        </tr>
      </thead>
      <tbody className=" text-violet-100">
        {nameList.map((name) => {
          return <NameListing key={name._id} name={name} session={session} />;
        })}
      </tbody>
    </table>
  );
}

export default ChartComponent;
