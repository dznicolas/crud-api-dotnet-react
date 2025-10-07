import api from './axiosConfig';

export const authService = {
    async login(username, password) {
        try {
            const response = await api.post('/auth/login', { username, password });
            if (response.data.sucesso) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.usuario));
                return { success: true, data: response.data };
            }
            return { success: false, message: response.data.mensagem };
        } catch (error) {

            if (error.response && error.response.data) {
                return { 
                    success: false, 
                    message: error.response.data.mensagem || 'Credenciais inválidas' 
                };
            }

            return { success: false, message: 'Erro de conexão com o servidor' };
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};
