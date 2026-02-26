import React from 'react'
import logo from '../../assets/logoremax.png'
import { useNavigate } from 'react-router-dom'
import '../invitado-css/InicioOsp.css'


const InicioOsp = () => {
    const navigate = useNavigate()

const handleSubmit = (e) => {
    e.preventDefault();
    // Obtener valores del formulario
    const nombre = e.target.Nombre.value;
    const email = e.target.email.value;
    const telefono = e.target.telefono.value;
    // Obtener el horario seleccionado
    let horario = localStorage.getItem('horarioSeleccionado');
    try {
        horario = horario ? JSON.parse(horario) : "";
    } catch {
        // Si no es JSON, dejarlo como está
    }
    // Si no hay horario seleccionado, redirigir a la selección de horario
    if (!horario || !horario.hora) {
        navigate('/eleccionhorario');
        return;
    }
    // Generar id único para el invitado
    const id = Date.now() + '-' + Math.floor(Math.random() * 10000);
    // Obtener la fecha del evento
    const evento = JSON.parse(localStorage.getItem('evento') || '{}');
    const fechaEvento = evento.fecha || "";
    // Crear la reserva con fecha
    const reserva = { id, nombre, email, celular: telefono, horario, fecha: fechaEvento };
    // Obtener reservas existentes
    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    // Agregar la nueva reserva
    reservas.push(reserva);
    // Guardar en localStorage
    localStorage.setItem('reservas', JSON.stringify(reservas));
    // Limpiar el horario seleccionado para evitar usar el anterior
    localStorage.removeItem('horarioSeleccionado');
    // Navegar a la página principal o mostrar confirmación
    navigate('/');
}
  return (
    <div className='contenedor-inicio-invitado'>
        <div className='contenedor-logo-titulo'>
            <img className="logo" src={logo} alt="Logo" />
            <h1 className='titulo-osp'>Prenotazione<br />Gaston Molinari</h1>
        </div>
            <div className='Form-Osp'>
                <form onSubmit={handleSubmit}>
                    <div className='form-items'>
                        <label htmlFor="Nombre">Nome:</label>
                        <input type="text" id="Nombre" name="Nombre" placeholder='John Doe' required />
                    </div>
                    <div className='form-items'>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" placeholder='john.doe@example.com' required />
                    </div>
                    <div className='form-items'>
                        <label htmlFor="telefono">Mobile:</label>
                        <input type="tel" id="telefono" name="telefono" placeholder='+39 123 456 7890' required />
                    </div>
                    <div className='botones-ingreso-osp'>
                        <button className='boton-ingreso-osp' type="button" onClick={() => navigate(-1)}>Indietro</button>
                        <button className='boton-ingreso-osp' type="submit">Prenota</button>
                    </div>
                </form> 
            </div>
    </div>
  )
}

export default InicioOsp