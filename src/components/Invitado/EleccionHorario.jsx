import React, { useState, useEffect } from 'react';
import logo from '../../assets/logoremax.png';
import { useNavigate } from 'react-router-dom';
import '../invitado-css/EleccionHorario.css';



const horarios = ["09:00", "09:15","09:30", "09:45", "10:00", "10:15","10:30","10:45", "11:00","11:15","11:30","11:45", "12:00","12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45" ];

const EleccionHorario = () => {
    const [horarioSeleccionado, setHorarioSeleccionado] = useState("");
    const navigate = useNavigate();
    const evento = JSON.parse(localStorage.getItem('evento'));
    const fecha = evento.fecha ||'';
    const direccion = evento.direccion ||'';
    const datoAdicional = evento.datoAdicional ||'';

    // Limpiar horarioSeleccionado huérfano al cargar el componente
    useEffect(() => {
        localStorage.removeItem('horarioSeleccionado');
    }, []);

    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    // Filtrar solo reservas de la fecha actual
    const reservasFecha = reservas.filter(r => r.fecha === fecha);
    // Extraer solo la hora, sea objeto o string
    const horariosReservados = reservasFecha.map(r => {
        if (typeof r.horario === 'object' && r.horario !== null) {
            return r.horario.hora;
        }
        if (typeof r.horario === 'string' && r.horario.includes('{')) {
            try {
                const obj = JSON.parse(r.horario);
                return obj.hora || r.horario;
            } catch {
                return r.horario;
            }
        }
        return r.horario;
    });

    return (
        <div className='Horario-home'>
            <div className='Horario-inicio-logo'>
                <img className="logo" src={logo} alt="Logo" />
                <h1 className='titulo-horario'>Prenotazione Gaston Molinari</h1>
            </div>
                <p className='datos-prenotazione'>
                    <span><strong>Data:</strong> {fecha}</span><br />
                    <span><strong>Indirizzo:</strong> {direccion}</span><br />
                    {datoAdicional && <span><strong>Dato aggiuntivo:</strong> {datoAdicional}</span>}
                </p>
                        <div className='Horario-seleccion'>
                                <label>Scegli l'orario:</label>
                                <div className='horarios-grid'>
                                    {horarios.filter(hora => !horariosReservados.includes(hora)).map(hora => (
                                        <button className='botones-horarios'
                                            key={hora}
                                            onClick={() => setHorarioSeleccionado(hora)}
                                        >
                                            {hora}
                                        </button>
                                    ))}
                                </div>
                        
            {horarioSeleccionado && (
                <p>Orario selezionato: <strong>{horarioSeleccionado}</strong></p>
            )}
            </div>
            <div className='botones-accion-horario'>
                <button type="button" className='boton-horarios' onClick={() => navigate(-1)}>Indietro</button>
                <button
                    type="button"
                    className='boton-horarios'
                    onClick={() => {
                        if (horarioSeleccionado) {
                            // Genero id único para el horario
                            const horarioId = Date.now() + '-' + Math.floor(Math.random() * 10000);
                            // y lo  guardo
                            localStorage.setItem('horarioSeleccionado', JSON.stringify({ id: horarioId, hora: horarioSeleccionado }));
                            navigate('/'); 
                        }
                    }}
                    disabled={!horarioSeleccionado}
                >Prenota</button>
            </div>
        </div>
    );
};  

export default EleccionHorario;