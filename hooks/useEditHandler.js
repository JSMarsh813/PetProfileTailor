import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export function useEditHandler({ apiEndpoint, mutate, setLocalData }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const openEdit = (target) => {
    console.log("openEdit called with target:", target);
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
        nameSubmission: {
          ...editedData,
          nameId: editTarget._id,
        },
      });

      const updatedItem = res.data?.data ??
        res.data ?? { ...editTarget, ...editedData };
      // normalized so updatedItem is always just the actual object to replace
      console.log("response data", res.data);

      console.log("updatedItem", updatedItem);
      // SWR case: update the cached array
      if (mutate) {
        // the api sends us { data: {name object}, message: "name updated"
        // so we need to do page.data to look at the actual content data
        // since my fetcher flattens the swr pages, all the content objects are in a flat array

        mutate((pages = []) => {
          return pages.map((page) => ({
            ...page,
            data: page.data.map((item) => {
              if (item._id === updatedItem._id) {
                return updatedItem;
              }
              return item;
            }),
          }));
        }, false);
        // else if we're not using SWR (aka a single page), do this:
      } else if (setLocalData) {
        setLocalData(updatedItem);
      }

      toast.success("Successfully edited!");

      closeEdit();
    } catch (error) {
      console.error("Error editing name:", error);
      toast.error("Failed to edit name!");
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
