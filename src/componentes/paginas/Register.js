import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './Register.css';
const caminho = process.env.REACT_APP_API_URL

const Register = () => {
   
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()


    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleSubmit = async (event) => {
        event.preventDefault();
        // console.log(caminho,'/register');
        
        try {
            const response = await fetch(`${caminho}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Registro realizado com sucesso!');
                navigate('/login')
            } else {
                alert(`Erro: ${result.error}`);
            }
        } catch (error) {
            console.error('Erro ao registrar:', error);
            alert('Erro ao registrar.');
        }
    };

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <div className='registerCSS'>
            {/* Header */}
            <header className="headerRegister">
                <h1 className="header-title">F360</h1>
                <p className="header-subtitle">Bem-vindo ao centro do investidor</p>
            </header>

            <main>
                {/* Container de registro */}
                <div className="register-container">
                    <h2 className="register-title">Registrar</h2>
                    <form id="register-form" onSubmit={handleSubmit}>
                        <label htmlFor="email">E-mail:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                        <label htmlFor="password">Senha:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        <button type="submit">Registrar</button>
                    </form>

                    <Link to="/login" className="login-link">Já tem uma conta? Faça login</Link>
                    <button onClick={handleBackClick} className="back-button">Voltar para a Tela Inicial</button>
                </div>
            </main>

            {/* Footer */}
            <footer className="footer">
                <p>© 2024 F360. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default Register;
