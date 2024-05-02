import { useEffect, useState } from "react"
import api from "../../api";
import { Form, Modal, Table } from "antd";
import Input, { SearchProps } from "antd/es/input";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import HandleUtil from "../util/handle";



function Student() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState(''); 
  const handleUtil: HandleUtil<Student> = new HandleUtil();
  

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
      key: 'z',
      render: (_: any, student: Student) =>
        <div style={{display: 'flex', justifyContent: "space-evenly"}}>
          <a onClick={() => student.borrowedBooksCount === 0 ?handleUtil.handleDelete(student, "student" ,setStudents, students) : alert("Estudante ainda tem livros a serem devolvidos, não é possivel apagar o registro.")}><DeleteTwoTone /></a>
          <a onClick={() => handleUtil.handleEdit(student, setEditingStudent, form, setIsModalVisible)}><EditTwoTone /></a>
        </div>,
    }
  ];

  useEffect(() => {
    api.get(`/student?page=${currentPage - 1}`)
      .then(response => {
        setStudents(response.data.data.content)
        console.log('passou')
      }).catch(error => {
        console.log('Ocorreu um erro!', error)
      });
  }, []);
  
  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchValue.toLowerCase())
  );
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <div>
      <Input.Search placeholder="input search text" onChange={handleSearch} style={{ width: '100%'}} />
      <Table dataSource={filteredStudents} columns={columns} pagination={{
      current: currentPage,
      total: totalPages * 10,
      onChange: (page) => setCurrentPage(page),
      position: ['bottomCenter']
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
