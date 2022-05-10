import Button from '@mui/material/Button';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

export default function EditButton() {
    return (
        <Button
            fullWidth
            type="submit"
            variant="contained"
            startIcon={<ChangeCircleIcon />}
        >
            更新
        </Button>
    );
}