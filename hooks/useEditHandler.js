import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export function useEditHandler({ apiEndpoint, mutate }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const openEdit = (target) => {
    console.log("openEdit called with target:", target); // <— add this
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
      await axios.put(apiEndpoint, {
        nameSubmission: {
          ...editedData,
          nameId: editTarget._id,
        },
      });

      toast.success("Successfully edited!");
      mutate(); // refresh SWR data
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
