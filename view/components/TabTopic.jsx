import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { List, Avatar, Tag } from 'antd';
import { fetchTotalOfTopics, fetchTopics } from '../store/actions';
import dayjs from 'dayjs';
class TabTopic extends Component {
    handleTurnPage = (page) => {
        this.props.dispatch(fetchTopics({
            tab: this.props.tab,
            page: page
        }));
    }
    componentDidMount = () => {
        if (this.props.tab) return;
        this.props.dispatch(fetchTotalOfTopics({
            tab: this.props.tab
        }));
    }
    render() {
        const tab = this.props.tab;
        let tabTopics, totalOfTopics;
        if (tab) {
            tabTopics = this.props.topics.filter(topic => topic.tab === tab);
            totalOfTopics = tabTopics.length;
        } else {
            tabTopics = this.props.topics;
            totalOfTopics = this.props.totalOfTopics;
        }
        const pagination = {
            pageSize: 10,
            total: Number(totalOfTopics),
            onChange: this.handleTurnPage
        };
        return (
            <div>
                <List
                    itemLayout="horizontal"
                    dataSource={tabTopics}
                    bordered={true}
                    pagination={pagination}
                    renderItem={topic => (
                        <List.Item actions={[<span>{dayjs(topic.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</span>]}>
                            <List.Item.Meta
                                avatar={
                                    <Link to={`user/${topic.author_id}`}>
                                        <Avatar src={topic.avatar} />
                                    </Link>
                                }
                                title={
                                    <Link to={`/topic/${topic.id}`}>
                                        <em style={{ marginRight: 16 }}>
                                            {`${topic.collects_count}/${topic.comments_count}/${topic.visit_count}`}
                                        </em>
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
            </div>
        );
    }
};

function mapStateToProps(state) {
    return {
        topics: state.topics,
        totalOfTopics: state.totalOfTopics
    }
};

export default withRouter(
    connect(mapStateToProps)(TabTopic)
);
