import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Chart from 'chart.js/auto';
import './Stats.css';

const caminho = process.env.REACT_APP_API_URL;

const Stats = () => {
    const location = useLocation();
    const [ticker, setTicker] = useState(null);
    const [stockInfo, setStockInfo] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);

    useEffect(() => {
        // Extrair o valor do parâmetro "ticker" da query string
        const queryParams = new URLSearchParams(location.search);
        const tickerParam = queryParams.get('ticker');
        setTicker(tickerParam);
    }, [location.search]);

    useEffect(() => {
        if (ticker) {
            const fetchStockInfo = async () => {
                try {
                    const response = await fetch(`${caminho}/stock-info/${ticker}`);
                    if (!response.ok) throw new Error('Erro ao buscar dados da ação');
                 
                    
                    const data = await response.json();
                   
                    
                    setStockInfo(data);
                } catch (error) {
                    console.error('Erro ao buscar dados da ação:', error);
                    setStockInfo({ error: 'Erro ao carregar informações da ação.' });
                }
            };

            const fetchHistoricalData = async () => {
                try {
                    const response = await fetch(`${caminho}/stock-history/${ticker}`);
                    if (!response.ok) throw new Error('Erro ao carregar dados históricos');
                    
                    
                    const data = await response.json();
                 
                    
                    setHistoricalData(data);
                    renderChart(data);
                } catch (error) {
                    console.error('Erro ao carregar dados do gráfico:', error);
                }
            };

            fetchStockInfo();
            fetchHistoricalData();
        }
    }, [ticker]);
    const formatarData = (dataISO) => {
        const data = new Date(dataISO); 
        const dia = String(data.getDate()).padStart(2, '0'); 
        const mes = String(data.getMonth() + 1).padStart(2, '0'); 
        const ano = data.getFullYear(); 
        return `${dia}/${mes}/${ano}`;
    };
    
    const renderChart = (data) => {
        const labels = data.map((item) => item.date).reverse();
        const closePrices = data.map((item) => item.close_price).reverse();

        const ctx = document.getElementById('chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Preço de Fechamento',
                    data: closePrices,
                    borderColor: 'blue',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Data'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Preço (R$)'
                        }
                    }
                }
            }
        });
    };

    return (
        <div className='statsCSS'>
            <header className='headerStats'>
                <div className="header-container">
                    <div className="brand">
                        <Link to="/">F360</Link>
                        <p>GESTÃO DE INVESTIMENTOS</p>
                    </div>
                    <nav className="nav-linksStats">
                        <ul>
                            <li><Link to="/">Página Inicial</Link></li>
                            <li><Link to="/login">Iniciar Sessão</Link></li>
                        </ul>
                    </nav>
                </div>
            </header>
            <main>
                <section id="action-summary" className="stock-container">
                    <div className="stock-header">
                        {stockInfo?.logourl && <img id="action-logo" src={stockInfo.logourl} alt="Logo da Empresa" />}
                        <h2 id="action-title">{stockInfo? stockInfo.at(-1).ticker ? `${stockInfo.at(-1).ticker} - ${stockInfo.long_name || 'Resumo'}` : 'Carregando...' : 'Carregando...'}</h2>
                    </div>
                    <div className="stock-content">
                        <div className="stock-graph">
                            <canvas id="chart"></canvas>
                        </div>
                        <div className="stock-info" id="action-details">
                            {stockInfo ? (
                           
                                
                             
                                
                                
                                stockInfo.error ? (
                                    <p>{stockInfo.error}</p>
                                ) : (
                                   
                                   
                                    <>
                                  
                                        <h3>Desempenho do Último Dia</h3>
                                        <p><strong>Data:</strong> {formatarData(stockInfo.at(-1).date) || 'N/A'}</p>
                                        <p><strong>Preço de Abertura:</strong> R$ {stockInfo.at(-1).open_price || 'N/A'}</p>
                                        <p><strong>Preço de Fechamento:</strong> R$ {stockInfo.at(-1).close_price || 'N/A'}</p>
                                        <p><strong>Variação Percentual:</strong> {typeof stockInfo.at(-1).change_percent === 'number' ? stockInfo[0].change_percent.toFixed(2) + "%" : "N/A"}</p>
                                        <p><strong>Volume:</strong> {stockInfo.at(-1).volume || 'N/A'}</p>
                                        <p><strong>Earnings per share:</strong> {stockInfo.at(-1).earnings_per_share || 'N/A'}</p>
                                    </>
                                )
                            ) : (
                                <p>Carregando informações da ação...</p>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <footer>
                <p>&copy; 2024 F360. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default Stats;
