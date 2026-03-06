import React from 'react'
import logo from '../../assets/logoremax.png'
import { useNavigate } from 'react-router-dom'
import '../administrador-css/InicioAdm.css'

const InicioAdm = () => {
    const navigate = useNavigate()
    const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
      // Validar usuario y contraseña exactos
    const password = e.target.password.value;
    if (username === 'GM1554' && password === '41872758') {
        navigate('/creadorevento');
    } else {
        alert('Utente o password non validi.');
    }
    };
return (
    <div className='contenedor-principal-inicio-adm'>
        <div className='contenedor-logo-titulo'>
            <img className="logo" src={logo} alt="Logo" />
            <h1 className='amministratore'>Amministratore</h1>
        </div>
        <div className='Form-Adm'>
            <form onSubmit={handleSubmit}>
                                <div className='form-items'>
                                    <label htmlFor="username">Utente:  </label>
                                    <input type="text" id="username" name="username" placeholder='DoeJ2026' required />
                                </div>
                                <div className='form-items'>
                                    <label htmlFor="password">Password:  </label>
                                    <input type="password" id="password" name="password" placeholder='********' required />
                                </div>
                <div className='botones-inicio-adm'>
                <button className='boton-inicio-adm' type="button" onClick={() => navigate(-1)}>Indietro</button>
                <button className='boton-inicio-adm' type="submit">LogIn</button>
                </div>
            </form>

        </div>
    </div>
)
}

export default InicioAdm