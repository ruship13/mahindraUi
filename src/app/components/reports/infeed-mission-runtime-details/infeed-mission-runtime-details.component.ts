import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Workbook } from 'exceljs';
import { InfeedMissionRuntimeDetailsModel } from 'src/app/models/infeedMissionRuntimeDetails.model';
import { MasterAreaDetailsModel } from 'src/app/models/masterAreaDetails.model';
import { MasterFloorDetailsModel } from 'src/app/models/masterFloorDetails.model';
import { InfeedMissionRuntimeDetailsService } from 'src/app/service/infeedMissionRuntimeDetails.service';
import { MasterAreaDetailsService } from 'src/app/service/masterAreaDetails.service';
import { MasterFloorDetailsService } from 'src/app/service/masterFloorDetails.service';
import * as  fileServer from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AuthenticationService } from 'src/app/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MasterProductDetailsService } from 'src/app/service/master-product-details.service';
import { MasterProductDetailsModel } from 'src/app/models/masterProductDetails.model';

@Component({
  selector: 'app-infeed-mission-runtime-details',
  templateUrl: './infeed-mission-runtime-details.component.html',
  styleUrls: ['./infeed-mission-runtime-details.component.css']
})
export class InfeedMissionRuntimeDetailsComponent implements OnInit,OnDestroy {
  infeedMissionReportDtOptions: DataTables.Settings = {};
  infeedMissionRuntimeDetailsList: InfeedMissionRuntimeDetailsModel[] = [];
  masterProductDetailsTableList: MasterProductDetailsModel[] = [];

 private intervalIds: any[] = [];

  //Fetching Floor Name
  floorDropDownList: MasterFloorDetailsModel[] = [];


  //Fetching Floor Name
  areaDropDownList: MasterAreaDetailsModel[] = [];


  floorName!: string
  selectedArea!: string;

