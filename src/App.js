import React from 'react';
import { Switch, Link, Route } from 'react-router-dom';
import Home from './Home';
import Plan from './components/Plan';
import PlanForm from './components/PlanForm';
import styled from 'styled-components';
import Login from './Login'

export const formatString = "dddd, MMMM Do YYYY @ h:mm a"

export const PageBody = styled.div`
  width: 1100px;
  margin-left: auto;
  margin-right: auto;
`;

const renderPlan = (routerProps) => {
    const plan_id = routerProps.match.params.id;
    const user_id = routerProps.match.params.user_id;
    return <Plan history={routerProps.history} id={plan_id} user_id={user_id} />;
};

const renderPlanForm = (routerProps) => {
    const mode = routerProps.match.params.mode;
    const plan_id = routerProps.match.params.plan_id;
    const user_id = routerProps.match.params.user_id;
    return <PlanForm history={routerProps.history}plan_id={plan_id} mode={mode} user_id={user_id} />;
};

const App = () => {
    return (
        <PageBody>
        <Switch>
            <Route exact path = '/' component={Login} />
            <Route exact path = '/home' component={Home} />
            <Route path = '/plan/:id/:user_id' render={routerProps => renderPlan(routerProps)} />
            <Route path = '/plan-form/:mode/:user_id/:plan_id?' render={routerProps => renderPlanForm(routerProps)} />
        </Switch>
        </PageBody>
    )
};

export default App;