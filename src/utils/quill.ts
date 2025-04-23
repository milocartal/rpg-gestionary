export const modules = {
  toolbar: [
    [{ header: ["1", "2", "3", "4", "5", "6", false] }],
    //[{ size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ font: [] }],
    [{ color: [] }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
  history: {
    delay: 2000,
    maxStack: 500,
    userOnly: false,
  },
};