  selectedProductName!: string;
  selectedPalletStatus!: string;
  selectedInfeedMissionStatus!: string
  infeedMissionStartCdatetime!: string
  infeedMissionEndCdatetime!: string
  toDisplayFilter = false;
  disableSearchButton: boolean = false;
  disableDateTime: boolean = true;
  productName!: string;
  palletStatus!: string;
  palletStatusname!: string;
  constructor(private infeedMissionRuntimeDetailsService: InfeedMissionRuntimeDetailsService,
    //Fetching floor
    private masterFloorDetailsService: MasterFloorDetailsService,
    //Fetching area
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


    this.fetchAllInfeedRunTimeReportByCurrentDate();
    this.fetchfloorDetails();
    this.fetchAreaDetails();
    this.fetchMasterProductData();


    this.infeedMissionReportDtOptions = {
      ajax: () => {

        this.fetchAllInfeedRunTimeReportByCurrentDate();
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

    // Restore only authentication-related values to prevent logout
    if (authToken) sessionStorage.setItem('authToken', authToken);
    if (currentUser) sessionStorage.setItem('currentUser', currentUser);
    if (userRoles) sessionStorage.setItem('userRoles', userRoles);

    sessionStorage.setItem('infeed', 'true'); // Mark dashboard as loaded
  }

  public fetchAllInfeedMissionRuntimeDetails() {
    this.disableDateTime = true;
    this.disableSearchButton = false;
    this.infeedMissionRuntimeDetailsService.fetchInfeedMissionRuntimeDetailsByCurrentDate().subscribe(
      infeedMissionRuntimeDetailsList => {
        $('#infeedMissionRuntimeDetailsId').DataTable().clear().destroy();
        this.infeedMissionRuntimeDetailsList = infeedMissionRuntimeDetailsList;

        $(function () {
          $("#infeedMissionRuntimeDetailsId").DataTable();
        });
      }
    )
  }



  fetchAllInfeedRunTimeReportByCurrentDate() {
    this.disableDateTime = true;
    this.disableSearchButton = false;
    this.infeedMissionRuntimeDetailsService.fetchAllInfeedMissionRuntimeDetails().subscribe(
      infeedDetailsList => {
        $('#infeedMissionRuntimeDetailsId').DataTable().clear().destroy();
        // console.log("infeedMissionRuntimeDetailsList ::"+this.infeedMissionRuntimeDetailsList)
        this.infeedMissionRuntimeDetailsList = infeedDetailsList;

        $(function () {
          $("#infeedMissionRuntimeDetailsId").DataTable();
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




  public fetchInfeedMissionRuntimeDetailsByAllFilters() {
    this.resetData();
    this.infeedMissionRuntimeDetailsService.fetchInfeedMissionRuntimeDetailsByAllFilters(

      this.productName, this.selectedPalletStatus, this.infeedMissionStartCdatetime,
      this.infeedMissionEndCdatetime).subscribe(
        infeedMissionRuntimeDetailsFilter => {
          // console.log(" this.infeedMissionCdatetimeStart::" + this.infeedMissionStartCdatetime)
          // console.log(" this.infeedMissionCdatetimeEnd::" + this.infeedMissionEndCdatetime)
          // console.log(" this.productName::" + this.productName);
          // console.log(" this.palletStatusname::" + this.selectedPalletStatus);
          $('#infeedMissionRuntimeDetailsId').DataTable().clear().destroy();
          $(function () {
            $("#infeedMissionRuntimeDetailsId").DataTable();
          });
          // console.log("this.infeedMissionRuntimeDetailsList ::" + infeedMissionRuntimeDetailsFilter.length)
          this.infeedMissionRuntimeDetailsList = infeedMissionRuntimeDetailsFilter;

        });
  }


  public fetchfloorDetails() {
    this.masterFloorDetailsService.fetchAllMasterFloorDetails().subscribe(
      floorList => {
        // console.log("floorDropDownList::" + this.floorDropDownList)
        this.floorDropDownList = floorList;
      });
  }
  public selectFloorChangeHandler(value: string) {
    this.floorName = value;
  }

  public fetchAreaDetails() {
    this.masterAreaDetailsService.fetchAllAreaDetails().subscribe(
      areaList => {
        this.areaDropDownList = areaList;
        // console.log("arealist::" + this.areaDropDownList)

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
  public selectAreaChangeHandler(value: string) {
    // console.log("areaName ::" + this.selectedArea)
    this.selectedArea = value;
  }

  selectInfeedMissionStatusChangeHandler(value: string) {
    this.selectedInfeedMissionStatus = ''
    this.selectedInfeedMissionStatus = value;

  }

  public dateTimeValidation() {

    if (this.infeedMissionStartCdatetime != null && (this.infeedMissionEndCdatetime == null || this.infeedMissionEndCdatetime == 'NA')) {
      this.disableDateTime = false;
      this.disableSearchButton = true;
    }

    else if (this.infeedMissionStartCdatetime != null && this.infeedMissionEndCdatetime != null && this.infeedMissionEndCdatetime <= this.infeedMissionEndCdatetime) {
      this.disableSearchButton = false;
    }

    else if (this.infeedMissionStartCdatetime != null && this.infeedMissionEndCdatetime != null && this.infeedMissionStartCdatetime < this.infeedMissionEndCdatetime) {
      this.disableSearchButton = false;
    }


    else if (this.infeedMissionStartCdatetime == this.infeedMissionEndCdatetime) {
      this.disableSearchButton = false;
    }

    else {
      this.disableSearchButton = true;
    }
  }
  // resetData() {
  //   if (this.floorName == undefined || this.floorName == null) {
  //     this.floorName = "NA"
  //   }
  //   if (this.selectedArea == undefined || this.selectedArea == null) {
  //     this.selectedArea = "NA"
  //   }
  //   if (this.selectedInfeedMissionStatus == undefined || this.selectedInfeedMissionStatus == null) {
  //     this.selectedInfeedMissionStatus = "NA"
  //   }
  //   if (this.infeedMissionStartCdatetime == undefined || this.infeedMissionStartCdatetime == null) {
  //     this.infeedMissionStartCdatetime = "NA"
  //   }
  //   if (this.infeedMissionEndCdatetime == undefined || this.infeedMissionEndCdatetime == null) {
  //     this.infeedMissionEndCdatetime = "NA"
  //   }

  // }



  resetData() {
    if (this.productName == undefined || this.productName == null) {
      this.productName = "NA"
    }
    if (this.selectedPalletStatus == undefined || this.selectedPalletStatus == null) {
      this.selectedPalletStatus = "NA"
    }
    if (this.selectedInfeedMissionStatus == undefined || this.selectedInfeedMissionStatus == null) {
      this.selectedInfeedMissionStatus = "NA"
    }
    if (this.infeedMissionStartCdatetime == undefined || this.infeedMissionStartCdatetime == null) {
      this.infeedMissionStartCdatetime = "NA"
    }
    if (this.infeedMissionEndCdatetime == undefined || this.infeedMissionEndCdatetime == null) {
      this.infeedMissionEndCdatetime = "NA"
    }

  }

  generateInfeedRunTimeExcelReport() {


    if (this.infeedMissionRuntimeDetailsList.length > 0) {


      //  const logoBase64Logo = "";
      const headerRowsCount = 11;


      const title = 'INFEED MISSION DETAILS REPORT' + "    " + formatDate(new Date(), 'dd-MMM-yyyy HH:mm:ss', 'en-US');


      const header = ["Sr.No", "Pallet Code", "BP Serial Number", "Part No ", "Part Name", "Model", "Quantity", "Pallet Status", "Position Name",
        "Status", "MFG Date", "Load Date Time", "Start Date Time", "End Date Time"];


      // Convert the id to sr.no
      for (let i = 0; i < this.infeedMissionRuntimeDetailsList.length; i++) {
        this.infeedMissionRuntimeDetailsList[i].infeedMissionId = (i + 1)
      }

      const data = this.infeedMissionRuntimeDetailsList.map((obj) =>
        Object.values({
          wmsEquipmentAlarmHistoryId: obj.infeedMissionId,
          palletCode: obj.palletCode,
          serialNumber: obj.serialNumber,
          productVariantCode: obj.productVariantCode,
          productVariantname: obj.productVariantName,
          productname: obj.productName,
          quantity: obj.quantity,
          palletStatus: obj.palletStatusName,
         // mfgShift: obj.mfgShift,
          positionName: obj.positionName,
          infeedMissionStatus: obj.infeedMissionStatus,
            mfgDate: obj.mfgDate,
          loadDateTime: obj.loadDateTime,
          infeedMissionStartDateTime: obj.infeedMissionStartDateTime,
          infeedMissionEndDatetime: obj.infeedMissionEndDateTime

        }
        )
      );


      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('Infeed Mission Data');

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

        const fileName = "InfeedReport_" + (todayDate.getDate()) + (todayDate.getMonth() + 1) + (todayDate.getFullYear()) + (todayDate.getHours())
          + (todayDate.getMinutes()) + (todayDate.getSeconds());

        fileServer.saveAs(blob, fileName + '.xlsx');
      })



    }
    else {
      alert("Data is not available");
    }
  }






  // createPdf() {

  //   if (this.infeedMissionRuntimeDetailsList.length === 0) {
  //     alert('Data is not available');
  //     return;
  //   }

  //   // doc = new jsPDF({ orientation: 'landscape', unit: 'px', floatPrecision: 2 });
  //   for (let i = 0; i < this.infeedMissionRuntimeDetailsList.length; i++) {
  //     this.infeedMissionRuntimeDetailsList[i].infeedMissionId = (i + 1);
  //   }
  //   const Tabledata = this.infeedMissionRuntimeDetailsList.map((obj) =>
  //     Object.values({
  //       wmsEquipmentAlarmHistoryId: obj.infeedMissionId,
  //       palletCode: obj.palletCode,
  //       serialNumber: obj.serialNumber,
  //       productVariantCode: obj.productVariantCode,
  //       productVariantname: obj.productVariantName,
  //       productname: obj.productName,
  //       quantity: obj.quantity,
  //       floorName: obj.floorName,
  //       areaName: obj.areaName,
  //       rackName: obj.rackName,
  //       positionName: obj.positionName,
  //       infeedMissionStatus: obj.infeedMissionStatus,
  //       infeedMissionCdatetime: obj.createdDatetime,
  //       infeedMissionStartDateTime: obj.infeedMissionStartDateTime,
  //       infeedMissionEndDatetime: obj.infeedMissionEndDateTime



  //     }
  //     )

  //   );

  //   var doc = new jsPDF();

  //   doc.setFontSize(18);
  //   doc.text('INFEED MISSION DETAILS REPORT', 11, 8);
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
  //   const fileName = 'InfeedReport_' + todayDate.getDate() + (todayDate.getMonth() + 1) + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + '.pdf';

  //   doc.save(fileName + '.pdf');

  // }

  createPdf() {

    if (this.infeedMissionRuntimeDetailsList.length === 0) {
      this.toastr.warning('Data is not available for the report.', '', { timeOut: 5000 });
      return;
    }


    for (let i = 0; i < this.infeedMissionRuntimeDetailsList.length; i++) {
      this.infeedMissionRuntimeDetailsList[i].infeedMissionId = (i + 1);
    }


    const Tabledata = this.infeedMissionRuntimeDetailsList.map((obj) =>
      Object.values({
        wmsEquipmentAlarmHistoryId: obj.infeedMissionId,
        palletCode: obj.palletCode,
        serialNumber: obj.serialNumber,
        productVariantCode: obj.productVariantCode,
        // productVariantname: obj.productVariantName,
        productname: obj.productName,
        quantity: obj.quantity,
        palletStatusName: obj.palletStatusName,
       

        positionName: obj.positionName,
        // infeedMissionStatus: obj.infeedMissionStatus,
         mfgDate: obj.mfgDate,
        loadDateTime: obj.loadDateTime,
        infeedMissionStartDateTime: obj.infeedMissionStartDateTime,
        infeedMissionEndDatetime: obj.infeedMissionEndDateTime,
      })
    );


    var doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1000, 700], floatPrecision: 2 });


    const title = 'INFEED MISSION DETAILS REPORT';
    doc.setFontSize(22);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('User: ' + this.authService.currentUserValue.userName, 10, 30);


    const headers = [['Sr.No', 'Pallet Code', 'BP Serial Number', 'Part No', 'Product Name', 'Quantity', 'Pallet Status',  'Position Name', 'MFG Date','Load Date Time', 'Start Date Time', 'End Date Time']];


    (doc as any).autoTable({
      head: headers,
      body: Tabledata,
      startY: 50, // Start position for the table
      theme: 'grid',
      headStyles: {
        fillColor: [68, 114, 196], // Header background color (same as your second example)
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
        12: { cellWidth: 80 },
      },
    });

    // Add Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.text('This is a system-generated PDF document.', doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: 'center' });

    // Generate File Name with Current Date and Time
    const todayDate = new Date();
    const fileName = 'InfeedReport_' + todayDate.getDate() + (todayDate.getMonth() + 1) + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + '.pdf';

    // Save the PDF
    doc.save(fileName);
  }



}
