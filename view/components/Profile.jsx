import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Avatar, Icon, Button } from 'antd';
export default class Profile extends Component {
    render() {
        return (
            <div>
                <Card
                    title="信息面板"
                    bodyStyle={{ textAlign: 'center' }}
                >
                    {
                        this.props.userInfo ?
                            <ul className="menu menu-vertical">
                                <li>
                                    <Link to={`/user/${this.props.userInfo.id}`}>
                                        <Avatar size="large" src={this.props.userInfo.avatar} />
                                    </Link>
                                </li>
                                <li>
                                    <em>
                                        {this.props.userInfo.username}
                                    </em>
                                </li>
                                <li>
                                    <em>
                                        {
                                            this.props.userInfo.gender === 'M' ? <Icon type="man" /> : <Icon type="woman" />
                                        }
                                    </em>
                                </li>
                                <li>
                                    <em>
                                        <Icon type="mail" />
                                        {this.props.userInfo.email}
                                    </em>
                                </li>
                                <li>
                                    <em>
                                        {this.props.userInfo.introduction}
                                    </em>
                                </li>
                                <li>
                                    <em style={{ marginRight: 5 }}>
                                        <a href={this.props.userInfo.website}>
                                            <Icon type="global" />
                                        </a>
                                    </em>
                                    <em>
                                        <a href={`https://github.com/${this.props.userInfo.githubName}`}>
                                            <Icon type="github" />
                                        </a>
                                    </em>
                                </li>
                                <li>
                                    <em>
                                        <Icon type="environment-o" />
                                        {this.props.userInfo.location}
                                    </em>
                                </li>
                            </ul>
                            :
                            <div>
                                <Link to="/signin">
                                    <Button icon="user" style={{ width: '100%' }} type="primary">Signin</Button>
                                </Link>
                            </div>
                    }
                </Card>
            </div>
        );
    }
};