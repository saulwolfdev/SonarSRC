import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WatchLaterRoundedIcon from '@mui/icons-material/WatchLaterRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/material';

enum StatusChip {
  none = 'none',
  success = 'success',
  pending = 'pending',
  alert = 'alert',
  info = 'info',
  warning = 'warning',
  disabled = 'disabled',
  avatar = 'avatar',
  deletable = 'deletable'
}

interface ChipCustomProps { 
  status ?: StatusChip;
  label: string;
  onDelete?: any
  sx?: any
}

function ChipCustom({ status, label,onDelete, sx }: ChipCustomProps) {
  const getChipProps = (status ?: StatusChip) => {
    switch (status) {
      case StatusChip.success:
        return { color: '#009F5C', textColor: 'white' };
      case StatusChip.pending:
        return { color: '#F77F00', textColor: 'white' };
      case StatusChip.alert:
        return { color: '#DC3545', textColor: 'white' };
      case StatusChip.info:
        return { color: '#0451DD', textColor: 'white' };
      case StatusChip.warning:
        return { color: '#F7CE00', textColor: 'black' };
      case StatusChip.disabled:
        return { color: '#D6D6D6', textColor: 'black', disabled: true };
      case StatusChip.avatar:
        return { color: '#D6D6D6', textColor: 'black', avatar: <Avatar><PermIdentityIcon /></Avatar> };
      case StatusChip.deletable:
        return { color: '#D6D6D6', textColor: 'black', onDelete: () => {} };
      default:
        return { color: '#D6D6D6', textColor: 'black' };
    }
  };

  const chipProps = getChipProps(status);

  return (
    <Chip
      label={label}
      sx={{ bgcolor: chipProps.color, color: chipProps.textColor, ...sx }}
      avatar={chipProps.avatar}
      onDelete={onDelete}
      disabled={chipProps.disabled}
    />
  );
}

export {
  StatusChip,ChipCustom
}