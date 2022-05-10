import { useContext } from 'react';
import Modal from '@mui/material/Modal';
import { createColor } from 'material-ui-color';
import { MyGlobalContext } from '../contexts/openRegistForm';
import RegistForm from './RegistForm';
import EditForm from './EditForm';

export default function Form() {
  const ctx = useContext(MyGlobalContext);

  function handleCloseForm() {
    ctx.setOpenForm(!ctx.openForm);
    ctx.setCategoryName("");
    ctx.setCategoryId("");
    ctx.setComment("");
    ctx.setTitle("");
    ctx.setColor(createColor("red"));
  };

  return (
    <div>
      <Modal
        open={ctx.openForm}
        onClose={handleCloseForm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {ctx.isRegistForm ?
          <RegistForm />
          :
          <EditForm />
        }
      </Modal>
    </div>
  );
}