import React, { useState, useEffect } from 'react'
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import api from '../api';
import styled from 'styled-components';
import moment from 'moment';

const AvailsWrapper = styled.div`
    width: 50%;
`;

const updateAvail = (data) => {
    const date = data.date;
    const id = data.id;
    const start_time = moment(date[0]).format('YYYY-MM-DD HH:mm:ss');
    const end_time = moment(date[1]).format('YYYY-MM-DD HH:mm:ss');
    api.availabilities().update(id, {start_time: start_time, end_time: end_time}).then((res) => console.log(res));
}

const Avail = (props) => {
    const { start_time, end_time, editable, id } = props;
    const [range, setRange] = useState([new Date(start_time), new Date(end_time)]);
    useEffect(() => {
        updateAvail({date: range, id: id});
    }, [range, id]);
    return <DateTimeRangePicker value={range} onChange={(date) => setRange(date)} />
}

const Availabilities = (props) => {
    const { user_id, editable } = props;
    const [avails, setAvails] = useState([]);
    useEffect(() => {
        api.availabilities().getForFriend(user_id).then((res) => setAvails(res.data));
    });
    const Avails = avails.map((a) => {
        return (<Avail
            start_time={moment(a.start_time, 'YYYY-MM-DD HH:mm:ss.SSSSS').format('YYYY-MM-DDThh:mm')}
            end_time={moment(a.end_time, 'YYYY-MM-DD HH:mm:ss.SSSSS').format('YYYY-MM-DDThh:mm')}
            editable={editable}
            id={a.availability_id} />);
    });

    return (<AvailsWrapper>
        {Avails}
    </AvailsWrapper>);
}

export default Availabilities