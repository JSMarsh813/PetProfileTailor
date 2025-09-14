import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import Select from "react-select";
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { useCategoriesForDataType } from "@/hooks/useCategoriesForDataType";

export default function TagsSelectAndCheatSheet({
  dataType,
  tagsToSubmit,
  handleSelectChange,
  handleCheckboxChange,
}) {
  console.log({ tagsToSubmit, handleSelectChange, handleCheckboxChange });

  const { categoriesWithTags, tagList } = useCategoriesForDataType(dataType);

  // Map tagsToSubmit to the actual objects in tagList so React Select displays them

  // do NOT use filter, it will reorganized the array, so the selected tags won't appear in the order the user added them
  // we have to use map isntead to preserve the order
  const selectedOptions = tagsToSubmit.map(
    (tag) => tagList.find((option) => option.value === tag.value) || tag,
  );
  return (
    <div className="h-fit w-fit bg-secondary border-b-2 border-subtleWhite rounded-box py-2">
      <label
        className="font-bold block my-4 text-xl text-center text-subtleWhite"
        htmlFor="nameTags"
      >
        Tags
      </label>

      <Select
        unstyled
        className="text-subtleWhite border border-subtleWhite bg-secondary w-[96%] mx-auto"
        styles={{
          menu: (provided) => ({
            ...provided,
            backgroundColor: "rgb(20 2 35)",
            color: "rgb(221 214 254)",
            borderRadius: "0.5rem",
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#2563EB" : "rgb(20 2 35)",
            color: "rgb(221 214 254)",
            cursor: state.isDisabled ? "not-allowed" : "pointer",
          }),
        }}
        options={tagList}
        value={selectedOptions} // mapped to options
        isMulti
        isSearchable
        placeholder="Type tags here..."
        onChange={handleSelectChange}
      />

      <p className="my-4 text-subtleWhite text-center">
        Or use the tags cheat sheet
      </p>

      {categoriesWithTags.map((category) => (
        <Disclosure
          key={category._id}
          as="div"
          className="inline-block align-top mb-6 "
        >
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-[306px] border-t-2 border-subtleWhite bg-primary px-2 py-2 text-base font-medium text-subtleWhite hover:bg-blue-100 hover:text-blue-900 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                <span className="mx-auto">{category.category}</span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-blue-200`}
                />
              </Disclosure.Button>

              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-subtleWhite">
                <div className="space-y-6 mb-4">
                  {category.tags.map((tag) => {
                    const checked = tagsToSubmit.some(
                      (t) => t.value === tag._id,
                    );
                    return (
                      <label
                        key={tag._id}
                        htmlFor={tag._id}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-blue-700 px-1 py-1 rounded"
                      >
                        <input
                          id={tag._id}
                          type="checkbox"
                          className="sr-only peer"
                          checked={checked}
                          onChange={(e) =>
                            handleCheckboxChange({
                              id: tag._id,
                              label: tag.tag,
                              checked: e.target.checked,
                            })
                          }
                        />

                        <span
                          className={`
      border-2 border-violet-300 rounded flex items-center justify-center p-[7px]
      transition-colors duration-200
      bg-secondary text-subtleWhite
      peer-checked:bg-yellow-300 peer-checked:text-secondary
      peer-focus:ring-2 peer-focus:ring-yellow-400 peer-focus:outline-none
    `}
                        >
                          <FontAwesomeIcon icon={faPaw} />
                        </span>

                        <span className="text-subtleWhite">{tag.tag}</span>
                      </label>
                    );
                  })}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
}
