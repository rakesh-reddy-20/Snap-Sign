import React, { useEffect, useState, useContext } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { UserContext } from "@/context/userContext";
import { Toaster, toast } from "react-hot-toast";
import { TrashIcon, FileTextIcon, DownloadIcon } from "lucide-react";

const Uploads = () => {
  const [uploadInfo, setUploadInfo] = useState([]);
  const { user } = useContext(UserContext);

  const getUploadPdf = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.DOC.ALL_DOCS);
      setUploadInfo(res.data.documents || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };

  useEffect(() => {
    getUploadPdf();
  }, []);

  const columns = [
    {
      header: "ID",
      accessorKey: "_id",
      cell: (info) => {
        const id = info.getValue();
        return (
          <span title={id}>
            {id.slice(0, 6)}...{id.slice(-4)}
          </span>
        );
      },
    },
    {
      header: "Document Name",
      accessorKey: "title",
      cell: (info) => info.getValue(),
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (info) =>
        new Date(info.getValue()).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      id: "preview",
      header: "Preview",
      accessorKey: "fileUrl",
      cell: (info) => {
        const url = info.getValue();
        return (
          <div className="flex justify-center">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <FileTextIcon className="h-5 w-5 text-blue-600 hover:scale-110 transition" />
            </a>
          </div>
        );
      },
    },
    {
      id: "download",
      header: "Download",
      accessorKey: "fileUrl",
      cell: (info) => {
        const url = info.getValue();
        return (
          <div className="flex justify-center">
            <a href={url} download>
              <DownloadIcon className="h-5 w-5 text-green-600 hover:scale-110 transition" />
            </a>
          </div>
        );
      },
    },
    {
      id: "delete",
      header: "Delete",
      accessorKey: "_id",
      cell: (info) => {
        const id = info.getValue();

        const handleDelete = async () => {
          const confirmDelete = window.confirm(
            `Are you sure you want to delete "${id}"?`
          );
          if (!confirmDelete) return;

          try {
            await axiosInstance.delete(API_PATHS.DOC.DELETE_DOC(id));
            setUploadInfo((prev) => prev.filter((doc) => doc._id !== id));
            toast.success("Doc deleted successfully!");
          } catch (err) {
            console.error("Delete failed:", err);
            toast.error("Failed to delete the file!");
          }
        };

        return (
          <div className="flex justify-center">
            <TrashIcon
              className="h-5 w-5 text-red-600 cursor-pointer hover:scale-110 transition"
              onClick={handleDelete}
            />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: uploadInfo,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex justify-center mt-6">
      <div className="w-full max-w-4xl rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No uploads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Uploads;
