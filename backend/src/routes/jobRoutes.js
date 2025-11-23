import express from "express";
import multer from "multer";
import {
  getAllJobs,
  getJobById,
  createJob,
  deleteJob,
} from "../controllers/jobController.js";
import auth from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", auth, getAllJobs);
router.get("/:id", auth, getJobById);
router.post("/", auth, upload.single("file"), createJob);
router.delete("/:id", auth, deleteJob);

export default router;
