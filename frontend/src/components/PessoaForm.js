import { useEffect, useState } from 'react';
import { createPessoa, updatePessoa } from '../api/pessoas';
import { Input, Button, Select, Option } from "@material-tailwind/react";

const formatCpf = (cpf) => cpf.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');

export default function PessoaForm({ pessoa, onSuccess, onCancel, onError }) {
    const initialState = {
        nome: '',
        sexo: '',
        email: '',
        dataNascimento: '',
        naturalidade: '',
        nacionalidade: '',
        cpf: ''
    };

    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (pessoa) {
            setFormData({ 
                ...pessoa, 
                dataNascimento: pessoa.dataNascimento.split('T')[0],
                email: pessoa.email || '',
                cpf: formatCpf(pessoa.cpf || '')
            });
        }
    }, [pessoa]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (value) => {
        setFormData({ ...formData, sexo: value });
    };

    const handleCpfChange = (e) => {
        setFormData({ ...formData, cpf: formatCpf(e.target.value) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...formData,
                email: formData.email?.trim() || null,
                cpf: formData.cpf.replace(/\D/g, '')
            };
            
            if (pessoa) {
                await updatePessoa(pessoa.id, dataToSend);
            } else {
                await createPessoa(dataToSend);
            }
            setFormData(initialState);
            onSuccess();
        } catch (error) {
            let errorMessage = error.response?.data?.mensagem || 'Erro ao salvar pessoa';

            if (onError) {
                onError(errorMessage);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input name="nome" label="Nome" value={formData.nome} onChange={handleChange} required />
            
            <Select 
                label="Sexo" 
                value={formData.sexo} 
                onChange={handleSelectChange}
            >
                <Option value="M">M</Option>
                <Option value="F">F</Option>
            </Select>
            
            <Input name="email" type="email" label="Email" value={formData.email} onChange={handleChange} />
            <Input name="dataNascimento" type="date" label="Data de Nascimento" value={formData.dataNascimento} onChange={handleChange} required />
            <Input name="naturalidade" label="Naturalidade" value={formData.naturalidade} onChange={handleChange} />
            <Input name="nacionalidade" label="Nacionalidade" value={formData.nacionalidade} onChange={handleChange} />
            <Input 
                name="cpf" 
                label="CPF" 
                value={formData.cpf} 
                onChange={handleCpfChange} 
                maxLength={14}
                placeholder="000.000.000-00"
                required 
            />
            <div className="flex gap-2 justify-end">
                {onCancel && (
                    <Button type="button" color="gray" onClick={onCancel}>
                        Cancelar
                    </Button>
                )}
                <Button type="submit" color="blue">
                    {pessoa ? 'Atualizar' : 'Cadastrar'}
                </Button>
            </div>
        </form>
    );
}
