"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { GradeDistributionChart } from "./grade-distribution-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data
type Student = {
  id: string
  name: string
  studentId: string
  attendance: number
  midterm: number | null
  finals: number | null
  projects: number | null
  finalGrade: number | null
  status: "pending" | "submitted" | "approved"
}

const data: Student[] = [
  {
    id: "728ed52f",
    name: "Maria Santos",
    studentId: "ST-2023-0001",
    attendance: 95,
    midterm: 88,
    finals: 92,
    projects: 90,
    finalGrade: 91,
    status: "approved",
  },
  {
    id: "489e1d42",
    name: "Juan Dela Cruz",
    studentId: "ST-2023-0002",
    attendance: 85,
    midterm: 78,
    finals: 82,
    projects: 85,
    finalGrade: 82,
    status: "approved",
  },
  {
    id: "a9f2e321",
    name: "Ana Reyes",
    studentId: "ST-2023-0003",
    attendance: 90,
    midterm: 85,
    finals: 88,
    projects: 92,
    finalGrade: 89,
    status: "submitted",
  },
  {
    id: "fc7e0932",
    name: "Carlos Mendoza",
    studentId: "ST-2023-0004",
    attendance: 75,
    midterm: 65,
    finals: 70,
    projects: 80,
    finalGrade: 72,
    status: "submitted",
  },
  {
    id: "8d3b5a12",
    name: "Sofia Lim",
    studentId: "ST-2023-0005",
    attendance: 98,
    midterm: 95,
    finals: 96,
    projects: 98,
    finalGrade: 97,
    status: "approved",
  },
  {
    id: "6e9c4b78",
    name: "Miguel Garcia",
    studentId: "ST-2023-0006",
    attendance: 80,
    midterm: 75,
    finals: null,
    projects: 85,
    finalGrade: null,
    status: "pending",
  },
  {
    id: "2f5a8e19",
    name: "Isabella Tan",
    studentId: "ST-2023-0007",
    attendance: 92,
    midterm: 88,
    finals: null,
    projects: 90,
    finalGrade: null,
    status: "pending",
  },
]

