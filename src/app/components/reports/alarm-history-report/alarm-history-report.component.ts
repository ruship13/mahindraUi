import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fileServer from 'file-saver';

import { EquipmentAlarmHistoryDetailsModel } from 'src/app/models/equipmentAlarmHistoryDetails.model';
import { MasterEquipmentDetailsModel } from 'src/app/models/masterEquipmentDetails.model';
import { AuthenticationService } from 'src/app/service/auth.service';

import { EquipmentAlarmHistoryDetailsService } from 'src/app/service/equipmentAlarmHistoryDetails.service';
import { MasterEquipmentDetailsService } from 'src/app/service/masterEquipmentDetails.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-alarm-history-report',
  templateUrl: './alarm-history-report.component.html',
  styleUrls: ['./alarm-history-report.component.css']
})
export class AlarmHistoryReportComponent implements OnInit {

  alarmHistoryDtOptions: DataTables.Settings = {};
  alarmHistoryDetailsList: EquipmentAlarmHistoryDetailsModel[] = [];
  startDateTime!: string;
  endDateTime!: string;
  equipmentName!: string;
  equipmentAlarmName!: string;
  disableSearchButton: boolean = false;
  disableDateTime: boolean = true;
  dropDownList: MasterEquipmentDetailsModel[] = [];
  masterEquipmentDetailsModelList: EquipmentAlarmHistoryDetailsModel[] = [];

  constructor(private equipmentAlarmHistoryDetailsService: EquipmentAlarmHistoryDetailsService,
    private masterEquipmentDetailsService: MasterEquipmentDetailsService, private authService: AuthenticationService,
    private toastr: ToastrService,) { }

ngOnInit(): void {
  this.alarmHistoryDtOptions = {
    ajax: () => {
      this.fetchAllEquipmentAlarmHistoryDetails();
      this.fetchEquipmentDetails();
    },
  
    paging: true,
    pageLength: 10
  };

  
}


  resetData() {
    this.equipmentName = "NA";
    this.startDateTime = "NA";
    this.endDateTime = "NA"
  }

