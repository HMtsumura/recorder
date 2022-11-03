import { useContext } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { MyGlobalContext } from '../contexts/openRegistForm';
import { createColor } from 'material-ui-color';
import DeleteIcon from '@mui/icons-material/Delete';

const deleteContent = 'http://localhost:3000/contents/delete';
const getContents = 'http://localhost:3000/contents';

export default function DeleteButton() {
    const ctx = useContext(MyGlobalContext);

    function handleDelete() {
        axios.get(deleteContent, {
            params: {
                content_id: ctx.contentId,
            }
        }).then((res) => {
            handleCloseForm();
            getAllContents();
            console.log(res);
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
                token: ctx.token
            }
        })
            .then((res) => {
                console.log(res.data[1]);
                ctx.setRecords(res.data[0]);
                ctx.setCategories(res.data[1]);
            })
            .catch((e) => {
                console.error(e);
            });
    }

    return (
        <Button
            fullWidth
            type="button"
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
        >
            削除
        </Button>
    );
}