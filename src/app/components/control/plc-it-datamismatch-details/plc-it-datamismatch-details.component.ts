import { formatDate } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Workbook } from 'exceljs';
import * as  fileServer from 'file-saver';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CurrentPalletStockDetailsModel } from 'src/app/models/currentPalletStockDetails.model';
import { MasterUserDetailsModel } from 'src/app/models/masterUserDetails.model';
import { PlcItDataMismatchModel } from 'src/app/models/plcItDataMismatchDetails.model';
import { TemperatureAlarmMissionRuntimeDetailsModel } from 'src/app/models/temperatureAlarmMissionRuntimeDetailsModel.model';
import { AuthenticationService } from 'src/app/service/auth.service';
import { CurrentPalletStockDetailsService } from 'src/app/service/currentPalletStockDetails.service';
import { PlcItDataMismatchDetailsService } from 'src/app/service/plcItDataMismatchDetails.service';
import { TemperatureAlarmMissionRuntimeDetailsService } from 'src/app/service/temperatureAlarmMissionRuntimeDetailsService.service';
@Component({
  selector: 'app-plc-it-datamismatch-details',
 
  templateUrl: './plc-it-datamismatch-details.component.html',
  styleUrl: './plc-it-datamismatch-details.component.css'
})
export class PlcItDatamismatchDetailsComponent implements OnInit,OnDestroy {
  private subscription:Subscription=new Subscription();
  plcItDataMismatchReportDtOptions: DataTables.Settings = {};
  disableSearchButton: boolean = false;
  disableDateTime: boolean = true;
  areaName: string = '';
  ItPlcDataMismatchDetails: PlcItDataMismatchModel[] = [];
  missionDetailsList: TemperatureAlarmMissionRuntimeDetailsModel[] = [];
  updateInstance: CurrentPalletStockDetailsModel = new CurrentPalletStockDetailsModel();
 
