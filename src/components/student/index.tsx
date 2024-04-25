import { useEffect, useState } from "react"
import api from "../../api";
import { Space, Table } from "antd";
import Input, { SearchProps } from "antd/es/input";


function Student() {
  const [students, setStudents] = useState([]);
  const columns = [
    {
      title: 'Nome Completo',
      dataIndex: 'fullName',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Livros em Posse',
      dataIndex: 'barrowedBooksCount',
      key: 'barrowedBooksCount',
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
    api.get('/student')
      .then(response => {
        setStudents(response.data.data)
      }).catch(error => {
        console.log('Ocorreu um erro!', error)
      });
  }, []);

  return (
    <div>
          <Search placeholder="input search text" onSearch={onSearch} style={{ width: '100%', padding: 15 }} />
          <Table dataSource={students} columns={columns} />
    </div>
  );
}

export default Student
