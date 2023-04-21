import {Modal, Form, Input, Select, DatePicker} from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import dayjs from 'dayjs';
import {useState} from 'react';

import {useCreateTransactionMutation, useEditTransactionMutation} from '../../store/services/mainApi';

import './TransactionModal.css';

const {Option} = Select;

const categories = {
    INCOME: [
        'Salário',
        'Aluguel de imóveis',
        'Venda de produtos',
        'Investimentos',
        'Serviços prestados',
        'Outros',
    ],
    EXPENSE: [
        'Moradia',
        'Transporte',
        'Alimentação',
        'Saúde',
        'Educação',
        'Lazer',
        'Outros',
    ],
};

const titles = {
    INCOME: (isEdit) => isEdit ? 'Editar Rendimento' : 'Novo Rendimento',
    EXPENSE: (isEdit) => isEdit ? 'Editar Despesa' : 'Nova Despesa',
};

const defaultData = {
    value: undefined,
    category: '',
    date: new Date(),
};

function TransactionModal({isOpen, onClose, type, isEdit = false, data}) {
    const newData = {...defaultData, ...data};
    const [form] = Form.useForm();
    const [createTransaction] = useCreateTransactionMutation();
    const [editTransaction] = useEditTransactionMutation();
    const [category, setCategory] = useState(newData.category);

    const handleOk = async () => {
        const values = await form.validateFields();
        if (isEdit) {
            await editTransaction({id: newData.id, payload: {...values, date: dayjs(values.date).toISOString(), type, userId: localStorage.getItem('userId')}});
        } else {
            await createTransaction({...values, date: dayjs(values.date).toISOString(), type, userId: localStorage.getItem('userId')});
        }
        form.resetFields();
        onClose();
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    const options = categories[type].map(category => <Option value={category}>{category}</Option>);

    return (
        <Modal open={isOpen} onOk={handleOk} onCancel={handleCancel}>
            <h2>{titles[type](isEdit)}</h2>
            <Form form={form} fields={[
                {
                    name: 'value',
                    value: newData.value,
                },
                {
                    name: 'category',
                    value: newData.category,
                },
                {
                    name: 'date',
                    value: dayjs(newData.date),
                },
            ]}>
                <Form.Item
                    className='form-item'
                    label='Valor'
                    name='value'
                    rules={[{required: true, message: 'Por favor, insira um valor!'}]}
                >
                    <Input type='number' min={0} />
                </Form.Item>
                <Form.Item
                    className='form-item'
                    label='Categoria'
                    name='category'
                    rules={[{required: true, message: 'Por favor, selecione uma categoria!'}]}
                >
                    <Select value={category} onChange={(value) => setCategory(value)}>
                        {options}
                    </Select>
                </Form.Item>
                <Form.Item
                    className='form-item'
                    label='Data'
                    name='date'
                >
                    <DatePicker showTime locale={locale} className='month-date-picker' allowClear={false} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default TransactionModal;
