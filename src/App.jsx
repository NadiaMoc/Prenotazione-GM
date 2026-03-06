import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Inicio from './components/Inicio'
import InicioAdm from './components/administrador/InicioAdm'
import InicioOsp from './components/Invitado/InicioOsp'
import EventoAdm from './components/administrador/EventoAdm'
import EleccionEvento from './components/Invitado/EleccionEvento'
import EleccionHorario from './components/Invitado/EleccionHorario'
import Agenda from './components/administrador/Agenda'


function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Inicio />} />
        <Route path='/admin' element={<InicioAdm />} />
        <Route path='/ospite' element={<InicioOsp />} />
        <Route path='/creadorevento' element={<EventoAdm />} />
        <Route path='/eleccionevento' element={<EleccionEvento />} />
        <Route path='/eleccionhorario' element={<EleccionHorario />} />
        <Route path='/agenda' element={<Agenda />} />
      </Routes>
    </div>
  )
}

export default App
