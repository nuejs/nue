
---
back_to: standards-first-react-alternative/
pagehead: false
unlisted: true
---

# More complex table
A sortable/filterable table component, wrapped inside a card component. Implemented with modern React and Hyper.

## With modern React
Excessive boilerplate through Tanstack Table, ShadCN, and TypeScript interfaces

``` jsx
import * as React from "react"

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  ColumnFiltersState,
} from "@tanstack/react-table"

import { ArrowUpDown, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableCaption,
  TableRow,
} from "@/components/ui/table"

import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

import { Person, DataTableProps } from "./DataTable.types.ts";


// Create a reusable sortable header component
const SortableHeader = ({ column, title, align = "left" }) => (
  <div className={align === "right" ? "text-right" : ""}>
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  </div>
);

// Define the columns more concisely
const columns: ColumnDef<Person>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableHeader column={column} title="Email" />,
  },
  {
    accessorKey: "age",
    header: ({ column }) => <SortableHeader column={column} title="Age" />,
  },
  {
    accessorKey: "total",
    header: ({ column }) => <SortableHeader column={column} title="Total" align="right" />,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"))
      return <div className="text-right font-medium">{new Intl.NumberFormat('en-US').format(amount)}</div>
    },
  },
]

export default function DataTable({ data }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Table example</CardTitle>
          <CardDescription>A table example with filtering and sortable columns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter by name..."
                value={(table.getColumn("name")?.getFilterValue() as string) || ""}
                onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4 py-3">
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
            {
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-7 py-3">
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableCaption className="mb-5">{ data.length } people in total</TableCaption>
        </Table>
      </Card>
    </div>
  )
}
```

Here is the extra TypeScript needed (not included in the comparison images):

```
type Person = {
  id: string;
  name: string;
  email: string;
  age: number;
  total: number;
};

interface DataTableProps {
  data: Person[]
}
```


## With vanilla TSX { #oldschool }
This is an oldschool example using external CSS, which is no longer the "idiomatic" way to build React compomnents:

```
import React, { useState, useMemo } from "react";

import { Person, DataTableProps } from "./DataTable.types.ts";

export default function DataTable({ data }: DataTableProps) {
  const [sortField, setSortField] = useState<keyof Person | null>(null);
  const [sortDirection, setSortDirection] = useState<1 | -1>(1);
  const [filterValue, setFilterValue] = useState("");

  const handleSort = (field: keyof Person) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 1 ? -1 : 1);
    } else {
      setSortField(field);
      setSortDirection(1);
    }
  };

  const filteredData = useMemo(() => {
    return filterValue
      ? data.filter(person =>
          person.name.toLowerCase().includes(filterValue.toLowerCase())
        )
      : data;
  }, [data, filterValue]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[sortField] > b[sortField]) return sortDirection;
      if (a[sortField] < b[sortField]) return -sortDirection;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  return (
    <div className="card-container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Table example</h1>
          <p className="card-description">A table example with filtering and sortable columns</p>
          <div className="search-container">
            <input
              type="text"
              placeholder="Filter by name..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>
                <button className="sort-button" onClick={() => handleSort("name")}>
                  Name
                  <span className="sort-icon">↕</span>
                </button>
              </th>
              <th>
                <button className="sort-button" onClick={() => handleSort("email")}>
                  Email
                  <span className="sort-icon">↕</span>
                </button>
              </th>
              <th>
                <button className="sort-button" onClick={() => handleSort("age")}>
                  Age
                  <span className="sort-icon">↕</span>
                </button>
              </th>
              <th>
                <button className="sort-button" onClick={() => handleSort("total")}>
                  Total
                  <span className="sort-icon">↕</span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((person) => (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>{person.email}</td>
                  <td>{person.age}</td>
                  <td className="text-right">
                    {new Intl.NumberFormat('en-US').format(person.total)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="empty-message">
                  No results.
                </td>
              </tr>
            )}
          </tbody>
          <caption className="table-caption">{data.length} people in total</caption>
        </table>
      </div>
    </div>
  );
}
```


## With Hyper
Uses only about 40 lines of code, roughly 75% reduction in code to implement the same features.


``` html
<div class="card">
  <header>
    <h1>Table example</h1>
    <p>A table example with filtering and sortable columns</p>
    <input type="search" :input="filter" placeholder="Filter by name...">
  </header>

  <table>
    <tr>
      <th><a :click="sort('name')">Name</a></th>
      <th><a :click="sort('email')">Email</a></th>
      <th><a :click="sort('age')">Age</a></th>
      <th><a :click="sort('total')">Total</a></th>
    </tr>

    <tr :for="user of subset || users" key="${ user.id }">
      <td>${ user.name }</td>
      <td>${ user.email }</td>
      <td>${ user.age }</td>
      <td>${ new Intl.NumberFormat('en-US').format(user.total) }</td>
    </tr>
    <tr :if="subset && !subset[0]"><td colspan="4">No results</td></tr>

    <caption>${ users.length } people in total</caption>
  </table>

  <script>
    sort(by) {
      this.by = this.by == by ? this.by : by
      this.dir = this.by == by ? -this.dir || -1 : 1
      this.users.sort((a, b) => (a[by] > b[by] ? 1 : -1) * this.dir)
    }

    filter(e) {
      const val = e.target.value.trim().toLowerCase()
      this.subset = val ? this.users.filter(el => el.name.toLowerCase().includes(val)) : null
    }
  </script>
</div>
```
