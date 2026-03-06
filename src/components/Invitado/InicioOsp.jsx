import React, { useEffect, useState } from 'react'
import logo from '../../assets/logoremax.png'
import { useNavigate } from 'react-router-dom'
import '../invitado-css/InicioOsp.css'


const InicioOsp = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: ''
    })

    useEffect(() => {
        const borrador = JSON.parse(localStorage.getItem('ospiteDraft') || '{}')
        setFormData({
            nombre: borrador.nombre || '',
            email: borrador.email || '',
            telefono: borrador.telefono || ''
        })
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

const handleSubmit = (e) => {
    e.preventDefault();
    const nombre = formData.nombre;
    const email = formData.email;
    const telefono = formData.telefono;

    localStorage.setItem('ospiteDraft', JSON.stringify({ nombre, email, telefono }));
    localStorage.removeItem('horarioSeleccionado');
    navigate('/eleccionevento');
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
                        <input
                            type="text"
                            id="Nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder='John Doe'
                            required
                        />
                    </div>
                    <div className='form-items'>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='john.doe@example.com'
                            required
                        />
                    </div>
                    <div className='form-items'>
                        <label htmlFor="telefono">Mobile:</label>
                        <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder='+39 123 456 7890'
                            required
                        />
                    </div>
                    <div className='botones-ingreso-osp'>
                        <button className='boton-ingreso-osp' type="button" onClick={() => navigate('/')}>Indietro</button>
                        <button className='boton-ingreso-osp' type="submit">Prenota</button>
                    </div>
                </form> 
            </div>
    </div>
  )
}

export default InicioOsp