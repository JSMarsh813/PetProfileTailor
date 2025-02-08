let removeDeletedContent = function (
  setListOfContent,
  listOfContent,
  deleteThisContentId,
  setDeleteThisContentId,
) {
  setListOfContent(
    listOfContent.filter(
      (ContentFromList) => ContentFromList._id != deleteThisContentId,
    ),
  ) && setDeleteThisContentId(null);
};

export default removeDeletedContent;
