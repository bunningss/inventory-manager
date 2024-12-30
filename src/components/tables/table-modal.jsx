"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Heading } from "../heading";

export function TableModal({
  columns,
  data,
  header,
  withAction = false,
  footer,
}) {
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  return (
    <div>
      {header && (
        <Heading className="text-center mb-2 text-lg underline decoration-secondary text-muted-foreground">
          {header}
        </Heading>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.header} className={`text-center `}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="text-center even:bg-muted">
                {columns.map((column, i) => (
                  <TableCell
                    key={i}
                    className={`min-w-[100px] lg:min-w-0 print:min-w-0 border-r last:border-r-0 ${
                      withAction ? "print:last:hidden" : ""
                    }`}
                  >
                    {column.cell
                      ? column.cell(row, rowIndex)
                      : getNestedValue(row, column.accessorKey)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          {footer}
        </Table>
      </div>
    </div>
  );
}
