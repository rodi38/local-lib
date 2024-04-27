import { useEffect, useState } from "react"
import api from "../../api";
import { Form, Modal, Space, Table } from "antd";
import Input, { SearchProps } from "antd/es/input";
import { DeleteTwoTone } from "@ant-design/icons";
import HandleUtil from "../util/handle";



function Student() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();

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
      dataIndex: 'barrowedBooksCount',
      key: 'barrowedBooksCount',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'z',
      render: (_: any, student: Student) =>
        <div>
          <a><DeleteTwoTone /></a>
          <a onClick={() => handleUtil.handleEdit(student, setEditingStudent, form, setIsModalVisible)}>Update</a>
        </div>,
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
