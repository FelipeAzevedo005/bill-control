import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const mainApi = createApi({
    reducerPath: 'mainApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (user) => ({
                url: '/signup',
                method: 'POST',
                body: user,
            }),
        }),
        login: builder.mutation({
            query: (user) => ({
                url: '/login',
                method: 'POST',
                body: user,
            }),
        }),
        createTransaction: builder.mutation({
            query: (data) => ({
                url: '/transactions',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['BalanceInfo', 'ExpensesByCategory', 'IncomesByCategory', 'ListByType'],
        }),
        editTransaction: builder.mutation({
            query: ({id, payload}) => ({
                url: `/transactions/${id}`,
                method: 'PUT',
                body: payload,
            }),
            invalidatesTags: ['BalanceInfo', 'ExpensesByCategory', 'IncomesByCategory', 'ListByType'],
        }),
        deleteTransaction: builder.mutation({
            query: (id) => ({
                url: `/transactions/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['BalanceInfo', 'ExpensesByCategory', 'IncomesByCategory', 'ListByType'],
        }),
        getBalanceInfo: builder.query({
            query: ({userId, startDate, endDate}) => ({
                url: `/transactions/balance/${userId}?startDate=${startDate}&endDate=${endDate}`,
                method: 'GET',
            }),
            providesTags: ['BalanceInfo'],
        }),
        listByType: builder.query({
            query: ({userId, type, startDate, endDate}) => ({
                url: `/transactions/type/${userId}?type=${type}&startDate=${startDate}&endDate=${endDate}`,
                method: 'GET',
            }),
            providesTags: ['ListByType'],
        }),
        listExpensesByCategory: builder.query({
            query: ({userId, startDate, endDate}) => ({
                url: `/transactions/expenses/category/${userId}?startDate=${startDate}&endDate=${endDate}`,
                method: 'GET',
            }),
            providesTags: ['ExpensesByCategory'],
        }),
        listIncomesByCategory: builder.query({
            query: ({userId, startDate, endDate}) => ({
                url: `/transactions/incomes/category/${userId}?startDate=${startDate}&endDate=${endDate}`,
                method: 'GET',
            }),
            providesTags: ['IncomesByCategory'],
        }),
    }),
});

export const {
    useSignupMutation,
    useLoginMutation,
    useCreateTransactionMutation,
    useEditTransactionMutation,
    useDeleteTransactionMutation,
    useGetBalanceInfoQuery,
    useListByTypeQuery,
    useListExpensesByCategoryQuery,
    useListIncomesByCategoryQuery,
} = mainApi;
