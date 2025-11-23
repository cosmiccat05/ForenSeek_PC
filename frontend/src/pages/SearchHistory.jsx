import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, FileText } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/pages/history.css';

const SearchHistory = () => {
  const navigate = useNavigate();

  //datos simulados de búsquedas (luego con el back lo quitan)
  const [searches] = useState([
    {
      id: 'ID0001',
      date: '15/11/2024',
      fileName: 'base_datos01.csv',
      pattern: 'AGATCAGATCAGATC',
      success: true,
      matches: 5,
      suspects: ['Sospechoso 01', 'Sospechoso 02', 'Sospechoso 03', 'Sospechoso 04', 'Sospechoso 05']
    },
    {
      id: 'ID0002',
      date: '14/11/2024',
      fileName: 'base_datos01.csv',
      pattern: 'WAZA',
      success: false,
      matches: 0,
      suspects: []
    },
    {
      id: 'ID0003',
      date: '13/11/2024',
      fileName: 'base_datos02.csv',
      pattern: 'GCTAGCTAGCTAGCT',
      success: true,
      matches: 3,
      suspects: ['Sospechoso 01', 'Sospechoso 02', 'Sospechoso 03']
    },
    {
      id: 'ID0004',
      date: '12/11/2024',
      fileName: 'base_datos03.csv',
      pattern: 'TTTTAAAACCCCGGGG',
      success: false,
      matches: 0,
      suspects: []
    },
    {
      id: 'ID0005',
      date: '11/11/2024',
      fileName: 'base_datos01.csv',
      pattern: 'CGATCGATCGATCGA',
      success: true,
      matches: 2,
      suspects: ['Sospechoso 01', 'Sospechoso 02']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSearch, setSelectedSearch] = useState(null);

  //filtrar búsquedas
  const filteredSearches = searches.filter(search => {
    const matchesSearch = search.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         search.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         search.pattern.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'success' && search.success) ||
                         (filterStatus === 'failure' && !search.success);
    
    return matchesSearch && matchesFilter;
  });

  const goBack = () => {
    navigate('/dashboard');
  };

  const handleViewSearch = (search) => {
    setSelectedSearch(search);
  };

  const handleCloseModal = () => {
    setSelectedSearch(null);
  };

  const ResultModal = ({ search, onClose }) => {
    const { id, date, fileName, pattern, success, matches, suspects } = search;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="result-modal" onClick={(e) => e.stopPropagation()}>
          <div className="result-modal-header">
            <h3 className="result-modal-title">Búsqueda {id}</h3>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>

          <span className={`results-badge ${success ? 'success' : 'failure'}`}>
            {success ? 'EXITOSO' : 'FRACASO'}
          </span>

          <div className="result-modal-info">
            <p><strong>Fecha:</strong> {date}</p>
            <p><strong>Archivo:</strong> {fileName}</p>
            <p><strong>Patrón buscado:</strong> <code>{pattern}</code></p>
            <p><strong>Coincidencias encontradas:</strong> {matches}</p>
            
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
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              Todos
            </button>
            <button
              className={`filter-btn ${filterStatus === 'success' ? 'active' : ''}`}
              onClick={() => setFilterStatus('success')}
            >
              Exitosos
            </button>
            <button
              className={`filter-btn ${filterStatus === 'failure' ? 'active' : ''}`}
              onClick={() => setFilterStatus('failure')}
            >
              Fracasos
            </button>
          </div>
        </div>

        {/* Lista de búsquedas */}
        <div className="history-list">
          {filteredSearches.length > 0 ? (
            filteredSearches.map((search) => (
              <div key={search.id} className="history-item">
                <div className="history-item-content">
                  <FileText size={24} className="history-icon" />
                  <div className="history-item-info">
                    <span className="history-item-id">{search.id}</span>
                    <span className="history-item-separator">|</span>
                    <span className="history-item-file">{search.fileName}</span>
                    <span className="history-item-separator">|</span>
                    <span className="history-item-date">{search.date}</span>
                  </div>
                  <span className={`history-badge ${search.success ? 'success' : 'failure'}`}>
                    {search.success ? 'EXITOSO' : 'FRACASO'}
                  </span>
                </div>
                <button
                  className="history-view-btn"
                  onClick={() => handleViewSearch(search)}
                >
                  Ver
                </button>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No se encontraron búsquedas</p>
            </div>
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
