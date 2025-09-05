import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import Select from "react-select";
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";

export default function TagsSelectAndCheatSheet({
  categoriesWithTags,
  tagsToSubmit,
  handleSelectChange,
  handleCheckboxChange,
}) {
  console.log("Child debug:");
  console.log({ tagsToSubmit, handleSelectChange, handleCheckboxChange });

  // Flatten all tags into a single list for the select dropdown
  const tagList = useMemo(() => {
    return categoriesWithTags.flatMap((cat) =>
      cat.tags.map((tag) => ({ label: tag.tag, value: tag._id })),
    );
  }, [categoriesWithTags]);

  // Map tagsToSubmit to the actual objects in tagList so React Select displays them
  const selectedOptions = tagList.filter((option) =>
    tagsToSubmit.some((tag) => tag.value === option.value),
  );

  return (
    <div className="h-fit w-fit bg-darkPurple border-b-2 border-subtleWhite rounded-box py-2">
      <label
        className="font-bold block mt-4 text-subtleWhite"
        htmlFor="nameTags"
      >
        Tags
      </label>

      <Select
        unstyled
        className="text-subtleWhite border border-subtleWhite bg-darkPurple w-[96%] mx-auto"
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
        placeholder="Filter tags here..."
        onChange={handleSelectChange}
      />

      <p className="my-4 text-subtleWhite">Or use the tags cheat sheet</p>

      {categoriesWithTags.map((category) => (
        <Disclosure
          key={category._id}
          as="div"
          className="inline-block align-top mb-6"
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
                        className="flex items-center space-x-2 cursor-pointer hover:bg-blue-700 px-1 py-1 rounded"
                      >
                        <input
                          type="checkbox"
                          className="peer hidden"
                          checked={checked}
                          onChange={(e) =>
                            handleCheckboxChange({
                              id: tag._id,
                              label: tag.tag,
                              checked: e.target.checked,
                            })
                          }
                        />

                        <span className="border-2 border-violet-300 rounded flex items-center justify-center bg-darkPurple peer-checked:bg-yellow-300 p-[7px] peer-checked:text-darkPurple text-subtleWhite transition-colors duration-200">
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
