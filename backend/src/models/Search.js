import mongoose from "mongoose";

const searchSchema = new mongoose.Schema(
  {
    email: {
      type: String
    },
    archivo: {
      type: String,
      required: true,
    },
    patron: {
      type: String,
      required: true,
      trim: true
    },
    coincidencias: {
      type: [String],  // lista de sospechosos coincidentes
      default: []
    }
  },
  {
    timestamps: true,
  }
);

const Search = mongoose.model("Search", searchSchema);

export default Search;
