import { Form, Modal, Table } from 'antd';
import api from '../../api';
import { useEffect, useState } from 'react';
import Input, { SearchProps } from 'antd/es/input';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';

function Book() {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [form] = Form.useForm();

  const [books, setBooks] = useState<Book[]>([]);

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    form.setFieldsValue(book);
    setIsModalVisible(true);
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  }

  const handleOk = () => {
    const updatedBook = form.getFieldsValue();
    api.put(`/book/${editingBook!.id}`, updatedBook).then((response) => {
      setBooks(books.map(book => book.id === editingBook!.id ? response.data.data : book));
      setIsModalVisible(false);
    }).catch(error => {
      console.log('Erro ao fazer update do livro.', error);
    }
    )

    console.log(form.getFieldsValue());
    setIsModalVisible(false);
  };

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
        <div style={{ gap: '12px' }}>
          <a><DeleteTwoTone /></a>
          <a onClick={() => handleEdit(book)}><EditTwoTone /></a>
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
      <Modal title="Editar Livro" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
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