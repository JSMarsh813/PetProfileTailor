import { useState } from "react";
import { useSWRConfig } from "swr";

export function useDeleteConfirmation() {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { mutate } = useSWRConfig();

  function openDelete(target) {
    setDeleteTarget(target);
    setShowDeleteConfirmation(true);
  }

  function closeDelete() {
    setDeleteTarget(null);
    setShowDeleteConfirmation(false);
  }

  async function confirmDelete(apiLink, signedInUsersId, mutate) {
    if (!deleteTarget) return;

    // Optimistically remove from every page
    mutate(
      (pages) =>
        pages.map((page) => ({
          ...page,
          data: page.data.filter((item) => item._id !== deleteTarget._id),
          totalDocs: page.totalDocs - 1, // keep count accurate
        })),
      false,
    );

    try {
      await fetch(apiLink, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentId: deleteTarget._id,
          signedInUsersId,
        }),
      });

      // Revalidate pages
      mutate();
    } catch (err) {
      console.error("Failed to delete", err);
      mutate(); // rollback
    }

    closeDelete();
  }

  return {
    showDeleteConfirmation,
    deleteTarget,
    openDelete,
    closeDelete,
    confirmDelete,
  };
}
