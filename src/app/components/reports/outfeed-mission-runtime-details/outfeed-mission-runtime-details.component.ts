import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Workbook } from 'exceljs';
import { MasterAreaDetailsModel } from 'src/app/models/masterAreaDetails.model';
import { MasterFloorDetailsModel } from 'src/app/models/masterFloorDetails.model';
import { OutfeedMissionRuntimeDetailsModel } from 'src/app/models/outfeedMissionRuntimeDetails.model';
import { MasterAreaDetailsService } from 'src/app/service/masterAreaDetails.service';
import { MasterFloorDetailsService } from 'src/app/service/masterFloorDetails.service';
import { OutfeedMissionRuntimeDetailsService } from 'src/app/service/outfeedMissionRuntimeDetails.service';
import * as  fileServer from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AuthenticationService } from 'src/app/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MasterProductDetailsModel } from 'src/app/models/masterProductDetails.model';
import { MasterProductDetailsService } from 'src/app/service/master-product-details.service';
import { MannualRetrivalOrderModel } from 'src/app/models/mannual-retrival-order.model';
import { MannualRetrivalOrderService } from 'src/app/service/mannual-retrival-order.service';
@Component({
  selector: 'app-outfeed-mission-runtime-details',
  templateUrl: './outfeed-mission-runtime-details.component.html',
  styleUrls: ['./outfeed-mission-runtime-details.component.css']
})
export class OutfeedMissionRuntimeDetailsComponent implements OnInit, OnDestroy {
  outfeedMissionReportDtOptions: DataTables.Settings = {};
  private intervalIds: any[] = [];

  outfeedMissionRuntimeDetailsList: OutfeedMissionRuntimeDetailsModel[] = [];
  masterProductDetailsTableList: MasterProductDetailsModel[] = [];
  //Fetching Floor Name
  floorDropDownList: MasterFloorDetailsModel[] = [];
  selectedFloor!: string;

  //Fetching Floor Name
  areaDropDownList: MasterAreaDetailsModel[] = [];
  selectedArea!: string;

  shiftName!: string;
  productName!: string
  productVariantCode!: string
  batchNumber!: string
  modelNumber!: string
  floorName!: string
  areaName!: string
  selectedOutfeedMissionStatus!: string
  outfeedMissionCdatetimeStart!: string
  outfeedMissionCdatetimeEnd!: string
  toDisplayFilter = false;
  disableSearchButton: boolean = false;
  disableDateTime: boolean = true;
  selectedPalletStatus!: string;
  dispatchOrderNumber!: string;
  selectedDispatchOrderNumber: string = "";
  manunualRetrivalList: MannualRetrivalOrderModel[] = [];
  constructor(private outfeedMissionRuntimeDetailsService: OutfeedMissionRuntimeDetailsService,
    private mannualRetrivalService: MannualRetrivalOrderService,

    private masterFloorDetailsService: MasterFloorDetailsService,

    private masterAreaDetailsService: MasterAreaDetailsService,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private masterProductDetailsService: MasterProductDetailsService,
  ) { }
  ngOnDestroy(): void {

    this.intervalIds.forEach(id => clearInterval(id));
    this.intervalIds = [];
  }

  ngOnInit(): void {
    this.SessionClearMethod();


    this.fetchMasterProductData();
    this.fetchfloorDetails();
    this.fetchAreaDetails();
    this.fetchAllManualDispatchDetailsList();


    this.outfeedMissionReportDtOptions = {
      ajax: () => {
        this.fetchAllOutfeedMissionRuntimeDetails();
      },
      paging: true,
      pageLength: 10
    };


  }

  public SessionClearMethod() {
    const authToken = sessionStorage.getItem('authToken');
    const currentUser = sessionStorage.getItem('currentUser');  // If you store user details
    const userRoles = sessionStorage.getItem('userRoles'); // If you store roles/permissions

    sessionStorage.clear(); // Clear all session storage

    // Restore only authentication-related values to prevent logout
    if (authToken) sessionStorage.setItem('authToken', authToken);
    if (currentUser) sessionStorage.setItem('currentUser', currentUser);
    if (userRoles) sessionStorage.setItem('userRoles', userRoles);

    sessionStorage.setItem('outfeed', 'true'); // Mark dashboard as loaded
  }

