import { Button, Form, Modal, Table } from "antd";
import api from "../../api";
import { useEffect, useState } from "react";
import Input from "antd/es/input";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import HandleUtil from "../util/handle";
import { debounce } from "lodash";
import { toast } from "react-toastify";

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

  const handleDeleteConfirm = async () => {
    if (bookToDelete) {
      await handleUtil.handleDelete(bookToDelete, "book", setBooks, books);
      const pageAfterDeletion =
        books.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      setCurrentPage(pageAfterDeletion);
      fetchBooks(search, pageAfterDeletion);
    }
    setIsDeleteModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const columns = [
    {
      title: "Titulo",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Autor",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Categoria",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      key: "isbn",
    },
    {
      title: "Editora",
      dataIndex: "publisher",
      key: "publisher",
    },
    {
      title: "Ano de publicação",
      dataIndex: "publishedYear",
      key: "publishedYear",
    },
    {
      title: "Quantidade em estoque",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
    },
    {
      title: "Action",
      dataIndex: "",
      width: 100,
      key: "z",
      render: (_: any, book: Book) => (
        <div style={{ display: "flex", justifyContent: "flex-start", gap: 20 }}>
          <a onClick={() => showDeleteConfirmModal(book)}>
            <DeleteFilled style={{ color: "#e30202", fontSize: "18px" }} />
          </a>
          <a
            onClick={() =>
              handleUtil.handleEdit(
                book,
                setEditingBook,
                form,
                setIsModalVisible
              )
            }
          >
            <EditFilled style={{ color: "#ff8903", fontSize: "18px" }} />
          </a>
        </div>
      ),
    },
  ];

  const fetchBooks = async (search: string, page: number) => {
    try {
      const response = await api.get(`/book?page=${page - 1}&search=${search}`);
      setBooks(response.data.data.content);
      setTotalPages(response.data.data.totalPages);
    } catch (error: any) {
      if (error.response.data.errors) {
        error.response.data.errors.forEach((e: string) =>
          toast.error(e, { theme: "colored", autoClose: 3000 })
        );
      }
      toast.error(
        handleUtil.handleDuplicityExceptionDetail(
          error.response.data.rootCause.serverErrorMessage.detail
        ),
        { theme: "colored", autoClose: 3000 }
      );
    }
  };

  const debouncedFetchBooks = debounce(fetchBooks, 300);

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
        style={{ width: "100%", marginBottom: "20px" }}
      />
      <Table
        dataSource={books}
        columns={columns}
        pagination={{
          current: currentPage,
          total: totalPages * 10,
          onChange: (page) => setCurrentPage(page),
          position: ["topCenter"],
        }}
      />

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
      <Modal
        title="Editar Livro"
        open={isModalVisible}
        onOk={() => {
          if (editingBook) {
            handleUtil.handlePut(
              form,
              "book",
              editingBook,
              setBooks,
              books,
              setIsModalVisible
            );
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
  );
}

export default Book;
