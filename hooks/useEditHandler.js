import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export function useEditHandler({ apiEndpoint, mutate, setLocalData }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const openEdit = (target) => {
    // console.log("openEdit called with target:", target);
    if (!target?._id) {
      console.warn("openEdit called with invalid target!", target);
      return;
    }
    setEditTarget(target);
    setShowEditDialog(true);
  };

  const closeEdit = () => {
    setShowEditDialog(false);
    setEditTarget(null);
    setIsSaving(false);
  };

  const confirmEdit = async (editedData) => {
    if (!editTarget) return;

    setIsSaving(true);

    try {
      const res = await axios.put(apiEndpoint, {
        submission: {
          ...editedData,
          contentId: editTarget._id,
        },
      });

      const updatedItem = res.data?.data ??
        res.data ?? { ...editTarget, ...editedData };
      // normalized so updatedItem is always just the actual object to replace
      // console.log("response data", res.data);

      // console.log("updatedItem", updatedItem);
      // SWR case: update the cached array
      // console.log("SWR pages before mutate:", res.data);

      if (mutate) {
        // the api sends us { data: {name object}, message: "name updated"
        // so we need to do page.data to look at the actual content data
        // since my fetcher flattens the swr pages, all the content objects are in a flat array
        mutate(
          (pages = []) =>
            pages.map((page) => ({
              ...page,
              data: page.data.map((item) =>
                item._id === updatedItem._id ? updatedItem : item,
              ),
            })),
          false,
        );
      }
      // } else if (setLocalData) {
      //   setLocalData(updatedItem);
      // }
      setLocalData(updatedItem);
      // need to always set the local data, because the edit logic form grabs from the local state
      // since the edit hook itself won't rerender after the data's been edited
      // so whether its swr or local, the edit dialog will use state
      // this way, if the user edits the form, and goes to edit a 2nd time, they'll see the updated data
      setEditTarget(updatedItem); // <-- update modal’s editTarget so the edit form sees the update

      toast.success("Successfully edited!");

      closeEdit();
    } catch (error) {
      console.error("Error editing content:", error);
      toast.error("Failed to edit content!");
      setIsSaving(false);
    }
  };

  return {
    showEditDialog,
    editTarget,
    isSaving,
    openEdit,
    closeEdit,
    confirmEdit,
  };
}
