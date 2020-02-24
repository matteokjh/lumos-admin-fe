import React from "react";
import { Form, Icon, Input, Button, message } from "antd";
import { FormComponentProps } from "antd/lib/form";
import "../styles/Login.sass";
import { login } from "../api/user";

const Login = (props: FormComponentProps) => {
    const { getFieldDecorator } = props.form;

    // methods
    const handleSubmit = () => {
        props.form.validateFields(async (err,val) => {
            if(!err) {
                try {
                    let res = await login(val)
                    if(res.code === 200) {
                        message.success(`欢迎回来！`)
                        window.location.reload()
                    } else {
                        message.error(res.msg)
                    }
                } catch(err) {
                    message.error(err)
                }
            }
        })
    };

    return (
        <div className="Login">
            <div className="formWrapper">
                <div className="title">Lumos - 管理平台</div>
                <Form className="login-form">
                    <Form.Item>
                        {getFieldDecorator("username", {
                            rules: [
                                {
                                    required: true,
                                    message: "请输入用户名"
                                }
                            ]
                        })(
                            <Input
                                prefix={
                                    <Icon
                                        type="user"
                                        style={{ color: "rgba(0,0,0,.25)" }}
                                    />
                                }
                                spellCheck={false}
                                autoComplete='off'
                                placeholder="用户名"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator("password", {
                            rules: [
                                {
                                    required: true,
                                    message: "请输入密码"
                                }
                            ]
                        })(
                            <Input
                                prefix={
                                    <Icon
                                        type="lock"
                                        style={{ color: "rgba(0,0,0,.25)" }}
                                    />
                                }
                                type="password"
                                placeholder="密码"
                                autoComplete='off'
                            />
                        )}
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

export default Form.create({
    name: "login_form"
})(Login);
