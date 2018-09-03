import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import { Layout, Input } from 'antd';
import routes from './routes';
import { CLEAR_USERINFO, fetchUserInfo } from './store/actions';
import * as api from './api';
import 'highlightjs/styles/atom-one-light.css';
import './App.css';
const { Header, Content, Footer } = Layout;
const Search = Input.Search;

class App extends Component {
    handleSignout = async () => {
        try {
            await api.signout();
            this.props.dispatch({
                type: CLEAR_USERINFO
            });
        } catch (err) {
            console.log(err);
        }
    }
    componentDidMount = () => {
        this.props.dispatch(fetchUserInfo());
    }
    render() {
        return (
            <div>
                <Layout className="container">
                    <Header className="header">
                        <div className="header-left">
                            <div className="logo-wrap">
                                <Link to="/">
                                    <img className="logo" src="//o4j806krb.qnssl.com/public/images/cnodejs_light.svg" alt="logo" />
                                </Link>
                            </div>
                            <div className="share">一个分享与发现的地方</div>
                            <div>
                                <Search
                                    placeholder="搜索"
                                    enterButton
                                    style={{ width: 250 }}
                                />
                            </div>
                        </div>
                        <div className="header-right">
                            {
                                this.props.userInfo ?
                                    <ul className="menu menu-horizon">
                                        <li className="menu-item">
                                            <Link to="/setting">设置</Link>
                                        </li>
                                        <li className="menu-item">
                                            <a onClick={this.handleSignout} href="javascript:;">退出</a>
                                        </li>
                                    </ul>
                                    :
                                    <ul className="menu menu-horizon">
                                        <li className="menu-item">
                                            <Link to="/signin">登陆</Link>
                                        </li>
                                        <li className="menu-item">
                                            <Link to="/signup">注册</Link>
                                        </li>
                                    </ul>
                            }
                        </div>
                    </Header>
                    <Content style={{ marginTop: 20, padding: '0px 50px' }}>
                        <Switch>
                            {
                                routes.map((route, index) => (
                                    <Route key={index} {...route} />
                                ))
                            }
                        </Switch>
                    </Content>
                    <Footer className="text-center">
                        ©2018 created by sceley
                    </Footer>
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

export default withRouter(connect(mapStateToProps)(App));