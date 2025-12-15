
import { Dialog, DialogTitle, DialogContent, Grid, TextField, Button } from '@mui/material';
export default function ViewApiDialog({ open, api, onClose }) {
  if (!api) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>API Details</DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          {Object.entries(api).map(([k, v]) => (
            <Grid size={{xs:12,md:6}} key={k}>
              <TextField fullWidth label={k} value={v} InputProps={{ readOnly: true }} />
            </Grid>
          ))}
        </Grid>
        <Button sx={{ mt: 2 }} fullWidth variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
