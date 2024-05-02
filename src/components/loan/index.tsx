import { useEffect, useState } from "react";
import api from "../../api";
import { Card, Form, Modal, Table } from "antd";
import Input, { SearchProps } from "antd/es/input";
import { DeleteTwoTone, EditTwoTone, ReloadOutlined } from "@ant-design/icons";
import HandleUtil from "../util/handle";

function Loan() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const handleUtil: HandleUtil<Loan> = new HandleUtil();


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
      key: 'z',
      render: (_: any, loan: Loan) =>
        <div style={{ display: 'flex', justifyContent: "space-between" }}>
          <a onClick={() => handleUtil.handleDelete(loan, "loan", setLoans, loans)}><DeleteTwoTone /></a>
          <a onClick={() => handleUtil.handleEdit(loan, setEditingLoan, form, setIsModalVisible)}><ReloadOutlined /></a>
        </div>,
    }
  ];

  const { Search } = Input;


  const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

  useEffect(() => {
    api.get(`/loan?page=${currentPage - 1}`)
      .then(response => {
        setLoans(response.data.data.content)
      }).catch(error => {
        console.log('Ocorreu um erro!', error)
      });
  }, []);
  return (
    <div>
      <Search placeholder="input search text" onSearch={onSearch} style={{ width: '100%' }} />
      <Table dataSource={loans} columns={columns} pagination={{
      current: currentPage,
      total: totalPages * 10,
      onChange: (page) => setCurrentPage(page),
      position: ['bottomCenter']
    }} />
      { editingLoan && (
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
            {editingLoan?.returnDate  && (
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