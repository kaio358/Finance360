import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'
const caminho = process.env.REACT_APP_API_URL
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${caminho}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Login bem-sucedido!');
                navigate('/portfolio'); // Redireciona para a página do portfolio
            } else {
                alert(`Erro: ${result.error}`);
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao fazer login.');
        }
    };

    const handleBackClick = () => {
        navigate('/')
    };

    return (
        <div className='loginCSS'>
            {/* Header */}
            <header className="header">
                <h1 className="header-title">F360</h1>
                <p className="header-subtitle">Bem-vindo ao centro do investidor</p>
            </header>

            <main>
                {/* Container de login */}
                <div className="login-container">
                    <h2 className="login-title">Acesse sua conta</h2>
                    <form id="login-form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        <button type="submit">Entrar</button>
                    </form>
                    <Link to="/register" className="register-link">Não tem uma conta? Cadastre-se</Link>
                    <button className="back-button" onClick={handleBackClick}>Voltar para a Tela Inicial</button>
                </div>
            </main>

            {/* Footer */}
            <footer className="footer">
                <p>&copy; 2024 F360. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default Login;
