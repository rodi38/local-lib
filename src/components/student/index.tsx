import { useEffect, useState } from "react"
import api from "../../api";
import { Button, Form, Modal, Table } from "antd";
import Input, { SearchProps } from "antd/es/input";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import HandleUtil from "../util/handle";
import debounce from 'lodash/debounce';

function Student() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const handleUtil: HandleUtil<Student> = new HandleUtil();

  const [search, setSearch] = useState("");



  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const showDeleteConfirmModal = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (studentToDelete) {
      handleUtil.handleDelete(studentToDelete, "student", setStudents, students);
    }
    setIsDeleteModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };


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
      dataIndex: 'borrowedBooksCount',
      key: 'borrowedBooksCount',
    },
    {
      title: 'Action',
      dataIndex: '',
      width: 100,
      key: 'z',
      render: (_: any, student: Student) =>
        <div style={{ display: 'flex', justifyContent: "flex-start", gap: 20 }}>
          <a onClick={() => student.borrowedBooksCount === 0 ? showDeleteConfirmModal(student) : alert("Estudante ainda tem livros a serem devolvidos, não é possivel apagar o registro.")}><DeleteFilled style={{ color: '#e30202', fontSize: '18px' }} /></a>
          <a onClick={() => handleUtil.handleEdit(student, setEditingStudent, form, setIsModalVisible)}><EditFilled style={{ color: '#ff8903', fontSize: '18px' }} /></a>
        </div>,
    }
  ];

  const fetchStudents = async (search: string, page: number) => {
    try {
      const response = await api.get(`/student?page=${page - 1}&search=${search}`);
      setStudents(response.data.data.content);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.log('Ocorreu um erro!', error);
    }
  };

  const debouncedFetchStudents = debounce(fetchStudents, 300);

  useEffect(() => {
    debouncedFetchStudents(search, currentPage);
    return () => {
      debouncedFetchStudents.cancel();
    };
  }, [search]);




  return (
    <div>
      <Input 
        placeholder="Buscar estudante" 
        onChange={(e) => setSearch(e.target.value)} 
        style={{ width: '100%', marginBottom: '20px' }} 
      />

      <Table dataSource={students} virtual columns={columns} pagination={{
        current: currentPage,
        total: totalPages * 10,
        onChange: (page) => setCurrentPage(page),
        position: ['topCenter'],
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

      <Modal title="Editar dados do estudante" open={isModalVisible} onOk={() => {
        if (editingStudent) {
          handleUtil.handleOk(form, 'student', editingStudent, setStudents, students, setIsModalVisible)
        }
      }}
        onCancel={() => handleUtil.handleCancel(setIsModalVisible)}>
        <Form form={form} layout="vertical">
          <Form.Item label="Nome completo" name="fullName">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Student
