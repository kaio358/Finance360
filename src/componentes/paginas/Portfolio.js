import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import './Portfolio.css'; 
import { Link,useNavigate } from 'react-router-dom';
const caminho = process.env.REACT_APP_API_URL

const Portfolio = () => {
    const [investments, setInvestments] = useState([]);
    const [formState, setFormState] = useState({ id: '', ticker: '', value: '', quantity: '' });
    const navigate = useNavigate()

    useEffect(() => {
        const fetchInvestments = async () => {
            try {
                const response = await fetch(`${caminho}/investments`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${document.cookie}`,
                    },
                });

                if (!response.ok) {
                    alert('Erro ao carregar investimentos. Faça login novamente.');
                    navigate('/login')
                    return;
                }

                const data = await response.json();
                setInvestments(data);
                renderPieChart(data);
            } catch (error) {
                console.error('Erro ao carregar investimentos:', error);
                alert('Erro ao carregar investimentos.');
            }
        };

        fetchInvestments();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch(`/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                alert('Logout realizado com sucesso!');
                navigate('/login')
            } else {
                alert('Erro ao tentar fazer logout.');
            }
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const { id, ticker, value, quantity } = formState;

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${caminho}/investments/${id}` : '/investments';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticker, value: parseFloat(value), quantity: parseInt(quantity) }),
            });

            if (response.ok) {
                alert('Investimento salvo com sucesso!');
                window.location.reload();
            } else {
                alert('Erro ao salvar investimento.');
            }
        } catch (error) {
            console.error('Erro ao salvar investimento:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${caminho}/investments/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Investimento excluído!');
                window.location.reload();
            } else {
                alert('Erro ao excluir investimento.');
            }
        } catch (error) {
            console.error('Erro ao excluir investimento:', error);
        }
    };

    const handleEdit = (investment) => {
        setFormState({
            id: investment.id,
            ticker: investment.ticker,
            value: investment.value,
            quantity: investment.quantity,
        });
    };

    const renderPieChart = (investments) => {
        const investmentChart = document.getElementById('investmentChart').getContext('2d');

        const totalValue = investments.reduce((acc, investment) => acc + (investment.value * investment.quantity), 0);
        const chartData = investments.map(investment => ({
            label: investment.ticker,
            value: (investment.value * investment.quantity) / totalValue * 100,
        }));

        const data = {
            labels: chartData.map(item => item.label),
            datasets: [{
                data: chartData.map(item => item.value),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
                hoverBackgroundColor: ['#FF758F', '#49C8F2', '#FFD03B', '#4CD9D5', '#FFAA58'],
            }],
        };

        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2) + '%';
                        },
                    },
                },
            },
        };

        new Chart(investmentChart, {
            type: 'pie',
            data: data,
            options: options,
        });
    };

    return (
        <div>
            <header className='headerPotfolio'>
                <div className="header-container">
                    <div className="brand">
                        <Link to="/">F360</Link>
                        <p>GESTÃO DE INVESTIMENTOS</p>
                    </div>
                    <nav className="nav-links">
                        <ul>
                            <button className="home-button" onClick={() =>  navigate('/')}>Tela Inicial</button>
                            <button id="logoutButton" onClick={handleLogout}>Sair</button>
                        </ul>
                    </nav>
                </div>
            </header>
            <main className='portInvestimento'>
                <section id="left-panel">
                    <form id="investmentForm" onSubmit={handleFormSubmit}>
                        <input type="hidden" id="investmentId" value={formState.id} />
                        <label htmlFor="ticker">Ativo:</label>
                        <input type="text" id="ticker" placeholder="Ex: PETR4" value={formState.ticker} onChange={(e) => setFormState({ ...formState, ticker: e.target.value })} required />
                        <label htmlFor="value">Valor:</label>
                        <input type="number" id="value" step="0.01" value={formState.value} onChange={(e) => setFormState({ ...formState, value: e.target.value })} required />
                        <label htmlFor="quantity">Quantidade:</label>
                        <input type="number" id="quantity" value={formState.quantity} onChange={(e) => setFormState({ ...formState, quantity: e.target.value })} required />
                        <button type="submit">Salvar</button>
                    </form>

                    <table>
                        <thead>
                            <tr>
                                <th>Ativo</th>
                                <th>Valor</th>
                                <th>Quantidade</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="investments-container">
                            {investments.map(investment => (
                                <tr key={investment.id} data-id={investment.id}>
                                    <td className="ticker">{investment.ticker}</td>
                                    <td className="value">R$ {investment.value.toFixed(2)}</td>
                                    <td className="quantity">{investment.quantity}</td>
                                    <td>
                                        <button onClick={() => handleEdit(investment)}>Editar</button>
                                        <button onClick={() => handleDelete(investment.id)}>Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
                <section id="chart-container">
                    <canvas id="investmentChart"></canvas>
                </section>
            </main>
            <footer>
                <p>&copy; 2024 F360. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default Portfolio;
