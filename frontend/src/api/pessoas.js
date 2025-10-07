import api from './axiosConfig';

export const getPessoas = async () => {
    const response = await api.get('/pessoas');
    return response.data.dados || [];
};

export const getPessoaById = async (id) => {
    const response = await api.get(`/pessoas/${id}`);
    return response.data.dados || response.data;
};

export const createPessoa = async (pessoa) => {
    const response = await api.post('/pessoas', pessoa);
    return response.data.dados || response.data;
};

export const updatePessoa = async (id, pessoa) => {
    const response = await api.put(`/pessoas/${id}`, pessoa);
    return response.data.dados || response.data;
};

export const deletePessoa = async (id) => {
    const response = await api.delete(`/pessoas/${id}`);
    return response.data;
};
