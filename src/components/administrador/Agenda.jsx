import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logoremax.png'
import'../administrador-css/Agenda.css'
import { api } from '../../services/api';

const Agenda = () => {
    const [eventosAgenda, setEventosAgenda] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const obtenerHoraReserva = (reserva) => {
        if (typeof reserva.horario === 'object' && reserva.horario !== null) {
            return reserva.horario.hora;
        }
        if (typeof reserva.horario === 'string' && reserva.horario.includes('{')) {
            try {
                const obj = JSON.parse(reserva.horario);
                return obj.hora || reserva.horario;
            } catch {
                return reserva.horario;
            }
        }
        return reserva.horario;
    };

    useEffect(() => {
        let isMounted = true;

        const cargarAgenda = async () => {
            try {
                const eventos = await api.getEventos();

                const eventosConReservas = await Promise.all(
                    eventos.map(async (evento) => {
                        const reservasEvento = await api.getReservasEvento(evento.id);
                        const reservasOrdenadas = reservasEvento
                            .map((reserva) => ({ ...reserva, _horaOrden: obtenerHoraReserva(reserva) }))
                            .sort((a, b) => {
                                if (!a._horaOrden || !b._horaOrden) return 0;
                                return a._horaOrden.localeCompare(b._horaOrden);
                            });

                        return {
                            ...evento,
                            fecha: typeof evento.fecha === 'string' && evento.fecha.includes('T')
                                ? evento.fecha.slice(0, 10)
                                : evento.fecha,
                            reservas: reservasOrdenadas
                        };
                    })
                );

                if (isMounted) {
                    setEventosAgenda(eventosConReservas);
                }
            } catch (error) {
                alert(error.message || 'Errore caricando agenda.');
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        cargarAgenda();

        return () => {
            isMounted = false;
        };
    }, []);

    // Función para cancelar una reserva
    const handleCancelar = async (idReserva) => {
        try {
            await api.deleteReserva(idReserva);

            setEventosAgenda((prev) => prev.map((evento) => ({
                ...evento,
                reservas: evento.reservas.filter((r) => r.id !== idReserva)
            })));
        } catch (error) {
            alert(error.message || 'Errore cancellando prenotazione.');
        }
    };

    const handleEliminarEventoCompleto = async (eventoObjetivo) => {
        const confirmar = window.confirm('Vuoi eliminare tutto il contenuto di questo evento?');
        if (!confirmar) return;

        try {
            await api.deleteEvento(eventoObjetivo.id);

            setEventosAgenda((prev) => prev.filter((evento) => evento.id !== eventoObjetivo.id));
        } catch (error) {
            alert(error.message || 'Errore eliminando evento.');
        }
    };

    return (
        <div className='contenedor-principal-agenda'>
            <div className= 'contenedor-logo-agenda'>
                <img className="logo" src={logo} alt="Logo" />
                <h1 className='gaston-molinari'>Gaston Molinari  |  Agenda</h1>
            </div>
            {loading ? (
                <p>Caricando agenda...</p>
            ) : eventosAgenda.length > 0 ? (
                eventosAgenda.map((evento, eventIdx) => (
                    <div key={evento.id || `${evento.fecha}-${eventIdx}`} style={{ width: '100%', maxWidth: '650px', marginBottom: '28px' }}>
                        <h2 className='titulo-agenda' style={{ margin: '22px 0 14px 0', paddingLeft: 0 }}>
                            <span className="fecha-agenda">{evento.fecha || 'Senza data'}</span>
                        </h2>
                        <p style={{ margin: '0 0 12px 0' }}><strong>Indirizzo:</strong> {evento.direccion || '—'}</p>
                        {evento.datoAdicional && <p style={{ margin: '0 0 12px 0' }}><strong>Dato aggiuntivo:</strong> {evento.datoAdicional}</p>}

                        {evento.reservas.length > 0 ? (
                            <ul className='lista-reservas'>
                                {evento.reservas.map((reserva, idx) => (
                                    <li key={reserva.id || idx} className='reserva-item'>
                                        <span className='reserva-hora'>{reserva._horaOrden}</span>
                                        <span className='reserva-nombre'>{reserva.nombre},</span>
                                        <span className='reserva-email'>{reserva.email},</span>
                                        <span className='reserva-celular'>{reserva.celular}</span>
                                        <button className='cancelar' onClick={() => handleCancelar(reserva.id)}>Cancelar</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Non ci sono prenotazioni ancora.</p>
                        )}

                        <button
                            className='boton-eliminar-evento'
                            onClick={() => handleEliminarEventoCompleto(evento)}
                        >
                            Cancelar l' evento
                        </button>
                    </div>
                ))
            ) : (
                <p>Non ci sono eventi ancora.</p>
            )}
            <button className='boton-agenda' onClick={() => navigate(-1)}>Indietro</button>
        </div>
    );
}

export default Agenda