  responseData: any;
  intervalId: any;
  responseData1: any;

@ViewChild('updatecurrentStockModalForm') updatecurrentStockModalForm!: NgForm;
  dispatchCurrentStockDetailsInstance: CurrentPalletStockDetailsModel = new CurrentPalletStockDetailsModel();
  positionId!: number;
  isValidated!: boolean;
  validationMessage!: string;
  isproductNameValidated!: boolean;
  selectedDataMismatch: any;
  plcItDataMismatchStartCdatetime!: string;
  plcItDataMismatchEndCdatetime!: string;
  currentUser: MasterUserDetailsModel | undefined;
  constructor(private mockDrillMissionService: TemperatureAlarmMissionRuntimeDetailsService,
    private toastr: ToastrService,
    private authService: AuthenticationService,
    private plcItDataMismatchDetails:PlcItDataMismatchDetailsService,
    private currentPalletStockDetailsService:CurrentPalletStockDetailsService
  ) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.fetchAllMismatchDetails();
  }


  public isMonitor(): boolean {
    return this.currentUser?.roleName === 'MONITOR'
  }
  onRowSelect(dataMismatch: any): void {
    this.selectedDataMismatch = dataMismatch;

    // Set the Position ID and Position Name in dispatchCurrentStockDetailsInstance
    this.dispatchCurrentStockDetailsInstance.positionId = dataMismatch.positionId;
    this.dispatchCurrentStockDetailsInstance.positionName = dataMismatch.positionName;
}




  public fetchAllMismatchDetails() {
    this.disableDateTime = true;
    this.disableSearchButton = false;
    this.plcItDataMismatchDetails.fetchPlcItDataMismatchDetails().subscribe(alarmData => {
      $('#dataMismatchDetailsId').DataTable().clear().destroy();
      this.ItPlcDataMismatchDetails = alarmData;
      console.log("Alarm Data :: " + this.ItPlcDataMismatchDetails);
      $(function () {
        $("#dataMismatchDetailsId").DataTable();
      });
    })

  }

  public dateTimeValidation() {

    if (this.plcItDataMismatchStartCdatetime != null && (this.plcItDataMismatchEndCdatetime == null || this.plcItDataMismatchEndCdatetime == 'NA')) {
      this.disableDateTime = false;
      this.disableSearchButton = true;
    }

    else if (this.plcItDataMismatchStartCdatetime != null && this.plcItDataMismatchEndCdatetime != null && this.plcItDataMismatchEndCdatetime <= this.plcItDataMismatchEndCdatetime) {
      this.disableSearchButton = false;
    }

    else if (this.plcItDataMismatchStartCdatetime != null && this.plcItDataMismatchEndCdatetime != null && this.plcItDataMismatchEndCdatetime < this.plcItDataMismatchEndCdatetime) {
      this.disableSearchButton = false;
    }


    else if (this.plcItDataMismatchStartCdatetime == this.plcItDataMismatchEndCdatetime) {
      this.disableSearchButton = false;
    }

    else {
      this.disableSearchButton = true;
    }
  }


  public fetchDataMismatchDetailsByAllFilters() {
    this.resetData();
    this.plcItDataMismatchDetails.fetchDataMismatchDetailsByAllFilters(this.plcItDataMismatchStartCdatetime, this.plcItDataMismatchEndCdatetime).subscribe(
        daataMismatchDetailsFilter => {
          console.log("this.plcItDataMismatchStartCdatetime::" + this.plcItDataMismatchStartCdatetime)
          console.log("this.plcItDataMismatchEndCdatetime::" + this.plcItDataMismatchEndCdatetime)
      
          $('#dataMismatchDetailsId').DataTable().clear().destroy();
          $(function () {
            $("#dataMismatchDetailsId").DataTable();
          });
          console.log("this.ItPlcDataMismatchDetails ::" + this.ItPlcDataMismatchDetails.length)
          this.ItPlcDataMismatchDetails = daataMismatchDetailsFilter;


        });
  }




  resetData() {
    if (this.plcItDataMismatchStartCdatetime == undefined || this.plcItDataMismatchStartCdatetime == null) {
      this.plcItDataMismatchStartCdatetime = "NA"
    }
    if (this.plcItDataMismatchEndCdatetime == undefined || this.plcItDataMismatchEndCdatetime == null) {
      this.plcItDataMismatchEndCdatetime = "NA"
    }

  }

  // public fetchAlarmMissionRuntimeDetailsByAllFilters() {
  //   this.resetData();
  //   this.mockDrillMissionService.fetchAlarmMissionRuntimeDetailsByAllFilters(this.alarmMissionStartDateTime,
  //     this.alarmMissionEndDateTime).subscribe(
  //       alarmMissionRuntimeDetailsFilter => {

  //         $('#mockDrillTestDetailsId').DataTable().clear().destroy();
  //         $(function () {
  //           $("#mockDrillTestDetailsId").DataTable();
  //         });
  //         console.log("this.infeedMissionRuntimeDetailsList ::" + alarmMissionRuntimeDetailsFilter.length)
  //         this.missionDetails = alarmMissionRuntimeDetailsFilter;

  //       });
  // }


  validatePalletCode(dispatchCurrentStockDetailsInstance: CurrentPalletStockDetailsModel) {
    // const palletCode = this.dispatchForm.get('palletCode')?.value;
    const palletCode = dispatchCurrentStockDetailsInstance.palletCode;

    if (!palletCode) {

      // this.messageService.add({ severity: 'error', summary: 'Successful', detail: 'Pallet Code is empty', life: 3000 });
      return;
    }

    this.currentPalletStockDetailsService.validatePalletCode(palletCode).subscribe(
      (response) => {
        console.log("Pallet Code:", palletCode);

        if (response.status === 200) {
          console.log("Validated.....");
          this.isValidated = true;
          this.validationMessage = ""; // Clear validation message if needed

        } else if (response.status === 204) {
          this.isValidated = false;
          this.validationMessage = " Pallet code is duplicate.";
        }
      },
      (error) => {
        this.isValidated = false;
        this.validationMessage = "Position is empty";
        console.error(error);
      }
    );
  }



  validateProductName(dispatchCurrentStockDetailsInstance: CurrentPalletStockDetailsModel) {
    // const palletCode = this.dispatchForm.get('palletCode')?.value;
    const productName = dispatchCurrentStockDetailsInstance.productName;

    if (!productName) {

      // this.messageService.add({ severity: 'error', summary: 'Successful', detail: 'Pallet Code is empty', life: 3000 });
      return;
    }

    this.currentPalletStockDetailsService.validateProductName(productName).subscribe(
      (response) => {
        console.log("Pallet Code:", productName);

        if (response.status === 200) {
          console.log("Validated.....");
          this.isproductNameValidated = true;
          this.validationMessage = ""; // Clear validation message if needed

        } else if (response.status === 204) {
          this.isproductNameValidated = false;
          this.validationMessage = " Product Name Not Found";
        }
      },
      (error) => {
        this.isproductNameValidated = false;
        this.validationMessage = "Position is empty";
        console.error(error);
      }
    );
  }

  checkProductVariantAndQuantity(): boolean {
    // Check if the product variant is 'NA' and the quantity is greater than 0
    if (
      this.dispatchCurrentStockDetailsInstance.productVariantCode === 'NA' &&
      this.dispatchCurrentStockDetailsInstance.quantity > 0
    ) {
      this.validationMessage = 'Quantity must be 0 if the Product Variant is NA';
      return true; // Disable submit button
    }

    // Check if the product variant is not 'NA' and the quantity is 0
    if (
      this.dispatchCurrentStockDetailsInstance.productVariantCode !== 'NA' &&
      this.dispatchCurrentStockDetailsInstance.quantity === 0
    ) {
      this.validationMessage = 'Enter quantity greater than 0';
      return true; // Disable submit button
    }
    // Clear validation message if conditions are met
    this.validationMessage = '';
    return false; // Enable submit button
  }

  onPalletCodeChange() {
    this.isValidated = false;
    this.validationMessage = "Please validate pallet code using the icon.";
  }
  onProductNameChange() {
    this.isproductNameValidated = false;
    this.validationMessage = "Please validate product Name using the icon.";
  }
  updateCurrentStockDetailsByPosition(dispatchCurrentStockDetailsInstance: CurrentPalletStockDetailsModel) {
    console.log('Dispatch Pallet Code:', dispatchCurrentStockDetailsInstance.palletCode);
    console.log('Dispatch Position ID:', dispatchCurrentStockDetailsInstance.positionId);
    console.log('Dispatch Position Name:', dispatchCurrentStockDetailsInstance.positionName);

    // Update the instance with the current data from the form
    this.updateInstance.positionId = dispatchCurrentStockDetailsInstance.positionId;     
    this.updateInstance.positionName = dispatchCurrentStockDetailsInstance.positionName;
    this.updateInstance.palletCode = dispatchCurrentStockDetailsInstance.palletCode;
    this.updateInstance.productVariantCode = dispatchCurrentStockDetailsInstance.productVariantCode;
    this.updateInstance.batchNumber = dispatchCurrentStockDetailsInstance.batchNumber;
    this.updateInstance.quantity = dispatchCurrentStockDetailsInstance.quantity;
    this.updateInstance.productName = dispatchCurrentStockDetailsInstance.productName;
    this.updateInstance.qualityStatus = dispatchCurrentStockDetailsInstance.qualityStatus;
    this.updateInstance.serialNumber = dispatchCurrentStockDetailsInstance.serialNumber;

     this.selectedDataMismatch.positionId = this.positionId;
     console.log('Dispatch Position ID:', this.positionId);
    this.plcItDataMismatchDetails.addOrUpdateMasterPalletInformation(dispatchCurrentStockDetailsInstance).subscribe(
      (currentstockdetails) => {
        // alert("Current Stock Details Updated Successfully");
        if (currentstockdetails.status === 200) {
          this.fetchAllMismatchDetails();
          this.toastr.success(currentstockdetails.message, 'Success', { timeOut: 5000 });

        }
        else if (currentstockdetails.status === 226) {
          this.fetchAllMismatchDetails();
          this.toastr.error(currentstockdetails.message, 'Error', { timeOut: 5000 });
        }
        else if (currentstockdetails.status === 400) {
          this.fetchAllMismatchDetails();
          this.toastr.error(currentstockdetails.message, 'Error', { timeOut: 5000 });
        }
        else if (currentstockdetails.status === 208) {
          this.fetchAllMismatchDetails();
          this.toastr.error(currentstockdetails.message, 'Error', { timeOut: 5000 });
        }
        else if (currentstockdetails.status === 409) {
          this.fetchAllMismatchDetails();
          this.toastr.error(currentstockdetails.message, 'Error', { timeOut: 5000 });
        }
        else if (currentstockdetails.status === 201) {
          this.fetchAllMismatchDetails();
          this.toastr.error(currentstockdetails.message, 'Error', { timeOut: 5000 });
        }
        else {
          this.fetchAllMismatchDetails();
          this.toastr.error(currentstockdetails.message, 'Error', { timeOut: 5000 });
        }

        if (this.updatecurrentStockModalForm) {
          this.updatecurrentStockModalForm.reset();
        }
      
      },
      error => {
        console.error("Error updating Current Stock Details:", error);

      }
    );
  }













  createPdf() {
    if (this.ItPlcDataMismatchDetails.length === 0) {
      this.toastr.warning('Data is not available', 'warning', { timeOut: 10000 });
      return;
    }

    // Assign Serial Number to each entry
    for (let i = 0; i < this.ItPlcDataMismatchDetails.length; i++) {
      this.ItPlcDataMismatchDetails[i].plcItId= (i + 1);
    }

    // Prepare Data for Table
    const Tabledata = this.ItPlcDataMismatchDetails.map((obj) =>
      Object.values({
        plcItId: obj.plcItId,
        palletCode: obj.palletCode,
        positionName: obj.positionName,
        positionId:obj.positionId,
        isDataUpdated: obj.isDataUpdated,
      })
    );

    // Initialize jsPDF with Landscape Orientation and Larger Page Size
    var doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1000, 700], floatPrecision: 2 });

    // Add Title and User Information
    const title = 'Data Mismatch Details REPORT';
    doc.setFontSize(22);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('User: ' + this.authService.currentUserValue.userName, 10, 30);

    // Define Table Headers
    const headers = [['Sr.No', 'Pallet Code','Position Id', 'Position Name','Is Data Updated']];

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
        1: { cellWidth: 70 }, // Adjust width of specific columns
        2: { cellWidth: 60 },
        3: { cellWidth: 100 },
        4: { cellWidth: 100 },
        5: { cellWidth: 100 },
        6: { cellWidth: 60 },
        7: { cellWidth: 60 },
        8: { cellWidth: 60 },
        9: { cellWidth: 80 },
        10: { cellWidth: 100 },
        11: { cellWidth: 100 },
        12: { cellWidth: 100 },
      },
    });

    // Add Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.text('This is a system-generated PDF document.', doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: 'center' });

    // Generate File Name with Current Date and Time
    const todayDate = new Date();
    const fileName = 'DataMismatchDetailsReport_' + todayDate.getDate() + (todayDate.getMonth() + 1) + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + '.pdf';

    // Save the PDF
    doc.save(fileName);
  }




  generateMannualRetrivalExcelReport() {
    if (this.ItPlcDataMismatchDetails.length === 0) {
      this.toastr.warning('Data is not available', 'warning', { timeOut: 10000, });
      return;
    }

    if (this.ItPlcDataMismatchDetails.length > 0) {



      const headerRowsCount = 6;


      const title = 'DATA MISMATCH DETAILS REPORT' + "    " + formatDate(new Date(), 'dd-MMM-yyyy HH:mm:ss', 'en-US');


      const header = ['Sr.No','Pallet Code' ,'Positon Id', 'Positon Name','Is Data Updated'];


      // Convert the id to sr.no
      for (let i = 0; i < this.ItPlcDataMismatchDetails.length; i++) {
        this.ItPlcDataMismatchDetails[i].plcItId = (i + 1)
      }

      const data = this.ItPlcDataMismatchDetails.map((obj) =>
        Object.values({
          plcItId: obj.plcItId,
          palletCode: obj.palletCode,
          positionName: obj.positionName,
          positionId:obj.positionId,
          isDataUpdated: obj.isDataUpdated,
         
        
        }
        )
      );


      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('Data Mismatch Data');

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
          size: 11,
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
        console.log(todayDate);

        const fileName = "DataMismatchDetailsReport_" + (todayDate.getDate()) + (todayDate.getMonth() + 1) + (todayDate.getFullYear()) + (todayDate.getHours())
          + (todayDate.getMinutes()) + (todayDate.getSeconds());

        fileServer.saveAs(blob, fileName + '.xlsx');
      })



    }
    else {
      this.toastr.warning('Data is not available', 'warning', { timeOut: 10000, });
    }
  }
}
