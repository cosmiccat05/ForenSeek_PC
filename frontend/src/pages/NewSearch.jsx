import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, FileText, X } from "lucide-react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import Button from "../components/common/Button";
import "../styles/pages/search.css";
import api from "../services/api";

const NewSearch = () => {
  const navigate = useNavigate();

  //estados
  const [step, setStep] = useState("upload");
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pattern, setPattern] = useState("");
  const [results, setResults] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [job, setJob] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  //handlers de drag & drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".csv")) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setUploadError(null);
    setJob(null);
    setUploadProgress(0);
    setStep("loading");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await api.post("/jobs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          if (!event.total) return;
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        },
      });

      setJob(response.data);
      setStep("loaded");
    } catch (error) {
      console.error("Error subiendo archivo:", error);
      setUploadError(error.message || "Error al subir el archivo");
      setFile(null);
      setUploadProgress(0);
      setStep("upload");
      alert(error.message || "Error al subir el archivo");
    }
  };

  const handleCancel = () => {
    setFile(null);
    setUploadProgress(0);
    setStep("upload");
    setPattern("");
    setResults(null);
    setJob(null);
    setUploadError(null);
  };

  const handleNext = () => {
    setStep("pattern");
    setResults(null); //limpiar resultados previos
  };

  const handleSearch = () => {
    setIsSearching(true);

    setTimeout(() => {
      const isSuccess = pattern.length > 10;

      setResults({
        success: isSuccess,
        matches: isSuccess ? 5 : 0,
        suspects: isSuccess
          ? [
              "Sospechoso 01",
              "Sospechoso 02",
              "Sospechoso 03",
              "Sospechoso 04",
              "Sospechoso 05",
            ]
          : [],
      });

      setIsSearching(false);
      setStep("results");
    }, 1500);
  };

  const handleNewPattern = () => {
    setPattern("");
    setResults(null);
    setStep("pattern");
  };

  const handleViewHistory = () => {
    navigate("/search/history");
  };

  const goBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="search-page">
      <Header />

      <main className="search-content">
        {/* Botón volver */}
        <button className="back-button" onClick={goBack}>
          <ArrowLeft size={20} />
          <span>Volver al inicio</span>
        </button>

        {/* Título */}
        <h1 className="search-title">Nueva búsqueda de ADN</h1>

        {/* ESTADO 1: Subir archivo */}
        {step === "upload" && (
          <>
            <p className="search-subtitle">
              Cargue su archivo CSV y busque su cadena
            </p>

            <div
              className={`upload-zone ${isDragging ? "dragging" : ""}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileText size={64} className="upload-icon" />
              <p className="upload-text">
                Arrastre el archivo CSV o cárguelo desde su computadora
              </p>

              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="file-input"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="upload-button">
                <Upload size={18} />
                <span>Subir</span>
              </label>

              {uploadError && <p className="upload-error">{uploadError}</p>}
            </div>
          </>
        )}

        {/* ESTADO 2: Cargando archivo */}
        {step === "loading" && (
          <>
            <p className="search-subtitle">Cargando... Espere un momento.</p>

            <div className="loading-card">
              <div className="file-info">
                <FileText size={24} />
                <span>{file?.name}</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              <div className="loading-actions">
                <Button variant="secondary" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button variant="primary" disabled>
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        )}

        {/* ESTADO 3: Archivo cargado */}
        {step === "loaded" && (
          <>
            <p className="search-subtitle">Archivo cargado con éxito.</p>

            <div className="loaded-card">
              <div className="file-display">
                <FileText size={24} />
                <span>{file?.name}</span>
                <button className="remove-file" onClick={handleCancel}>
                  <X size={20} />
                </button>
              </div>

              {job?.responseSummary && (
                <p className="upload-summary">{job.responseSummary}</p>
              )}

              <div className="loaded-actions">
                <Button variant="secondary" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={handleNext}>
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        )}

        {/* ESTADO 4: Ingresar patrón */}
        {step === "pattern" && (
          <>
            <p className="search-subtitle">
              Busque un patrón ADN en el archivo cargado
            </p>

            <div className="pattern-section">
              <label className="pattern-label">
                Inserte el patrón de ADN a buscar
              </label>
              <input
                type="text"
                className="pattern-input"
                placeholder="AAAABBBBCCCC"
                value={pattern}
                onChange={(e) => setPattern(e.target.value.toUpperCase())}
              />

              <Button
                variant="primary"
                onClick={handleSearch}
                disabled={!pattern || isSearching}
              >
                {isSearching ? "Buscando..." : "Buscar"}
              </Button>
            </div>
          </>
        )}

        {/* ESTADO 5: Resultados */}
        {step === "results" && results && (
          <>
            <p className="search-subtitle">
              Busque un patrón ADN en el archivo cargado
            </p>

            <div className="pattern-section-with-results">
              <label className="pattern-label">
                Inserte el patrón de ADN a buscar
              </label>
              <input
                type="text"
                className="pattern-input"
                placeholder="AAAABBBBCCCC"
                value={pattern}
                onChange={(e) => setPattern(e.target.value.toUpperCase())}
              />

              <Button
                variant="primary"
                onClick={handleSearch}
                disabled={!pattern || isSearching}
              >
                {isSearching ? "Buscando..." : "Buscar"}
              </Button>
            </div>

            {/* Card de resultados */}
            <div className="results-card">
              <h3 className="results-title">Resultado de búsqueda</h3>

              <span
                className={`results-badge ${
                  results.success ? "success" : "failure"
                }`}
              >
                {results.success ? "EXITOSO" : "FRACASO"}
              </span>

              <div className="results-info">
                <p>
                  <strong>Coincidencias encontradas:</strong> {results.matches}
                </p>

                <p className="suspects-label">Lista de sospechosos:</p>

                {results.suspects.length > 0 ? (
                  <ul className="suspects-list">
                    {results.suspects.map((suspect, index) => (
                      <li key={index}>{`{${suspect}}`}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-suspects">No se encontraron sospechosos</p>
                )}
              </div>

              <div className="results-actions">
                <Button variant="secondary" onClick={handleViewHistory}>
                  Ver el historial
                </Button>
                <Button variant="primary" onClick={handleNewPattern}>
                  Buscar otro patrón
                </Button>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NewSearch;
