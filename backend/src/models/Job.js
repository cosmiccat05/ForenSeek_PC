// models/Job.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    storedFilename: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "done", "error"],
      default: "done",
    },
    responseSummary: {
      type: String,
    },
    responseData: {
      type: Object,
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
