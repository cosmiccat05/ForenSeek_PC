import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, FileText } from "lucide-react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import "../styles/pages/history.css";
import api from "../services/api";

const SearchHistory = () => {
  const navigate = useNavigate();

  const [searches, setSearches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedSearch, setSelectedSearch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Cargar historial desde el backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/jobs");
        setSearches(res.data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al cargar historial");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  //filtrar búsquedas
  const filteredSearches = searches.filter((search) => {
    const id = (search._id || "").toLowerCase();
    const fileName = (search.originalFilename || "").toLowerCase();
    const summary = (search.responseSummary || "").toLowerCase();
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      id.includes(term) || fileName.includes(term) || summary.includes(term);

    const isSuccess = search.status !== "error";

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "success" && isSuccess) ||
      (filterStatus === "failure" && !isSuccess);

    return matchesSearch && matchesFilter;
  });

  const goBack = () => {
    navigate("/dashboard");
  };

  const handleViewSearch = (search) => {
    setSelectedSearch(search);
  };

  const handleCloseModal = () => {
    setSelectedSearch(null);
  };

  const ResultModal = ({ search, onClose }) => {
    const {
      _id,
      createdAt,
      originalFilename,
      responseSummary,
      responseData,
      status,
    } = search;

    const success = status !== "error";
    const matches = responseData?.matches ?? 0;
    const suspects = responseData?.suspects ?? [];
    const pattern = responseData?.pattern || "N/A";

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="result-modal" onClick={(e) => e.stopPropagation()}>
          <div className="result-modal-header">
            <h3 className="result-modal-title">Búsqueda {_id}</h3>
            <button className="modal-close" onClick={onClose}>
              ×
            </button>
          </div>

          <span className={`results-badge ${success ? "success" : "failure"}`}>
            {success ? "EXITOSO" : "FRACASO"}
          </span>

          <div className="result-modal-info">
            <p>
              <strong>Fecha:</strong> {new Date(createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Archivo:</strong> {originalFilename}
            </p>
            <p>
              <strong>Patrón buscado:</strong> <code>{pattern}</code>
            </p>
            <p>
              <strong>Coincidencias encontradas:</strong> {matches}
            </p>

            <p className="suspects-label">Lista de sospechosos:</p>

            {suspects.length > 0 ? (
              <ul className="suspects-list">
                {suspects.map((suspect, index) => (
                  <li key={index}>{suspect}</li>
                ))}
              </ul>
            ) : (
              <p className="no-suspects">No se encontraron sospechosos</p>
            )}

            {responseSummary && (
              <p style={{ marginTop: "1rem" }}>
                <strong>Resumen:</strong> {responseSummary}
              </p>
            )}
          </div>

          <button className="history-view-btn" onClick={onClose}>
            Volver
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="history-page">
      <Header />

      <main className="history-content">
        {/* Botón volver */}
        <button className="back-button" onClick={goBack}>
          <ArrowLeft size={20} />
          <span>Volver al inicio</span>
        </button>

        {/* Título */}
        <h1 className="history-title">Historial</h1>

        {/* Barra de búsqueda y filtros */}
        <div className="history-controls">
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
              onClick={() => setFilterStatus("all")}
            >
              Todos
            </button>
            <button
              className={`filter-btn ${
                filterStatus === "success" ? "active" : ""
              }`}
              onClick={() => setFilterStatus("success")}
            >
              Exitosos
            </button>
            <button
              className={`filter-btn ${
                filterStatus === "failure" ? "active" : ""
              }`}
              onClick={() => setFilterStatus("failure")}
            >
              Fracasos
            </button>
          </div>
        </div>

        {/* Lista de búsquedas */}
        <div className="history-list">
          {loading && (
            <div className="no-results">
              <p>Cargando historial...</p>
            </div>
          )}

          {!loading && error && (
            <div className="no-results">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {filteredSearches.length > 0 ? (
                filteredSearches.map((search) => {
                  const isSuccess = search.status !== "error";
                  return (
                    <div key={search._id} className="history-item">
                      <div className="history-item-content">
                        <FileText size={24} className="history-icon" />
                        <div className="history-item-info">
                          <span className="history-item-id">{search._id}</span>
                          <span className="history-item-separator">|</span>
                          <span className="history-item-file">
                            {search.originalFilename}
                          </span>
                          <span className="history-item-separator">|</span>
                          <span className="history-item-date">
                            {new Date(search.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <span
                          className={`history-badge ${
                            isSuccess ? "success" : "failure"
                          }`}
                        >
                          {isSuccess ? "EXITOSO" : "FRACASO"}
                        </span>
                      </div>
                      <button
                        className="history-view-btn"
                        onClick={() => handleViewSearch(search)}
                      >
                        Ver
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="no-results">
                  <p>No se encontraron búsquedas</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />

      {/* Modal de resultado */}
      {selectedSearch && (
        <ResultModal search={selectedSearch} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default SearchHistory;
