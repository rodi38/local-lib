import { useEffect, useState } from "react";
import api from "../../api";
import { Button, Card, Form, Modal, Table } from "antd";
import Input, { SearchProps } from "antd/es/input";
import { DeleteFilled, UndoOutlined } from "@ant-design/icons";
import HandleUtil from "../util/handle";
import { debounce } from "lodash";

// const formatDateString = (date: Date): string => {
//   return isNaN(date.getDate()) ? "Invalid Date" : date.toLocaleDateString();
// }

function Loan() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const handleUtil: HandleUtil<Loan> = new HandleUtil();

  const [search, setSearch] = useState("");


  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState<Loan | null>(null);

  const showDeleteConfirmModal = (loan: Loan) => {
    setLoanToDelete(loan);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (loanToDelete) {
      await handleUtil.handleDelete(loanToDelete, "loan", setLoans, loans);
      // Recarregar dados após exclusão
      const pageAfterDeletion = (loans.length === 1 && currentPage > 1) ? currentPage - 1 : currentPage;
      setCurrentPage(pageAfterDeletion);
      fetchLoans(search, pageAfterDeletion);
    }
    setIsDeleteModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };


  const columns = [
    {
      title: 'Livro emprestado',
      dataIndex: 'book',
      key: 'book',
      render: (book: Book) => book.title
    },
    {
      title: 'Estudante',
      dataIndex: 'student',
      key: 'student',
      render: (student: Student) => student.fullName

    },
    {
      title: 'Email',
      dataIndex: 'student',
      key: 'student',
      render: (student: Student) => student.email

    },
    {
      title: 'Data do emprestimo',
      dataIndex: 'loanDate',
      key: 'loanDate',
    },
    {
      title: 'Data limite',
      dataIndex: 'limitDate',
      key: 'limitDate',
    },
    {
      title: 'Data de retorno',
      dataIndex: 'returnDate',
      key: 'returnDate',
    },
    {
      title: 'Action',
      dataIndex: '',
      width: 100,
      key: 'z',
      render: (_: any, loan: Loan) =>
        <div style={{ display: 'flex', justifyContent: "flex-start", gap: 20 }}>
          <a onClick={() => showDeleteConfirmModal(loan)}><DeleteFilled style={{ color: '#e30202', fontSize: '18px' }} /></a>
          {loan.returnDate ? (
            <a onClick={() => alert('Este livro já foi retornado')}><UndoOutlined style={{ color: '#e30202', fontSize: '18px' }} /></a>
          ) : (
            <a onClick={() => handleUtil.handleEdit(loan, setEditingLoan, form, setIsModalVisible)}><UndoOutlined style={{ color: '#0251e3', fontSize: '18px' }} /></a>
          )}
        </div>,
    }
  ];

  const fetchLoans = async (search: string, page: number) => {
    try {
      const response = await api.get(`/loan?page=${page - 1}&search=${search}`);
      setLoans(response.data.data.content);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.log('Ocorreu um erro!', error);
    }
  };

  const debouncedFetchBooks = debounce(fetchLoans, 300);

  useEffect(() => {
    debouncedFetchBooks(search, currentPage);
    return () => {
      debouncedFetchBooks.cancel();
    };
  }, [search, currentPage]);



  return (
    <div>
      <Input 
        placeholder="Buscar estudante" 
        onChange={(e) => setSearch(e.target.value)} 
        style={{ width: '100%', marginBottom: '20px' }} 
      />
      <Table dataSource={loans} columns={columns} pagination={{
        current: currentPage,
        total: totalPages * 10,
        onChange: (page) => setCurrentPage(page),
        position: ['topCenter']
      }} />
      {isDeleteModalVisible && (
        <Modal
          title="Confirmação de Deleção"
          open={isDeleteModalVisible}
          onOk={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          footer={[
            <Button key="back" onClick={handleDeleteCancel}>
              Cancelar
            </Button>,
            <Button key="submit" type="primary" onClick={handleDeleteConfirm}>
              Deletar
            </Button>,
          ]}
        >
          <p>Tem certeza que deseja deletar este empréstimo?</p>
        </Modal>
      )}
      {editingLoan && (
        <Modal title="Deseja retornar o livro emprestado?" open={isModalVisible} onOk={() => {
          if (editingLoan) {
            handleUtil.handlePut(form, 'loan', editingLoan, setLoans, loans, setIsModalVisible, false)
          }
        }}
          onCancel={() => handleUtil.handleCancel(setIsModalVisible)}>
          <Form form={form} layout="vertical">
            <Card bordered={false} style={{ width: "100%" }}>
              <p><strong>Livro:</strong> {editingLoan?.book.title}</p>
              <p><strong>Estudante:</strong> {editingLoan?.student.fullName}</p>
              <p><strong>Email:</strong> {editingLoan?.student.email}</p>
              <p><strong>Data do empréstimo:</strong> {editingLoan!.loanDate.toString()}</p>
              <p><strong>Data limite:</strong> {editingLoan!.limitDate.toString()}</p>
              {editingLoan?.returnDate && (
                <p><strong>Data de retorno:</strong> {editingLoan!.returnDate.toString()}</p>
              )}
            </Card>
          </Form>
        </Modal>
      )}
    </div>
  )
}

export default Loan