  public fetchAllEquipmentAlarmHistoryDetails() {
    this.equipmentAlarmHistoryDetailsService.fetchAllEquipmentAlarmHistoryDetails().subscribe(
      equipmentAlarmList => {
        $('#alarmHistoryId').DataTable().clear().destroy();
        this.alarmHistoryDetailsList = equipmentAlarmList;
        $(function () {
          $("#alarmHistoryId").DataTable();
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
        if (this.alarmHistoryDetailsList == null) {
          alert("Data not found");
        }
      }
    );
  }

  fetchEquipmentDetails() {
    this.masterEquipmentDetailsService.fetchAllEquipmentDetails().subscribe(
      equipmentDetailsList => {
        this.dropDownList = equipmentDetailsList;
        //console.log(this.dropDownList);
      });
  }

  public selectEquipmentNameChangeHandler(value: string) {
    this.equipmentName = value;
  }

  // public selectEquipmentAlarmNameChangeHandler(value:string){
  //   this.equipmentAlarmName=value;
  // }

  public fetchEquipmentAlarmHistoryDetailsByAllFilters() {
    if (this.startDateTime == undefined || this.startDateTime == null) {
      this.startDateTime = "NA"
    }
    if (this.endDateTime == undefined || this.endDateTime == null) {
      this.endDateTime = "NA"
    }
    if (this.equipmentName == undefined || this.equipmentName == null || this.equipmentName.trim() == "") {
      this.equipmentName = "NA"
    }

    this.equipmentAlarmHistoryDetailsService.fetchEquipmentAlarmHistoryDetailsByAllFilters(this.startDateTime, this.endDateTime, this.equipmentName).subscribe(
      equipmentAlarmList => {
        $('#alarmHistoryId').DataTable().clear().destroy();
        this.alarmHistoryDetailsList = equipmentAlarmList;
        //console.log("Equipment alarm list= " + this.alarmHistoryDetailsList);
        $(function () {
          $("#alarmHistoryId").DataTable();
        });
        if (this.alarmHistoryDetailsList == null) {
        
          this.toastr.warning('Data is not available.', '', { timeOut: 5000, });
        }
      }
    )
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

  public generateAlarmExcelReport() {
    if (this.alarmHistoryDetailsList.length === 0) {
      this.toastr.warning('Data is not available.', '', { timeOut: 5000, });
      return;
    }

    var logoBase64Logo = ""
    const headerRowsCount = 6;

    //const title = 'Alarm Details Report';
    const title = 'ALARM DETAILS REPORT' + "    " + formatDate(new Date(), 'dd-MMM-yyyy HH:mm:ss', 'en-US');
    const header = ["Sr.No", "Equipment Name", "Alarm Name", "Alarm Desc",
      "Alarm Occured Date Time", "Alarm Resolved Date Time"]

    // Convert the id to sr.no
    for (let i = 0; i < this.alarmHistoryDetailsList.length; i++) {
      this.alarmHistoryDetailsList[i].wmsEquipmentAlarmHistoryId = (i + 1)
    }

    // Convert the array of objects to array of array because reporing library support array of array or array as input.


    const data = this.alarmHistoryDetailsList.map((obj) =>
      Object.values({
        wmsEquipmentAlarmHistoryId: obj.wmsEquipmentAlarmHistoryId,
        equipmentName: obj.equipmentName,
        equipmentAlarmName: obj.equipmentAlarmName,
        equipmentAlarmDesc: obj.equipmentAlarmDesc,
        equipmentAlarmOccurredDatetime: obj.equipmentAlarmOccurredDatetime,
        equipmentAlarmResolvedDatetime: obj.equipmentAlarmResolvedDatetime,




      }
      )
    );

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Alarm Data');

    // Add new row
    let titleRow = worksheet.addRow([title]);

    // Set font, size and style in title row.
    titleRow.font = { name: 'Calibri', family: 4, size: 22 };
    //titleRow.font = { name: 'Comic Sans MS', family: 4, size: 25, underline: 'double', bold: true };
    // Align the title in the center
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

    //Merge Cells
    worksheet.mergeCells(`A${titleRow.number}:F${titleRow.number}`);

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
        // bgColor: { argb: 'FF0000FF' }
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
    worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

    // Save the file in Excel format
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const todayDate = new Date();
      // console.log(todayDate);



      const fileName = "AlarmReport" + (todayDate.getDate()) + (todayDate.getMonth() + 1) + (todayDate.getFullYear()) + (todayDate.getHours())
        + (todayDate.getMinutes()) + (todayDate.getSeconds());
      fileServer.saveAs(blob, fileName + '.xlsx');
    })


    //Save the file in excel format using buffer
    // workbook.xlsx.writeBuffer().then((data) => {
    //   let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //   fileServer.saveAs(blob, 'CarData.xlsx');
    // });

    // Save the file in CSV format
    // workbook.csv.writeBuffer().then((data) => {
    //   let blob = new Blob([data], { type: 'text/csv' });
    //   fs.saveAs(blob, 'ProductData.csv');
    // })

  }


  header = [["Sr.No", "Equipment Name", "Alarm Name", "Alarm Desc",
    "Alarm Occured Date Time", "Alarm Resolved Date Time"]];



  // createPdf() {

  //   if (this.alarmHistoryDetailsList.length === 0) {
  //     this.toastr.warning('Data is not available.', '', { timeOut: 5000, });
  //     return;
  //   }

  //   // doc = new jsPDF({ orientation: 'landscape', unit: 'px', floatPrecision: 2 });
  //   for (let i = 0; i < this.alarmHistoryDetailsList.length; i++) {
  //     this.alarmHistoryDetailsList[i].wmsEquipmentAlarmHistoryId = (i + 1);
  //   }
  //   const Tabledata = this.alarmHistoryDetailsList.map((obj) =>
  //     Object.values({
  //       wmsEquipmentAlarmHistoryId: obj.wmsEquipmentAlarmHistoryId,
  //       equipmentName: obj.equipmentName,
  //       equipmentAlarmName: obj.equipmentAlarmName,
  //       equipmentAlarmDesc: obj.equipmentAlarmDesc,
  //       equipmentAlarmOccurredDatetime: obj.equipmentAlarmOccurredDatetime,
  //       equipmentAlarmResolvedDatetime: obj.equipmentAlarmResolvedDatetime,

  //     }
  //     )

  //   );

  //   var doc = new jsPDF();

  //   doc.setFontSize(18);
  //   doc.text('ALARM DETAILS REPORT', 11, 8);
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
  //   const fileName = 'AlarmReport_' + todayDate.getDate() + (todayDate.getMonth() + 1) + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + '.pdf';
    
  //   doc.save(fileName + '.pdf');
  
  // }



  createPdf() {
    if (this.alarmHistoryDetailsList.length === 0) {
      this.toastr.warning('Data is not available.', '', { timeOut: 5000 });
      return;
    }
  
    // Assign Serial Number to each entry
    for (let i = 0; i < this.alarmHistoryDetailsList.length; i++) {
      this.alarmHistoryDetailsList[i].wmsEquipmentAlarmHistoryId = (i + 1);
    }
  
    // Prepare Data for Table
    const Tabledata = this.alarmHistoryDetailsList.map((obj) =>
      Object.values({
        wmsEquipmentAlarmHistoryId: obj.wmsEquipmentAlarmHistoryId,
        equipmentName: obj.equipmentName,
        equipmentAlarmName: obj.equipmentAlarmName,
        equipmentAlarmDesc: obj.equipmentAlarmDesc,
        equipmentAlarmOccurredDatetime: obj.equipmentAlarmOccurredDatetime,
        equipmentAlarmResolvedDatetime: obj.equipmentAlarmResolvedDatetime,
      })
    );
  
    // Initialize jsPDF with Landscape Orientation and Larger Page Size
    var doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1000, 700], floatPrecision: 2 });
  
    // Add Title and User Information
    const title = 'ALARM DETAILS REPORT';
    doc.setFontSize(22);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('User: ' + this.authService.currentUserValue.userName, 10, 30);
  
    // Define Table Headers
    const headers = [['Sr.No', 'Equipment Name', 'Alarm Name', 'Alarm Description', 'Occurred Date Time', 'Resolved Date Time']];
  
    // Set Table with AutoTable Plugin
    (doc as any).autoTable({
      head: headers,
      body: Tabledata,
      startY: 50, // Start position for the table
      theme: 'grid',
      headStyles: {
        fillColor: [68, 114, 196], // Header background color
        textColor: [255, 255, 255], // White text
        fontSize: 12,
        halign: 'center',
        valign: 'middle',
      },
      bodyStyles: {
        fontSize: 10,
        halign: 'center',
        valign: 'middle',
      },
      styles: {
        cellPadding: 4,
        lineColor: [0, 0, 0], // Black border lines
        lineWidth: 0.1,
        overflow: 'linebreak', // Handle overflow for long text
        columnWidth: 'wrap', // Set column width dynamically
      },
      columnStyles: {
        1: { cellWidth: 100 }, // Adjust width of specific columns
        2: { cellWidth: 100 },
        3: { cellWidth: 150 },
        4: { cellWidth: 120 },
        5: { cellWidth: 120 },
        6: { cellWidth: 120 },
      },
    });
  
    // Add Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.text('This is a system-generated PDF document.', doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: 'center' });
  
    // Generate File Name with Current Date and Time
    const todayDate = new Date();
    const fileName = 'AlarmReport_' + todayDate.getDate() + (todayDate.getMonth() + 1) + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + '.pdf';
  
    // Save the PDF
    doc.save(fileName);
  }
  
}
