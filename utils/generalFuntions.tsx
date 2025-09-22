import ExcelJS from "exceljs"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { saveAs } from "file-saver"

// 🔹 Excel Export
export const exportToExcel = async (customers: any[], filename: any) => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Customers")

    worksheet.columns = [
        { header: "First Name", key: "firstName", width: 20 },
        { header: "Last Name", key: "lastName", width: 20 },
        { header: "Email", key: "email", width: 30 },
        { header: "Company", key: "company", width: 20 },
        { header: "Phone", key: "phone", width: 20 },
        { header: "Status", key: "status", width: 15 },
        { header: "Created At", key: "createdAt", width: 20 },
    ]

    customers.forEach((c) => {
        worksheet.addRow({
            firstName: c.firstName,
            lastName: c.lastName,
            email: c.email,
            company: c.company || "-",
            phone: c.phone || "-",
            status: c.status,
            createdAt: new Date(c.createdAt).toLocaleDateString(),
        })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buffer]), `${filename}.xlsx`)
}

// 🔹 PDF Export
export const exportToPDF = (customers: any[]) => {
    const doc = new jsPDF()

    doc.text("Customer Report", 14, 15)

    const tableData = customers.map((c) => [
        c.firstName + " " + c.lastName,
        c.email,
        c.company || "-",
        c.phone || "-",
        c.status,
        new Date(c.createdAt).toLocaleDateString(),
    ])

    autoTable(doc, {
        startY: 20,
        head: [["Name", "Email", "Company", "Phone", "Status", "Created At"]],
        body: tableData,
    })

    doc.save("customers.pdf")
}