  public fetchAllOutfeedMissionRuntimeDetails() {
    this.disableDateTime = true;
    this.disableSearchButton = false;
    this.outfeedMissionRuntimeDetailsService.fetchOutfeedMissionRuntimeDetailsByCurrentDate().subscribe(
      outfeedMissionRuntimeDetailsList => {
        $('#outfeedMissionRuntimeDetailsId').DataTable().clear().destroy();
        this.outfeedMissionRuntimeDetailsList = outfeedMissionRuntimeDetailsList;

        $(function () {
          $("#outfeedMissionRuntimeDetailsId").DataTable();
        });
      }
    )
  }
  public selectProductNameChangeHandler(value: string) {
    this.productName = value;
  }


  public selectPalletStatusChangeHandler(value: string) {
    // console.log("Selected Pallet Status:", value);
    this.selectedPalletStatus = value;
  }



  public fetchOutfeedMissionRuntimeDetailsByAllFilters() {
    this.resetData();
    this.outfeedMissionRuntimeDetailsService.fetchOutfeedMissionRuntimeDetailsByAllFilters(
      this.productName, this.selectedPalletStatus, this.outfeedMissionCdatetimeStart,
      this.outfeedMissionCdatetimeEnd, this.dispatchOrderNumber).subscribe(
        outfeedMissionRuntimeDetailsFilter => {
          $('#outfeedMissionRuntimeDetailsId').DataTable().clear().destroy();

          this.outfeedMissionRuntimeDetailsList = outfeedMissionRuntimeDetailsFilter;

          $(function () {
            $("#outfeedMissionRuntimeDetailsId").DataTable();
          });
        });
  }





  public fetchMasterProductData() {
    this.masterProductDetailsService.fetchAllMasterProductDetails().subscribe(
      productDetailsList => {
        $('#prodId').DataTable().clear().destroy();

        this.masterProductDetailsTableList = productDetailsList;
        // console.log("this.masterProductDetailsTableList" + this.masterProductDetailsTableList)
        // add this code with table id to convert data as Datatable
        $(function () {
          $("#prodId").DataTable();
        });
      }
    );
  }

  public fetchfloorDetails() {
    this.masterFloorDetailsService.fetchAllMasterFloorDetails().subscribe(
      floorList => {
        this.floorDropDownList = floorList;
      });
  }
  public selectFloorChangeHandler(value: string) {
    this.selectedFloor = value;
  }


  public fetchAreaDetails() {
    this.masterAreaDetailsService.fetchAllAreaDetails().subscribe(
      areaList => {
        this.areaDropDownList = areaList;
      });
  }
  public selectAreaChangeHandler(value: string) {
    this.selectedArea = value;
  }

  selectOutfeedMissionStatusChangeHandler(value: string) {
    this.selectedOutfeedMissionStatus = ''
    this.selectedOutfeedMissionStatus = value

  }
  public selectDispatchOrderNumberChangeHandler(value: string) {
    this.dispatchOrderNumber = value;
  }
  public fetchAllManualDispatchDetailsList() {
    this.mannualRetrivalService.fetchAllManualDispatchDetails().subscribe(manualList => {
      this.manunualRetrivalList = manualList;
      console.log("fetchAll...." + JSON.stringify(this.manunualRetrivalList))

    })
  }
  public dateTimeValidation() {

    if (this.outfeedMissionCdatetimeStart != null && (this.outfeedMissionCdatetimeEnd == null || this.outfeedMissionCdatetimeEnd == 'NA')) {
      this.disableDateTime = false;
      this.disableSearchButton = true;
    }

    else if (this.outfeedMissionCdatetimeStart != null && this.outfeedMissionCdatetimeEnd != null && this.outfeedMissionCdatetimeStart <= this.outfeedMissionCdatetimeEnd) {
      this.disableSearchButton = false;
    }

    else if (this.outfeedMissionCdatetimeStart != null && this.outfeedMissionCdatetimeEnd != null && this.outfeedMissionCdatetimeStart < this.outfeedMissionCdatetimeEnd) {
      this.disableSearchButton = false;
    }


    else if (this.outfeedMissionCdatetimeStart == this.outfeedMissionCdatetimeEnd) {
      this.disableSearchButton = false;
    }

    else {
      this.disableSearchButton = true;
    }
  }

