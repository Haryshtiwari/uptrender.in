
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
} from '@mui/material';
import {
  AccountTree as SegmentIcon,
  Business as BrokerIcon,
  Key as KeyIcon,
  Shield as SecretIcon,
  Password as MpPinIcon,
  VerifiedUser as TotpIcon,
  Badge as BrokerIdIcon,
  DriveFileRenameOutline as ApiNameIcon,
  WifiProtectedSetup as PassphraseIcon,
} from '@mui/icons-material';

const BROKERS = {
  Crypto: ['Binance', 'Kraken', 'Coinbase'],
  Forex: ['OANDA', 'FXCM', 'Pepperstone'],
  Indian: ['Zerodha', 'AngelOne', 'Upstox'],
};

const EMPTY = {
  segment: '',
  broker: '',
  apiName: '',
  brokerId: '',
  mpin: '',
  totp: '',
  apiKey: '',
  apiSecret: '',
  passphrase: '',
};

export default function AddApiDialog({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY);

  const handle = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const resetAndClose = () => {
    setForm(EMPTY);
    onClose();
  };

  /* ---------- validation ---------- */
  const requiredBase =
    form.segment &&
    form.broker &&
    form.apiName &&
    form.brokerId &&
    form.mpin &&
    form.totp &&
    form.apiKey &&
    form.apiSecret;

  const isValid =
    requiredBase && (form.segment !== 'Crypto' || form.passphrase);

  const submit = () => {
    if (!isValid) return;
    onSubmit(form);
    resetAndClose();
  };

  const brokerOptions = form.segment ? BROKERS[form.segment] : [];

  return (
    <Dialog open={open} onClose={resetAndClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Add API Connection</DialogTitle>

      <DialogContent dividers>
  <Grid container spacing={2} mt={0.5}>
  {/* ------------ Segment (always visible) ------------ */}
  <Grid size={{xs:12,md:12}}>
    <TextField
      select
      fullWidth
      label="Segment"
      value={form.segment}
      onChange={handle('segment')}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SegmentIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
    >
      {Object.keys(BROKERS).map((seg) => (
        <MenuItem key={seg} value={seg}>
          {seg}
        </MenuItem>
      ))}
    </TextField>
  </Grid>

  {/* ------------ Broker (only after segment chosen) ------------ */}
  {form.segment && (
    <Grid size={{xs:12,md:12}}>
      <TextField
        select
        fullWidth
        label="Broker"
        value={form.broker}
        onChange={handle('broker')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BrokerIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      >
        {BROKERS[form.segment].map((br) => (
          <MenuItem key={br} value={br}>
            {br}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  )}

  {/* ------------ Full form (only after broker chosen) ------------ */}
  {form.broker && (
    <>
      {/* API Name */}
      <Grid size={{xs:12,md:12}}>
        <TextField
          fullWidth
          label="API Name"
          value={form.apiName}
          onChange={handle('apiName')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ApiNameIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      {/* Broker ID */}
      <Grid size={{xs:12,md:12}}>
        <TextField
          fullWidth
          label="Broker ID"
          value={form.brokerId}
          onChange={handle('brokerId')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BrokerIdIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      {/* mPIN */}
      <Grid size={{xs:12,md:12}}>
        <TextField
          fullWidth
          label="mPIN"
          value={form.mpin}
          onChange={handle('mpin')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MpPinIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      {/* TOTP */}
      <Grid size={{xs:12,md:12}}>
        <TextField
          fullWidth
          label="TOTP"
          value={form.totp}
          onChange={handle('totp')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TotpIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      {/* API Key */}
      <Grid size={{xs:12,md:12}}>
        <TextField
          fullWidth
          label="API Key"
          value={form.apiKey}
          onChange={handle('apiKey')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <KeyIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      {/* API Secret */}
      <Grid size={{xs:12,md:12}}>
        <TextField
          fullWidth
          label="API Secret"
          value={form.apiSecret}
          onChange={handle('apiSecret')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SecretIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      {/* Passphrase only for Crypto */}
      {form.segment === 'Crypto' && (
        <Grid size={{xs:12,md:12}}>
          <TextField
            fullWidth
            label="Passphrase"
            value={form.passphrase}
            onChange={handle('passphrase')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PassphraseIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      )}
    </>
  )}
</Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={resetAndClose}>Cancel</Button>
        <Button variant="contained" disabled={!isValid} onClick={submit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
