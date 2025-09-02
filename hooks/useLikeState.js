import { useState } from "react";

export function useLikeState({
  data,
  userId,
  likedSetRef,
  recentLikesRef,
  apiBaseLink,
}) {
  const nameId = data._id;

  const initialLiked = likedSetRef?.current.has(nameId); // true, false
  const initialCount = data.likedbycount; // 10

  // Local state only for rendering
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(
    initialCount + (recentLikesRef.current[nameId] || 0),
  );

  const [isProcessing, setIsProcessing] = useState(false);
  // if the user went backwards, we'd need to update the count to reflect the recent changes they made

  function calculateHowCountAdjusts() {
    let currentChange;
    if (initialLiked && !recentLikesRef.current[nameId]) {
      // it was liked originally, but we hadn't clicked on it yet in this session
      currentChange = -1;
      // unlike it
    } else if (
      recentLikesRef.current[nameId] === 1 ||
      recentLikesRef.current[nameId] === -1
    ) {
      currentChange = 0;
      // change back to default whether it was initiallly liked or not, we're just undoing the clicks we did in this session
    } else {
      currentChange = 1;
      // otherwise like it
    }
    return currentChange;
  }

  // ############ Handle Click ##############################
  const toggleLike = async () => {
    if (isProcessing) return;
    console.log("toggleLike clicked!", nameId);
    setIsProcessing(true);

    const currentNameCountChange = calculateHowCountAdjusts();
    //  ### Tracking how we're adjusting the likes count to match the server ######

    const newLikedStatus = !liked;
    const prevChange = recentLikesRef.current[nameId] || 0;

    if (newLikedStatus) {
      likedSetRef.current.add(nameId);
      recentLikesRef.current[nameId] = currentNameCountChange;
      setLikeCount((prev) => prev + 1);
    } else {
      likedSetRef.current.delete(nameId);
      recentLikesRef.current[nameId] = currentNameCountChange;
      setLikeCount((prev) => prev - 1);
    }

    setLiked(!liked);

    try {
      await fetch(`${apiBaseLink}/${nameId}/togglelike`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
    } catch (err) {
      console.log("an error occured");

      if (prevChange === 1) likedSetRef.current.delete(nameId);
      if (prevChange === -1) likedSetRef.current.add(nameId);
      recentLikesRef.current[nameId] = prevChange;

      const rollbackLiked =
        likedSetRef.current.has(nameId) || recentLikesRef.current[nameId] === 1;
      const rollbackCount = initialCount + prevChange;

      setLiked(rollbackLiked);
      setLikeCount(rollbackCount);
    } finally {
      setIsProcessing(false);
    }
  };

  return { liked, likeCount, isProcessing, toggleLike };
}
