import React, { useMemo, useState } from "react";
import {
  MRT_TableContainer,
  useMaterialReactTable,
} from "material-react-table";
import { Button, TablePagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { reOrder } from "../services/web/webServices";

const DataTable = ({ tableData, onDelete, handleShow }) => {
  const navigate = useNavigate();
  const itemsPerPageOptions = [10, 25, 50, 100];

  const columns = useMemo(() => [
    //column definitions...
    {
      accessorKey: "order_id",
      header: "S.NO.",
      size: 5,
      muiTableHeadCellProps: {
        align: "left",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      size: 20,
      muiTableHeadCellProps: {
        align: "left",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
    },
    {
      accessorKey: "primary_color",
      header: "Primary Color",
      size: 20,
      muiTableHeadCellProps: {
        align: "left",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
    },
    {
      header: "Actions",
      muiTableHeadCellProps: {
        align: "left",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
      accessorKey: "actions",
      sx: { minWidth: 0, width: "auto", padding: 0 },
      accessorFn: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "left",
            }}
          >
            {params?.module_id === 1 ? (
              <Button
                style={{ width: "50px" }}
                onClick={() =>
                  navigate("/curriculum_module", {
                    state: { id: params?.curriculum_id },
                  })
                }
              >
                Sections
              </Button>
            ) : (
              <Button
                style={{ width: "50px" }}
                onClick={() => {
                  navigate("/curriculum_units", {
                    state: { id: params?.curriculum_id, module_id: 0 },
                  });
                }}
              >
                Units
              </Button>
            )}
            <Button onClick={() => handleShow(params)}>
              <i className="fas fa-edit"></i>
            </Button>
            <Button color="error" onClick={() => onDelete(params)}>
              <i className="fa fa-trash" aria-hidden="true"></i>
            </Button>
          </div>
        );
      },
    },
  ], []);

  const [data, setData] = useState(() => tableData || []);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPageOptions[0]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, page, rowsPerPage]);

  const table = useMaterialReactTable({
    autoResetPageIndex: false,
    columns,
    data: paginatedData,
    enableRowOrdering: true,
    enableSorting: false,
    enablePagination: false,
    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table.getState();
        if (hoveredRow && draggingRow) {
          let data = {
            id1: draggingRow.original.order_id,
            id2: hoveredRow.original.order_id,
            tableName: "curriculum",
          };
          reOrder(data)
            .then((res) => {
              setData(
                res.data.result.map((el, index) => ({
                  ...el,
                  id: el.curriculum_id,
                  column_name: el.name,
                  i: index,
                })));
            })
            .catch((err) => {
              console.log(err);
            });
        }
      },
    }),
  });

  return (
    <>
      <MRT_TableContainer table={table} />
      <TablePagination
        rowsPerPageOptions={itemsPerPageOptions}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ position: 'sticky', bottom: 0, backgroundColor: 'white', zIndex: 1 }}
      />
    </>
  );
};

export default DataTable;
