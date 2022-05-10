import { useContext } from 'react';
import TextField from '@mui/material/TextField';
import { MyGlobalContext } from '../contexts/openRegistForm';

export default function CommentInput() {
    const ctx = useContext(MyGlobalContext);
    
    function handleCommentChange(event: any) {
        ctx.setComment(event.target.value);
    }
    return (
        <TextField
            id="comment-field"
            label="Comment"
            name="comment"
            multiline
            rows={5}
            value={ctx.comment}
            onChange={handleCommentChange}
        />
    );
}