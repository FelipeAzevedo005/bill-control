import {Provider} from 'react-redux';
import {BrowserRouter, Routes, Route, Navigate, Outlet} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Historic from './pages/historic/Historic';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import {store} from './store';
import {hasToken} from './utils/auth.utils';

import './App.css';

const PrivateRoutes = () => {
    const isAuthenticated = hasToken();

    return (
        isAuthenticated ? <Outlet /> : <Navigate to='/login' />
    );
};

function App() {
    return (
        <Provider store={store}>
            <div className='App'>
                <BrowserRouter>
                    <Routes>
                        <Route element={<PrivateRoutes />}>
                            <Route path='/home' element={<Home />} />
                            <Route path='/hist' element={<Historic />} />
                        </Route>
                        <Route path='/login' element={<Login />} />
                        <Route path='/' element={<Navigate to='/home' />} />
                    </Routes>
                </BrowserRouter>
                <ToastContainer theme='dark' />
            </div>
        </Provider>
    );
}

export default App;