  //this.selectedShiftName, this.selectedProductName, this.selectedProductVariantCode, this.batchNumber, this.modelNumber, this.selectedFloor, this.selectedArea, this.selectedOutfeedMissionStatus, this.outfeedMissionCdatetimeStart, this.outfeedMissionCdatetimeEnd

  resetData() {


    // if (this.selectedFloor == undefined || this.selectedFloor == null) {
    //   this.selectedFloor = "NA"
    // }
    // if (this.selectedArea == undefined || this.selectedArea == null) {
    //   this.selectedArea = "NA"
    // }
    if (this.productName == undefined || this.productName == null) {
      this.productName = "NA"
    }
    if (this.selectedPalletStatus == undefined || this.selectedPalletStatus == null) {
      this.selectedPalletStatus = "NA"
    }
    if (this.dispatchOrderNumber == undefined || this.dispatchOrderNumber == null) {
      this.dispatchOrderNumber = "NA"
    }
    if (this.selectedOutfeedMissionStatus == undefined || this.selectedOutfeedMissionStatus == null) {
      this.selectedOutfeedMissionStatus = "NA"
    }
    if (this.outfeedMissionCdatetimeStart == undefined || this.outfeedMissionCdatetimeStart == null) {
      this.outfeedMissionCdatetimeStart = "NA"
    }
    if (this.outfeedMissionCdatetimeEnd == undefined || this.outfeedMissionCdatetimeEnd == null) {
      this.outfeedMissionCdatetimeEnd = "NA"
    }

  }

