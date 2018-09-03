import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, Layout, Avatar, List, Tag } from 'antd';
import moment from 'moment';
import Profile from './Profile';
import { fetchUser } from '../store/actions'
const { Content, Sider } = Layout;
class User extends Component {
    componentDidMount = () => {
        const match = this.props.match;
        this.props.dispatch(fetchUser(match));
    }
    render() {
        return (
            <div>
                <Layout>
                    <Content className="content">
                        <Card
                            title="他发表的话题"
                        >
                            <List
                                itemLayout="horizontal"
                                dataSource={this.props.user.topics}
                                bordered={true}
                                renderItem={topic => (
                                    <List.Item actions={[<span>{moment(topic.createdAt).format("YYYY-MM-DD HH:mm:ss")}</span>]}>
                                        <List.Item.Meta
                                            avatar={
                                                <Link to={`/user/${topic.user_id}`}>
                                                    <Avatar src={topic.avatar} />
                                                </Link>
                                            }
                                            title={
                                                <Link to={`/topic/${topic.id}`}>
                                                    <Tag color="#87d068">
                                                        {topic.tab === 'tech' ? "技术" : "生活"}
                                                    </Tag>
                                                    {topic.title}
                                                </Link>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                        <Card
                            title="他收藏的话题"
                            style={{ marginTop: 24 }}
                        >
                            <List
                                itemLayout="horizontal"
                                dataSource={this.props.user.collects}
                                bordered={true}
                                renderItem={topic => (
                                    <List.Item actions={[<span>{moment(topic.createdAt).format("YYYY-MM-DD HH:mm:ss")}</span>]}>
                                        <List.Item.Meta
                                            avatar={
                                                <Link to={`/user/${topic.author_id}`}>
                                                    <Avatar src={topic.avatar} />
                                                </Link>
                                            }
                                            title={
                                                <Link to={`/topic/${topic.id}`}>
                                                    <Tag color="#87d068">
                                                        {topic.tab === 'tech' ? "技术" : "生活"}
                                                    </Tag>
                                                    {topic.title}
                                                </Link>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Content>
                    <Sider width={250} className="sider">
                        <Profile userInfo={this.props.user} />
                    </Sider>
                </Layout>
            </div>
        );
    }
};

User.serverFetch = fetchUser;

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default withRouter(
    connect(mapStateToProps)(User)
);