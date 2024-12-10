import React from 'react';
import { Box, Stepper, Step, StepLabel, StepButton, Divider } from '@mui/material';

interface StepNavigationProps {
  steps: string[];
  activeStep: number;
  onStepChange: (step: number) => void;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ steps, activeStep, onStepChange }) => {
  return (
    <Box sx={{ width: '40%', marginBottom: 4 }}>
      <Stepper alternativeLabel activeStep={activeStep} connector={null}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={() => onStepChange(index)}>
              <StepLabel>{label}</StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default StepNavigation;