  generateProductionExcelReport() {

    if (this.outfeedMissionRuntimeDetailsList.length > 0) {

      //  const logoBase64Logo = "";
      const headerRowsCount = 11;


      const title = 'OUTFEED MISSION DETAILS REPORT' + "    " + formatDate(new Date(), 'dd-MMM-yyyy HH:mm:ss', 'en-US');


      const header = ["Sr.No", "Pallet Code", "BP Serial Number", "Part No", "Part Name", "Model", "Quantity", "Pallet Status", "MFG Date", "Position Name",
        "Status", "Dispatch Order Number", "Load Date Time", "Start Date Time", "End Date Time"];


      // Convert the id to sr.no
      for (let i = 0; i < this.outfeedMissionRuntimeDetailsList.length; i++) {
        this.outfeedMissionRuntimeDetailsList[i].outfeedMissionId = (i + 1)
      }

      // Convert the array of objects to array of array because reporing library support array of array or array as input.
      // const data = this.outfeedMissionRuntimeDetailsList.map(obj => Object.values(obj));
      const data = this.outfeedMissionRuntimeDetailsList.map((obj) =>
        Object.values({
          wmsEquipmentAlarmHistoryId: obj.outfeedMissionId,
          palletCode: obj.palletCode,
          serialNumber: obj.serialNumber,
          productVariantCode: obj.productVariantCode,
          productVariantname: obj.productVariantName,
          productName: obj.productName,
          quantity: obj.quantity,
          palletStatus: obj.palletStatusName,
          mfgDate: obj.mfgDate,
          // mfgShift: obj.mfgShift,
          positionName: obj.positionName,
          outfeedMissionStatus: obj.outfeedMissionStatus,
          dispatchOrderNumber: obj.dispatchOrderNumber,
          loadDateTime: obj.loadDateTime,
          outfeedMissionStartDateTime: obj.outfeedMissionStartDateTime,

          outfeedMissionEndDatetime: obj.outfeedMissionEndDateTime

        }
        )
      );


      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('Outfeed Mission Data');

      // Add new row
      let titleRow = worksheet.addRow([title]);

      // Set font, size and style in title row.
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
      // worksheet.spliceColumns(21, 10);
      // worksheet.spliceColumns(20,1);

      // To give the width to the column
      worksheet.getColumn(2).width = 15;
      worksheet.getColumn(3).width = 15;
      worksheet.getColumn(4).width = 20;
      worksheet.getColumn(5).width = 20;
      worksheet.getColumn(6).width = 15;
      worksheet.getColumn(7).width = 15;
      worksheet.getColumn(8).width = 15;
      worksheet.getColumn(9).width = 30;
      worksheet.getColumn(10).width = 30;
      worksheet.getColumn(11).width = 30;
      // worksheet.getColumn(12).width = 15;
      // worksheet.getColumn(13).width = 15;
      // worksheet.getColumn(14).width = 15;
      // worksheet.getColumn(15).width = 15;
      // worksheet.getColumn(16).width = 15;
      // worksheet.getColumn(17).width = 30;
      // worksheet.getColumn(18).width = 30;
      // worksheet.getColumn(19).width = 30;


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

        const fileName = "OutfeedReport_" + (todayDate.getDate()) + (todayDate.getMonth() + 1) + (todayDate.getFullYear()) + (todayDate.getHours())
          + (todayDate.getMinutes()) + (todayDate.getSeconds());

        fileServer.saveAs(blob, fileName + '.xlsx');
      })


    }
    else {
      this.toastr.warning('Data is not available.', '', { timeOut: 5000, });
    }
  }








  createPdf() {
    if (this.outfeedMissionRuntimeDetailsList.length === 0) {
      this.toastr.warning('Data is not available.', '', { timeOut: 5000 });
      return;
    }

    // Assign Serial Number to each entry
    for (let i = 0; i < this.outfeedMissionRuntimeDetailsList.length; i++) {
      this.outfeedMissionRuntimeDetailsList[i].outfeedMissionId = (i + 1);
    }

    // Prepare Data for Table
    const Tabledata = this.outfeedMissionRuntimeDetailsList.map((obj) =>
      Object.values({
        wmsEquipmentAlarmHistoryId: obj.outfeedMissionId,
        palletCode: obj.palletCode,
        serialNumber: obj.serialNumber,
        productVariantCode: obj.productVariantCode,
        productVariantname: obj.productVariantName,
        productName: obj.productName,
        // quantity: obj.quantity,
        palletStatus: obj.palletStatusName,
        dispatchOrdernumber: obj.dispatchOrderNumber,
        mfgDate: obj.mfgDate,

        positionName: obj.positionName,
        // outfeedMissionStatus: obj.outfeedMissionStatus,
        loadDateTime: obj.loadDateTime,
        outfeedMissionStartDateTime: obj.outfeedMissionStartDateTime,
        outfeedMissionEndDatetime: obj.outfeedMissionEndDateTime,
      })
    );

    // Initialize jsPDF with Landscape Orientation and Larger Page Size
    var doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1000, 700], floatPrecision: 2 });

    // Add Title and User Information
    const title = 'OUTFEED MISSION DETAILS REPORT';
    doc.setFontSize(22);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('User: ' + this.authService.currentUserValue.userName, 10, 30);

    // Define Table Headers
    const headers = [['Sr.No', 'Pallet Code', 'BP Serial Number', 'Part No', 'Part Name', 'Product Name', 'Pallet Status Name', 'Dispatch Order Number', 'MFG Date', 'Position Name', 'Load Date Time', 'Start Date Time', 'End Date Time']];

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
        10: { cellWidth: 60 },
        11: { cellWidth: 80 },
        12: { cellWidth: 80 },
        13: { cellWidth: 80 },
      },
    });

    // Add Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.text('This is a system-generated PDF document.', doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: 'center' });

    // Generate File Name with Current Date and Time
    const todayDate = new Date();
    const fileName = 'OutfeedReport_' + todayDate.getDate() + (todayDate.getMonth() + 1) + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + '.pdf';

    // Save the PDF
    doc.save(fileName);
  }

}
