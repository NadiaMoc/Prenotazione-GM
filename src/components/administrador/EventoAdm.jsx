import React from 'react'
import logo from '../../assets/logoremax.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../administrador-css/EventoAdm.css'
import { api } from '../../services/api'


const EventoAdm = () => {
const [fecha, setFecha] = useState('');
const [direccion, setDireccion] = useState('');
const [datoAdicional, setDatoAdicional] = useState('');
const [eventoCreado, setEventoCreado] = useState(null);
const navigate = useNavigate();

const handleIrAgenda = () => {
    navigate('/agenda');
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const evento = await api.createEvento({
            fecha,
            direccion,
            datoAdicional
        });

        setEventoCreado({
            ...evento,
            fecha: typeof evento.fecha === 'string' && evento.fecha.includes('T')
                ? evento.fecha.slice(0, 10)
                : evento.fecha
        });

        localStorage.setItem('evento', JSON.stringify(evento));
    } catch (error) {
        alert(error.message || 'Errore creando evento.');
    }
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
                                localStorage.removeItem('horarioSeleccionado');
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
                            <button className='boton-evento' type="button" onClick={handleIrAgenda}>Agenda</button>
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
                    <button className='boton-evento' onClick={handleIrAgenda}>Agenda</button>
                </div>
            </div>
            )}
        </div>
    </div>
)
}   
export default EventoAdm;
