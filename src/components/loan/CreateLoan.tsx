import { Form, Button, Row, Col, Select, AutoComplete } from 'antd';
import { useEffect, useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import Student from '../student';


function CreateLoan() {
    const [searchResults, setSearchResults] = useState([]);
    const { Option } = Select;
    const navigate = useNavigate();


    const onFinish = (values: any) => {
        api.post(`/loan`, values).then((response) => {
            console.log(response.data.data.content)
            navigate("/loan");
        }).catch(error => {
            console.log('Erro ao criar emprestimo.', error);

        });
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const handleSearch = (value: string, context: string) => {
        if (value) {
            api.get(`/${context}?search=${value}&page=0&size=1000`)
                .then(response => {
                    setSearchResults(response.data.data.content);
                    console.log(response.data.data.content)
                }).catch(error => {
                    console.log('Ocorreu um erro!', error);
                });
        } else {
            setSearchResults([]);
        }
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

                            <AutoComplete
                                style={{ width: '100%' }}
                                onChange={(value) => handleSearch(value, "student")}
                                placeholder="Selecione um estudante"
                            >
                                {searchResults.map((student: Student) => (
                                    <Option key={student.id} value={student.id}>{student.email}  | livros em posse: {student.borrowedBooksCount}</Option>
                                ))}
                            </AutoComplete>


                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Livro"
                            name="bookId"
                            rules={[{ required: true, message: 'Por favor insira o livro!' }]}
                        >

                            <AutoComplete
                                style={{ width: '100%' }}
                                onChange={(value) => handleSearch(value, "book")}
                                placeholder="Selecione um estudante"
                            >
                                {searchResults.map((book: Book) => (
                                    <Option key={book.id} value={book.id}>{book.title}  | Quantidade em estoque: {book.stockQuantity}</Option>
                                ))}
                            </AutoComplete>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Enviar
                            </Button>
                        </Form.Item>
                    </Col>

                </Row>
            </Form>
        </div>

    );
}

export default CreateLoan;