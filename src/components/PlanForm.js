import React, { useState, useEffect } from 'react';
import api from '../api';
import moment from 'moment';

const PlanForm = props => {
    const { plan_id, mode, user_id } = props;
    // connection.sql('SET @title = ?;').bind(plan.title).execute(),
    //         connection.sql('SET @description_text = ?;').bind(plan.description_text).execute(),
    //         connection.sql('SET @plan_photo = ?;').bind(plan.plan_photo).execute(),
    //         connection.sql('SET @start_time = ?;').bind(plan.start_time).execute(),
    //         connection.sql('SET @end_time = ?;').bind(plan.end_time).execute(),
    //         connection.sql('SET @host_id = ?;').bind(plan.host_id).execute(),
    const [plan, setPlan] = useState({ title: '', description_text: '', plan_photo: '', start_time: '', end_time: '', host_id: user_id });
    const updateTitle = (val) => {
        setPlan({ ...plan, title: val });
    }
    const updateDesc = (val) => {
        setPlan({ ...plan, description_text: val });
    }
    const updatePhoto = (val) => {
        setPlan({ ...plan, plan_photo: val });
    }
    const updateStartTime = (val) => {
        setPlan({ ...plan, start_time: moment(val).format('YYYY-MM-DD HH:mm:ss.SSSSS') });
    }
    const updateEndTime = (val) => {
        setPlan({ ...plan, end_time: moment(val).format('YYYY-MM-DD HH:mm:ss.SSSSS') });
    }
    const createPlan = () => {
        if (plan.title && plan.description_text && plan.plan_photo && plan.start_time && plan.end_time) {
            console.log(plan)
            api.plans().create(plan).then((res) => console.log(res));
        }
    }
    return (
        <>
            <h1>Create a plan</h1>
            <div>
                <span>Plan title:</span><input type="text" onChange={(e) => updateTitle(e.target.value)} />
            </div>
            <div>
                <span>Plan description:</span><input type="textarea" onChange={(e) => updateDesc(e.target.value)} />
            </div>
            <div>
                <span>Plan photo (url):</span><input type="text" onChange={(e) => updatePhoto(e.target.value)} />
            </div>
            <div>
                <span>Start time:</span><input type="datetime-local" onChange={(e) => updateStartTime(e.target.value)} />
            </div>
            <div>
                <span>End time:</span><input type="datetime-local" onChange={(e) => updateEndTime(e.target.value)} />
            </div>
            <button onClick={() => createPlan()}>Create plan</button>
        </>
    );
};

export default PlanForm;