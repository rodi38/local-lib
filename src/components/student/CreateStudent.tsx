import { Form, Input, InputNumber, Button, Row, Col } from 'antd';
import { Button as AntdButton } from 'antd';
 
import { useNavigate } from 'react-router-dom';
import api from '../../api';


function CreateStudent() {

    const navigate = useNavigate();


    const onFinish = (values: any) => {
        api.post(`/student`, values).then((response) => {
            console.log(response.data.data)
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
                            <Button type="primary" style={{boxShadow: 'none'}} htmlType="submit">
                                Enviar
                            </Button>
                        </Form.Item>
                    </Col>

                </Row>

            </Form>
        </div>

    );
}

export default CreateStudent;