import React, { useContext } from 'react';
import { createColor } from 'material-ui-color';
import { MyGlobalContext } from '../contexts/openRegistForm';
import axios from 'axios';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Select from 'react-select';
import ColorPallete from './ColorPallete';
import DatePicker from './DatePicker';
import TitleInput from './TitleInput';
import CommentInput from './CommentInput';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';
import AsyncSelect, { useAsync } from 'react-select/async';
import { resolve } from 'path';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const editContent = 'http://localhost:3000/contents/edit';
const registCategory = 'http://localhost:3000/categories/regist';
const getContents = 'http://localhost:3000/contents';

export default function EditForm() {
    const ctx = useContext(MyGlobalContext);

    function handleEdit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        let ymd;
        if (typeof ctx.date === 'string') {
            const split_ymd = ctx.date.split('-');
            ymd = split_ymd[2] + '-' + split_ymd[0] + '-' + split_ymd[1];
        } else {
            const y = ctx.date.getFullYear();
            const m = ('0' + (ctx.date.getMonth() + 1)).slice(-2);
            const d = ('0' + ctx.date.getDate()).slice(-2);
            ymd = y + '-' + m + '-' + d;
        }

        const formData = new FormData(event.currentTarget);
        axios.get(editContent, {
            params: {
                content_id: ctx.contentId,
                title: formData.get('title'),
                comment: formData.get('comment'),
                color_code: ctx.color.hex,
                record_ymd: ymd,
                category_id: ctx.categoryId
            }
        }).then((res) => {
            handleCloseForm();
            getAllContents();

        }).catch((e) => {
            console.error(e);
        });
    }

    function handleCloseForm() {
        ctx.setOpenForm(!ctx.openForm);
        ctx.setCategoryName("");
        ctx.setCategoryId("");
        ctx.setComment("");
        ctx.setTitle("");
        ctx.setColor(createColor("red"));
    };

    function getAllContents() {
        axios.get(getContents)
            .then((res) => {
                console.log(res.data[1]);
                ctx.setRecords(res.data[0]);
                ctx.setCategories(res.data[1]);
            })
            .catch((e) => {
                console.error(e);
            });
    }

    function handleRegistCategoryChange(event: any) {
        if (event != null) {
            if (event.__isNew__) {
                axios.get(registCategory, {
                    params: {
                        user_id: '1',
                        category_name: event.label,
                    }
                }).then((res) => {
                    ctx.setCategories(res.data[0]);
                    ctx.setCategoryId(res.data[1][0]);
                }).catch((e) => {
                    console.error(e);
                });
                ctx.setCategoryName(event.label);
            } else {
                ctx.setCategoryName(event.label);
                ctx.setCategoryId(event.value);
            }
        } else {
            ctx.setCategoryName("");
            ctx.setCategoryId("");
        }
    }

    return (
        <Box component="form" onSubmit={handleEdit} noValidate sx={style}>
            <FormControl fullWidth>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    記録
                </Typography>
                <DatePicker />
                <Select
                    isClearable
                    options={ctx.categories}
                    styles={{
                        menu: provided => ({ ...provided, zIndex: 9999 })
                    }}
                    onChange={handleRegistCategoryChange}
                    value={{value: ctx.categoryId, label: ctx.categoryName}}
                ></Select>
                <ColorPallete />
                <TitleInput />
                <CommentInput />
                <div>
                    <Stack spacing={2} direction="row">
                        <DeleteButton />
                        <EditButton />
                    </Stack>
                </div>
            </FormControl>
        </Box>
    );
}