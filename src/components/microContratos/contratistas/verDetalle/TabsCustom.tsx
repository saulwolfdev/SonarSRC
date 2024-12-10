import React, {ReactNode} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Badge, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useRouterPush } from '@/hooks/useRouterPush';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface Tab{
  name: string,
  element : ReactNode
}

interface TabsCustomProps{
  options: Tab[]
  value: number
  setValue: (value: number) => void
  id:number
}

export default function TabsCustom({options,  value, setValue, id}: TabsCustomProps) {
  const routerPush = useRouterPush();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const router = useRouter()

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider',display:'flex', flexDirection:'row' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{width:'90%'}}>
          {options && options.length > 0 && options.map((op, index) => (
            <Tab key={`tab-${op.name}`} label={op.name} {...a11yProps(index)} />
          ))}
        </Tabs>
        {value === 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' , width:'10%'}}>
          <IconButton
            sx={{ width: 35, height: 35 }}
            onClick={() => {
              routerPush(`/microContratos/contratistas/editar?id=${id}`);
            }}
          >
            <Badge sx={{ width: 35, height: 35 }}>
              <EditOutlinedIcon sx={{ color: "#000", width: 35, height: 35 }} />
            </Badge>
          </IconButton>
        </Box>
      )}
      </Box>
  
     
  
      {options && options.length > 0 && options.map((op, index) => (
        <CustomTabPanel key={`tab-${op.name}`} value={value} index={index}>
          {op.element}
        </CustomTabPanel>
      ))}
    </Box>
  );
  
}
