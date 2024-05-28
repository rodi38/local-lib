import { Form, Input, Button, Row, Col } from 'antd';

import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { toast } from 'react-toastify';



function CreateStudent() {
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        try {
            await api.post(`/student`, values);
            await toast.promise(
                new Promise(resolve => setTimeout(resolve, 1000)),
                {
                  pending: 'Enviando ...',
                  success: 'Estudante cadastrado com sucesso!',
                }
            ,{
                theme: 'colored'
            });
            navigate("/student");

        } catch (error: any) {
            if(error.response.data.errors) {
                error.response.data.errors.forEach((e: string) => toast.error(e, {theme: "colored", autoClose: 3000,}));
            }
            toast.error( error.response.data.message, {theme: "colored", autoClose: 3000,});
            console.log(error)

        }

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
                            label="Nome completo do Estudante"
                            name="fullName"
                            rules={[{ required: true, message: 'Por favor insira o nome do aluno!' }]}
                        >
                            <Input />
                        </Form.Item>


                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Por favor insira o email!', type: 'email' }]}
                        >
                            <Input />
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

export default CreateStudent;