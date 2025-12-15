
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
export default function DeleteConfirm({ open, name, onConfirm, onClose }) {
  return (
<Dialog
  open={open}
  onClose={onClose}
  BackdropProps={{
    sx: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
  }}
>
      <DialogTitle sx={{ pr: 6 }}>Delete “{name}” API?</DialogTitle>
      <DialogActions sx={{ pb: 2, pr: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
