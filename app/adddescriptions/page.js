import PageTitleWithImages from "@components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import AddingDescription from "@components/AddingNewData/addingdescription";

function AddDescriptions() {
  return (
    <div>
      <PageTitleWithImages
        title="Add a"
        title2="Description"
      />
      <AddingDescription />
    </div>
  );
}

export default AddDescriptions;
