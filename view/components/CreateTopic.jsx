import React, { Component } from 'react';
import { Card, Input, Button, Form, Select, Layout } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Editor from './Editor';
import { createTopic } from '../api';
const FormItem = Form.Item;
const Option = Select.Option;
const { Content, Sider } = Layout;
class CreateTopic extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const content = this.refs.editor.getValue();
                values.content = content;
                if (!content) {
                    return;
                }
                const res = await createTopic(values);
                if (res.ok) {
                    const json = await res.json();
                    if (json.err === 0) {
                        this.props.history.push('/');
                    } else {
                        alert(json.msg);
                    }
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
                            title={<h2>发表文章</h2>}
                        >
                            <Form onSubmit={this.handleSubmit}>
                                <FormItem
                                    label="板块"
                                >
                                    {getFieldDecorator('tab', {
                                        rules: [{
                                            required: true, message: '请选择板块!',
                                        }],
                                    })(
                                        <Select>
                                            <Option value="tech">技术</Option>
                                            <Option value="life">生活</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    label="标题"
                                >
                                    {getFieldDecorator('title', {
                                        rules: [{
                                            required: true, message: '请输入标题!',
                                        }],
                                    })(
                                        <Input placeholder="标题" />
                                    )}
                                </FormItem>
                                <FormItem
                                    label="内容"
                                >
                                    <Editor ref="editor"></Editor>
                                </FormItem>
                                <FormItem>
                                    <div style={{ textAlign: 'center' }}>
                                        <Button type="primary" htmlType="submit">
                                            发表
                                        </Button>
                                    </div>
                                </FormItem>
                            </Form>
                        </Card>
                    </Content>
                    <Sider width={250} className="sider">
                        <Card
                            title={<h4>说明</h4>}
                        >
                            <ul className="menu menu-vertical">
                                <li>支持Markdown语法</li>
                                <li>点击图片图标可上传图片</li>
                            </ul>
                        </Card>
                    </Sider>
                </Layout>
            </div>
        );
    }
};

function mapStateToProps(state) {
    return {
        topics: state.topics
    }
};

export default withRouter(
    connect(mapStateToProps)(
        Form.create()(CreateTopic)
    )
);