export const columns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Student Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "studentId",
    header: "Student ID",
    cell: ({ row }) => <div>{row.getValue("studentId")}</div>,
  },
  {
    accessorKey: "attendance",
    header: "Attendance",
    cell: ({ row }) => {
      const value = row.getValue("attendance") as number
      return <div className="text-center">{value}%</div>
    },
  },
  {
    accessorKey: "midterm",
    header: "Midterm",
    cell: ({ row }) => {
      const value = row.getValue("midterm") as number | null
      return <div className="text-center">{value !== null ? value : "-"}</div>
    },
  },
  {
    accessorKey: "finals",
    header: "Finals",
    cell: ({ row, table }) => {
      const initialValue = row.getValue("finals") as number | null
      const [value, setValue] = useState<string>(initialValue !== null ? initialValue.toString() : "")
      const student = row.original

      const onBlur = () => {
        const numValue = value === "" ? null : Number.parseFloat(value)
        if (numValue !== null && (isNaN(numValue) || numValue < 0 || numValue > 100)) {
          toast({
            title: "Invalid grade",
            description: "Grade must be between 0 and 100",
            variant: "destructive",
          })
          setValue(initialValue !== null ? initialValue.toString() : "")
          return
        }

        // Update the data
        table.options.meta?.updateData(row.index, "finals", numValue)
      }

      return student.status === "approved" ? (
        <div className="text-center">{initialValue !== null ? initialValue : "-"}</div>
      ) : (
        <Input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className="h-8 w-16 mx-auto text-center"
        />
      )
    },
  },
  {
    accessorKey: "projects",
    header: "Projects",
    cell: ({ row, table }) => {
      const initialValue = row.getValue("projects") as number | null
      const [value, setValue] = useState<string>(initialValue !== null ? initialValue.toString() : "")
      const student = row.original

      const onBlur = () => {
        const numValue = value === "" ? null : Number.parseFloat(value)
        if (numValue !== null && (isNaN(numValue) || numValue < 0 || numValue > 100)) {
          toast({
            title: "Invalid grade",
            description: "Grade must be between 0 and 100",
            variant: "destructive",
          })
          setValue(initialValue !== null ? initialValue.toString() : "")
          return
        }

        // Update the data
        table.options.meta?.updateData(row.index, "projects", numValue)
      }

      return student.status === "approved" ? (
        <div className="text-center">{initialValue !== null ? initialValue : "-"}</div>
      ) : (
        <Input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className="h-8 w-16 mx-auto text-center"
        />
      )
    },
  },
  {
    accessorKey: "finalGrade",
    header: "Final Grade",
    cell: ({ row }) => {
      const value = row.getValue("finalGrade") as number | null
      return (
        <div
          className={`text-center font-medium ${
            value !== null ? (value >= 75 ? "text-green-600" : "text-red-600") : ""
          }`}
        >
          {value !== null ? value : "-"}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className="text-center">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              status === "approved"
                ? "bg-green-100 text-green-800"
                : status === "submitted"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(student.id)}>
              Copy student ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View student details</DropdownMenuItem>
            <DropdownMenuItem disabled={student.status === "approved"}>Edit grades</DropdownMenuItem>
            <DropdownMenuItem disabled={student.status !== "pending"}>Submit grades</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function GradeManagement() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [tableData, setTableData] = useState<Student[]>(data)
  const [selectedClass, setSelectedClass] = useState<string>("cs101")

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) => {
        setTableData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              // Calculate final grade if all components are present
              const updatedRow = {
                ...row,
                [columnId]: value,
              }

              if (
                updatedRow.attendance !== null &&
                updatedRow.midterm !== null &&
                updatedRow.finals !== null &&
                updatedRow.projects !== null
              ) {
                // Simple weighted average: 10% attendance, 30% midterm, 40% finals, 20% projects
                const finalGrade = Math.round(
                  updatedRow.attendance * 0.1 +
                    updatedRow.midterm * 0.3 +
                    updatedRow.finals * 0.4 +
                    updatedRow.projects * 0.2,
                )
                updatedRow.finalGrade = finalGrade
              }

              return updatedRow
            }
            return row
          }),
        )
      },
    },
  })

  const handleSaveGrades = () => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Grades saved",
        description: "All changes have been saved successfully.",
      })
    }, 1000)
  }

  const handleSubmitGrades = () => {
    // Update status for selected rows
    const selectedRows = table.getFilteredSelectedRowModel().rows
    if (selectedRows.length === 0) {
      toast({
        title: "No students selected",
        description: "Please select at least one student to submit grades for.",
        variant: "destructive",
      })
      return
    }

    // Check if all required grades are filled
    const incompleteRows = selectedRows.filter((row) => {
      const student = row.original
      return student.midterm === null || student.finals === null || student.projects === null
    })

    if (incompleteRows.length > 0) {
      toast({
        title: "Incomplete grades",
        description: `${incompleteRows.length} student(s) have incomplete grades. Please fill all required fields.`,
        variant: "destructive",
      })
      return
    }

    // Update status
    setTableData((old) =>
      old.map((student) => {
        if (selectedRows.some((row) => row.original.id === student.id) && student.status === "pending") {
          return { ...student, status: "submitted" }
        }
        return student
      }),
    )

    // Clear selection
    table.resetRowSelection()

    toast({
      title: "Grades submitted",
      description: `Grades for ${selectedRows.length} student(s) have been submitted for approval.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Grade Management</h2>
          <p className="text-muted-foreground">Manage and submit student grades for your classes</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cs101">CS101: Intro to Programming</SelectItem>
              <SelectItem value="cs201">CS201: Data Structures</SelectItem>
              <SelectItem value="cs301">CS301: Database Systems</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleSaveGrades}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <Tabs defaultValue="grades" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="grades">Grade Sheet</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="grades" className="space-y-4">
          <div className="flex flex-col md:flex-row items-center py-4 gap-4">
            <Input
              placeholder="Filter students..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} student(s)
              selected.
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleSubmitGrades}
                disabled={table.getFilteredSelectedRowModel().rows.length === 0}
              >
                Submit Selected
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Overview of grade distribution for CS101: Intro to Programming</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <GradeDistributionChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators for your class</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Class Average</p>
                      <p className="text-2xl font-bold">86.2%</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Passing Rate</p>
                      <p className="text-2xl font-bold">92%</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Highest Grade</p>
                      <p className="text-2xl font-bold">97%</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Lowest Grade</p>
                      <p className="text-2xl font-bold">72%</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-2">Grade Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">A (90-100%)</span>
                        <span className="text-sm font-medium">3 students (43%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">B (80-89%)</span>
                        <span className="text-sm font-medium">2 students (29%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">C (75-79%)</span>
                        <span className="text-sm font-medium">1 student (14%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">F (Below 75%)</span>
                        <span className="text-sm font-medium">1 student (14%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
