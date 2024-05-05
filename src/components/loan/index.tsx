import { useEffect, useState } from "react";
import api from "../../api";
import { Card, Form, Modal, Table } from "antd";
import Input, { SearchProps } from "antd/es/input";
import { DeleteFilled, DeleteOutlined, DeleteTwoTone, EditTwoTone, ReloadOutlined, UndoOutlined } from "@ant-design/icons";
import HandleUtil from "../util/handle";

function Loan() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const handleUtil: HandleUtil<Loan> = new HandleUtil();

  const [search, setSearch] = useState("");



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
          <a onClick={() => handleUtil.handleDelete(loan, "loan", setLoans, loans)}><DeleteFilled style={{color: '#e30202', fontSize: '18px'}}/></a>
          <a onClick={() => handleUtil.handleEdit(loan, setEditingLoan, form, setIsModalVisible)}><UndoOutlined style={{color: '#0251e3', fontSize: '18px'}} /></a>
        </div>,
    }
  ];

  const { Search } = Input;


  const onSearch: SearchProps['onSearch'] = (value) => setSearch(value);

  useEffect(() => {
    api.get(`/loan?page=${currentPage - 1}&search=${search}`)
      .then(response => {
        setLoans(response.data.data.content);
        setTotalPages(response.data.data.totalPages)
      }).catch(error => {
        console.log('Ocorreu um erro!', error)
      });
  }, [search, currentPage]);


  return (
    <div>
      <Search placeholder="input search text" onSearch={onSearch} style={{ width: '100%' }} />
      <Table dataSource={loans} columns={columns} pagination={{
        current: currentPage,
        total: totalPages * 10,
        onChange: (page) => setCurrentPage(page),
        position: ['bottomCenter']
      }} />
      {editingLoan && (
        <Modal title="Deseja retornar o livro emprestado?" open={isModalVisible} onOk={() => {
          if (editingLoan) {
            handleUtil.handleOk(form, 'loan', editingLoan, setLoans, loans, setIsModalVisible, false)
          }
        }}
          onCancel={() => handleUtil.handleCancel(setIsModalVisible)}>
          <Form form={form} layout="vertical">
            <Card bordered={false} style={{ width: 300 }}>
              <p><strong>Livro:</strong> {editingLoan?.book.title}</p>
              <p><strong>Estudante:</strong> {editingLoan?.student.fullName}</p>
              <p><strong>Email:</strong> {editingLoan?.student.email}</p>
              <p><strong>Data do empréstimo:</strong> {new Date(editingLoan!.loanDate).toLocaleDateString()}</p>
              <p><strong>Data limite:</strong> {new Date(editingLoan!.limitDate).toLocaleDateString()}</p>
              {editingLoan?.returnDate && (
                <p><strong>Data de retorno:</strong> {new Date(editingLoan!.returnDate).toLocaleDateString()}</p>
              )}
            </Card>
          </Form>
        </Modal>
      )}
    </div>
  )
}

export default Loan