import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Layout, List, Avatar, Card, Button, Icon } from 'antd';
import moment from 'moment';
import Profile from './Profile';
import Editor from './Editor';
import { connect } from 'react-redux';
import { fetchTopic, SET_TOPIC } from '../store/actions';
import { addComment, deleteComment, addCollect, deleteCollect, deleteTopic } from '../api'
const { Content, Sider } = Layout;
const Title = (props) => (
    <div>
        <h2>
            {props.topic.title}
            {
                props.userInfo ?
                    <div style={{ float: 'right', fontSize: 16 }}>
                        {
                            props.userInfo.id === props.topic.author_id ?
                                <div>
                                    <a onClick={props.handleDelTopic} style={{ marginLeft: 5 }}>
                                        <Icon type="delete" />
                                    </a>
                                </div>
                                :
                                <div>
                                    {
                                        props.topic.collected ?
                                            <a onClick={props.handleDelColTopic}>
                                                <Icon type="heart" />
                                            </a>
                                            :
                                            <a onClick={props.handleColTopic}>
                                                <Icon type="heart-o" />
                                            </a>
                                    }
                                </div>
                        }
                    </div>
                    :
                    null
            }
        </h2>
        <ul className="menu menu-horizon">
            <li>
                <em>
                    <span>作者：</span>
                    {props.topic.author}
                </em>
            </li>
            <li>
                <em>
                    <span>时间：</span>
                    {moment(props.topic.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </em>
            </li>
            <li>
                <em>
                    <span>板块：</span>
                    {
                        props.topic.tab === 'tech' ? "技术" : "生活"
                    }
                </em>
            </li>
            <li>
                <em>
                    <span>浏览数：</span>
                    {props.topic.visit_count}
                </em>
            </li>
            <li>
                <em>
                    <span>收藏数：</span>
                    {props.topic.collects_count}
                </em>
            </li>
        </ul>
    </div>
);
class Topic extends Component {
    componentDidMount = () => {
        const match = this.props.match;
        this.props.dispatch(fetchTopic(match));
    }
    handleComment = async () => {
        const content = this.refs.editor.getValue();
        if (!content) {
            return;
        }
        const body = {
            content: content,
            topic_id: this.props.match.params.id
        };
        const res = await addComment(body);
        if (res.ok) {
            const json = await res.json();
            if (json.err === 0) {
                const topic = this.props.topic;
                topic.comments = [...topic.comments, json.data];
                this.props.dispatch({
                    type: SET_TOPIC,
                    payload: topic
                });
                this.refs.editor.setValue(``);
            } else {
                alert(json.msg);
            }
        }
    }
    handleEnter = (author) => {
        this.refs.editor.setValue(`@${author} `);
    }
    handleColTopic = async () => {
        try {
            const res = await addCollect({
                topic_id: this.props.match.params.id
            });
            if (res.ok) {
                const json = await res.json();
                if (json.err === 0) {
                    this.props.dispatch({
                        type: SET_TOPIC,
                        payload: {
                            collected: true
                        }
                    });
                    console.log(json.msg);
                } else {
                    alert(json.msg);
                }
            }
        } catch (err) {
        }
    }
    handleDelTopic = async () => {
        try {
            const id = this.props.match.params.id;
            const res = await deleteTopic(id);
            if (res.ok) {
                const json = await res.json();
                if (json.err === 0) {
                    this.props.history.push('/');
                } else {
                    alert(json.msg);
                }
            }
        } catch (err) {
        }
    }
    handleDelComment = async (id) => {
        try {
            const res = await deleteComment(id, {
                topic_id: this.props.match.params.id
            });
            if (res.ok) {
                const json = await res.json();
                if (json.err === 0) {
                    const topic = this.props.topic;
                    topic.comments = topic.comments.filter(comment => comment.id != id);
                    this.props.dispatch({
                        type: SET_TOPIC,
                        payload: topic
                    });
                } else {
                    alert(json.msg);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
    handleDelColTopic = async () => {
        try {
            const res = await deleteCollect({
                topic_id: this.props.match.params.id
            });
            if (res.ok) {
                const json = await res.json();
                if (json.err === 0) {
                    this.props.dispatch({
                        type: SET_TOPIC,
                        payload: {
                            collected: false
                        }
                    });
                    console.log(json.msg);
                } else {
                    alert(json.msg);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
    render() {
        return (
            <div>
                <Layout>
                    <Content className="content">
                        <Card
                            title={
                                <Title
                                    topic={this.props.topic}
                                    userInfo={this.props.userInfo}
                                    handleColTopic={this.handleColTopic}
                                    handleDelTopic={this.handleDelTopic}
                                    handleDelColTopic={this.handleDelColTopic}
                                />}
                        >
                            <div dangerouslySetInnerHTML={{
                                __html: this.props.topic.content
                            }} />
                        </Card>
                        <Card
                            title={<div>{this.props.topic.comments.length}个回复</div>}
                            style={{ marginTop: 24 }}
                        >
                            <List
                                itemLayout="horizontal"
                                dataSource={this.props.topic.comments}
                                bordered={true}
                                renderItem={comment => (
                                    <List.Item
                                        actions={
                                            this.props.userInfo ?
                                                [
                                                    comment.author_id === this.props.userInfo.id ?
                                                        <a onClick={() => this.handleDelComment(comment.id)}>
                                                            <Icon type="delete" />
                                                        </a>
                                                        :
                                                        <a href="#editor" onClick={() => this.handleEnter(comment.author)}>
                                                            <Icon type="enter" />
                                                        </a>
                                                ]
                                                :
                                                []
                                        }
                                    >
                                        <div className="comment-item">
                                            <div>
                                                <Link to={`/user/${comment.author_id}`}>
                                                    <Avatar style={{ marginRight: 16 }} src={comment.avatar} />
                                                </Link>
                                            </div>
                                            <div>
                                                <div style={{ marginBottom: 16 }}>
                                                    <em>
                                                        <span>作者：</span>
                                                        {comment.author}
                                                    </em>
                                                    <em style={{ marginLeft: 16 }}>
                                                        <span>时间：</span>
                                                        {moment(comment.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                                                    </em>
                                                </div>
                                                <div dangerouslySetInnerHTML={{
                                                    __html: comment.content
                                                }} />
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Card>
                        <div style={{ marginTop: 24 }}>
                            {
                                this.props.userInfo ?
                                    <div>
                                        <div>
                                            <Editor id="editor" ref="editor" />
                                        </div>
                                        <div style={{ marginTop: 20 }} className="text-center">
                                            <Button onClick={this.handleComment} type="primary">回复</Button>
                                        </div>
                                    </div>
                                    :
                                    <div className="text-center">
                                        您需要登陆以后才能留下评论！
                                        <Link to="/signin">
                                            <Button type="primary" icon="user">Signin</Button>
                                        </Link>
                                        <Link to="/signup">
                                            <Button icon="user-add">Signup</Button>
                                        </Link>
                                    </div>
                            }
                        </div>
                    </Content>
                    <Sider width={250} className="sider">
                        <Profile userInfo={this.props.topic.authorInfo} />
                    </Sider>
                </Layout>
            </div>
        );
    }
};

Topic.serverFetch = fetchTopic;

function mapStateToProps(state) {
    return {
        userInfo: state.userInfo,
        topic: state.topic
    }
};

export default withRouter(
    connect(mapStateToProps)(
        Topic
    )
);