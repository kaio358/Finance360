import React, { useState } from 'react';
const caminho = process.env.REACT_APP_API_URL
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

  return (
    <section className="search-section">
      <h1>Pesquise pelo ativo desejado</h1>
      <div className="search-bar" style={{ position: "relative" }}>
        <input
          id="search-input"
          type="text"
          placeholder="Digite o nome do ativo"
          autoComplete="off"
          value={query}
          onChange={handleInputChange}
        />
        <div className="suggestions">
          {suggestions.length > 0 ? (
            suggestions.map(stock => (
              <div key={stock.ticker} className="suggestion-item" onClick={() => handleSuggestionClick(stock.ticker)}>
                {stock.ticker} - {stock.name}
              </div>
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
