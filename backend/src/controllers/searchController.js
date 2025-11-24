import jwt from "jsonwebtoken";
import Search from "../models/Search.js";
import { runExe } from "./runExe.js";
import Job from "../models/Job.js";
import path from "node:path";

export async function buscar(req, res) {
  try {
    const userId = req.user.id;

    const { archivo, patron, coincidencias } = req.body;

    if (!archivo || !patron) {
      return res
        .status(400)
        .json({ message: "Hay campos vacíos" });
    }
        
    // Buscar el archivo real en la BD
    const job = await Job.findById(archivo);

    // Ruta absoluta al CSV
    const csvPath = path.resolve("uploads", job.storedFilename);
    
    if (!job) {
      return res.status(404).json({ message: "Job no encontrado" });
    }
    
    // Ejecutar el archivo .exe
    let resultadoExe;
    try {
      resultadoExe = await runExe(csvPath, patron);
    } catch (exeError) {
      console.error("Error ejecutando el EXE:", exeError);
      return res.status(500).json({ message: "Error al procesar el archivo .exe" });
    }

    // Parsear el JSON devuelto por el .exe
    let sospechosos;
    try {
      sospechosos = JSON.parse(resultadoExe.trim());
    } catch (parseError) {
      console.error("Error parseando JSON del EXE:", parseError);
      return res.status(500).json({ message: "El .exe devolvió un JSON inválido" });
    }

    const search = await Search.create({ usuario: userId, archivo: csvPath, patron, coincidencias: sospechosos.coincidencias || [] });

    res.status(201).json({
      search: {
        id: search._id,
        usuario: search.usuario,
        archivo: search.archivo,
        patron: search.patron,
        coincidencias: search.coincidencias
      },
    });
  } catch (err) {
    console.error("Error in buscar controller:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getBusquedas(req, res) {
  try {
    const userId = req.user.id;
    const busquedas = await Search.find({ usuario: userId });

    res.status(200).json(busquedas);
  } catch (error) {
    console.error("Error in getAllJobs controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
