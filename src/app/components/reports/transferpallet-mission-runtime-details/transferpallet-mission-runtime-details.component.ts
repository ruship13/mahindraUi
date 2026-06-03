import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { TransferPalletMissionRuntimeDetailsService } from 'src/app/service/transferPalletMissionRuntimeDetails.service';
import { TransferPalletMissionRuntimeDetailsModel } from 'src/app/models/transferPalletMissionRuntimeDetails.model';
import { Workbook } from 'exceljs';
import * as  fileServer from 'file-saver';

import { AuthenticationService } from 'src/app/service/auth.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transferpallet-mission-runtime-details',

  templateUrl: './transferpallet-mission-runtime-details.component.html',
  styleUrls: ['./transferpallet-mission-runtime-details.component.css']
})
export class TransferpalletMissionRuntimeDetailsComponent implements OnInit,OnDestroy {
  transferPalletDetailsDtOptions: DataTables.Settings = {};
   private intervalIds: any[] = [];

  disableSearchButton: boolean = false;
  disableDateTime: boolean = true;
  transferMissionStartDatetime!: string;
  transferMissionEndDatetime!: string;
  palletCode!: string;
  productVariantCode!: string;
  transferpalletMissionRuntimeDetailsforFetchAllList: TransferPalletMissionRuntimeDetailsModel[] = [];
  transferpalletMissionRuntimeDetailsList: TransferPalletMissionRuntimeDetailsModel[] = [];
  constructor(private transferPalletMissionruntimeDetailsService: TransferPalletMissionRuntimeDetailsService,
    private authService: AuthenticationService,
  private toastr:ToastrService) {

  }
  ngOnDestroy(): void {
    
    this.intervalIds.forEach(id => clearInterval(id));
    this.intervalIds = [];
  }
   ngOnInit(): void {
    this.SessionClearMethod();

    
    this.fetchAllTransferPalletMissionDetails();

    
    this.transferPalletDetailsDtOptions = {
      ajax: () => {
        this.fetchAllTransferPalletMissionruntimeDetailsByCurrentDate();
      },
      paging: true,
      pageLength: 10
    };

   
  }
  public SessionClearMethod() {
    const authToken = sessionStorage.getItem('authToken');
    const currentUser = sessionStorage.getItem('currentUser');  
    const userRoles = sessionStorage.getItem('userRoles'); 

    sessionStorage.clear(); 


    if (authToken) sessionStorage.setItem('authToken', authToken);
    if (currentUser) sessionStorage.setItem('currentUser', currentUser);
    if (userRoles) sessionStorage.setItem('userRoles', userRoles);

    sessionStorage.setItem('transfer', 'true'); 
  }
  public fetchAllTransferPalletMissionDetails() {
    this.transferPalletMissionruntimeDetailsService.fetchAllTransferPalletMissionDetailsDetails().subscribe(manualList => {
      this.transferpalletMissionRuntimeDetailsforFetchAllList = manualList;
      // console.log("fetchAll" + this.transferpalletMissionRuntimeDetailsList)

    })
  }
  public selectPalletCodeChangeHandler(value: string) {
    this.palletCode = value;
  }
  selectProductvariantCodeChangeHandler(value: string) {
    this.productVariantCode = value;
  }
  public fetchAllTransferPalletMissionruntimeDetailsByCurrentDate() {
    this.disableDateTime = true;
    this.disableSearchButton = false;
    this.transferPalletMissionruntimeDetailsService.fetchAllTransferPalletMissionRuntimeDetailsByCdateTime().subscribe(
      transferPalletMissionList => {
        $('#TransferPalletMissionDetailsId').DataTable().clear().destroy();
        this.transferpalletMissionRuntimeDetailsList = transferPalletMissionList;

        $(function () {
          $("#TransferPalletMissionDetailsId").DataTable();
        });
      }
    )
  }
  public dateTimeValidation() {

    if (this.transferMissionStartDatetime != null && (this.transferMissionEndDatetime == null || this.transferMissionEndDatetime == 'NA')) {
      this.disableDateTime = false;
      this.disableSearchButton = true;
    }

    else if (this.transferMissionStartDatetime != null && this.transferMissionEndDatetime != null && this.transferMissionEndDatetime <= this.transferMissionEndDatetime) {
      this.disableSearchButton = false;
    }

    else if (this.transferMissionStartDatetime != null && this.transferMissionEndDatetime != null && this.transferMissionStartDatetime < this.transferMissionEndDatetime) {
      this.disableSearchButton = false;
    }


    else if (this.transferMissionStartDatetime == this.transferMissionEndDatetime) {
      this.disableSearchButton = false;
    }

    else {
      this.disableSearchButton = true;
    }
  }
  resetData() {
    if (this.transferMissionStartDatetime == undefined || this.transferMissionStartDatetime == null) {
      this.transferMissionStartDatetime = "NA"
    }
    if (this.transferMissionEndDatetime == undefined || this.transferMissionEndDatetime == null) {
      this.transferMissionEndDatetime = "NA"
    }
    if (this.palletCode == undefined || this.palletCode == null) {
      this.palletCode = "NA"
    }
    if (this.productVariantCode == undefined || this.productVariantCode == null) {
      this.productVariantCode = "NA"
    }


  }


