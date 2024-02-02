import { useMemo, useState } from "react";
import {
  MRT_TableContainer,
  useMaterialReactTable,
} from "material-react-table";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DataTable = ({ tableData, onDelete, handleShow }) => {
  const navigate = useNavigate();

  const columns = useMemo(
    //column definitions...
    () => [
      {
        accessorKey: "curriculum_id",
        header: "S.NO.",
        // width: "15%",
        size: 10,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 80,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "primary_color",
        header: "Primary Color",
        size: 50,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        header: "Actions",
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        accessorKey: "actions",
        sx: { minWidth: 0, width: "auto", padding: 0 },
        accessorFn: (params) => {
          console.log(params, "params");
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {params?.row?.module_id === 1 ? (
                <Button
                  style={{ width: "-webkit-fill-available" }}
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
                  style={{ width: "-webkit-fill-available" }}
                  onClick={() => {
                    console.log(params.curriculum_id, "xxxx");
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
    ],
    []
    //end
  );

  const [data, setData] = useState(() => tableData || []);

  const table = useMaterialReactTable({
    autoResetPageIndex: false,
    columns,
    data,
    enableRowOrdering: false,
    enableSorting: true,
    enablePagination: true,
    paginationDisplayMode: "pages",
    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table?.getState();
        if (hoveredRow && draggingRow) {
          data &&
            data?.length > 0 &&
            data?.splice(
              hoveredRow.index,
              0,
              data && data?.length > 0 && data?.splice(draggingRow?.index, 1)[0]
            );
          setData([...data]);
        }
      },
    }),
    // enableRowActions: true,
    // renderRowActions: ({ row }) => (
    //   <div style={{ width: "100px" }}>
    //     {row.module_id === 1 ? (
    //       <Button
    //         style={{ width: "-webkit-fill-available" }}
    //         onClick={() =>
    //           navigate("/curriculum_module", {
    //             state: { id: row.curriculum_id },
    //           })
    //         }
    //       >
    //         Sections
    //       </Button>
    //     ) : (
    //       <Button
    //         style={{ width: "-webkit-fill-available" }}
    //         onClick={() =>
    //           navigate("/curriculum_units", {
    //             state: { id: row.curriculum_id, module_id: 0 },
    //           })
    //         }
    //       >
    //         Units
    //       </Button>
    //     )}
    //     <Button onClick={() => handleShow(row)}>
    //       <i className="fas fa-edit"></i>
    //     </Button>
    //     <Button color="error" onClick={onDelete(row)}>
    //       <i className="fa fa-trash" aria-hidden="true"></i>
    //     </Button>
    //   </div>
    // ),
  });

  return <MRT_TableContainer table={table} />;
};

export default DataTable;
