import { useEffect, useState } from "react";
import api from "../../api";
import { Table } from "antd";
import Input, { SearchProps } from "antd/es/input";

function Loan() {
  const [loans, setLoans] = useState([]);
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
      render: () => <a>Update</a>,
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: () => <a>Delete</a>,
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

    </div>
  )
}

export default Loan