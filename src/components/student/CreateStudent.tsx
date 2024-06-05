import { Form, Input, Button, Row, Col } from "antd";

import { useNavigate } from "react-router-dom";
import api from "../../api";
import { toast } from "react-toastify";
import HandleUtil from "../util/handle";

function CreateStudent() {
  const navigate = useNavigate();

  const handleUtil: HandleUtil<Student> = new HandleUtil();

  const onFinish = async (values: any) => {
    try {
      await api.post(`/student`, values);
      await toast.promise(
        new Promise((resolve) => setTimeout(resolve, 1000)),
        {
          pending: "Enviando ...",
          success: "Estudante cadastrado com sucesso!",
        },
        {
          theme: localStorage.getItem('theme') === "light" ? "colored" : "dark" ,
        }
      );
      navigate("/student");
    } catch (error: any) {
      if (error.response.data.errors) {
        error.response.data.errors.forEach((e: string) =>
          toast.error(e, { theme: localStorage.getItem('theme') === "light" ? "colored" : "dark", autoClose: 3000 })
        );
      }
      toast.error(
        handleUtil.handleDuplicityExceptionDetail(
          error.response.data.rootCause.serverErrorMessage.detail
        ),
        { theme: localStorage.getItem('theme') === "light" ? "colored" : "dark", autoClose: 3000 }
      );
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={{}}>
      <Form
        name="createBook"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Nome completo do Estudante"
              name="fullName"
              rules={[
                {
                  required: true,
                  message: "Por favor insira o nome do aluno!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Por favor insira o email!",
                  type: "email",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item>
              <Button
                type="primary"
                style={{ boxShadow: "none" }}
                htmlType="submit"
              >
                Enviar
              </Button>

              <Button
                type="default"
                style={{ marginLeft: "10px" }}
                onClick={() => navigate("/student")}
              >
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
