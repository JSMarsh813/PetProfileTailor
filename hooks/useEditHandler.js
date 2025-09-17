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
        submission: {
          ...editedData,
          contentId: editTarget._id,
        },
      });

      const updatedItem = res.data?.data ??
        res.data ?? { ...editTarget, ...editedData };
      // normalized so updatedItem is always just the actual object to replace
      console.log("response data", res.data);

      console.log("updatedItem", updatedItem);
      // SWR case: update the cached array
      console.log("SWR pages before mutate:", res.data);

      if (mutate) {
        // the api sends us { data: {name object}, message: "name updated"
        // so we need to do page.data to look at the actual content data
        // since my fetcher flattens the swr pages, all the content objects are in a flat array
        mutate(
          (prev) =>
            prev.map((item) =>
              item._id === updatedItem._id ? updatedItem : item,
            ),
          { revalidate: false },
        );
      } else if (setLocalData) {
        setLocalData(updatedItem);
      }

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