  public fetchAllDetailsByAllFilters() {
    this.resetData();
    this.transferPalletMissionruntimeDetailsService.fetchTransferPalletMissionRuntimeDetailsByAllFilters(

      this.transferMissionStartDatetime, this.transferMissionEndDatetime, this.palletCode, this.productVariantCode).subscribe(
        transferpalletMissionRuntimeDetailsFilter => {
          // console.log(" this.transferMissionStartDatetime::" + this.transferMissionStartDatetime)
          // console.log(" this.transferMissionEndDatetime::" + this.transferMissionEndDatetime)
          $('#TransferPalletMissionDetailsId').DataTable().clear().destroy();
          $(function () {
            $("#TransferPalletMissionDetailsId").DataTable();
          });
          // console.log("this.infeedMissionRuntimeDetailsList ::" + transferpalletMissionRuntimeDetailsFilter.length)
          this.transferpalletMissionRuntimeDetailsList = transferpalletMissionRuntimeDetailsFilter;

        });
  }

  generateTransferPalletMissionRunTimeExcelReport() {
    if (this.transferpalletMissionRuntimeDetailsList.length === 0) {
      this.toastr.warning('Data is not available.', '', { timeOut: 5000, });
      return;
    }

    if (this.transferpalletMissionRuntimeDetailsList.length > 0) {


      //  const logoBase64Logo = "";
      const headerRowsCount = 10;


      const title = 'TRANSFER PALLET MISSION DETAILS REPORT' + "    " + formatDate(new Date(), 'dd-MMM-yyyy HH:mm:ss', 'en-US');


      const header = ["Sr.No", "Pallet Code", "BP Serial Number",  "Part No","Part Name", "Model","Quantity","MFG Date","PreviousPositionName", "TransferPositionName",
        "Create Date Time", "Start Date Time", "End Date Time"];


      // Convert the id to sr.no
      for (let i = 0; i < this.transferpalletMissionRuntimeDetailsList.length; i++) {
        this.transferpalletMissionRuntimeDetailsList[i].transferPalletMissionRuntimeDetailsId = (i + 1)
      }

      const data = this.transferpalletMissionRuntimeDetailsList.map((obj) =>
        Object.values({
          transferPalletMissionRuntimeDetailsId: obj.transferPalletMissionRuntimeDetailsId,
          palletCode: obj.palletCode,
          serialNumber: obj.serialNumber,

          productVariantCode: obj.productvariantCode,
          productVariantname: obj.productvariantName,
          productName:obj.productName,
          quantity: obj.quantity,
          mfgDate:obj.mfgDate,
          
          previousPositionName: obj.previousPositionName,
          transferPositionName: obj.transferPositionName,

          infeedMissionCdatetime: obj.cdatetime,
          infeedMissionStartDateTime: obj.transferMissionStartDatetime,
          infeedMissionEndDatetime: obj.transferMissionEndDatetime

        }
        )
      );

      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('Transfer pallet Mission Data');

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

      //Add row with current date
      // let subTitleRow = worksheet.addRow(['Date & Time : ' + (new Date().toLocaleString())]);

      // Add Image
      // let logo = workbook.addImage({
      //   base64: logoBase64Logo,
      //   extension: 'png',
      // });
      // worksheet.addImage(logo, 'S1:S3');


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

        const fileName = "TransferPalletMissionDetailReport" + (todayDate.getDate()) + (todayDate.getMonth() + 1) + (todayDate.getFullYear()) + (todayDate.getHours())
          + (todayDate.getMinutes()) + (todayDate.getSeconds());

        fileServer.saveAs(blob, fileName + '.xlsx');
      })



    }
    else {
      this.toastr.warning('Data is not available.', '', { timeOut: 5000, });
    }
  }


  // header = [["Sr.No", "Pallet Code", "Serial Number", "Part No","Part Name", "Model","Quantity","MFG Date","MFG Shift", "PreviousPositionName", "TransferPositionName", "Create Date Time", "Start Date Time", "End Date Time"]];






  createPdf() {
    if (this.transferpalletMissionRuntimeDetailsList.length === 0) {
      this.toastr.warning('Data is not available.', '', { timeOut: 5000 });
      return;
    }
  
    // Assign Serial Number to each entry
    for (let i = 0; i < this.transferpalletMissionRuntimeDetailsList.length; i++) {
      this.transferpalletMissionRuntimeDetailsList[i].transferPalletMissionRuntimeDetailsId = (i + 1);
    }
  
    // Prepare Data for Table
    const Tabledata = this.transferpalletMissionRuntimeDetailsList.map((obj) =>
      Object.values({
        transferPalletMissionRuntimeDetailsId: obj.transferPalletMissionRuntimeDetailsId,
        palletCode: obj.palletCode,
        serialNumber: obj.serialNumber,
        productVariantCode: obj.productvariantCode,
        productVariantName: obj.productvariantName,
        quantity: obj.quantity,
        mfgDate:obj.mfgDate,
        previousPositionName: obj.previousPositionName,
        transferPositionName: obj.transferPositionName,
        infeedMissionCdatetime: obj.cdatetime,
        infeedMissionStartDateTime: obj.transferMissionStartDatetime,
        infeedMissionEndDatetime: obj.transferMissionEndDatetime,
      })
    );
  
    // Initialize jsPDF with Landscape Orientation and Larger Page Size
    var doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1000, 700], floatPrecision: 2 });
  
    // Add Title and User Information
    const title = 'TRANSFER PALLET MISSION DETAILS REPORT';
    doc.setFontSize(22);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('User: ' + this.authService.currentUserValue.userName, 10, 30);
  
    // Define Table Headers
    const headers = [['Sr.No', 'Pallet Code', 'BP Serial Number', 'Part No', 'Part Name', 'Quantity','MFG Date','Previous Position Name', 'Transfer Position Name', 'Create Date Time', 'Start Date Time', 'End Date Time']];
  
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
        4: { cellWidth: 100 }, // Adjust width of specific columns
        5: { cellWidth: 100 },
        6: { cellWidth: 60 },
        7: { cellWidth: 60 },
        8: { cellWidth: 60 },
        9: { cellWidth: 60 },
        10: { cellWidth: 80 },
        11: { cellWidth: 80 },
      },
    });
  
    // Add Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.text('This is a system-generated PDF document.', doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: 'center' });
  
    // Generate File Name with Current Date and Time
    const todayDate = new Date();
    const fileName = 'TransferPalletMissionDetailReport_' + todayDate.getDate() + (todayDate.getMonth() + 1) + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + '.pdf';
  
    // Save the PDF
    doc.save(fileName);
  }
  

}



