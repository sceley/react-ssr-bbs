import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';
import { Card, Form, Input, Button, Icon } from 'antd';
const FormItem = Form.Item;

class Signup extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {

            }
        });
    }
    checkUsername = (rule, value, callback) => {
        if (!(value && value.length <= 20 && value.length >= 2)) {
            callback("用户名应为2-20个字符");
        }
    }
    checkPassword = (rule, value, callback) => {
        if (!(value && value.length >= 6 && value.length <= 16)) {
            callback('密码应为6-16个字符');
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Card
                    title={<h2>注册</h2>}
                >
                    <Form style={{ maxWidth: 500, margin: '0 auto' }} onSubmit={this.handleSubmit}>
                        <FormItem
                            label="用户名"
                        >
                            {getFieldDecorator('username', {
                                rules: [{
                                    required: true, message: '请输入用户名!'
                                }, {
                                    validator: this.checkUsername
                                }]
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="2-20位字符的用户名" />
                            )}
                        </FormItem>
                        <FormItem
                            label="邮箱"
                        >
                            {getFieldDecorator('email', {
                                rules: [{
                                    type: 'email', message: '邮箱格式不正确!'
                                }, {
                                    required: true, message: '请输入邮箱!'
                                }]
                            })(
                                <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="邮箱" />
                            )}
                        </FormItem>
                        <FormItem
                            label="密码"
                        >
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: '请输入密码!'
                                }, {
                                    validator: this.checkPassword
                                }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="6-16位字符的密码" />
                            )}
                        </FormItem>
                        <FormItem>
                            <div className="text-center">
                                <Button type="primary" htmlType="submit">
                                    注册
                                </Button>
                            </div>
                            <div>
                                <Link to="/signin">登陆!</Link>
                            </div>
                        </FormItem>
                    </Form>
                </Card>
            </div>
        );
    }
};

export default Form.create()(Signup);