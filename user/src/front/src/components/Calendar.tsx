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
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import MenuBar from './MenuBar';

interface recordObj {
    id: string,
    title: string,
    color_code: string,
    comment: string,
    label: string,
    value: string,
    record_ymd: string
}

const getContents = 'http://localhost:3000/contents';
const contentById = 'http://localhost:3000/contents/contentById';
const categorizedContents = 'http://localhost:3000/contents/categorized';

export default function Calender() {
    const ctx = useOepnRegistForm();
    const location = useLocation();
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
        axios.get(getContents,{
            params:{
                user_id: location.state
            }
        })
            .then((res) => {
                console.log(res.data[1]);
                ctx.setRecords(res.data[0]);
                ctx.setCategories(res.data[1]);
            })
            .catch((e) => {
                console.error(e);
                // this.setState({
                //   status: false,
                //   result: e,
                // });
            });
    };

    useEffect(() => {
        getAllContents();
    }, []);

    function handleSelect(event: any) {
        if (event == null) {
            getAllContents();
            setSelectedCategoryId("");
            setSelectedCategoryName("");
            //   setState({
            //     selected_category: "",
            //     selected_category_id: ""
            //   });
        } else {
            const selectedId: string = event.value;
            setSelectedCategoryId(event.value);
            setSelectedCategoryName(event.label);
            axios.get(categorizedContents, {
                params: {
                    id: selectedId,
                    user_id: location.state
                }
            }).then((res) => {
                console.log(res.data[1]);
                ctx.setRecords(res.data[0]);
                ctx.setCategories(res.data[1]);
            }).catch((e) => {
                console.error(e);
                // this.setState({
                //   status: false,
                //   result: e,
                // });
            });
        }
    }

    function handleEventClick(event: any) {
        axios.get(contentById, {
            params: {
                content_id: event.event.id,
            }
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
            console.error(e);
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