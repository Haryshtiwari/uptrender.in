import { Paper, Box, Typography, IconButton, useTheme } from "@mui/material";
import { Edit2 } from "lucide-react";

const SectionCard = ({ icon, title, children, onEdit }) => {
  const theme = useTheme();
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      alert(`Edit clicked for: ${title}`);
    }
  };
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        transition: "all 0.2s ease-in-out",
        '&:hover': {
          boxShadow: theme.shadows[2],
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2.5}
        sx={{
          backgroundColor: theme.palette.action.hover,
          px: 2,
          py: 1,
          borderRadius: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          {icon}
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={handleEdit}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <Edit2 size={18} />
        </IconButton>
      </Box>
      <Box display="flex" flexWrap="wrap" gap={4} >
        {children}
      </Box>
    </Paper>
  );
};

export default SectionCard;




