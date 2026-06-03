import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TemperatureAlarmMissionRuntimeDetailsModel } from 'src/app/models/temperatureAlarmMissionRuntimeDetailsModel.model';
import { AuthenticationService } from 'src/app/service/auth.service';
import { TemperatureAlarmMissionRuntimeDetailsService } from 'src/app/service/temperatureAlarmMissionRuntimeDetailsService.service';
import * as  fileServer from 'file-saver';
import jsPDF from 'jspdf';
import { Workbook } from 'exceljs';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-temperature-mission-runtime-details',
  templateUrl: './temperature-mission-runtime-details.component.html',
  styleUrl: './temperature-mission-runtime-details.component.css'
})
export class TemperatureMissionRuntimeDetailsComponent implements OnInit, OnDestroy {

  tempReportDtOptions: DataTables.Settings = {};
  temperatureAlarmMissionDetails: TemperatureAlarmMissionRuntimeDetailsModel[] = [];
  private intervalIds: any[] = [];






  floorName!: string
  selectedArea!: string;

  selectedProductName!: string;
  selectedPalletStatus!: string;
  selectedInfeedMissionStatus!: string

  toDisplayFilter = false;
  disableSearchButton: boolean = false;
  disableDateTime: boolean = true;
  productName!: string;
  palletStatus!: string;
  palletStatusname!: string;
  alarmMissionEndDateTime!: string;
  alarmMissionStartDateTime!: string;
  constructor(private temperatureMissionDetails: TemperatureAlarmMissionRuntimeDetailsService,
    //Fetching floor
    private authService: AuthenticationService,
    private toastr: ToastrService,

  ) { }



  ngOnDestroy(): void {

    this.intervalIds.forEach(id => clearInterval(id));
    this.intervalIds = [];
  }


