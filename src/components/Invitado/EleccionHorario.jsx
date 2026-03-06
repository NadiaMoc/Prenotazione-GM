import React, { useState, useEffect } from 'react';
import logo from '../../assets/logoremax.png';
import { useNavigate } from 'react-router-dom';
import '../invitado-css/EleccionHorario.css';
import { api } from '../../services/api';

const EleccionHorario = () => {
const [horarioSeleccionado, setHorarioSeleccionado] = useState("");
const [horariosDisponibles, setHorariosDisponibles] = useState([]);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();
const eventoGuardado = localStorage.getItem('evento');
const evento = eventoGuardado ? JSON.parse(eventoGuardado) : {};
const eventoId = evento.id || '';
const fecha = (typeof evento.fecha === 'string' && evento.fecha.includes('T'))
    ? evento.fecha.slice(0, 10)
    : (evento.fecha || '');
const direccion = evento.direccion ||'';
const datoAdicional = evento.datoAdicional ||'';

useEffect(() => {
    const borrador = JSON.parse(localStorage.getItem('ospiteDraft') || '{}');
    if (!borrador.nombre || !borrador.email || !borrador.telefono) {
        navigate('/ospite');
        return;
    }

    if (!fecha || !direccion) {
        navigate('/eleccionevento');
    }

    const cargarDisponibilidad = async () => {
        if (!eventoId) {
            setLoading(false);
            return;
        }

        try {
            const response = await api.getDisponibilidad(eventoId);
            setHorariosDisponibles(response.libres || []);
        } catch (error) {
            alert(error.message || 'Errore caricando disponibilità.');
        } finally {
            setLoading(false);
        }
    };

    cargarDisponibilidad();
}, [navigate, fecha, direccion]);

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
                            {loading ? (
                                <p>Caricando orari...</p>
                            ) : horariosDisponibles.map(hora => (
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
                <button type="button" className='boton-horarios' onClick={() => navigate('/eleccionevento')}>Indietro</button>
                <button
                    type="button"
                    className='boton-horarios'
                    onClick={() => {
                        if (horarioSeleccionado) {
                            const borrador = JSON.parse(localStorage.getItem('ospiteDraft') || '{}');
                            if (!borrador.nombre || !borrador.email || !borrador.telefono) {
                                navigate('/ospite');
                                return;
                            }
                            if (!eventoId || !fecha || !direccion) {
                                navigate('/eleccionevento');
                                return;
                            }

                            api.createReserva({
                                eventoId,
                                nombre: borrador.nombre,
                                email: borrador.email,
                                celular: borrador.telefono,
                                horario: horarioSeleccionado
                            })
                                .then(() => {
                                    localStorage.removeItem('ospiteDraft');
                                    localStorage.removeItem('horarioSeleccionado');
                                    navigate('/');
                                })
                                .catch((error) => {
                                    alert(error.message || 'Errore creando prenotazione.');
                                });
                        }
                    }}
                    disabled={!horarioSeleccionado || loading}
                >Prenota</button>
            </div>
        </div>
    );
};  

export default EleccionHorario;