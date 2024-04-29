import { useEffect, useState } from "react";
import api from "../../api";
import { Form, Modal, Table } from "antd";
import Input, { SearchProps } from "antd/es/input";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import HandleUtil from "../util/handle";

function Loan() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [form] = Form.useForm();

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
          <a onClick={() => handleUtil.handleEdit(loan, setEditingLoan, form, setIsModalVisible)}><EditTwoTone /></a>
        </div>,
    }
  ];

  const { Search } = Input;


  const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

  useEffect(() => {
    api.get('/loan')
      .then(response => {
        setLoans(response.data.data)
      }).catch(error => {
        console.log('Ocorreu um erro!', error)
      });
  }, []);
  return (
    <div>
      <Search placeholder="input search text" onSearch={onSearch} style={{ width: '100%' }} />
      <Table dataSource={loans} columns={columns} />
      <Modal title="Deseja retornar o livro emprestado?" open={isModalVisible} onOk={() => {
        if (editingLoan) {
          handleUtil.handleOk(form, 'loan', editingLoan, setLoans, loans, setIsModalVisible, false)
        }
      }}
        onCancel={() => handleUtil.handleCancel(setIsModalVisible)}>
        <Form form={form} layout="vertical">
          <Form.Item label="book" name="book">
            <Input disabled/>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  )
}

export default Loan