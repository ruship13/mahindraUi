import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Workbook } from 'exceljs';
import { ToastrService } from 'ngx-toastr';
import { LockUnlockDetailModel } from 'src/app/models/lockUnlockDetails.model';
import { LockUnlockCellDetailsService } from 'src/app/service/LockUnlockDetail.service';
import * as  fileServer from 'file-saver';
import jsPDF from 'jspdf';
import { AuthenticationService } from 'src/app/service/auth.service';
import { MasterFloorDetailsService } from 'src/app/service/masterFloorDetails.service';
import { MasterAreaDetailsService } from 'src/app/service/masterAreaDetails.service';
import { MasterPositionDetailsModel } from 'src/app/models/masterpositionDetails.model';
import { MasterFloorDetailsModel } from 'src/app/models/masterFloorDetails.model';
import { MasterAreaDetailsModel } from 'src/app/models/masterAreaDetails.model';
@Component({
  selector: 'app-lock-unlock-cell-details',

  templateUrl: './lock-unlock-cell-details.component.html',
  styleUrl: './lock-unlock-cell-details.component.css'
})
export class LockUnlockCellDetailsComponent implements OnInit,OnDestroy {

lockUnlockReportDtOptions: DataTables.Settings = {};
  lockUnlockDetailsList: MasterPositionDetailsModel[] = [];

  floorDetailsList: MasterFloorDetailsModel[] = [];
  areaDetailsList: MasterAreaDetailsModel[] = [];






  toDisplayFilter = false;
  disableSearchButton: boolean = false;
  disableDateTime: boolean = true;
  areaId!: number;
  floorId!: number;

  constructor(private lockUnlockDetailsService: LockUnlockCellDetailsService,
    private floorDetails: MasterFloorDetailsService,
    private areaDetails: MasterAreaDetailsService,
    private authService:AuthenticationService,
    private toastr:ToastrService

  ) { }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }


  ngOnInit(): void {
    this.fetchAllCurrentDateLockDetails(),

      this.lockUnlockReportDtOptions = {

        ajax: () => {

          this.fetchAllCurrentDateLockDetails();
          this.fetchAreaDetails();
          this.fetchFloorDetails();
        }
      };

  }


  public fetchAllCurrentDateLockDetails() {

    this.lockUnlockDetailsService.fetchAllCurrentDateLockDetails().subscribe(
      masterDetailsList => {
        $('#lockUnlokDetailsId').DataTable().clear().destroy();
        this.lockUnlockDetailsList = masterDetailsList;

        $(function () {
          $("#lockUnlokDetailsId").DataTable();
        });
      }
    )
  }


  public fetchFloorDetails() {
    this.floorDetails.fetchAllMasterFloorDetails().subscribe(floorList => {
      this.floorDetailsList = floorList;
    })
  }



  public fetchAreaDetails() {
    this.areaDetails.fetchAllAreaDetails().subscribe(areaList => {
      this.areaDetailsList = areaList;
    })
  }


  public selectAreaIdChangeHandler(value: number) {
    this.areaId = value;
  }


  public selectFloorIdChangeHandler(value: number) {
    // console.log("Selected Pallet Status:", value);
    this.floorId = value;
  }




  public fetchLockDetailsByAllFilters() {

    this.lockUnlockDetailsService.fetchLockCellDetailsByAllFilters(
      this.areaId, this.floorId,).subscribe(
        lockunlockDetailsFilter => {

          $('#lockUnlokDetailsId').DataTable().clear().destroy();
          $(function () {
            $("#lockUnlokDetailsId").DataTable();
          });

          this.lockUnlockDetailsList = lockunlockDetailsFilter;
         console.log('Area:', this.areaId, 'Floor:', this.floorId);


        });
  }




