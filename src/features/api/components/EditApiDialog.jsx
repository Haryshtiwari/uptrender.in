
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, Button } from '@mui/material';
export default function EditApiDialog({ open, api, onSave, onClose }) {
  const [form, setForm] = useState(api || {});
  useEffect(() => setForm(api || {}), [api]);
  const handle = (f) => (e) => setForm((v) => ({ ...v, [f]: e.target.value }));
  if (!api) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit API</DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          {['name', 'broker', 'brokerId', 'segment'].map((f) => (
            <Grid key={f} size={{xs:12,md:6}}>
              <TextField fullWidth label={f} value={form[f] ?? ''} onChange={handle(f)} />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pr: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => { onSave(form); onClose(); }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
