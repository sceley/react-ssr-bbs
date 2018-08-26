import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Tabs, Layout, Card, Button } from 'antd';
import TabTopic from './TabTopic';
import * as api from '../api';
import { SET_TOPICS } from '../store/actions';
const { TabPane } = Tabs;
const { Content, Sider } = Layout;

class Home extends Component {
    async componentWillMount() {
        try {
            console.log(this.props.topics);
            if (this.props.topics.length == 0) {
                const res = await api.fetchTopics();
                if (res.ok) {
                    const json = await res.json();
                    if (json.err === 0) {
                        await this.props.setTopics(json.topics);
                        // console.log(json.topics);
                    }
                }
            }
        } catch (err) {
            
        }
    }
    render() {
        return (
            <div>
                <Layout>
                    <Content style={{ background: '#fff', padding: 24, marginRight: 24, minHeight: 280 }}>
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
                    <Sider width={250} style={{ background: '#f0f2f5' }}>

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

function mapDispatchToProps(dispatch) {
    return {
        setTopics: async (topics) => await dispatch({
            type: SET_TOPICS,
            payload: topics
        })
    }
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Home)
);