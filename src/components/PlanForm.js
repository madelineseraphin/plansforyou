import React, { useState, useEffect } from 'react';
import api from '../api';
import moment from 'moment';
import styled from 'styled-components';

const PlanFormTitle = styled.h1`
    text-transform: capitalize
`;

const PlanForm = props => {
    const { plan_id, mode, user_id } = props;

    const [plan, setPlan] = useState({ title: '', description_text: '', plan_photo: '', start_time: '', end_time: '', host_id: user_id });

    useEffect(() => {
        if (mode === 'edit') {
            api.plans().getOne(plan_id).then((res) => {
                const planInfo = res.data.plan[0] || {};
                setPlan({
                    title: planInfo.title,
                    description_text: planInfo.description_text,
                    plan_photo: planInfo.plan_photo,
                    end_time: planInfo.end_time,
                    host_id: planInfo.host_id
                });
            })
        }
      }, [mode, plan_id]);
    
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
        setPlan({ ...plan, start_time: moment(val).format('YYYY-MM-DD HH:mm:ss') });
    }
    const updateEndTime = (val) => {
        setPlan({ ...plan, end_time: moment(val).format('YYYY-MM-DD HH:mm:ss') });
    }
    const createPlan = () => {
        if (plan.title && plan.description_text && plan.plan_photo && plan.start_time && plan.end_time) {
            console.log(plan)
            api.plans().create(plan).then((res) => console.log(res));
        }
    }
    const editPlan = () => {
        if (plan.title && plan.description_text && plan.plan_photo && plan.start_time && plan.end_time) {
            console.log(plan)
            api.plans().update(plan).then((res) => console.log(res));
        }
    }
    return (
        <>
            <PlanFormTitle>{mode} a plan</PlanFormTitle>
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
            <button onClick={() => mode === 'edit' ? editPlan() : createPlan()}>{mode} plan</button>
        </>
    );
};

export default PlanForm;