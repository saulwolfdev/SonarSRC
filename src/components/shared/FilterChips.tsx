import React, { useEffect, useRef, useState } from 'react';
import { Box, Chip, IconButton } from '@mui/material';
import ArrowForwardIosSharp from '@mui/icons-material/ArrowForwardIosSharp';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import { ChipCustom, StatusChip } from './ChipsCustom';

interface FilterChipsProps {
  onDelete: (value: string) => void;
  filters: [string, string, string][];
}

export default function FilterChips({ onDelete, filters }: FilterChipsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState({ left: false, right: false });

  // Función para desplazar los chips hacia la izquierda
  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -100, behavior: 'smooth' });
    }
  };

  // Función para desplazar los chips hacia la derecha
  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 100, behavior: 'smooth' });
    }
  };

  // Verificar si hay desbordamiento para mostrar/ocultar flechas
  useEffect(() => {
    const checkOverflow = () => {
      const container = scrollRef.current;
      if (container) {
        const { scrollWidth, clientWidth, scrollLeft } = container; // Asegúrate de que 'container' no sea null
        setShowArrows({
          left: scrollLeft > 0,
          right: scrollLeft + clientWidth < scrollWidth,
        });
      }
    };

    // Escuchar los eventos de scroll y de resize
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', checkOverflow);
      window.addEventListener('resize', checkOverflow);
      checkOverflow();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkOverflow);
      }
      window.removeEventListener('resize', checkOverflow);
    };
  }, [filters]);

  return (
    <Box
      gap={2}
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        gap: '10px',
        ml: 10,
      }}
    >
      {showArrows.left && (
        <IconButton onClick={handleScrollLeft} size='small'>
          <ArrowBackIosNew />
        </IconButton>
      )}

      <Box
        ref={scrollRef}
        display="flex"
        alignItems="center"
        gap={2}
        sx={{
          overflowX: 'auto', 
          whiteSpace: 'nowrap',
          flexGrow: 1,
          '::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {filters.length > 0 &&
          filters.map(([name, value, key]) => (
            <ChipCustom
              key={key}

              label={`${name}: ${value}`}
              status= {StatusChip.deletable}
              onDelete={() => onDelete(key)}
              sx={{ flexShrink: 0 }} // Asegura que los chips no se reduzcan
            />
          ))}
      </Box>

      {showArrows.right && (
        <IconButton onClick={handleScrollRight} size='small'>
          <ArrowForwardIosSharp />
        </IconButton>
      )}
    </Box>
  );
}
