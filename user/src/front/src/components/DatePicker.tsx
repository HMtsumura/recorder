import { useContext } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MyGlobalContext } from '../contexts/openRegistForm';
import TextField from '@mui/material/TextField';

export default function DatePick() {
    const ctx = useContext(MyGlobalContext);
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                label="date"
                value={ctx.date}
                onChange={(newValue: any) => {
                    ctx.setDate(newValue);
                }}
                renderInput={(params: any) => <TextField {...params} />}
            />
        </LocalizationProvider>
    );
}