import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Tabs, Layout, Card, Button } from 'antd';
import TabTopic from './TabTopic';
import Profile from './Profile';
import { fetchTopics } from '../store/actions';
const { TabPane } = Tabs;
const { Content, Sider } = Layout;

class Home extends Component {
    componentDidMount = () => {
        this.props.dispatch(fetchTopics());
    }
    render() {
        return (
            <div>
                <Layout>
                    <Content className="content">
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="全部" key="1">
                                <TabTopic tab="" />
                            </TabPane>
                            <TabPane tab="技术" key="2">
                                <TabTopic tab="tech" />
                            </TabPane>
                            <TabPane tab="生活" key="3">
                                <TabTopic tab="life" />
                            </TabPane>
                        </Tabs>
                    </Content>
                    <Sider width={250} className="sider">
                        <Profile userInfo={this.props.userInfo} />
                        {
                            this.props.userInfo ?
                                <Card style={{ marginTop: 20 }}>
                                    <Link to="/topic/create">
                                        <Button type="primary" style={{ width: '100%' }}>发表话题</Button>
                                    </Link>
                                </Card>
                                :
                                null
                        }
                    </Sider>
                </Layout>
            </div>
        );
    }
};

Home.serverFetch = fetchTopics;

function mapStateToProps(state) {
    return {
        topics: state.topics,
        userInfo: state.userInfo
    }
};

export default withRouter(
    connect(mapStateToProps)(Home)
);