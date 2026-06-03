import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fileServer from 'file-saver';
import { AuditTrailDetailsModel } from 'src/app/models/auditTrailDetails.model';
import { MasterUserDetailsModel } from 'src/app/models/masterUserDetails.model';
import { AuditTrailDetailsService } from 'src/app/service/auditTrailDetails.service';
import { AuthenticationService } from 'src/app/service/auth.service';
import { MasterUserDetailsService } from 'src/app/service/masterUserDetailsService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-audit-trail-report',
  templateUrl: './audit-trail-report.component.html',
  styleUrls: ['./audit-trail-report.component.css']
})
export class AuditTrailReportComponent implements OnInit,OnDestroy {
  auditTrailDtOptions: DataTables.Settings = {};
    private intervalIds: any[] = [];
  auditTrailDetailsList: AuditTrailDetailsModel[] = [];
  userName!: string;
  startDateTime!: string;
  endDateTime!: string;
  disableSearchButton: boolean = false;
  disableDateTime: boolean = true;
  dropDownList: MasterUserDetailsModel[] = [];
  username!: string;

  constructor(private auditTrailDetailsService: AuditTrailDetailsService,
    private masterUserDetailsService: MasterUserDetailsService,
    private authService: AuthenticationService,
    private toastr: ToastrService) { }
 ngOnDestroy(): void {
  
    this.intervalIds.forEach(id => clearInterval(id));
    this.intervalIds = [];
  }

  ngOnInit(): void {
    this.auditTrailDtOptions = {
      ajax: () => {
        this.fetchAllAuditTrailDetails();
        this.fetchAllUserDetails();
      },
       paging: true,
      pageLength: 10
    }


  }

  resetData() {
    this.userName = "NA";
    this.startDateTime = "NA";
    this.endDateTime = "NA"
  }

  public fetchAllAuditTrailDetails() {
    this.auditTrailDetailsService.fetchAllAuditTrailDetails().subscribe(
      auditTrailList => {
        $('#auditTrailId').DataTable().clear().destroy();
        this.auditTrailDetailsList = auditTrailList;
        $(function () {
          $("#auditTrailId").DataTable();
        });
        $(function () {
          $("#reasonId").DataTable({
            // pagingType: 'full_numbers',

            "language": {
              paginate: {
                "first": "First",
                "last": "last",
                "next": "Entries",
                "previous": "Show:"
              }
            }
          });
        });
        if (this.auditTrailDetailsList == null) {
          this.toastr.warning('Data is not available.', '', { timeOut: 5000, });
        }
      }
    )
  }

  public fetchAllUserDetails() {
    this.masterUserDetailsService.fetchAllUserDetails().subscribe(
      userDetailsList => {
        this.dropDownList = userDetailsList;
        //console.log("username"+this.dropDownList)
      }
    );
  }

  public selectUserNameChangeHandler(value: string) {
    this.userName = value;
  }

  public dateTimeValidation() {

    if (this.startDateTime != null && (this.endDateTime == null || this.endDateTime == 'NA')) {
      this.disableDateTime = false;
      this.disableSearchButton = true;
    }

    else if (this.startDateTime != null && this.endDateTime != null && this.endDateTime <= this.endDateTime) {
      this.disableSearchButton = false;
    }

    else if (this.startDateTime != null && this.endDateTime != null && this.startDateTime < this.endDateTime) {
      this.disableSearchButton = false;
    }


    else if (this.startDateTime == this.endDateTime) {
      this.disableSearchButton = false;
    }

    else {
      this.disableSearchButton = true;
    }
  }


  public fetchAuditTrailDetailsByAllFilters() {
    if (this.startDateTime == undefined || this.startDateTime == null) {
      this.startDateTime = "NA"
    }
    if (this.endDateTime == undefined || this.endDateTime == null) {
      this.endDateTime = "NA"
    }
    if (this.userName == undefined || this.userName == null || this.userName.trim() == "") {
      this.userName = "NA"
    }

    this.auditTrailDetailsService.fetchAuditTrailDetailsByAllFilters(this.startDateTime, this.endDateTime, this.userName).subscribe(
      auditTrailList => {
        this.auditTrailDetailsList = auditTrailList;
        //console.log("auditTrailList"+this.auditTrailDetailsList);
      }
    )
  }

