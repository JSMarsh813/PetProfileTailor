import { leanWithStrings } from "../mongoDataCleanup";

export async function getPaginatedNotifications(
  model,
  filter = { contentCreator: userId },
  populateOptions = [],
  { page = 1, limit = 25 } = {},
) {
  const skip = (page - 1) * limit;

  const docs = await leanWithStrings(
    model
      .find(filter)
      .populate(populateOptions)
      .sort({ read: 1, createdAt: -1 })
      //read: 1 means ascending order → false (0) comes before true (1).
      // createdAt: -1 means descending order → newest first.
      // Combined:
      // All unread (read: false) appear first.
      // Within unread → newest first.
      // Then read ones → also newest first.
      .skip(skip)
      .limit(limit),
  );

  return docs;
}
