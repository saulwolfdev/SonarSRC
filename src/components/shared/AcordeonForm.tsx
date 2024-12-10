import React, { ReactNode, useState } from "react";
import { Card, Typography, Box, IconButton, Collapse } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface AccordionFormProps {
  title: string;
  children: ReactNode;
  sx? : any
  allowCollapse?: boolean;
}

export default function AccordionForm({ title, children , sx, allowCollapse = true}: AccordionFormProps) {
  const [expanded, setExpanded] = useState(true);

  const handleToggleExpand = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <Box className="box-form-create-update" sx={{mt:10}}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
         cursor: allowCollapse ? "pointer" : "default",
          mt: { md: 2},
          ml: { md: 21 },
          mr: { md: 21 },
        }}
        onClick={ allowCollapse ? handleToggleExpand: undefined}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            color: "grey",
          }}
        >
          {title}
        </Typography>
        {allowCollapse &&  <IconButton>
          <KeyboardArrowUpIcon
            sx={{
              transform: expanded ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </IconButton>}
      </Box>

      <Collapse in={expanded}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            mt: { md: 2 },
            p: { md: 2 },
            ... sx,
          }}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}
