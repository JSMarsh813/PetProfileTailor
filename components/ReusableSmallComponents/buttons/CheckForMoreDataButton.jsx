import React from "react";
import GeneralButton from "./GeneralButton";

export default function CheckForMoreDataButton({
  page,
  filteredListLastPage,
  setSizeFunction,
}) {
  return (
    <div>
      {page >= filteredListLastPage && (
        <div className="text-center my-4">
          <GeneralButton
            text="Check for more"
            className=""
            type="submit"
            onClick={() => setSizeFunction(page + 1)}
          />

          <p>
            You have reached the end of the list! However you can click "check
            more" again to check for just-added data.
          </p>
        </div>
      )}
    </div>
  );
}
