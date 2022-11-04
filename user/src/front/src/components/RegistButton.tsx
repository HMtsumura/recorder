import { useContext } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { MyGlobalContext } from '../contexts/openRegistForm';
import { createColor } from 'material-ui-color';
import { useNavigate } from "react-router-dom";


const registContent = 'http://localhost:3000/contents/regist';
const getContents = 'http://localhost:3000/contents';

export default function RegistButton() {
    const ctx = useContext(MyGlobalContext);
    const navigate = useNavigate();

    function handleClick(event: any) {
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

        axios.post(registContent, {
            params: {
                title: ctx.title,
                comment: ctx.comment,
                color_code: ctx.color.hex,
                record_ymd: ymd,
                category_id: ctx.categoryId
            }
        },
            {
                headers: { Authorization: `Bearer ${ctx.token}` },
            })
            .then((res) => {
                handleCloseForm();
                getAllContents();
                console.log(res);
            }).catch((e) => {
                if (e.response.status === 403) {
                    navigate('/signin');
                }
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
        axios.post(getContents, {
            token: ctx.token
        },
            {
                headers: { Authorization: `Bearer ${ctx.token}` },
            })
            .then((res) => {
                console.log(res.data[1]);
                ctx.setRecords(res.data[0]);
                ctx.setCategories(res.data[1]);
            })
            .catch((e) => {
                if (e.response.status === 403) {
                    navigate('/signin');
                }
            });
    }

    return (
        <div>
            <Button
                fullWidth
                type="button"
                variant="contained"
                onClick={handleClick}
            >
                登録
            </Button>
        </div>
    );
}