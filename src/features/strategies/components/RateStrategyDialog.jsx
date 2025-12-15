import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Rating,
  TextField,
  Alert,
} from '@mui/material';
import { Star } from '@mui/icons-material';

const RateStrategyDialog = ({ open, strategy, onClose, onRate }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!strategy) return null;

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await onRate(strategy.id, { rating, review });
      handleClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setReview('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Rate Strategy</Typography>
        <Typography variant="caption" color="text.secondary">
          {strategy.name}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 3 }}>
          Your rating helps others make informed decisions about subscribing to this strategy.
        </Alert>

        <Box textAlign="center" mb={3}>
          <Typography variant="subtitle2" gutterBottom>
            How would you rate this strategy?
          </Typography>
          <Rating
            name="strategy-rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            size="large"
            sx={{ mt: 1 }}
            emptyIcon={<Star style={{ opacity: 0.3 }} fontSize="inherit" />}
          />
          <Typography variant="caption" display="block" mt={1} color="text.secondary">
            {rating === 0 && 'Select a rating'}
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </Typography>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Review (Optional)"
          placeholder="Share your experience with this strategy..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          helperText={`${review.length}/500 characters`}
          inputProps={{ maxLength: 500 }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={rating === 0 || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Rating'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RateStrategyDialog;
