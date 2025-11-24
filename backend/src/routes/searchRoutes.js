import express from "express";
import { buscar, getBusquedas } from "../controllers/searchController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getBusquedas);
router.post("/buscar", auth, buscar);

export default router;
