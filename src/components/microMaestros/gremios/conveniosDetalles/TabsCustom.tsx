import React, {ReactNode} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

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
}

export default function TabsCustom({options,  value, setValue}: TabsCustomProps) {

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
         {options && options.length > 0  && options.map((op, index) =>
            {return (  
                <Tab key={`tab-${op.name}`} label={op.name} {...a11yProps(index)} />
            )})
            }
          
        </Tabs>
      </Box>
      {options && options.length > 0  && options.map((op, index) =>
            {return (  
              <CustomTabPanel key={`tab-${op.name}`} value={value} index={index}>
             {op.element}
            </CustomTabPanel>
            )})
            }
      
      
    </Box>
  );
}
