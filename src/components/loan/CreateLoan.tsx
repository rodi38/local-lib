import { Form, Button, Row, Col, Select, AutoComplete } from 'antd';
import { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import _, { debounce } from 'lodash';



function CreateLoan() {
    // const [searchResults, setSearchResults] = useState([]);

    const [bookSearchResults, setBookSearchResults] = useState<Book[]>([]);
    const [studentSearchResults, setStudentSearchResults] = useState<Student[]>([]);


    const { Option } = Select;
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        try {
            const { studentId, bookId } = values;
            console.log(values);

            await api.post(`/loan`, { bookId, studentId });

            await toast.promise(
                new Promise(resolve => setTimeout(resolve, 1000)),
                {
                    pending: 'Enviando ...',
                    success: 'Emprestimo efetuado com sucesso!',
                }
                , {
                    theme: 'colored'
                });

            navigate("/loan");
        } catch (error: any) {
            toast.error(error.response.data.message, { theme: "colored", autoClose: 3000, });
            error.response.data.errors.forEach((e: string) => toast.error(e, { theme: "colored", autoClose: 3000, }));
        }

    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const handleSearch = async (value: string, context: string) => {

        try {
            const response = await api.get(`/${context}?search=${value}&page=0&size=1000`);
            if (context === "student") {
                setStudentSearchResults(response.data.data.content);
            } else if (context === "book") {
                setBookSearchResults(response.data.data.content);
            }
            console.log(response.data.data.content);
        } catch (error) {
            console.log('Ocorreu um erro ao pesquisar!', error);
        }

    };

    const debouncedSearch = _.debounce((value, context) => handleSearch(value, context), 300);



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
                                onChange={(value) => debouncedSearch(value, "student")}
                                placeholder="Selecione um estudante"
                            >
                                {studentSearchResults.map((student: Student) => (
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
                                onChange={(value) => debouncedSearch(value, "book")}
                                placeholder="Selecione um estudante"
                            >
                                {bookSearchResults.map((book: Book) => (
                                    <Option key={book.id} value={book.id}>{book.title}  | Quantidade em estoque: {book.stockQuantity}</Option>
                                ))}
                            </AutoComplete>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item>
                            <Button type="primary" style={{ boxShadow: 'none' }} htmlType="submit">
                                Enviar
                            </Button>
                            <Button type="default" style={{ marginLeft: '10px' }} onClick={() => navigate("/student")}>
                                Cancelar
                            </Button>
                        </Form.Item>
                    </Col>

                </Row>
            </Form>
        </div>

    );
}

export default CreateLoan;