  public generateAuditTrailExcelReport() {
    if (this.auditTrailDetailsList.length === 0) {
      this.toastr.warning('Data is not available.', '', { timeOut: 5000, });
      return;
    }
    var logoBase64Logo = ""
    const headerRowsCount = 8;
    const title = 'AUDIT TRAIL DETAILS REPORT' + "    " + formatDate(new Date(), 'dd-MMM-yyyy HH:mm:ss', 'en-US');
    //const title = 'Audit Trail Details Report';
    const header = ["Sr.No", "Transaction Details", "Field",
      "Reason", "Before Value", "After Value", "username", "DateTime"]

    // Convert the id to sr.no
    for (let i = 0; i < this.auditTrailDetailsList.length; i++) {
      this.auditTrailDetailsList[i].auditId = (i + 1)
    }

    // Convert the array of objects to array of array because reporing library support array of array or array as input.


    const data = this.auditTrailDetailsList.map((obj) =>
      Object.values({
        auditId: obj.auditId,
        transactionDetails: obj.operatorActions,
        field: obj.field,
        reason: obj.reason,
        beforeValue: obj.beforeValue,
        afterValue: obj.afterValue,
        username: obj.username,
        cDateTime: obj.datetimeC
      }
      )
    );

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Audit Trail Data');

    // Add new row
    let titleRow = worksheet.addRow([title]);

    // Set font, size and style in title row.
    titleRow.font = { name: 'Calibri', family: 4, size: 22 };
    //titleRow.font = { name: 'Comic Sans MS', family: 4, size: 25, underline: 'double', bold: true };
    // Align the title in the center
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

    //Merge Cells
    worksheet.mergeCells(`A${titleRow.number}:H${titleRow.number}`);

    // Blank Row
    worksheet.addRow([]);

    //Add row with current date
    let subTitleRow = worksheet.addRow(['Date & Time : ' + (new Date().toLocaleString())]);

    // Add Image
    // let logo = workbook.addImage({
    //   base64: logoBase64Logo,
    //   extension: 'png',
    // });
    // worksheet.addImage(logo, 'I1:I1');

    //Add Header Row
    let headerRow = worksheet.addRow(header);
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4472C4' },

      }
      cell.font = {

        color: { argb: 'FFFFFF' },
        size: 12,
        bold: true,
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    // // Add Data and Conditional Formatting (Row wise formatting)
    // data.forEach(d => {
    //   let row = worksheet.addRow(d);
    //   let qty = row.getCell(5);
    //   let color = 'FF99FF99';
    //   if (+qty < 800) {
    //     color = 'FF9999'
    //   }
    //   qty.fill = {
    //     type: 'pattern',
    //     pattern: 'solid',
    //     fgColor: { argb: color }
    //   }
    // }
    // );

    // Add all data without formatting
    worksheet.addRows(data);

    // Used to delete the column
    // worksheet.spliceColumns(10,1);
    // worksheet.spliceColumns(2,1);

    // To give the width to the column
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 10;
    worksheet.getColumn(8).width = 30;


    // worksheet.addRow([]);

    //Footer Row
    let footerRow = worksheet.addRow(['This is system generated excel sheet.']);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'F1F5F9' }
    };
    footerRow.getCell(1).border = {
      top: { style: 'thin' }, left: { style: 'thin' },
      bottom: { style: 'thin' }, right: { style: 'thin' }
    }
    // Align the footer in the center
    worksheet.getCell('A' + (data.length + headerRowsCount + 1)).alignment = { vertical: 'middle', horizontal: 'center' };
    // console.log(data.length + headerRowsCount + 1);

    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:H${footerRow.number}`);

    // Save the file in Excel format
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const todayDate = new Date();
      console.log(todayDate);



      const fileName = "AuditTrailReport" + (todayDate.getDate()) + (todayDate.getMonth() + 1) + (todayDate.getFullYear()) + (todayDate.getHours())
        + (todayDate.getMinutes()) + (todayDate.getSeconds());
      fileServer.saveAs(blob, fileName + '.xlsx');
    })


    

  }

  header = [["Sr.No", "Transaction Details", "Field",
    "Reason", "Before Value", "After Value", "username", "DateTime"]];



  // createPdf() {

  //   if (this.auditTrailDetailsList.length === 0) {
  //     this.toastr.warning('Data is not available.', '', { timeOut: 5000, });
  //     return;
  //   }

  //   // doc = new jsPDF({ orientation: 'landscape', unit: 'px', floatPrecision: 2 });
  //   for (let i = 0; i < this.auditTrailDetailsList.length; i++) {
  //     this.auditTrailDetailsList[i].auditId = (i + 1);
  //   }
  //   const Tabledata = this.auditTrailDetailsList.map((obj) =>
  //     Object.values({
  //       auditId: obj.auditId,
  //       transactionDetails: obj.operatorActions,
  //       field: obj.field,
  //       reason: obj.reason,
  //       beforeValue: obj.beforeValue,
  //       afterValue: obj.afterValue,
  //       username: obj.username,
  //       cDateTime: obj.datetimeC

  //     }
  //     )

  //   );

  //   var doc = new jsPDF();

  //   doc.setFontSize(18);
  //   doc.text('AUDIT TRAIL DETAILS REPORT', 11, 8);
  //   doc.text('User:', 150, 8); doc.text(this.authService.currentUserValue.userName, 165, 8);

  //   doc.setFontSize(12);
  //   doc.setTextColor(100);
  //   doc.setLineWidth(2);

  //   doc.text('', 10, 10);
  //   doc.setFont('Italic');
  //   //   alert('111')

  //   (doc as any).autoTable({

  //     head: this.header,
  //     body: Tabledata,

  //     theme: 'grid',
  //     didDrawCell: (data: { column: { index: any; }; }) => {
  //       console.log(data.column.index)
  //     },

  //   })

  
  //   const todayDate = new Date();
  //   const fileName = 'AuditTrailReport_' + todayDate.getDate() + (todayDate.getMonth() + 1) + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + '.pdf';
    
  //   doc.save(fileName + '.pdf');
   
  // }



  createPdf() {
    if (this.auditTrailDetailsList.length === 0) {
      this.toastr.warning('Data is not available.', '', { timeOut: 5000 });
      return;
    }
  
    // Add Serial Number to each entry
    for (let i = 0; i < this.auditTrailDetailsList.length; i++) {
      this.auditTrailDetailsList[i].auditId = (i + 1);
    }
  
    // Prepare Data for Table
    const Tabledata = this.auditTrailDetailsList.map((obj) =>
      Object.values({
        auditId: obj.auditId,
        transactionDetails: obj.operatorActions,
        field: obj.field,
        reason: obj.reason,
        beforeValue: obj.beforeValue,
        afterValue: obj.afterValue,
        username: obj.username,
        cDateTime: obj.datetimeC
      })
    );
  
    // Initialize jsPDF document in landscape orientation
    var doc = new jsPDF({ orientation: 'landscape' });
  
    // Add Title
    const title = 'AUDIT TRAIL DETAILS REPORT for ' + formatDate(new Date(), 'dd-MMM-yyyy', 'en-US');
    doc.setFontSize(22);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  
    // Add User Information
    doc.setFontSize(12);
    doc.text('User: ' + this.authService.currentUserValue.userName, 10, 30);
  
    // Table Headers
    const headers = [["Sr.No", "Transaction Details", "Field", "Reason", "Before Value", "After Value", "Username", "Date & Time"]];
  
    // AutoTable for Data
    (doc as any).autoTable({
      head: headers,
      body: Tabledata,
      startY: 50, // Position to start the table
      theme: 'grid',
      headStyles: {
        fillColor: [68, 114, 196], // Header background color
        textColor: [255, 255, 255], // White text
        fontSize: 12,
        halign: 'center', // Center align headers
        valign: 'middle',
      },
      bodyStyles: {
        fontSize: 10,
        halign: 'center', // Center align data
        valign: 'middle',
      },
      styles: {
        cellPadding: 4,
        lineColor: [0, 0, 0], // Black border
        lineWidth: 0.1,
      },
    });
  
    // Add Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.text('This is a system-generated PDF document.', doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: 'center' });
  
    // Save the PDF
    const todayDate = new Date();
    const fileName = 'AuditTrailReport_' + todayDate.getDate() + (todayDate.getMonth() + 1) + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + '.pdf';
    doc.save(fileName);
  }
  

}
