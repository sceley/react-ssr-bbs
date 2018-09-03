import React, { Component } from 'react';
import { Card, Layout, Icon, Form, Input, Button, Select } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Profile from './Profile';
import { editUserInfo } from '../api';
import { SET_USERINFO } from '../store/actions';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { Content, Sider } = Layout;

class Setting extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const res = await editUserInfo(values);
                if (res.ok) {
                    const json = await res.json();
                    if (json.err === 0) {
                        this.props.dispatch({
                            type: SET_USERINFO,
                            payload: {
                                ...this.props.userInfo,
                                ...values
                            }
                        })
                    }
                    alert(json.msg);
                }
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Layout>
                    <Content className="content">
                        <Card
                            title={<h2><Icon style={{ marginRight: 5 }} type="setting" />信息编辑</h2>}
                        >
                            <Form style={{ maxWidth: 500, margin: '0 auto' }} onSubmit={this.handleSubmit} className="SettingForm">
                                <FormItem
                                    label="用户名"
                                >
                                    {getFieldDecorator('username', {
                                        rules: [{ required: true, message: '请输入用户名!' }],
                                        initialValue: this.props.userInfo.username
                                    })(
                                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                                    )}
                                </FormItem>
                                <FormItem
                                    label="性别"
                                >
                                    {getFieldDecorator('gender', {
                                        rules: [{
                                            required: true, message: '请选择性别!'
                                        }], initialValue: this.props.userInfo.gender
                                    })(
                                        <Select>
                                            <Option value='M'>男</Option>
                                            <Option value='F'>女</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    label="地点"
                                >
                                    {getFieldDecorator('location', {
                                        initialValue: this.props.userInfo.location
                                    })(
                                        <Input prefix={<Icon type="environment-o" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="地点" />
                                    )}
                                </FormItem>
                                <FormItem
                                    label="个人网站"
                                >
                                    {getFieldDecorator('website', {
                                        initialValue: this.props.userInfo.website
                                    })(
                                        <Input prefix={<Icon type="global" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="个人网站" />
                                    )}
                                </FormItem>
                                <FormItem
                                    label="Github"
                                >
                                    {getFieldDecorator('githubName', {
                                        initialValue: this.props.userInfo.githubName
                                    })(
                                        <Input prefix={<Icon type="github" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="eg. sceley" />
                                    )}
                                </FormItem>
                                <FormItem
                                    label="个人简介"
                                >
                                    {getFieldDecorator('introduction', {
                                        initialValue: this.props.userInfo.introduction
                                    })(
                                        <TextArea rows={4} />
                                    )}
                                </FormItem>
                                <FormItem>
                                    <div className="text-center">
                                        <Button type="primary" htmlType="submit">
                                            更改
                                        </Button>
                                    </div>
                                </FormItem>
                            </Form>
                        </Card>
                    </Content>
                    <Sider width={250} className="sider">
                        <Profile userInfo={this.props.userInfo} />
                    </Sider>
                </Layout>
            </div>
        );
    }
};

function mapStateToProps(state) {
    return {
        userInfo: state.userInfo
    }
};

export default withRouter(
    connect(mapStateToProps)(
        Form.create()(Setting)
    )
);