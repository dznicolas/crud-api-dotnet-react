import { useEffect, useState, useMemo } from 'react';
import { getPessoas, deletePessoa } from '../api/pessoas';
import PessoaForm from './PessoaForm';
import Alert from './Alert';
import { Typography, Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input } from "@material-tailwind/react";
import DataTable from 'react-data-table-component';

export default function PessoaList() {
    const [pessoas, setPessoas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editPessoa, setEditPessoa] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [pessoaToDelete, setPessoaToDelete] = useState(null);
    const [alert, setAlert] = useState({ message: '', type: 'success' });
    const [modalAlert, setModalAlert] = useState({ message: '', type: 'error' });

    useEffect(() => {
        fetchPessoas();
    }, []);

    const fetchPessoas = async () => {
        try {
            const data = await getPessoas();
            setPessoas(Array.isArray(data) ? data : []);
        } catch (error) {
            setPessoas([]);
        }
    };

    const handleDelete = async (id) => {
        setPessoaToDelete(id);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        try {
            await deletePessoa(pessoaToDelete);
            setAlert({ message: 'Pessoa excluída com sucesso!', type: 'success' });
            fetchPessoas();
        } catch (error) {
            setAlert({ message: 'Erro ao excluir pessoa!', type: 'error' });
        } finally {
            setOpenDeleteDialog(false);
            setPessoaToDelete(null);
        }
    };

    const handleOpenModal = (pessoa = null) => {
        setEditPessoa(pessoa);
        setModalAlert({ message: '', type: 'error' });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditPessoa(null);
        setModalAlert({ message: '', type: 'error' });
    };

    const handleSuccess = () => {
        const message = editPessoa ? 'Pessoa atualizada com sucesso!' : 'Pessoa cadastrada com sucesso!';
        setAlert({ message, type: 'success' });
        fetchPessoas();
        handleCloseModal();
    };

    const handleError = (errorMessage) => {
        setModalAlert({ message: errorMessage, type: 'error' });
    };

    const formatCpf = (cpf) =>
        cpf ? cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '-';

    const formatDate = (dateStr) =>
        dateStr ? new Date(dateStr).toLocaleDateString('pt-BR') : '-';

    const filteredPessoas = useMemo(() => {
        if (!searchTerm) {
            return pessoas;
        }
        const lowercasedFilter = searchTerm.toLowerCase();

        return pessoas.filter(pessoa => {
            return (
                pessoa.nome?.toLowerCase().includes(lowercasedFilter) ||
                pessoa.cpf?.includes(lowercasedFilter) ||
                pessoa.email?.toLowerCase().includes(lowercasedFilter)
            );
        });
    }, [pessoas, searchTerm]);

    const columns = [
        { name: 'Nome', selector: row => row.nome, sortable: true },
        { name: 'CPF', selector: row => formatCpf(row.cpf), sortable: true },
        { name: 'Email', selector: row => row.email || '-', sortable: true },
        { name: 'Sexo', selector: row => row.sexo || '-', sortable: true },
        { name: 'Data Nascimento', selector: row => formatDate(row.dataNascimento), sortable: true },
        {
            name: 'Ações',
            cell: row => (
                <div className="flex gap-2">
                    <Button color="blue" size="sm" onClick={() => handleOpenModal(row)}>Editar</Button>
                    <Button color="red" size="sm" onClick={() => handleDelete(row.id)}>Excluir</Button>
                </div>
            )
        }
    ];

    const paginationOptions = {
        rowsPerPageText: 'Linhas por página:',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <Alert
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ message: '', type: 'success' })}
            />

            <div className="flex justify-between items-center mb-6">
                <Typography variant="h4" color="blue-gray">Registro de Pessoas</Typography>
                <Button color="blue" onClick={() => handleOpenModal()}>
                    Nova Pessoa
                </Button>
            </div>

            <div className="mb-6">
                <Input
                    label="Buscar por nome, CPF ou email"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <Typography variant="small" className="mt-2 text-gray-600">
                        Mostrando {filteredPessoas.length} de {pessoas.length} pessoas encontradas.
                    </Typography>
                )}
            </div>

            <DataTable
                columns={columns}
                data={filteredPessoas}
                pagination
                highlightOnHover
                noHeader
                noDataComponent="Nenhuma pessoa encontrada."
                paginationComponentOptions={paginationOptions}
            />

            <Dialog open={openModal} handler={handleCloseModal} size="lg">
                <DialogHeader>{editPessoa ? 'Editar Pessoa' : 'Nova Pessoa'}</DialogHeader>
                <DialogBody className="max-h-[70vh] overflow-y-auto">
                    {modalAlert.message && (
                        <div className="mb-4">
                            <Alert
                                message={modalAlert.message}
                                type={modalAlert.type}
                                onClose={() => setModalAlert({ message: '', type: 'error' })}
                                duration={5000}
                                inline
                            />
                        </div>
                    )}
                    <PessoaForm pessoa={editPessoa} onSuccess={handleSuccess} onCancel={handleCloseModal} onError={handleError} />
                </DialogBody>
            </Dialog>

            <Dialog open={openDeleteDialog} handler={() => setOpenDeleteDialog(false)} size="sm">
                <DialogHeader>Confirmar Exclusão</DialogHeader>
                <DialogBody>
                    Tem certeza que deseja excluir esta pessoa? Esta ação não pode ser desfeita.
                </DialogBody>
                <DialogFooter className="gap-2">
                    <Button color="gray" onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
                    <Button color="red" onClick={confirmDelete}>Excluir</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}
