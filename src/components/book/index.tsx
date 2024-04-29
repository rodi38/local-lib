import { Form, Modal, Table } from 'antd';
import api from '../../api';
import { useEffect, useState } from 'react';
import Input, { SearchProps } from 'antd/es/input';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import HandleUtil from '../util/handle';

function Book() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [form] = Form.useForm();


  const handleUtil: HandleUtil<Book> = new HandleUtil();


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
      title: 'Quantidade em estoque',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'z',
      render: (_: any, book: Book) =>
        <div style={{display: 'flex', justifyContent: "space-evenly"}}>
          <a onClick={() => handleUtil.handleDelete(book, "book", setBooks, books)}><DeleteTwoTone /></a>
          <a onClick={() => handleUtil.handleEdit(book, setEditingBook, form, setIsModalVisible)}><EditTwoTone /></a>
        </div>,
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
      <Modal title="Editar Livro" open={isModalVisible} onOk={() =>{
        if(editingBook) {
          handleUtil.handleOk(form, "book", editingBook, setBooks, books, setIsModalVisible, )
        }
      }}
        onCancel={() => handleUtil.handleCancel(setIsModalVisible)}
        >
        <Form form={form} layout="vertical">
          <Form.Item label="Titulo" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Autor" name="author">
            <Input />
          </Form.Item>
          <Form.Item label="Categoria" name="category">
            <Input />
          </Form.Item>
          <Form.Item label="ISBN" name="isbn">
            <Input />
          </Form.Item>
          <Form.Item label="Editora" name="publisher">
            <Input />
          </Form.Item>
          <Form.Item label="Ano de publicação" name="publishedYear">
            <Input />
          </Form.Item>
          <Form.Item label="Quantidade em estoque" name="stockQuantity">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>

  )
}

export default Book