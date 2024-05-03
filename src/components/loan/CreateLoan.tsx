import { Form, Button, Row, Col, Select } from 'antd';
import { useEffect, useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';


function CreateLoan() {

    const [students, setStudents] = useState<Student[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const { Option } = Select;
    const navigate = useNavigate();
    useEffect(() => {
        api.get('/student')
            .then(response => {
                setStudents(response.data.data.content);
                console.log('passou')

            }).catch(error => {
                console.log('Ocorreu um erro!', error);
            });
    }, []);
    useEffect(() => {
        api.get('/book')
            .then(response => {
                setBooks(response.data.data.content);
            }).catch(error => {
                console.log('Ocorreu um erro!', error);
            });
    }, []);

    const onFinish = (values: any) => {
        api.post(`/loan`, values).then((response) => {
            console.log(response.data.data.content)

            navigate("/student");
        }).catch(error => {
            console.log('Erro ao deletar.', error);

        });
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div style={{}}>
            <Form
                name="createBook"
                layout='vertical'
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Estudante"
                            name="studentId"
                            rules={[{ required: true, message: 'Por favor insira o estudante!' }]}
                        >   
                            
                            <Select placeholder="Selecione um estudante">
                                {students.map(student => (
                                    <Option key={student.id} value={student.id}>{student.email}  | livros em posse: {student.borrowedBooksCount}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Livro"
                            name="bookId"
                            rules={[{ required: true, message: 'Por favor insira o livro!' }]}
                        >
                            <Select placeholder="Selecione um estudante">
                                {books.map(book => (
                                    <Option key={book.id} value={book.id}>{book.title} | Quantidade em estoque: {book.stockQuantity}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Criar Livro
                            </Button>
                        </Form.Item>
                    </Col>

                </Row>
            </Form>
        </div>

    );
}

export default CreateLoan;