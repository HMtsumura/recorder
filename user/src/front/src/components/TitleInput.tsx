import { useContext } from 'react';
import TextField from '@mui/material/TextField';
import { MyGlobalContext } from '../contexts/openRegistForm';

export default function TitleInput() {
    const ctx = useContext(MyGlobalContext);

    function handleTitleChange(event: any) {
        ctx.setTitle(event.target.value);
    }
    return (
        <div>
            <TextField
                id="title-field"
                label="Title"
                name="title"
                required
                value={ctx.title}
                onChange={handleTitleChange}
            >
            </TextField>
        </div>
    )
}