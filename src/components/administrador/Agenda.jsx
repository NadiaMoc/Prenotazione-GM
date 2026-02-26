import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logoremax.png'
import'../administrador-css/Agenda.css'

const Agenda = () => {
    const [reservas, setReservas] = useState([]);
    const [fecha, setFecha] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener el evento del localStorage
        const evento = JSON.parse(localStorage.getItem('evento') || '{}');
        const fechaPrevista = evento.fecha;
        setFecha(fechaPrevista || "");
        // Obtener la fecha de hoy en formato YYYY-MM-DD
        const hoy = new Date();
        const hoyStr = hoy.toISOString().split('T')[0];
        // Si la fecha prevista ya pasó, limpiar reservas
        if (fechaPrevista && hoyStr > fechaPrevista) {
            localStorage.removeItem('reservas');
            setReservas([]);
        } else {
            // Filtrar solo reservas de la fecha actual
            const todas = JSON.parse(localStorage.getItem('reservas') || '[]');
            setReservas(todas.filter(r => r.fecha === fechaPrevista));
        }
    }, []);

    // Función para cancelar una reserva
    const handleCancelar = (idReserva) => {
        // Filtrar reservas quitando la seleccionada SOLO para la fecha actual
        const todas = JSON.parse(localStorage.getItem('reservas') || '[]');
        const evento = JSON.parse(localStorage.getItem('evento') || '{}');
        const fechaActual = evento.fecha || "";
        // Quitar solo la reserva de la fecha actual
        const nuevasReservasFecha = reservas.filter(r => r.id !== idReserva);
        // Mantener reservas de otras fechas
        const reservasOtrasFechas = todas.filter(r => r.fecha !== fechaActual);
        const nuevasTodas = [...reservasOtrasFechas, ...nuevasReservasFecha];
        setReservas(nuevasReservasFecha);
        localStorage.setItem('reservas', JSON.stringify(nuevasTodas));
        // Aquí puedes preparar la lógica para enviar un mail al invitado cancelado
        // Por ejemplo, guardar el email del invitado cancelado en localStorage o backend
    };

    return (
        <div className='contenedor-principal-agenda'>
            <div className= 'contenedor-logo-agenda'>
                <img className="logo" src={logo} alt="Logo" />
                <h1 className='gaston-molinari'>Gaston Molinari</h1>
            </div>
            <h2 className='titulo-agenda'>
                {fecha && (<span className="fecha-agenda">{fecha}</span>)}
                <span style={{marginLeft: fecha ? '18px' : '0'}}>Agenda</span>
            </h2>
            {reservas.length > 0 ? (
                <ul className='lista-reservas'>
                    {[...reservas]
                        .map(reserva => {
                            // Extraer la hora como string para ordenar
                            let hora = typeof reserva.horario === 'object' && reserva.horario !== null
                                ? reserva.horario.hora
                                : (typeof reserva.horario === 'string' && reserva.horario.includes('{')
                                    ? (() => {
                                        try {
                                            const obj = JSON.parse(reserva.horario);
                                            return obj.hora || reserva.horario;
                                        } catch {
                                            return reserva.horario;
                                        }
                                    })()
                                    : reserva.horario);
                            return { ...reserva, _horaOrden: hora };
                        })
                        .sort((a, b) => {
                            // Ordenar por hora (formato HH:mm)
                            if (!a._horaOrden || !b._horaOrden) return 0;
                            return a._horaOrden.localeCompare(b._horaOrden);
                        })
                        .map((reserva, idx) => (
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
            <button className='boton-agenda' onClick={() => navigate(-1)}>Indietro</button>
        </div>
    );
}

export default Agenda