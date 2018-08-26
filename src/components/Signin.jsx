import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { USER_SIGNIN } from '../store/actions';
import { Card, Form, Input, Button, Icon } from 'antd';
const FormItem = Form.Item;
class Signin extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {

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
                                <Link to="/forgotpassword">忘记密码!</Link>
                                <Link to="/signup">现在注册!</Link>
                            </div>
                            <div className="text-center">
                                <Button type="primary" htmlType="submit">
                                    登陆
                                </Button>
                            </div>
                            <div style={{ fontSize: 16 }}>
                                <span>其他登陆：</span>
                                <a href="#"><Icon type="github" /></a>
                            </div>
                        </FormItem>
                    </Form>
                </Card>
            </div>
        );
    }
};

function mapStateToProps(state) {
    return {

    }
};

function mapDispatchToProps(dispatch) {
    return {
        handleLogin: (user) => dispatch({
            type: USER_SIGNIN,
            payload: user
        })
    }
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(
        Form.create()(Signin)
    )
);