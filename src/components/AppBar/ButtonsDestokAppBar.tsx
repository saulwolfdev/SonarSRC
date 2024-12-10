import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import { Box, Button, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useRouter } from 'next/router';
import { useRouterPush } from '@/hooks/useRouterPush';


const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    mt: theme.spacing(1),
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        mr: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300],
    }),
  },
}));
export default function ButtonsDestokAppBar({ ...props }) {
  const routerPush = useRouterPush();

  const { handleCloseNavMenu, pages } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedButton, setSelectedButton] = React.useState<string | null>(null);
  const [currentMenu, setCurrentMenu] = React.useState<string | null>(null);

  const router = useRouter();

  const handleNavigation = (path: string) => {
    routerPush(path); 
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>, pageTitle: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedButton(pageTitle);
    setCurrentMenu(pageTitle);
  };

  const handleClose = (url?: string) => {
    setAnchorEl(null);
    setSelectedButton(null);
    setCurrentMenu(null);
    if(url){
      handleNavigation(url)
    }
  };

  return (
        <Box sx={{ flexGrow: 1, justifyContent: 'start', display: { xs: "none", sm: "flex" }, ml: { md: 3 } }}>
        {pages.length > 0 &&
        pages.map((page: any) => (
          <MenuItem
            key={page.title}
            onClick={handleCloseNavMenu}
            sx={{
              paddingInline: { md:'0px'},
              '&:hover': {
                backgroundColor: 'inherit',
              },
            }}
          >
            <Button
              className="MuiButton-primary"
              variant="contained"
              startIcon={page.icon}
              endIcon={page.subpages.length > 0 ? <KeyboardArrowDownIcon /> : null}
              disableElevation
              onClick={(e) => handleClick(e, page.title)}
              sx={{
                paddingInline: { md: '14px' },
                textTransform: 'none',
                borderBottom: selectedButton === page.title ? '2px solid white' : 'none',

              }}
            >
              {page.title}

            </Button>
            {page.subpages.length > 0 && <StyledMenu
              id={`menu-${page.title}`}
              MenuListProps={{
                "aria-labelledby": `menu-button-${page.title}`,
              }}
              anchorEl={currentMenu === page.title ? anchorEl : null}
              open={Boolean(anchorEl) && currentMenu === page.title}
              onClose={() => handleClose()}
            >
              {page.subpages.map((sub: any) => (
                <MenuItem key={sub.nombre} onClick={() => handleClose(sub.url)} disableRipple>
                  {sub.nombre}
                </MenuItem>
              ))}
            </StyledMenu>}
          </MenuItem>
        ))}
    </Box>
  );
}
