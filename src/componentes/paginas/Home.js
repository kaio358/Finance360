
import {Link} from 'react-router-dom'
import './Home.css';
import SearchSection from '../layout/SearchSection';
import Rankings from '../layout/Rankings'
import RecentActions from '../layout/RecentActions';

const Home = () => {
     const handleSearch = (ticker) => { 
            console.log(`Pesquisando por: ${ticker}`); 
            let recentes = JSON.parse(localStorage.getItem('recentes')) || []; if (!recentes.includes(ticker)) { 
                recentes.unshift(ticker); 
                if (recentes.length > 5) recentes.pop(); 
                localStorage.setItem('recentes', JSON.stringify(recentes)); 

            }

    };
    return (
        <div className="home">
            <header className='headerHome'>
                <div className="header-container">
                    <div className="brand">
                        <Link to="/">F360</Link>
                        <p>GESTÃO DE INVESTIMENTOS</p>
                    </div>
                    <nav className="navLinks">
                        <ul>
                            <li><Link to="/login">Iniciar Sessão</Link></li>
                        </ul>
                    </nav>
                </div>
            </header>
            <main>
                <SearchSection onSearch={handleSearch} /> 
                <Rankings /> 
                <RecentActions />
            </main>
            <footer>
                <p>&copy; 2024 F360. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default Home;
