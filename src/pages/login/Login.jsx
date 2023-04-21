import {useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

import {useLoginMutation} from '../../store/services/mainApi';

import './Login.css';

function Login() {
    const navigate = useNavigate();
    const emailInputRef = useRef('');
    const passwordInputRef = useRef('');

    const [login] = useLoginMutation();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const user = {
            email: emailInputRef.current?.value,
            password: passwordInputRef.current?.value,
        };

        try {
            const {token, username, userId} = await login(user).unwrap();
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('userId', userId);
            navigate('/home');
        } catch (error) {
            toast.error('Usuário ou senha incorretos');
        }
    };

    return (
        <div className='login-container'>
            <section className='login-icon-section'>
                <img src='src/assets/logo.svg' alt='Logo' />
            </section>

            <form className='login-form' onSubmit={handleSubmit}>
                <input placeholder='Email' className='login-input' ref={emailInputRef}></input>
                <input type='password' placeholder='Senha' className='login-input' ref={passwordInputRef}></input>
                <button className='login-button'>Entrar</button>
            </form>
        </div>
    );
}

export default Login;
