import Job from "../models/Job.js";
import fs from "fs";
import csv from "csv-parser";

export async function getAllJobs(req, res) {
  try {
    const userId = req.user.id;

    const jobs = await Job.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error in getAllJobs controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getJobById(req, res) {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (error) {
    console.error("Error in getJobById controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createJob(req, res) {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No CSV file received" });
    }

    const { originalname, filename, path } = req.file;

    let rowCount = 0;
    let columnCount = 0;

    const rows = [];

    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (data) => {
        rows.push(data);
      })
      .on("end", async () => {
        rowCount = rows.length;
        columnCount = rows[0] ? Object.keys(rows[0]).length : 0;

        const result = {
          rows: rowCount,
          columns: columnCount,
          preview: rows.slice(0, 5),
        };

        // VALIDACIÓN: Debe tener mínimo 2 columnas
        if (columnCount != 2) {
          fs.unlink(path, () => {});
          
          return res.status(400).json({
            message: "El archivo CSV debe tener 2 columnas",
          });
        }

        const job = await Job.create({
          user: userId,
          originalFilename: originalname,
          storedFilename: filename,
          status: "done",
          responseSummary: `CSV con ${rowCount} filas y ${columnCount} columnas`,
          responseData: result,
        });

        res.status(201).json(job);
      });
  } catch (error) {
    console.error("Error in createJob controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteJob(req, res) {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error in deleteJob controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
