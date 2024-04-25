import { Table } from 'antd';
import api from '../../api';
import { useEffect, useState } from 'react';
import Input, { SearchProps } from 'antd/es/input';

function Book() {

  const [books, setBooks] = useState([]);
  const columns = [
    {
      title: 'Titulo',
      dataIndex: 'title',
      key: 'title',
    }, 
    {
      title: 'Autor',
      dataIndex: 'author',
      key: 'author',
    }, 
    {
      title: 'Categoria',
      dataIndex: 'category',
      key: 'category',
    }, 
    {
      title: 'ISBN',
      dataIndex: 'isbn',
      key: 'isbn',
    },
    {
      title: 'Editora',
      dataIndex: 'publisher',
      key: 'publisher',
    },
    {
      title: 'Ano de publicação',
      dataIndex: 'publishedYear',
      key: 'publishedYear',
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
    api.get('/book')
      .then(response => {
        setBooks(response.data.data)
      }).catch(error => {
        console.log('Ocorreu um erro!', error)
      });
  }, []);

  return (
    <div>
        <Search placeholder="input search text" onSearch={onSearch} style={{ width: '100%' }} />
        <Table dataSource={books} columns={columns} />
    </div>

  )
}

export default Book