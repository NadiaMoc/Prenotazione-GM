import React from 'react'
import logo from '../../assets/logoremax.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../administrador-css/EventoAdm.css'


const EventoAdm = () => {
const [fecha, setFecha] = useState('');
const [direccion, setDireccion] = useState('');
const [datoAdicional, setDatoAdicional] = useState('');
const [eventoCreado, setEventoCreado] = useState(null);
const navigate = useNavigate();
const handleSubmit = (e) => {
    e.preventDefault();
    const evento = {
        fecha,
        direccion,
        datoAdicional
    };
    setEventoCreado(evento);
    localStorage.setItem('evento', JSON.stringify(evento));
};
return (
    <div className='evento-home'>
        <div className= 'contenedor-principal-evento'>
            <img className="logo" src={logo} alt="Logo" />
            <h1 className='gaston-molinari'>Gaston Molinari</h1>
        </div>
        <div className='form-evento'>
            {!eventoCreado ? (
                <>
                    <h3 className='evento-titulo'>Crea il tuo evento</h3>
                    <form onSubmit={handleSubmit}>
                        <div className='form-data-ind-agt'>
                            <label>Data:</label>
                            <input
                            type="date"
                            value={fecha}
                            onChange={e => {
                                setFecha(e.target.value);
                                // No borrar reservas de ninguna fecha al crear evento
                                localStorage.removeItem('horarioSeleccionato');
                            }}
                            required
                    />
                        </div>
                        <div className='form-data-ind-agt'>
                            <label>Indirizzo:</label>
                            <input
                                type="text"
                                value={direccion}
                                onChange={e => setDireccion(e.target.value)}
                                placeholder='Via Italia 123'
                                required
                            />
                        </div>
                        <div className='form-data-ind-agt'>
                            <label>Dato aggiuntivo:</label>
                            <input
                                type="text"
                                value={datoAdicional}
                                onChange={e => setDatoAdicional(e.target.value)}
                                placeholder='Informazioni aggiuntive'
                            />
                        </div>
                        <div className='botones-evento'>
                            <button className='boton-evento' type="button" onClick={() => navigate(-1)}>Indietro</button>
                            <button className='boton-evento' type="button" onClick={() => navigate('/agenda')}>Agenda</button>
                            <button className='boton-evento' type="submit">Crear evento</button>
                        </div>
                        </form>
                    </>
            ) : (
            <div className='evento-creado'>
                <h3 className='evento-titulo'>Evento creato:</h3>
                <p><strong>Data:</strong> {eventoCreado.fecha}</p>
                <p><strong>Indirizzo:</strong> {eventoCreado.direccion}</p>
                <p><strong>Dato aggiuntivo:</strong> {eventoCreado.datoAdicional}</p>
                <div className='botones-evento-creado'>
                    <button className='boton-evento' onClick={() => navigate(-1)}>Indietro</button>
                    <button className='boton-evento' onClick={() => navigate('/agenda')}>Agenda</button>
                </div>
            </div>
            )}
        </div>
    </div>
)
}   
export default EventoAdm;
