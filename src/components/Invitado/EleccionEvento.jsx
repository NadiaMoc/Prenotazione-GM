import React, { useEffect, useState } from 'react'
import logo from '../../assets/logoremax.png'
import { useNavigate } from 'react-router-dom'
import '../invitado-css/EleccionEvento.css'
import { api } from '../../services/api'

const EleccionEvento = () => {
    const navigate = useNavigate()
    const [eventos, setEventos] = useState([])
    const [loading, setLoading] = useState(true)

    const formatFecha = (value) => {
        if (!value) return ''
        if (typeof value === 'string' && value.includes('T')) {
            return value.slice(0, 10)
        }
        return value
    }

    useEffect(() => {
        let isMounted = true

        const borrador = JSON.parse(localStorage.getItem('ospiteDraft') || '{}')
        if (!borrador.nombre || !borrador.email || !borrador.telefono) {
            navigate('/ospite')
            return
        }

        const cargarEventos = async () => {
            try {
                const eventosApi = await api.getEventos()
                const eventosOrdenados = [...eventosApi].sort((a, b) => {
                    const fechaA = formatFecha(a.fecha) || ''
                    const fechaB = formatFecha(b.fecha) || ''

                    if (!fechaA && !fechaB) return 0
                    if (!fechaA) return 1
                    if (!fechaB) return -1

                    return fechaA.localeCompare(fechaB)
                })

                if (isMounted) {
                    setEventos(eventosOrdenados)
                }
            } catch (error) {
                alert(error.message || 'Errore caricando eventi.')
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        cargarEventos()

        return () => {
            isMounted = false
        }
    }, [navigate])

    const handleSeleccionarEvento = (evento) => {
        localStorage.setItem('evento', JSON.stringify(evento))
        localStorage.removeItem('horarioSeleccionado')
        navigate('/eleccionhorario')
    }

    return (
        <div className='eleccion-evento-home'>
            <div className='Evento-inicio-logo'>
                <img className="logo" src={logo} alt="Logo" />
                <h1 className='titulo-evento'>Prenotazione Gaston Molinari</h1>
            </div>

            <div className='eventos-lista'>
                <label>Scegli l'evento:</label>
                {loading ? (
                    <p>Caricando eventi...</p>
                ) : eventos.length > 0 ? (
                    eventos.map((evento, idx) => (
                        <button
                            key={evento.id || `${evento.fecha}-${idx}`}
                            className='boton-evento-opcion'
                            onClick={() => handleSeleccionarEvento(evento)}
                        >
                            <strong>Data:</strong> {formatFecha(evento.fecha) || 'Senza data'}<br />
                            <strong>Indirizzo:</strong> {evento.direccion || '—'}<br />
                            {evento.datoAdicional && (<><strong>Dato aggiuntivo:</strong> {evento.datoAdicional}</>)}
                        </button>
                    ))
                ) : (
                    <p>Non ci sono eventi disponibili.</p>
                )}
            </div>

            <div className='botones-accion-evento'>
                <button className='boton-evento-nav' type='button' onClick={() => navigate('/ospite')}>Indietro</button>
            </div>
        </div>
    )
}

export default EleccionEvento