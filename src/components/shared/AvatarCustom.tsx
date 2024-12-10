import * as React from 'react';
import Avatar from '@mui/material/Avatar';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WatchLaterRoundedIcon from '@mui/icons-material/WatchLaterRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { Box } from '@mui/material';

enum StatusAvatar {
  none = 'none',
  check = 'check',
  waiting = 'waiting',
  block = 'block'

}

interface AvatarCustomProps { 
  status: StatusAvatar;
  photo: string;
  avatarWidth: any;
  avatarHeight: any;
  sxBox: any;
}

function AvatarCustom({ status, photo , avatarWidth, avatarHeight, sxBox}: AvatarCustomProps) {
  return (
    <Box >
      <Avatar sx={{ width: avatarWidth, height: avatarHeight, bgcolor: '#F5F5F5' }} src={photo}>
          <PermIdentityIcon fontSize='large' sx={{color: '#0451DD' }} />
      </Avatar>
      {status === StatusAvatar.check ? (
        <CheckCircleRoundedIcon
          sx={{
            width: 20, height: 20, 
            color: '#007F49',
            position: 'absolute',
            bottom: 0,
            right: 0
          }} />)
        : status === StatusAvatar.waiting ? (
          <WatchLaterRoundedIcon fontSize='large'
            sx={{
              width: 20, height: 20, 
              color: '#FFBA00', 
              position: 'absolute',
              bottom: 0,
              right: 0
            }} />
        )
          : status === StatusAvatar.block ? (
            <CircleRoundedIcon fontSize='large'
              sx={{
                width: 20, height: 20, 
                color: '#DC3545', 
                position: 'absolute',
                bottom: 0,
                right: 0
              }} />
          )
            : null}
    </Box>

  );
}


export {
  AvatarCustom, StatusAvatar }  
