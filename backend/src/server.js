import express from "express";
import notesRoutes from "./routes/noteRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app=express();
const PORT=process.env.PORT;

app.use(express.json())
app.use(rateLimiter);
app.use("/api/notes", notesRoutes)
app.use("/api/user", userRoutes)

connectDB().then(()=>{
    app.listen(PORT, ()=> {
        console.log("Servidor iniciado en PUERTO: 5001");
    });
});
