import {FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import {useState} from 'react';
import {Cell, Pie, PieChart, ResponsiveContainer} from 'recharts';

import {useListExpensesByCategoryQuery, useListIncomesByCategoryQuery} from '../../../../store/services/mainApi';

import './StatsSection.css';

const queries = {
    expense: useListExpensesByCategoryQuery,
    income: useListIncomesByCategoryQuery,
};

function StatsSection({startDate, endDate}) {
    const userId = localStorage.getItem('userId');
    const [type, setType] = useState('expense');
    const {data, isLoading} = queries[type]({userId, startDate, endDate});

    return (
        <section className='stats-section'>
            <FormControl className='type-select-form'>
                <InputLabel id='demo-simple-select-label'>Tipo</InputLabel>
                <Select
                    labelId='demo-simple-select-label'
                    id='type-select'
                    value={type}
                    label='Tipo'
                    onChange={(event) => setType(event.target.value)}
                >
                    <MenuItem value='expense'>Despesas</MenuItem>
                    <MenuItem value='income'>Rendas</MenuItem>
                </Select>
            </FormControl>
            {isLoading
                ? 'Loading'
                : (
                    <>
                        <Chart data={data?.list} />
                        <Legend data={data?.list} total={data?.total} type={type} />
                    </>
                )
            }
        </section>
    );
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#403d64', '#7a1952', '#36060c', '#0f5c4b'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.65;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill='white' textAnchor='middle' dominantBaseline='central'>
            {`${(percent * 100).toFixed(1)}%`}
        </text>
    );
};

function Chart({data}) {
    return (
        <div className='chart-container'>
            <ResponsiveContainer width='100%' height='100%'>
                <PieChart height={500} width={500}>
                    <Pie
                        startAngle={90}
                        endAngle={-270}
                        data={data}
                        labelLine={false}
                        label={renderCustomizedLabel}
                        fill='#8884d8'
                        dataKey='value'
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

function Legend({data, total, type}) {
    const title = type === 'expense' ? 'Despesas por categoria' : 'Rendas por categoria';

    return (
        <div className='legend-container'>
            <h2>{title}</h2>
            <div className='legend-grid'>
                {data.map((item, index) => <LegendItem value={item.value} category={item.category} total={total} index={index} />)}
            </div>
        </div>
    );
}

function LegendItem({value, total, category, index}) {
    return (
        <div className='legend-item'>
            <div className='round-info' style={{backgroundColor: COLORS[index % COLORS.length]}}>
                <span>{(value / total * 100).toFixed(1).concat('%')}</span>
            </div>
            <div className='raw-info'>
                <span className='category'>
                    {category}
                </span>
                <span className='value'>
                    {value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                </span>
            </div>
        </div>
    );
}

export default StatsSection;
