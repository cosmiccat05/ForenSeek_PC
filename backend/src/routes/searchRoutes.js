import express from "express";
import { buscar } from "../controllers/searchController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/buscar", auth, buscar);

export default router;
