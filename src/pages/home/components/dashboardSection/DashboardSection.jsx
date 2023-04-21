import {useEffect, useState} from 'react';
import {FaWallet} from 'react-icons/fa';
import {FiArrowDown, FiArrowUp} from 'react-icons/fi';
import {toast} from 'react-toastify';

import TransactionModal from '../../../../components/transactionModal/TransactionModal';
import {useGetBalanceInfoQuery} from '../../../../store/services/mainApi';

import './DashboardSection.css';

function DashboardSection({startDate, endDate}) {
    const userId = localStorage.getItem('userId');
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState('EXPENSE');

    const {data, error, isLoading} = useGetBalanceInfoQuery({userId, startDate, endDate});

    const dashboardItems = [
        {name: 'Saldo', value: data?.balance, Icon: FaWallet, iconBgColor: '#42a5f5'},
        {name: 'Rendas', value: data?.incomes, Icon: FiArrowUp, iconBgColor: '#66bb6a'},
        {name: 'Despesas', value: data?.expenses, Icon: FiArrowDown, iconBgColor: '#ef5350'},
    ];

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    return (
        <section className='dashboard-section'>
            {isLoading
                ? 'Is Loading'
                : dashboardItems.map(item => <DashboardItem name={item.name} value={item.value} Icon={item.Icon} iconBgColor={item.iconBgColor} setIsOpen={setIsOpen} setType={setType} />)
            }
            <TransactionModal isOpen={isOpen} type={type} onClose={() => setIsOpen(false)} />
        </section>
    );
}

function DashboardItem({name, value, Icon, iconBgColor, setIsOpen, setType}) {
    const handleClick = () => {
        if (name === 'Rendas') {
            setType('INCOME');
            setIsOpen(true);
        } else if (name === 'Despesas') {
            setType('EXPENSE');
            setIsOpen(true);
        }
    };

    return (
        <div className='dashboard-item' onClick={handleClick} style={{cursor: name !== 'Saldo' ? 'pointer' : 'default'}}>
            <div className='info'>
                <span className='label'>{name}</span>
                <span className='value'>{value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
            </div>
            <div className='icon-bg' style={{backgroundColor: iconBgColor}}>
                <Icon color='white' size={22} />
            </div>
        </div>
    );
}

export default DashboardSection;
