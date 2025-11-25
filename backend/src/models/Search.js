import mongoose from "mongoose";

const searchSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    archivo: {
      type: String,
      required: true,
    },
    nombreOriginal: {
      type: String,
      required: true,
    },
    patron: {
      type: String,
      required: true,
      trim: true
    },
    coincidencias: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
  }
);

const Search = mongoose.model("Search", searchSchema);

export default Search;
