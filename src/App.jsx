import './App.css'
import 'rsuite/dist/rsuite-no-reset.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Pages/Layout/Layout'
import Buscador from './Pages/Buscador/Buscador'
import Editar from './Pages/Editar/Editar'
import Agregar from './Pages/Agregar/Agregar'
import Empresa from './Pages/Empresa/Empresa';


function App() {

  return (  
    <>
      <BrowserRouter>
        <Routes>
          {/* Sidebar layout */}
          <Route path='/' element={<Layout/>}> 
              <Route index element={<Buscador/>}/>
              <Route path='editor' element={<Editar/>}/>
              <Route path='add' element={<Agregar/>}/>
              <Route path='/:id' element={<Empresa/>}/>
          </Route>          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
