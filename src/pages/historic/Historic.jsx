import {InputLabel, MenuItem, FormControl, Select, Dialog, DialogTitle, DialogActions, Button} from '@mui/material';
import {DatePicker} from 'antd';
import {endOfMonth, format, startOfMonth} from 'date-fns';
import {pt} from 'date-fns/locale';
import dayjs from 'dayjs';
import {useState} from 'react';
import {FiArrowDown, FiArrowUp, FiEdit2, FiTrash2} from 'react-icons/fi';
import {toast} from 'react-toastify';

import TransactionModal from '../../components/transactionModal/TransactionModal';
import {useListByTypeQuery, useDeleteTransactionMutation} from '../../store/services/mainApi';
import {Header} from '../home/Home';

import './Historic.css';

const typeOptions = {
    INCOME: {Icon: FiArrowUp, iconBgColor: '#66bb6a'},
    EXPENSE: {Icon: FiArrowDown, iconBgColor: '#ef5350'},
};

function Historic() {
    const [currentDate, setCurrentData] = useState(dayjs(new Date()));
    const [startDate, setStartDate] = useState(startOfMonth(new Date()).toISOString());
    const [endDate, setEndDate] = useState(endOfMonth(new Date()).toISOString());
    const [type, setType] = useState('EXPENSE');
    const [data, setData] = useState({});
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (date, dateString) => {
        setCurrentData(dayjs(dateString));
        setStartDate(startOfMonth(new Date(dateString.concat('T00:00:00'))).toISOString());
        setEndDate(endOfMonth(new Date(dateString.concat('T00:00:00'))).toISOString());
    };

    return (
        <div className='historic-container'>
            <Header />
            <h2>Histórico</h2>
            <div className='options-filter'>
                <FormControl className='type-select-form'>
                    <InputLabel id='demo-simple-select-label'>Tipo</InputLabel>
                    <Select
                        labelId='demo-simple-select-label'
                        id='type-select'
                        value={type}
                        label='Tipo'
                        onChange={(event) => setType(event.target.value)}
                    >
                        <MenuItem value='EXPENSE'>Despesas</MenuItem>
                        <MenuItem value='INCOME'>Rendas</MenuItem>
                    </Select>
                </FormControl>
                <DatePicker onChange={handleChange} picker='month' className='month-date-picker' value={currentDate} allowClear={false} />
            </div>
            <Transactions type={type} startDate={startDate} endDate={endDate} setData={setData} setIsOpen={setIsOpen} />
            <TransactionModal isOpen={isOpen} type={type} onClose={() => setIsOpen(false)} isEdit data={data} />
        </div>
    );
}

function Transactions({type, startDate, endDate, setData, setIsOpen, setIsAlertOpen}) {
    const userId = localStorage.getItem('userId');
    const {data, error, isLoading} = useListByTypeQuery({userId, type, startDate, endDate});

    if (error) {
        toast.error('Erro ao buscar transações');
    }

    if (isLoading) {
        return null;
    }

    return (
        <section className='transaction-list'>
            {data?.transactions?.map((item, index) => <TransactionItem item={item} key={index} setData={setData} setIsOpen={setIsOpen} setIsAlertOpen={setIsAlertOpen} />)}
        </section>
    );
}

function TransactionItem({item, setData, setIsOpen}) {
    const {value, category, date, type} = item;
    const {Icon, iconBgColor} = typeOptions[type];
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const handleCloseAlert = () => {
        setIsAlertOpen(false);
    };

    const [deleteTransaction] = useDeleteTransactionMutation();

    const handleEdit = () => {
        setData(item);
        setIsOpen(true);
    };

    const handleDelete = async () => {
        await deleteTransaction(item.id);
        setIsAlertOpen(false);
    };

    return (
        <div className='transaction-item'>
            <div className='detail-part'>
                <div className='icon-bg' style={{backgroundColor: iconBgColor}}>
                    <Icon color='white' size={22} />
                </div>
                <div className='info'>
                    <span>{category}</span>
                    <span>{value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
                </div>
            </div>
            <div className='time-part'>
                <span className='date-part'>{format(new Date(date), 'PPpp', {locale: pt})}</span>
                <div className='control'>
                    <button className='edit-button' onClick={handleEdit}>
                        <FiEdit2 size={22} color='white' />
                    </button>
                    <button className='delete-button' onClick={() => setIsAlertOpen(true)}>
                        <FiTrash2 size={22} color='white' />
                    </button>
                </div>
            </div>
            <Dialog
                open={isAlertOpen}
                onClose={handleCloseAlert}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>
                    Tem certeza que deseja excluir este item?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseAlert}>Não</Button>
                    <Button onClick={handleDelete} autoFocus>
                        Sim
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Historic;
