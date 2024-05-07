import { Button, Form, Modal, Table } from 'antd';
import api from '../../api';
import { useEffect, useState } from 'react';
import Input, { SearchProps } from 'antd/es/input';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import HandleUtil from '../util/handle';

function Book() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");

  const handleUtil: HandleUtil<Book> = new HandleUtil();


  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [bookToDelete, setbookToDelete] = useState<Book | null>(null);

  const showDeleteConfirmModal = (book: Book) => {
    setbookToDelete(book);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (bookToDelete) {
      handleUtil.handleDelete(bookToDelete, "book", setBooks, books);
    }
    setIsDeleteModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
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
      width: 100,
      key: 'z',
      render: (_: any, book: Book) =>
        <div style={{ display: 'flex', justifyContent: "flex-start", gap: 20 }}>
          <a onClick={() => showDeleteConfirmModal(book)}><DeleteFilled style={{ color: '#e30202', fontSize: '18px' }} /></a>
          <a onClick={() => handleUtil.handleEdit(book, setEditingBook, form, setIsModalVisible)}><EditFilled style={{ color: '#ff8903', fontSize: '18px' }} /></a>
        </div>,
    }
  ];

  const { Search } = Input;


  const onSearch: SearchProps['onSearch'] = (value) => setSearch(value);

  useEffect(() => {
    api.get(`/book?page=${currentPage - 1}&search=${search}`)
      .then(response => {
        setBooks(response.data.data.content);
        setTotalPages(response.data.data.totalPages)
      }).catch(error => {
        console.log('Ocorreu um erro!', error)
      });
  }, [search, currentPage]);

  return (
    <div>
      <Search placeholder="input search text" onSearch={onSearch} style={{ width: '100%' }} />
      <Table dataSource={books} columns={columns} pagination={{
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
          <p>Tem certeza que deseja deletar este item?</p>
        </Modal>
      )}
      <Modal title="Editar Livro" open={isModalVisible} onOk={() => {
        if (editingBook) {
          handleUtil.handleOk(form, "book", editingBook, setBooks, books, setIsModalVisible,)
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