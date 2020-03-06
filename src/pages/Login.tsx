import React from "react";
import { Form, Input, Button, message } from "antd";
import "@/styles/Login.sass";
import { login } from "@/api/user";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const Login = () => {
    const [form] = Form.useForm();

    // methods
    const handleSubmit = async () => {
        let values: any = await form.validateFields();
        try {
            let res = await login(values);
            if (res.code === 200) {
                message.success(`欢迎回来！`);
                window.location.reload();
            } else {
                message.error(res.msg);
            }
        } catch (err) {
            message.error(err);
        }
    };

    return (
        <div className="Login">
            <div className="formWrapper">
                <div className="title">Lumos - 管理平台</div>
                <Form form={form} className="login-form">
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "请输入用户名"
                            }
                        ]}
                    >
                        <Input
                            prefix={
                                <UserOutlined
                                    style={{ color: "rgba(0,0,0,.25)" }}
                                />
                            }
                            spellCheck={false}
                            autoComplete="off"
                            placeholder="用户名"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "请输入密码"
                            }
                        ]}
                    >
                        <Input
                            prefix={
                                <LockOutlined
                                    style={{ color: "rgba(0,0,0,.25)" }}
                                />
                            }
                            type="password"
                            placeholder="密码"
                            autoComplete="off"
                        />
                    </Form.Item>
                    <Form.Item className="btn-wrapper">
                        <Button
                            type="primary"
                            className="login-form-button"
                            onClick={handleSubmit}
                        >
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
