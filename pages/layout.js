import React from 'react'
<link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet" />

 function layout() {
  return (
  
<div class="overflow-x-auto">
  <table class="min-w-full divide-y divide-gray-200 text-sm">

    <thead class="bg-gray-100">
      <tr>
        <th
          class="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"
        >
          Name
        </th>

        <th
          class="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"
        >
          Meaning
        </th>

        <th
          class="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"
        >
          tags
        </th>
       </tr>
    </thead>

    <tbody class="divide-y divide-gray-200">
      <tr>
        <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
          John Doe
        </td>
        <td class="whitespace-nowrap px-4 py-2 text-gray-700">24/05/1995</td>
       
      </tr>

      <tr>
        <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
          Jane Doe
        </td>
        <td class="whitespace-nowrap px-4 py-2 text-gray-700">04/11/1980</td>
      
      </tr>

      <tr>
        <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
          Gary Barlow
        </td>
        <td class="whitespace-nowrap px-4 py-2 text-gray-700">24/05/1995</td>
      
      </tr>
    </tbody>
  </table>
</div>

    )
}
export default layout