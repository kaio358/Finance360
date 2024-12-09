import './SearchSection.css';
import {Link} from 'react-router-dom'
import { useState } from 'react';
const caminho = process.env.REACT_APP_API_URL;


function SearchSection({ onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = async (e) => {
    const searchTerm = e.target.value.trim();
    setQuery(searchTerm);
    if (searchTerm) {
      
      
      const response = await fetch(`${caminho}/searchStocks?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setSuggestions(data);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (ticker) => {
    setQuery(ticker);
    setSuggestions([]);
    onSearch(ticker); 
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); 
    if (query.trim()) {
      onSearch(query); 
      setSuggestions([]); 
    }
  };

  
  return (
    <section className="search-section">
      <h1>Pesquise pelo ativo desejado</h1>
      <div className="search-bar" style={{ position: "relative" }}>
        {/* Formulário que envolve a barra de busca */}
        <form onSubmit={handleFormSubmit}>
          <input
            id="search-input"
            type="text"
            placeholder="Digite o nome do ativo"
            autoComplete="off"
            value={query}
            onChange={handleInputChange}
          />
        </form>
        <div
          className="suggestions"
          style={{ display: suggestions.length > 0 ? 'block' : 'none' }}
        >
          {suggestions.length > 0 ? (
            suggestions.map((stock) => (
              <Link to={`/stats?ticker=${stock.ticker}`}>
                    <div
                      key={stock.ticker}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(stock.ticker)}
                    >
                      {stock.ticker} - {stock.name}
                    </div>
              </Link>
          
            ))
          ) : (
            <div className="no-results">Nenhuma ação encontrada</div>
          )}
        </div>

      </div>
    </section>
  );
}

export default SearchSection;
