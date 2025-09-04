import { Disclosure } from "@headlessui/react";

export default function CategoriesAndTagsCheatSheet({
  category,
  handleTagsChange,
  IsOpen,
  tagsToSubmit,
}) {
  return (
    <div
      className={`h-fit w-fit bg-blue-950 border-b-2  border-solid border-blue-300 rounded-box place-items-center ${
        IsOpen ? "" : "hidden"
      }`}
    >
      {/* mapping through categories ex: gender, holidays */}
      {category.map((category, index) => {
        return (
          <Disclosure
            key={category.$id}
            as="div"
            className="inline-block align-top"
            defaultOpen
          >
            {/* https://github.com/tailwindlabs/headlessui/issues/3351 as div needed as a workaround for the headlessui bug "Invalid prop data-headlessui-state supplied to React.Fragment. React.Fragment can only have key and children props." */}
            {/* defaultOpen will have the disclosure stay open*/}
            {({ open }) => (
              <>
                {/* Category name */}
                <Disclosure.Button
                  className="flex justify-between w-[244px] border-t-2 border-blue-300 bg-blue-900 px-2 py-2 text-base font-medium text-white
                 hover:bg-blue-100  hover:text-blue-900 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 "
                >
                  <span>{category.category_name} </span>
                  <ChevronUpIcon
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-blue-200`}
                  />
                </Disclosure.Button>

                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                  <div className="space-y-6">
                    {/* mapping through category options and assigning them a button (ex: male, female, unisex)*/}

                    {category.tags.map((option, index) => (
                      <div
                        key={option.$id}
                        className="flex items-center hover:bg-blue-700"
                      >
                        {/* adds a checkbox*/}
                        <input
                          id={option.$id}
                          name={`${option.tag_name}`}
                          value={option.tag_name}
                          type="checkbox"
                          onChange={handleTagsChange}
                          className="h-4 w-4 rounded  focus:ring-amber-600"
                          checked={tagsToSubmit.some(
                            (tag) => tag.value === option.$id,
                          )}
                          // ^^^ This line controls the checked state
                        />

                        {/* shows the actual description (male, female, unisex ect for gender) */}
                        <label
                          htmlFor={`filter-mobile-${index}`}
                          className="ml-3 min-w-0 flex-1 text-base text-blue-100 "
                        >
                          {option.tag_name}
                        </label>
                      </div>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        );
      })}
    </div>
  );
}
