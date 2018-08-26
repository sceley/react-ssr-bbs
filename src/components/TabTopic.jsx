import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { List, Avatar, Tag } from 'antd';
import moment from 'moment';
class TabTopic extends Component {
    constructor() {
        super();
        this.state = {
            tabTopics: []
        }
    }
    render() {
        // const tab = this.props.tab;
        // if (tab) {
        //     this.state.tabTopics = this.props.topics.filter(topic => topic.tab === tab);
        // } else {
        //     this.state.tabTopics = this.props.topics;
        // }
        const pagination = {
            pageSize: 10,
            total: this.state.tabTopics.length
        };
        return (
            <div>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.tabTopics}
                    bordered={true}
                    pagination={pagination}
                    renderItem={item => (
                        <List.Item actions={[<span>{moment(item.createAt).format("YYYY-MM-DD HH:mm:ss")}</span>]}>
                            <List.Item.Meta
                                avatar={
                                    <Link to={`user/${item.uid}`}>
                                        <Avatar src={item.avatar} />
                                    </Link>
                                }
                                title={
                                    <Link to={`/topic/${item.id}`}>
                                        <em style={{ marginRight: 16 }}>
                                            {`${item.collects_count}/${item.comments_count}/${item.visit_count}`}
                                        </em>
                                        <Tag color="#87d068">
                                            {item.tab === 'tech' ? "技术" : "生活"}
                                        </Tag>
                                        {item.title}
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
        topics: state.topics || []
    }
}

export default withRouter(
    connect(mapStateToProps)(TabTopic)
);
