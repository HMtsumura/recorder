import { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Form from './Form';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { MyGlobalContext, useOepnRegistForm } from '../contexts/openRegistForm'
import { createColor } from 'material-ui-color';
import Select from 'react-select';
import FormControl from '@mui/material/FormControl';
import { useLocation, useNavigate } from "react-router-dom";
import MenuBar from './MenuBar';
import { string } from 'yup';

interface recordObj {
    id: string,
    title: string,
    color_code: string,
    comment: string,
    label: string,
    value: string,
    record_ymd: string
}

type param = {
    id: string,
    token: string
}

type State = {
    token: string
}

const getContents = 'http://localhost:3000/contents';
const contentById = 'http://localhost:3000/contents/contentById';
const categorizedContents = 'http://localhost:3000/contents/categorized';

export default function Calender() {
    const ctx = useOepnRegistForm();
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as State;
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");

    let events: any = [];
    ctx.records.forEach((record: recordObj) => {
        const event = {
            id: record.id,
            title: record.title,
            date: record.record_ymd,
            color: record.color_code
        }
        events.push(event);
    });

    function getAllContents() {
        axios.post(getContents, {
            token: state['token']
        },
            {
                headers: { Authorization: `Bearer ${state['token']}` },
            })
            .then((res) => {
                ctx.setRecords(res.data[0]);
                ctx.setCategories(res.data[1]);
            })
            .catch((e) => {
                if (e.response.status === 401 || e.response.status === 403) {
                    navigate('/signin');
                }
            });
    };

    useEffect(() => {
        ctx.setToken(state['token']);        
        getAllContents();
    }, []);

    function handleSelect(event: any) {
        if (event == null) {
            getAllContents();
            setSelectedCategoryId("");
            setSelectedCategoryName("");
        } else {
            const selectedId: string = event.value;
            setSelectedCategoryId(event.value);
            setSelectedCategoryName(event.label);
            axios.post(categorizedContents, {
                params: {
                    id: selectedId,
                    token: ctx.token
                }
            },
                {
                    headers: { Authorization: `Bearer ${ctx.token}` },
                }).then((res) => {
                    console.log(res.data[1]);
                    ctx.setRecords(res.data[0]);
                    ctx.setCategories(res.data[1]);
                }).catch((e) => {
                    if (e.response.status === 401 || e.response.status === 403) {
                        navigate('/signin');
                    }
                });
        }
    }

    function handleEventClick(event: any) {
        axios.post(contentById, {
            params: {
                content_id: event.event.id,
            }
        },
        {
            headers: { Authorization: `Bearer ${ctx['token']}` },
        }).then((res) => {
            const record: recordObj = res.data[0][0];
            const y = record.record_ymd.split('-')[0]
            const m = record.record_ymd.split('-')[1];
            const d = record.record_ymd.split('-')[2];
            ctx.setContentId(record.id);
            ctx.setOpenForm(true);
            ctx.setIsRegistForm(false);
            ctx.setCategoryName(record.label);
            ctx.setCategoryId(record.value);
            ctx.setTitle(record.title);
            ctx.setComment(record.comment);
            ctx.setColor(createColor(record.color_code));
            ctx.setDate(`${m}-${d}-${y}`);
        }).catch((e) => {
            if (e.response.status === 401 || e.response.status === 403) {
                navigate('/signin');
            }
        });
    }

    function handleDateClick(event: any) {
        ctx.setOpenForm(!ctx.openForm);
        ctx.setIsRegistForm(true);
        ctx.setDate(event.dateStr);
    }

    function handleOpenRegistForm() {
        ctx.setOpenForm(!ctx.openForm);
        ctx.setIsRegistForm(true);
        ctx.setDate(new Date());
        ctx.setCategories(ctx.categories);
    }
    return (
        <div>
            <MenuBar />
            <FormControl sx={{ minWidth: 150 }}>
                <Select
                    isClearable
                    options={ctx.categories}
                    onChange={handleSelect}
                    styles={{
                        menu: provided => ({ ...provided, zIndex: 9999 })
                    }}
                ></Select>
            </FormControl>
            <AddCircleIcon color="primary" fontSize="large" onClick={handleOpenRegistForm}></AddCircleIcon>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                initialView="dayGridMonth"
                events={events}
            />
            <MyGlobalContext.Provider value={ctx}>
                <Form />
            </MyGlobalContext.Provider>
        </div>
    );
}