import {DatePicker} from 'antd';
import {endOfMonth, startOfMonth} from 'date-fns';
import dayjs from 'dayjs';
import {useState} from 'react';
import {FiLogOut} from 'react-icons/fi';
import {Link} from 'react-router-dom';

import DashboardSection from './components/dashboardSection/DashboardSection';
import StatsSection from './components/statsSection/StatsSection';

import './Home.css';

function Home() {
    const handleChange = (date, dateString) => {
        setCurrentData(dayjs(dateString));
        setStartDate(startOfMonth(new Date(dateString.concat('T00:00:00'))).toISOString());
        setEndDate(endOfMonth(new Date(dateString.concat('T00:00:00'))).toISOString());
    };

    const [currentDate, setCurrentData] = useState(dayjs(new Date()));
    const [startDate, setStartDate] = useState(startOfMonth(new Date()).toISOString());
    const [endDate, setEndDate] = useState(endOfMonth(new Date()).toISOString());

    return (
        <div className='home-container'>
            <Header />
            <main className='main-home'>
                <h2>Painel</h2>
                <DatePicker onChange={handleChange} picker='month' className='month-date-picker' value={currentDate} allowClear={false} />
                <DashboardSection startDate={startDate} endDate={endDate} />
                <StatsSection startDate={startDate} endDate={endDate} />
            </main>
        </div>
    );
}

export function Header() {
    return (
        <header className='header-home'>
            <img
                className='logo'
                src='/src/assets/logo.svg'
                alt='Logo'
            />
            <nav>
                <ul>
                    <li>
                        <Link to='/home'>
                            Painel
                        </Link>
                    </li>
                    <li>
                        <Link to='/hist'>
                            Extrato
                        </Link>
                    </li>
                    <li>
                        <Link to='/login' onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('username');
                        }}>
                            <FiLogOut size={24} className='logout' />
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Home;
