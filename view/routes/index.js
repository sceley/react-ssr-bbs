import Home from '../components/Home'
import Signin from '../components/Signin'
import Signup from '../components/Signup'
import Setting from '../components/Setting'
import User from '../components/User'
import CreateTopic from '../components/CreateTopic'
import Topic from '../components/Topic'

export default [
    {
        path: '/',
        component: Home,
        exact: true
    },
    {
        path: '/signin',
        component: Signin,
        exact: true
    },
    {
        path: '/signup',
        component: Signup,
        exact: true
    },
    {
        path: '/setting',
        component: Setting,
        exact: true
    },
    {
        path: '/user/:id',
        component: User,
        exact: true
    },
    {
        path: '/topic/create',
        component: CreateTopic,
        exact: true
    },
    {
        path: '/topic/:id',
        component: Topic,
        exact: true
    }
]