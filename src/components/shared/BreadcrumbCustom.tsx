import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';
import { useRouterPush } from '@/hooks/useRouterPush';

export interface BreadcrumbProps {name: string, path?: string, goBack? : any }


export interface BreadcrumbCustomProps{
    breadcrumbs: BreadcrumbProps[]
}

export default function BreadcrumbCustom({breadcrumbs}:BreadcrumbCustomProps) {

  const routerPush = useRouterPush();


    function handleClick(
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      path: string | null,
      goBack: any 
    ) {
      event.preventDefault();
      if (path) {
        routerPush(path);
      }
      if(goBack) goBack()
    }

  return (
    <Stack spacing={2}  sx={{mb: 25}}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {breadcrumbs.map(b => {
           return (
           <Link underline="hover" color="inherit" key={b.name}onClick={(e) => handleClick(e, b.path || null, b.goBack || null )}>
              { b.name}
           </Link>
          )
        })}
    </Breadcrumbs>
    </Stack>
  );
}
