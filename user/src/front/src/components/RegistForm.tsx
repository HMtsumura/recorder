import { useContext } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ColorPallete from './ColorPallete';
import DatePicker from './DatePicker';
import TitleInput from './TitleInput';
import CommentInput from './CommentInput';
import RegistButton from './RegistButton';
import FormControl from '@mui/material/FormControl';
import CreatableSelect from 'react-select/creatable';
import { MyGlobalContext } from '../contexts/openRegistForm';
import { createColor } from 'material-ui-color';
import { useLocation } from "react-router-dom";

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

const registContent = 'http://localhost:3000/contents/regist';
const registCategory = 'http://localhost:3000/categories/regist';
const getContents = 'http://localhost:3000/contents';

export default function RegistForm() {
    const ctx = useContext(MyGlobalContext);
    const location = useLocation();
    ctx.setUserId(location.state as string);
    function handleRegist(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        let ymd;
        if (typeof ctx.date === 'string') {
            ymd = ctx.date;
        } else {
            const y = ctx.date.getFullYear();
            const m = ('0' + (ctx.date.getMonth() + 1)).slice(-2);
            const d = ('0' + ctx.date.getDate()).slice(-2);
            ymd = y + '-' + m + '-' + d;
        }
        const formData = new FormData(event.currentTarget);
        axios.get(registContent, {
            params: {
                user_id: ctx.userId,
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
        axios.get(getContents,{
            params:{
                user_id: location.state
            }
        })
            .then((res) => { 
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
                        user_id: ctx.userId,
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
        <Box component="form" onSubmit={handleRegist} noValidate sx={style}>
            <FormControl fullWidth>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    記録
                </Typography>
                <DatePicker />
                <CreatableSelect
                    isClearable
                    onChange={handleRegistCategoryChange}
                    options={ctx.categories}
                    styles={{
                        menu: provided => ({ ...provided, zIndex: 9999 })
                    }}
                />
                <ColorPallete />
                <TitleInput />
                <CommentInput />
                <RegistButton />
            </FormControl>
        </Box>
    );
}