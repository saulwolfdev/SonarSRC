import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        ml: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    p: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export interface AccordionData {

    title: string,
    details: string,
}
interface AccordionCustomProps {
    data: AccordionData[];
  }

export default function AccordionCustom({data}: AccordionCustomProps  ) {
    const [expanded, setExpanded] = React.useState<string | false>('panel0');
    
    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };

    return (
        <div>
        {
        data.map((info : any , index : any) => {
            return (
                <Accordion key={index} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                    <AccordionSummary key={index} aria-controls={`panel${index}d-content`} id={`panel${index}d-header`}>
                        <Typography key={info.title} variant='body1'>{info.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography key={info.title} variant='body2'>{info.details}</Typography>
                    </AccordionDetails>
                </Accordion>
            )
        })
        }
        </div> 
    );
}