resetData() {
  this.areaId = 0;
  this.floorId = 0;
  this.fetchAllCurrentDateLockDetails();
}




  generateLockUnlockRunTimeExcelReport() {


    if (this.lockUnlockDetailsList.length > 0) {


      //  const logoBase64Logo = "";
      const headerRowsCount = 11;


      const title = 'LOCK DETAILS REPORT' + "    " + formatDate(new Date(), 'dd-MMM-yyyy HH:mm:ss', 'en-US');


      const header = ["Sr.No", "Position Name", "Position Description", "Area Id","Floor Id", "User Name"];


      // Convert the id to sr.no
      for (let i = 0; i < this.lockUnlockDetailsList.length; i++) {
        this.lockUnlockDetailsList[i].positionId = (i + 1)
      }

      const data = this.lockUnlockDetailsList.map((obj) =>
        Object.values({
          lockUnlockId: obj.positionId,
          positionName: obj.positionName,
          positionDesc: obj.positionDesc,
          areaId: obj.areaId,
       
          floorId: obj.floorId,
          userName: obj.userName,


        }
        )
      );


      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('Lock Unlock Data');

      // Add new row
      let titleRow = worksheet.addRow([title]);

      // Set font, size and style in title row.
      // titleRow.font = { name: 'Calibri', family: 4, size: 22, underline: 'double', bold: true };
      titleRow.font = { name: 'Calibri', family: 4, size: 22 };
      // Align the title in the center
      worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

      //Merge Cells
      worksheet.mergeCells(`A${titleRow.number}:K${titleRow.number}`);
      // worksheet.mergeCells("S1:S3");

      // Blank Row
      worksheet.addRow([]);




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


      // Add all data without formatting
      worksheet.addRows(data);

      // Used to delete the column
      // worksheet.spliceColumns(21, 10);
      // worksheet.spliceColumns(20,1);

      // To give the width to the column
      worksheet.getColumn(2).width = 15;
      worksheet.getColumn(3).width = 15;
      worksheet.getColumn(4).width = 15;
      worksheet.getColumn(5).width = 20;
      worksheet.getColumn(6).width = 20;
      worksheet.getColumn(7).width = 15;
      worksheet.getColumn(8).width = 30;
      worksheet.getColumn(9).width = 34;
      worksheet.getColumn(10).width = 34;
      worksheet.getColumn(11).width = 34;
      worksheet.getColumn(12).width = 25;
      worksheet.getColumn(13).width = 15;
      worksheet.getColumn(14).width = 15;
      worksheet.getColumn(15).width = 15;
      worksheet.getColumn(16).width = 15;
      worksheet.getColumn(17).width = 15;
      worksheet.getColumn(18).width = 30;
      worksheet.getColumn(19).width = 30;
      worksheet.getColumn(20).width = 30;


      // worksheet.addRow([]);

      //Footer Row
      let footerRow = worksheet.addRow(['This is system generated excel sheet.']);
      footerRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F1F5F9' }
      };
      footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      // Align the footer in the center
      worksheet.getCell('A' + (data.length + headerRowsCount + 1)).alignment = { vertical: 'middle', horizontal: 'center' };
      // console.log(data.length + headerRowsCount + 1);

      //Merge Cells
      worksheet.mergeCells(`A${footerRow.number}:K${footerRow.number}`);

      // Save the file in Excel format
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // const fileName="ProdData"+(new Date().getDay())+(new Date().getMonth())+(new Date().getFullYear())+(new Date().getTime())+(new Date().getMinutes())+(new Date().getSeconds());


        const todayDate = new Date();
        // console.log(todayDate);

        const fileName = "LockReport_" + (todayDate.getDate()) + (todayDate.getMonth() + 1) + (todayDate.getFullYear()) + (todayDate.getHours())
          + (todayDate.getMinutes()) + (todayDate.getSeconds());

        fileServer.saveAs(blob, fileName + '.xlsx');
      })



    }
    else {
      alert("Data is not available");
    }
  }


   createPdf() {
    if (this.lockUnlockDetailsList.length === 0) {
      this.toastr.warning('Data is not available for the report.', '', { timeOut: 5000 });
      return;
    }

    // Adding a 'Sr.No' column with numbers
    for (let i = 0; i < this.lockUnlockDetailsList.length; i++) {
      this.lockUnlockDetailsList[i].positionId = (i + 1);
    }

    // Mapping the data to be shown in the table
    const Tabledata = this.lockUnlockDetailsList.map((obj) =>
      Object.values({
      
       lockUnlockId: obj.positionId,
          positionName: obj.positionName,
          positionDesc: obj.positionDesc,
          areaId: obj.areaId,
       
          floorId: obj.floorId,
          userName: obj.userName,
      })
    );

    // Create a new jsPDF instance
    var doc = new jsPDF({
      orientation: 'landscape', 
      unit: 'px', 
      format: 'a4', // Use standard A4 size
      floatPrecision: 2
    });

    // Title
    const title = 'LOCK UNLOCK DETAILS REPORT';
    doc.setFontSize(22);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

    // User info
    doc.setFontSize(12);
    doc.text('User: ' + this.authService.currentUserValue.userName, 10, 50);

    // Table headers
    const headers = ["Sr.No", "Position Name", "Position Description", "Area Id","Floor Id", "User Name"];

    // AutoTable settings
    (doc as any).autoTable({
      head: [headers], // The header of the table
      body: Tabledata, // The body of the table
      startY: 60, // Start position for the table (more space for title and user info)
      theme: 'grid',
      headStyles: {
        fillColor: [68, 114, 196], // Header background color
        textColor: [255, 255, 255], // White text color
        fontSize: 12,
        halign: 'center', // Horizontal alignment for header cells
        valign: 'middle', // Vertical alignment for header cells
      },
      bodyStyles: {
        fontSize: 10,
        halign: 'center', // Horizontal alignment for body cells
        valign: 'middle', // Vertical alignment for body cells
      },
      styles: {
        cellPadding: 6, // Increased padding for better spacing
        lineColor: [0, 0, 0], // Black border lines
        lineWidth: 0.1,
        overflow: 'linebreak', // Handle overflow for long text
      },
      columnStyles: {
        0: { cellWidth: 40 }, // 'Sr.No' column width
        1: { cellWidth: 'auto' }, // 'Position Name' column width, auto for dynamic width
        2: { cellWidth: 'auto' }, // 'Reason' column width, auto for dynamic width
        3: { cellWidth: 'auto' }, // 'Username' column width, auto for dynamic width
        4: { cellWidth: 'auto' }, // 'Description' column width, auto for dynamic width
        5: { cellWidth: 'auto' }, // 'CdateTime' column width, auto for dynamic width
      },
      margin: { top: 60, left: 10, right: 10, bottom: 30 }, // Reduced margins to fit more on the page
      tableWidth: 'wrap', // Table width adjustment
    });

    // Add Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.text('This is a system-generated PDF document.', doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: 'center' });

    // Generate File Name with Current Date and Time
    const todayDate = new Date();
    const fileName = 'LockReport_' + todayDate.getDate() + (todayDate.getMonth() + 1) + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + '.pdf';

    // Save the PDF
    doc.save(fileName);
  }



  
}
