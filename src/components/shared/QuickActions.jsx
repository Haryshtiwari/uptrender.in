import React, { useState } from 'react';
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';
import {
  Add,
  Refresh,
  FileDownload,
  Notifications,
  ShowChart,
  TrendingUp,
} from '@mui/icons-material';

const QuickActions = ({ onAction }) => {
  const [open, setOpen] = useState(false);

  const actions = [
    { 
      icon: <Add />, 
      name: 'New Strategy', 
      action: 'newStrategy',
      shortcut: 'Ctrl+N'
    },
    { 
      icon: <TrendingUp />, 
      name: 'New Trade', 
      action: 'newTrade',
      shortcut: 'Ctrl+T'
    },
    { 
      icon: <Refresh />, 
      name: 'Refresh Data', 
      action: 'refresh',
      shortcut: 'F5'
    },
    { 
      icon: <FileDownload />, 
      name: 'Export Report', 
      action: 'export',
      shortcut: 'Ctrl+E'
    },
    { 
      icon: <Notifications />, 
      name: 'Notifications', 
      action: 'notifications',
      shortcut: 'Ctrl+I'
    },
  ];

  const handleActionClick = (actionType) => {
    setOpen(false);
    if (onAction) {
      onAction(actionType);
    }
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (event) => {
      if (onAction) {
        if (event.ctrlKey || event.metaKey) {
          switch (event.key.toLowerCase()) {
            case 'n':
              event.preventDefault();
              onAction('newStrategy');
              break;
            case 't':
              event.preventDefault();
              onAction('newTrade');
              break;
            case 'e':
              event.preventDefault();
              onAction('export');
              break;
            case 'i':
              event.preventDefault();
              onAction('notifications');
              break;
            default:
              break;
          }
        }
        if (event.key === 'F5') {
          event.preventDefault();
          onAction('refresh');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onAction]);

  return (
    <SpeedDial
      ariaLabel="Quick Actions"
      sx={{ position: 'fixed', bottom: 24, right: 24 }}
      icon={<SpeedDialIcon />}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={`${action.name} (${action.shortcut})`}
          tooltipOpen
          onClick={() => handleActionClick(action.action)}
        />
      ))}
    </SpeedDial>
  );
};

export default QuickActions;
