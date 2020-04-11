import React from 'react';
import { Switch, Link, Route } from 'react-router-dom';
import Home from './Home';
import Plan from './components/Plan';

export const formatString = "dddd, MMMM Do YYYY @ h:mm:ss a"
const user_id = 1;


const renderPlan = (routerProps) => {
    const plan_id = routerProps.match.params.id;
    return <Plan id={plan_id} user_id={user_id} />;
}
const App = () => {
    return (
        <Switch>
            <Route exact path = '/' component={Home} />
            <Route path = '/plans/:id' render={routerProps => renderPlan(routerProps)} />
        </Switch>
    )
};

export default App;