  ngOnInit(): void {

    this.SessionClearMethod();
    this.fetchAllTemperatureDetails();


    this.tempReportDtOptions = {
      ajax: () => {
        this.fetchAllTemperatureDetails();
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

    sessionStorage.setItem('temperature', 'true'); // Mark dashboard as loaded
  }

  public fetchAllTemperatureDetails() {
    this.disableDateTime = true;
    this.disableSearchButton = false;
    this.temperatureMissionDetails.getAllAlarmMissionByAutoMission().subscribe(
      tempDetailsList => {
        $('#tempAlarmMissionDetailsId').DataTable().clear().destroy();
        this.temperatureAlarmMissionDetails = tempDetailsList;

        $(function () {
          $("#tempAlarmMissionDetailsId").DataTable();
        });
      }
    )
  }




  public fetchLockUnlockDetailsByAllFilters() {
    this.resetData();
    this.temperatureMissionDetails.fetchTemperatureAlarmMissionRuntimeDetailsByAllFiltersByAutoMission(
      this.alarmMissionStartDateTime, this.alarmMissionEndDateTime,).subscribe(
        lockunlockDetailsFilter => {

          $('#tempAlarmMissionDetailsId').DataTable().clear().destroy();
          $(function () {
            $("#tempAlarmMissionDetailsId").DataTable();
          });

          this.temperatureAlarmMissionDetails = lockunlockDetailsFilter;

        });
  }








  public dateTimeValidation() {

    if (this.alarmMissionStartDateTime != null && (this.alarmMissionEndDateTime == null || this.alarmMissionEndDateTime == 'NA')) {
      this.disableDateTime = false;
      this.disableSearchButton = true;
    }

    else if (this.alarmMissionStartDateTime != null && this.alarmMissionEndDateTime != null && this.alarmMissionEndDateTime <= this.alarmMissionEndDateTime) {
      this.disableSearchButton = false;
    }

    else if (this.alarmMissionStartDateTime != null && this.alarmMissionEndDateTime != null && this.alarmMissionStartDateTime < this.alarmMissionEndDateTime) {
      this.disableSearchButton = false;
    }


    else if (this.alarmMissionStartDateTime == this.alarmMissionEndDateTime) {
      this.disableSearchButton = false;
    }

    else {
      this.disableSearchButton = true;
    }
  }




  resetData() {

    if (this.alarmMissionStartDateTime == undefined || this.alarmMissionStartDateTime == null) {
      this.alarmMissionStartDateTime = "NA"
    }
    if (this.alarmMissionEndDateTime == undefined || this.alarmMissionEndDateTime == null) {
      this.alarmMissionEndDateTime = "NA"
    }

  }

  generateLockUnlockRunTimeExcelReport() {


    if (this.temperatureAlarmMissionDetails.length > 0) {


      //  const logoBase64Logo = "";
      const headerRowsCount = 11;


      const title = 'TEMPERATURE MISSION DETAILS REPORT' + "    " + formatDate(new Date(), 'dd-MMM-yyyy HH:mm:ss', 'en-US');


      const header = ["Sr.No", "Pallet Code", "Product Name", "Product Variant Code", "Position Name", "Mission Source", "Alarm Mission StartDateTime", "Alarm Mission EndDateTime", "Username"];


      // Convert the id to sr.no
      for (let i = 0; i < this.temperatureAlarmMissionDetails.length; i++) {
        this.temperatureAlarmMissionDetails[i].temperatureAlarmMissionRuntimeDetailsId = (i + 1)
      }

      const data = this.temperatureAlarmMissionDetails.map((obj) =>
        Object.values({
          temperatureAlarmMissionRuntimeDetailsId: obj.temperatureAlarmMissionRuntimeDetailsId,
          palletCode: obj.palletCode,
          productName: obj.productName,
          productVariantCode: obj.productVariantCode,
          positionName: obj.positionName,
          missionSource: obj.missionSource,
          alarmMissionStartDateTime: obj.alarmMissionStartDateTime,
          alarmMissionEndDateTime: obj.alarmMissionEndDateTime,
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

        const fileName = "TEMPERATUREMISSIONDETAILSReport_" + (todayDate.getDate()) + (todayDate.getMonth() + 1) + (todayDate.getFullYear()) + (todayDate.getHours())
          + (todayDate.getMinutes()) + (todayDate.getSeconds());

        fileServer.saveAs(blob, fileName + '.xlsx');
      })



    }
    else {
      alert("Data is not available");
    }
  }



  createPdf() {

    if (this.temperatureAlarmMissionDetails.length === 0) {
      this.toastr.warning('Data is not available for the report.', '', { timeOut: 5000 });
      return;
    }


    for (let i = 0; i < this.temperatureAlarmMissionDetails.length; i++) {
      this.temperatureAlarmMissionDetails[i].temperatureAlarmMissionRuntimeDetailsId = (i + 1);
    }


    const Tabledata = this.temperatureAlarmMissionDetails.map((obj) =>
      Object.values({
        temperatureAlarmMissionRuntimeDetailsId: obj.temperatureAlarmMissionRuntimeDetailsId,
        palletCode: obj.palletCode,
        productName: obj.productName,
        productVariantCode: obj.productVariantCode,
        positionName: obj.positionName,
        missionSource: obj.missionSource,
        alarmMissionStartDateTime: obj.alarmMissionStartDateTime,
        alarmMissionEndDateTime: obj.alarmMissionEndDateTime,
        userName: obj.userName,
      })
    );



    var doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1000, 700], floatPrecision: 2 });


    const title = 'TEMPERATURE MISSION DETAILS REPORT';
    doc.setFontSize(22);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('User: ' + this.authService.currentUserValue.userName, 10, 30);


    const headers = [['Sr.No', 'Pallet Code', 'Product Name', 'Product Variant Code', 'Position Name', 'Mission Source', 'Alarm Mission StartDateTime', 'Alarm Mission StartDateTime', 'Username']];


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
    const fileName = 'TEMPERATUREMISSIONDETAILSReport_' + todayDate.getDate() + (todayDate.getMonth() + 1) + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + '.pdf';

    // Save the PDF
    doc.save(fileName);
  }

}
