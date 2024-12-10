import React, { useState } from "react";
import { Badge, Box, IconButton, Typography, Button, Paper, Popper, Chip } from "@mui/material";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import { fetchCodigo, fetchNombre } from "@/services/microMaestros/funcionEstandarizadaService";
import FuncionEstandarizadaSearch from "./FuncionEstandarizadaSearch";

interface FilterButtonProps {
  onApplyFilters: (filters: { label: string; value: string }[]) => void;
}

export default function FilterButton({ onApplyFilters }: FilterButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedNombre, setSelectedNombre] = useState<string | null>(null);
  const [selectedCodigo, setSelectedCodigo] = useState<string | null>(null);
  const [selectedEstado, setSelectedEstado] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ label: string; value: string }[]>([]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleRemoveFilter = (label: string) => {
    setFilters((prev) => prev.filter((filter) => filter.label !== label));
  };

  const handleApply = () => {
    const appliedFilters = [
      { label: "Codigo", value: selectedCodigo || "" },
      { label: "Nombre", value: selectedNombre || "" },
      { label: "Estado", value: selectedEstado || "" },
    ].filter(filter => filter.value); // Filtrar vacíos

    setFilters(appliedFilters);
    onApplyFilters(appliedFilters);
    handleClose();
  };

  return (
    <Box sx={{ flexGrow: 1, textAlign: "end" }}>
      <IconButton
        aria-describedby={open ? "simple-popper" : undefined}
        onClick={handleClick}
      >
        <Badge color="primary">
          <FilterAltOutlinedIcon sx={{ color: "black" }}/>
        </Badge>
      </IconButton>

      <Popper
        id={open ? "simple-popper" : undefined}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
      >
        <Paper
          elevation={3}
          sx={{
            backgroundColor: "#FFFFFF",
            padding: 16,
            width: 400,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: 'relative', zIndex: 1 }}>
            <Typography id="modal-title" variant="h6" component="h3" sx={{ fontSize: 16, fontWeight: 'bold' }}>
              Filtros
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{ color: "primary.main", textAlign: "right", '&:hover': { backgroundColor: 'transparent' } }}
            >
              <BackspaceOutlinedIcon sx={{ fontSize: 20}} />
              <Typography sx={{ fontSize: 16, ml: 5, fontWeight: 'semibold' }}>Limpiar filtros</Typography>
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 16, mt: 2 }}>
          {/* <FuncionEstandarizadaSearch
              // Código 
              label="Código"
              value={selectedCodigo || ""}
              fetchOptions={fetchCodigo}
              getOptionLabel={(option) => option}
              onChange={(value) => setSelectedCodigo(value)}
            /> */}

            {/* Nombre */}
            {/* <FuncionEstandarizadaSearch
              label="Nombre"
              value={selectedNombre || ""}
              fetchOptions={fetchNombre}
              getOptionLabel={(option) => option}
              onChange={(value) => setSelectedNombre(value)}
            /> */}

            {/* Estado */}
            {/* <FuncionEstandarizadaSearch
              label="Estado"
              value={selectedEstado || ""}
              fetchOptions={undefined}
              getOptionLabel={(option) => option}
              onChange={(value) => setSelectedEstado(value)}
            /> */}
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
            {filters.map((filter) => (
              <Chip
                key={filter.label}
                label={`${filter.label}: ${filter.value}`}
                onDelete={() => handleRemoveFilter(filter.label)}
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 16 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApply}
            >
              Aplicar
            </Button>
          </Box>
        </Paper>
      </Popper>
    </Box>
  );
}
