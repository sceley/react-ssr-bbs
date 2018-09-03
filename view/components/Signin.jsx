import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, Form, Input, Button, Icon } from 'antd';
import { SET_USERINFO } from '../store/actions'
import { signin } from '../api';
const FormItem = Form.Item;
class Signin extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                const res = await signin(values);
                if (res.ok) {
                    const json = await res.json();
                    if (json.err === 0) {
                        this.props.dispatch({
                            type: SET_USERINFO,
                            payload: json.data
                        });
                        this.props.history.push('/');
                    } else {
                        alert(json.msg);
                    }
                }
            }
        });
    }
    checkPassword = (rule, value, callback) => {
        if (!(value && value.length >= 6 && value.length <= 16)) {
            callback('密码应为6-16位字符');
        } else {
            callback();
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Card
                    title={
                        <h2>登陆</h2>
                    }
                >
                    <Form style={{ maxWidth: 500, margin: '0 auto' }} onSubmit={this.handleSubmit}>
                        <FormItem
                            label="账号"
                        >
                            {getFieldDecorator('account', {
                                rules: [{
                                    required: true, message: '请输入账号!'
                                }]
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名/邮箱" />
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
                            <div className="media media-horizon">
                                <Link to="/signup">现在注册!</Link>
                            </div>
                            <div className="text-center">
                                <Button icon="user" type="primary" htmlType="submit">
                                    Signin
                                </Button>
                            </div>
                            <div style={{ fontSize: 16 }}>
                                <span>其他登陆：</span>
                                <a href="/api/auth/github"><Icon type="github" /></a>
                            </div>
                        </FormItem>
                    </Form>
                </Card>
            </div>
        );
    }
};

export default withRouter(
    connect()(
        Form.create()(Signin)
    )
);