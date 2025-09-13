import { useState } from "react";
import { useToggleState } from "./useToggleState";

export function useLikeState({
  data,
  userId,
  likedSetRef, // likes we got from the server
  recentLikesRef, // tracking changes to likedSetRef
  apiBaseLink,
}) {
  const contentId = data._id;

  const initialLiked = likedSetRef?.current.has(contentId); // true, false
  const initialCount = data.likedbycount; // 10

  // Local state only for rendering
  const [likeCount, setLikeCount] = useState(
    initialCount + (recentLikesRef?.current[contentId] || 0),
  );

  function calculateHowCountAdjusts() {
    // ### Tracking how we're adjusting the likes count to match the server ######
    if (initialLiked && !recentLikesRef.current[contentId]) return -1;
    // it was liked originally, we're unliking it
    if ([1, -1].includes(recentLikesRef.current[contentId])) return 0;
    // change back to default whether it was initiallly liked or not, we're just undoing the clicks we did in this session
    return 1;
    // otherwise like it
  }

  const {
    active: liked,
    isProcessing,
    toggle,
  } = useToggleState({
    id: userId,
    initialActive: initialLiked,
    body: { userId, id: contentId },
    apiUrl: `${apiBaseLink}/${contentId}/togglelike`,
    onApplyOptimistic: (newLiked) => {
      // newLiked = true or false, opposite of its initial liked/unliked state
      const originalRecentLike = recentLikesRef.current[contentId] || 0;
      // Save originalRecentLike somewhere we can reuse in rollback, keeping track if they originally:
      // 1. liked during the session: 1,
      // 2. unliked during this session: -1
      // 3. number was === to database state: 0
      const change = calculateHowCountAdjusts();
      recentLikesRef.current[contentId] = change;

      if (newLiked) {
        likedSetRef.current.add(contentId);
        setLikeCount((prev) => prev + 1);
      } else {
        likedSetRef.current.delete(contentId);
        setLikeCount((prev) => prev - 1);
      }
      // Return originalRecentLike so rollback can use it
      return originalRecentLike;
    },

    onRollback: (originalRecentLike) => {
      // use the saved originalRecentLike from onApplyOptimistic
      if (originalRecentLike === 1) likedSetRef.current.add(contentId); // restore previous like

      if (originalRecentLike === -1) likedSetRef.current.delete(contentId); // restore previous unlike
      recentLikesRef.current[contentId] = originalRecentLike;

      const rollbackCount = initialCount + originalRecentLike;

      setLikeCount(rollbackCount);
    },
  });

  return { liked, likeCount, isProcessing, toggleLike: toggle };
}
