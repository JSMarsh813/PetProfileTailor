const mongoose = require("mongoose");

const accountHistorySchema = new mongoose.Schema(
  {
    accountchanges: {
      type: Array,
      required: false,
      unique: false,
    },
    flaggedbehavior: {
      type: Array,
      required: false,
      unique: false,
    },
    notes: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true },
  {
    strict: true,
    strictQuery: false, // Turn off strict mode for query filters
  },
);

const accounthistory =
  mongoose.models.accounthistory ||
  mongoose.model("accounthistory", accountHistorySchema);
export default accounthistory;
