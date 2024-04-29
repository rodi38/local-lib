import { Form, Input, InputNumber, Button, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../api';


function CreateBook() {

    const navigate = useNavigate();
    

    const onFinish = (values: any) => {
        api.post(`/book`, values).then((response) => {
            console.log(response.data.data)
            navigate("/book");
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
                            label="Título"
                            name="title"
                            rules={[{ required: true, message: 'Por favor insira o título!' }]}
                        >
                            <Input />
                        </Form.Item>


                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Autor"
                            name="author"
                            rules={[{ required: true, message: 'Por favor insira o autor!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Categoria"
                            name="category"
                            rules={[{ required: true, message: 'Por favor insira a categoria!' }]}
                        >
                            <Input />
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="ISBN"
                            name="isbn"
                            rules={[{ required: true, message: 'Por favor insira o ISBN!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>



                <Row gutter={16}>
                    <Col xs={24} sm={8}>

                        <Form.Item
                            label="Editora"
                            name="publisher"
                            rules={[{ required: true, message: 'Por favor insira a editora!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Ano de Publicação"
                            name="publishedYear"
                            rules={[{ required: true, message: 'Por favor insira o ano de publicação!' }]}
                        >
                            <InputNumber min={1} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Quantidade em Estoque"
                            name="stockQuantity"
                            rules={[{ required: true, message: 'Por favor insira a quantidade em estoque!' }]}
                        >
                            <InputNumber min={1} />
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

export default CreateBook;