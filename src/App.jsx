import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Link, withRouter, Redirect } from 'react-router-dom';
import { Layout, Input } from 'antd';
import Home from './components/Home';
import Signin from './components/Signin';
import Signup from './components/Signup';
import './App.css';
const { Header, Content, Footer } = Layout;
const Search = Input.Search;

class App extends Component {
    componentDidMount() {
    }
    render() {
        return (
            <div>
                <Layout className="container">
                    <Header className="header-wrap">
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
                            <ul className="menu menu-horizon">
                                <li className="menu-item">
                                    <Link to="/signin">登陆</Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/signup">注册</Link>
                                </li>
                            </ul>
                        </div>
                    </Header>
                    <Content className="content">
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route path="/signin" component={Signin} />
                            <Route path="/signup" component={Signup} />
                            <Redirect from="/hello" to="/helloworld" />
                        </Switch>
                    </Content>
                    <Footer className="text-center">
                        ©2018 Created by sceley
                    </Footer>
                </Layout>
            </div>
        );
    }
};

function mapStateToProps(state) {
    return {
        user: state.user
    }
};

function mapDispatchToProps(dispatch) {
    return {
        handleLogin: (user) => dispatch({
            type: 'USER_SIGNIN',
            user: user
        })
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));