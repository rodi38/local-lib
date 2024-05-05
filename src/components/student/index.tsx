import { useEffect, useState } from "react"
import api from "../../api";
import { Form, Modal, Table } from "antd";
import Input, { SearchProps } from "antd/es/input";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import HandleUtil from "../util/handle";



function Student() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const handleUtil: HandleUtil<Student> = new HandleUtil();
  
  const [search, setSearch] = useState("");



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
          <a onClick={() => student.borrowedBooksCount === 0 ? handleUtil.handleDelete(student, "student", setStudents, students) : alert("Estudante ainda tem livros a serem devolvidos, não é possivel apagar o registro.")}><DeleteFilled style={{color: '#e30202', fontSize: '18px'}}/></a>
          <a onClick={() => handleUtil.handleEdit(student, setEditingStudent, form, setIsModalVisible)}><EditFilled style={{color: '#ff8903', fontSize: '18px'}}/></a>
        </div>,
    }
  ];


  const { Search } = Input;

  const onSearch: SearchProps['onSearch'] = (value) => setSearch(value);


  useEffect(() => {
    api.get(`/student?page=${currentPage - 1}&search=${search}`)
      .then(response => {
        setStudents(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
      }).catch(error => {
        console.log('Ocorreu um erro!', error)
      });
  }, [search, currentPage]);




  return (
    <div>
      <Search placeholder="input search text" onSearch={onSearch} style={{ width: '100%' }} />

      <Table dataSource={students} virtual columns={columns} pagination={{
        current: currentPage,
        total: totalPages * 10,
        onChange: (page) => setCurrentPage(page),
        position: ['bottomCenter'],
      }} />
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
