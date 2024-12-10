"use client";
import * as React from "react";
import TablePagination from "@mui/material/TablePagination";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import useQueryString, { IQuery } from "@/hooks/useQueryString";

export interface PaginacionAPI {
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

interface PaginationCustomProps {
  rowsPerPageOptions: number[];
  pagination: PaginacionAPI;
}

export default function PaginationCustom({
  rowsPerPageOptions,
  pagination,
}: PaginationCustomProps) {

  const {pageNumber, pageSize, totalCount, totalPages} = pagination;
  
  const {modifyQueries} = useQueryString();

  const handleChangePage = (
    event: React.ChangeEvent<unknown> | null,
    newPage: number
  ) => {
    if (event) event.preventDefault();
    modifyQueries([{ name: 'pageNumber', value: newPage.toString() }]);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const queries : IQuery[] = [];
    queries.push({name: 'pageNumber', value: '1'});
    queries.push({name: 'pageSize', value: event.target.value});
    modifyQueries(queries);   
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="nowrap"
    >
      <span>{`${totalCount} registros totales`}</span>
      <TablePagination
        component="div"
        count={totalCount}
        page={pageNumber - 1}
        onPageChange={(event, newPage) => handleChangePage(event, newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage || 9}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={() => null}
        rowsPerPageOptions={rowsPerPageOptions}
        ActionsComponent={() => (
          <Pagination
            count={totalPages}
            page={pageNumber}
            onChange={(event, newPage) => handleChangePage(event, newPage)}
            sx={{
              "& .MuiPaginationItem-root": {
                fontFamily: "Roboto, sans-serif",
                fontStyle: "normal",
                color: "#1F1F1F",
                fontSize: "18px",
              },
              "& .MuiPagination-ul": {
                display: "flex",
                flexWrap: "nowrap", // Mantén los items en una sola fila
              },
              "& .Mui-selected": {
                backgroundColor: "#AAC5F3 !important",
                opacity: 1,
              },
            }}
          />
        )}
        sx={{
          ".MuiInputBase-root, .MuiInputBase-colorPrimary, .MuiTablePagination-input":
            {
              m: 0,
            },
          ".MuiSelect-select": {
            fontSize: "18px",
            pb: 0,
          },
          ".MuiPagination-root": {
            mr: 10,
          },
          ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
            {
              fontFamily: "Roboto, sans-serif",
              fontStyle: "normal",
              fontSize: "18px",
            },
        }}
      />
    </Box>
  );
}