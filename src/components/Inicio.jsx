import React from 'react'
import logo from '../assets/logoremax.png'
import { useNavigate } from 'react-router-dom'
import './Inicio.css'

const Inicio = () => {
  const navigate = useNavigate()

  return (
    <div className='contenedor-principal-inicio'>
      <div className='contenedor-inicio'>
        <img className="logo" src={logo} alt="Logo" />
        <h1 className='prenotazione-inicio'>Prenotazione</h1>
        </div>
        <div className='Botones-Inicio'>
            <button className='Boton-de-Inicio' onClick={() => navigate("/admin")}>Amministratore</button>
            <button className='Boton-de-Inicio' onClick={() => navigate('/ospite')}>Ospite</button>
        </div>
    </div>
  )
}

export default Inicio