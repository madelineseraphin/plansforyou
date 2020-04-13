import React, { useState, useEffect } from 'react';
import api from '../api';
import moment from 'moment';
import styled from 'styled-components';
import Availabilities from './Availabilities';

const PlanFormTitle = styled.h2`
    text-transform: capitalize
`;

const Flex = styled.div`
    display: flex;
`;

const PlanFormWrapper = styled.div`
    flex: 1;
`;

const FriendAvailsWrapper = styled.div`
    flex: 1;
`;

const PlanForm = props => {
    const { plan_id, mode, user_id } = props;

    const [plan, setPlan] = useState({ title: '', description_text: '', plan_photo: '', start_time: '', end_time: '', host_id: user_id });
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        if (mode === 'edit') {
            api.plans().getOne(plan_id).then((res) => {
                const planInfo = res.data.plan[0] || {};
                setPlan({
                    title: planInfo.title,
                    description_text: planInfo.description_text,
                    plan_photo: planInfo.plan_photo,
                    start_time: planInfo.start_time,
                    end_time: planInfo.end_time,
                    host_id: planInfo.host_id
                });
            })
        }
    }, [mode, plan_id]);

    useEffect(() => {
        api.friends().getAll().then((res) => setFriends(res.data))
    }, []);

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
            api.plans().create(plan).then((res) => props.history.push({
                pathname: '/home',
                state: { user_id: user_id }
            }));
        }
    }
    const editPlan = () => {
        if (plan.title && plan.description_text && plan.plan_photo && plan.start_time && plan.end_time) {
            api.plans().update(plan, plan_id).then((res) => props.history.push({
                pathname: `/plan/${plan_id}`,
                state: { user_id: user_id }
            }));
        }
    }


    const FriendAvailabilities = friends.map((f) => {
        return (<>
            <p><strong>{f.first_name} {f.last_name}</strong></p>
            <Availabilities user_id={f.friend_id} editable={false} />
        </>);
    });

    const goHome = () => {
        props.history.push({
            pathname: '/home',
            state: { user_id: user_id }
        });
    };

    return (
        <Flex>
            <PlanFormWrapper>
                <button onClick={() => goHome()}>Back to homepage</button>
                <PlanFormTitle>{mode} a plan</PlanFormTitle>
                <div>
                    <span>Plan title:</span><input type="text" value={plan.title} onChange={(e) => updateTitle(e.target.value)} />
                </div>
                <div>
                    <span>Plan description:</span><input type="textarea" value={plan.description_text} onChange={(e) => updateDesc(e.target.value)} />
                </div>
                <div>
                    <span>Plan photo (url):</span><input type="text" value={plan.plan_photo} onChange={(e) => updatePhoto(e.target.value)} />
                </div>
                <div>
                    <span>Start time:</span><input type="datetime-local" value={moment(plan.start_time, 'YYYY-MM-DD HH:mm:ss.SSSSS').format('YYYY-MM-DDThh:mm')} onChange={(e) => updateStartTime(e.target.value)} />
                </div>
                <div>
                    <span>End time:</span><input type="datetime-local" value={moment(plan.end_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDThh:mm')} onChange={(e) => updateEndTime(e.target.value)} />
                </div>
                <button onClick={() => mode === 'edit' ? editPlan() : createPlan()}>{mode} plan</button>
            </PlanFormWrapper>
            <FriendAvailsWrapper>
                <h3>Friend Availabilities:</h3>
                {FriendAvailabilities}
            </FriendAvailsWrapper>
        </Flex>
    );
};

export default PlanForm;