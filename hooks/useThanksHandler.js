import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export function useThanksHandler({ apiEndpoint }) {
  const [showThanksDialog, setShowThanksDialog] = useState(false);
  const [thanksTarget, setThanksTarget] = useState(null);
  const [isSavingThanks, setIsSavingThanks] = useState(false);

  const openThanks = (target) => {
    console.log("openThanks called with target:", target);
    const id = typeof target === "string" ? target : target?._id;
    if (!id) {
      console.warn("openThanks called with invalid target!", target);
      return;
    }
    console.log("this is id", id);
    setThanksTarget(id);
    setShowThanksDialog(true);
  };

  const closeThanks = () => {
    setShowThanksDialog(false);
    setThanksTarget(null);
    setIsSavingThanks(false);
  };

  const confirmThanks = async (thanksData) => {
    if (!thanksTarget) return;

    setIsSavingThanks(true);

    try {
      const res = await axios.put(apiEndpoint, {
        submission: {
          ...thanksData,
          contentId: thanksTarget._id,
        },
      });

      const submittedThanks = res.data?.data ??
        res.data ?? { ...thanksTarget, ...thanksData };
      // normalized so submittedThanks is always just the actual object to replace
      console.log("response data", res.data);

      console.log("submittedThanks", submittedThanks);

      toast.success("Successfully thanked!");

      closeThanks();
    } catch (error) {
      console.error("Error sending thanks:", error);
      toast.error("Failed to send thanks!");
      setIsSavingThanks(false);
    }
  };

  return {
    showThanksDialog,
    thanksTarget,
    isSavingThanks,
    openThanks,
    closeThanks,
    confirmThanks,
  };
}
