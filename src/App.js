import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import './App.css';


import Home from './componentes/paginas/Home';
import Login from './componentes/paginas/Login';
import Register from './componentes/paginas/Register';
import Portfolio from './componentes/paginas/Portfolio';
import Stats from './componentes/paginas/Stats';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home/>}/>
        <Route exact path='/login' element={ <Login/> }/>
        <Route exact path='/register' element={ <Register/> }/>
        <Route exact path='/portfolio' element={ <Portfolio/> }/>
        <Route exact path='/stats' element={<Stats/>}/>
        
      </Routes>
    </Router>
  );
}

export default App;
