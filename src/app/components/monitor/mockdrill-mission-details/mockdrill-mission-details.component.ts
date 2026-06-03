import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Workbook } from 'exceljs';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { TemperatureAlarmMissionRuntimeDetailsModel } from 'src/app/models/temperatureAlarmMissionRuntimeDetailsModel.model';
import { AuthenticationService } from 'src/app/service/auth.service';
import { TemperatureAlarmMissionRuntimeDetailsService } from 'src/app/service/temperatureAlarmMissionRuntimeDetailsService.service';
import * as  fileServer from 'file-saver';
import { HttpResponse } from '@angular/common/http';
import { MasterUserDetailsModel } from 'src/app/models/masterUserDetails.model';
@Component({
  selector: 'app-mockdrill-mission-details',

  templateUrl: './mockdrill-mission-details.component.html',
  styleUrl: './mockdrill-mission-details.component.css'
})
export class MockdrillMissionDetailsComponent implements OnInit {
  mockDrillTestReportDtOptions: DataTables.Settings = {};
  disableSearchButton: boolean = false;
  disableDateTime: boolean = true;
  areaName: string = '';
  missionDetails: TemperatureAlarmMissionRuntimeDetailsModel[] = [];
  missionDetailsList: TemperatureAlarmMissionRuntimeDetailsModel[] = [];
  alarmMissionStartDateTime!: string;
  alarmMissionEndDateTime!: string;
  responseData: any;
  intervalId: any;
  responseData1: any;
  intervalIds: any[] = []; // Store all interval IDs
  currentUser: MasterUserDetailsModel | undefined;
  constructor(private mockDrillMissionService: TemperatureAlarmMissionRuntimeDetailsService,
    private toastr: ToastrService,
    private authService: AuthenticationService
  ) { }
  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.fetchAllAlarmDetails();
    // this.intervalIds.push(setInterval(() => {
    //   this.getAlarmForArea1();
    //   this.getAlarmForArea2();
    // }, 120000));


  }


  public isMonitor(): boolean {
    return this.currentUser?.roleName === 'MONITOR'
  }

  onAddMockDrillMission(areaName: string): void {
    console.log('Area Name:', areaName);
    this.mockDrillMissionService.addMockDrillMissionDetails(areaName).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.toastr.success('Mission added successfully.', '', { timeOut: 5000 })
          $('#confirmationModel').modal('hide');
        }
        else if (response.status === 226) {
          this.toastr.error('Empty Pallet Not Found.', '', { timeOut: 5000 })

        } else if (response.status === 208) {
          this.toastr.error('Area 1 Dump tank is not empty', '', { timeOut: 5000 })

        } else if (response.status === 201) {
          this.toastr.error('Area 2 Dump tank is not empty.', '', { timeOut: 5000 })

        }


      },
      (error) => {
        console.error(`${areaName} - Error adding mission details:`, error);
      }
    );
  }


  onAddMockDrillMissionForArea2(areaName: string): void {
    console.log('Area Name:', areaName);
    this.mockDrillMissionService.addMockDrillMissionDetails(areaName).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.toastr.success('Mission added successfully.', '', { timeOut: 5000 })
          $('#confirmationModel1').modal('hide');
        }
        else if (response.status === 226) {
          this.toastr.error('Empty Pallet Not Found.', '', { timeOut: 5000 })

        } else if (response.status === 208) {
          this.toastr.error('Area 1 Dump tank is not empty', '', { timeOut: 5000 })

        } else if (response.status === 201) {
          this.toastr.error('Area 2 Dump tank is not empty.', '', { timeOut: 5000 })

        }


      },
      (error) => {
        console.error(`${areaName} - Error adding mission details:`, error);
      }
    );
  }



  public fetchAllAlarmDetails() {
    this.disableDateTime = true;
    this.disableSearchButton = false;
    this.mockDrillMissionService.fetchAllAlarmMissionList().subscribe(alarmData => {
      $('#mockDrillTestDetailsId').DataTable().clear().destroy();
      this.missionDetails = alarmData;
      console.log("Alarm Data :: " + this.missionDetails);
      $(function () {
        $("#mockDrillTestDetailsId").DataTable();
      });
    })

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

  public fetchAlarmMissionRuntimeDetailsByAllFilters() {
    this.resetData();
    this.mockDrillMissionService.fetchAlarmMissionRuntimeDetailsByAllFilters(this.alarmMissionStartDateTime,
      this.alarmMissionEndDateTime).subscribe(
        alarmMissionRuntimeDetailsFilter => {

          $('#mockDrillTestDetailsId').DataTable().clear().destroy();
          $(function () {
            $("#mockDrillTestDetailsId").DataTable();
          });
          console.log("this.infeedMissionRuntimeDetailsList ::" + alarmMissionRuntimeDetailsFilter.length)
          this.missionDetails = alarmMissionRuntimeDetailsFilter;

        });
  }


  fetchAllAlarmMissionRunTimeReportByCurrentDate() {
    this.disableDateTime = true;
    this.disableSearchButton = false;
    this.mockDrillMissionService.fetchAllAlarmMissionRuntimeDetails().subscribe(
      alarmDetailsList => {
        $('#mockDrillTestDetailsId').DataTable().clear().destroy();

        this.missionDetails = alarmDetailsList;

        $(function () {
          $("#mockDrillTestDetailsId").DataTable();
        });
      }

    )
  }


  getAlarmForArea1(): void {
    console.log("Fetching alarm...");
    this.mockDrillMissionService.getAlarmForArea1().subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.responseData = response.body;
          const message = this.responseData.message;
          console.log('Response from backend**********:', message);

          $('#confirmationModel').modal('show');

        }
        else if (response.status === 208) {
          $('#confirmationModel').modal('hide');
        }
      },
      error => {
        $('#confirmationModel').modal('hide');
        console.error('Error fetching empty position alarm:', error);
      }
    );
  }


  getAlarmForArea2(): void {
    console.log("Fetching alarm...");
    this.mockDrillMissionService.getAlarmForArea2().subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.responseData1 = response.body;
          const message = this.responseData1.message;
          console.log('Response from backend**********:', message);

          $('#confirmationModel1').modal('show');

        }
        else if (response.status === 208) {
          $('#confirmationModel1').modal('hide');
        }
      },
      error => {
        $('#confirmationModel1').modal('hide');
        console.error('Error fetching empty position alarm:', error);
      }
    );
  }

  createPdf() {
    if (this.missionDetails.length === 0) {
      this.toastr.warning('Data is not available', 'warning', { timeOut: 10000 });
      return;
    }

    // Assign Serial Number to each entry
    for (let i = 0; i < this.missionDetails.length; i++) {
      this.missionDetails[i].temperatureAlarmId = (i + 1);
    }

    // Prepare Data for Table
    const Tabledata = this.missionDetails.map((obj) =>
      Object.values({
        temperatureAlarmId: obj.temperatureAlarmId,
        yokogawaAlarmCellNo: obj.yokogawaAlarmCellNo,
        areaName: obj.areaName,
        floorName: obj.floorName,
        rackName: obj.rackName,
        userName: obj.userName,
        missionSource: obj.missionSource,
        currentDateTime: obj.currentDateTime,
        alarmOcurredTime: obj.alarmOcurredTime,
        alarmResolvedTime: obj.alarmResolvedTime,
        alarmMissionStartDateTime: obj.alarmMissionStartDateTime,
        alarmMissionEndDateTime: obj.alarmMissionEndDateTime,
      })
    );

    // Initialize jsPDF with Landscape Orientation and Larger Page Size
    var doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1000, 700], floatPrecision: 2 });

    // Add Title and User Information
    const title = 'Dump Tank Mockdrill Test REPORT';
    doc.setFontSize(22);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('User: ' + this.authService.currentUserValue.userName, 10, 30);

    // Define Table Headers
    const headers = [['Sr.No', 'Yokkogawa Alarm Cell No', 'Area Name', 'Floor Name', 'Rack Name', 'User Name', 'Mission Source', 'CDateTime', 'Alarm Ocurred Time', 'Alarm Resolved Time', 'Alarm Mission StartDateTime', 'Alarm Mission EndDateTime']];

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
    const fileName = 'DumpTankMockdrillTestReport_' + todayDate.getDate() + (todayDate.getMonth() + 1) + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + '.pdf';

    // Save the PDF
    doc.save(fileName);
  }




  mockDrillMissionDetailsExcelReport() {
    if (this.missionDetails.length === 0) {
      this.toastr.warning('Data is not available', 'warning', { timeOut: 10000, });
      return;
    }

    if (this.missionDetails.length > 0) {



      const headerRowsCount = 6;


      const title = 'DUMPTANK MOCK DRILL MISSION DETAILS REPORT' + "    " + formatDate(new Date(), 'dd-MMM-yyyy HH:mm:ss', 'en-US');


      const header = ['Sr.No', 'Yokkogawa Alarm Cell No', 'Area Name', 'Floor Name', 'Rack Name', 'User Name', 'Mission Source', 'CDateTime', 'Alarm Ocurred Time', 'Alarm Resolved Time', 'Alarm Mission StartDateTime', 'Alarm Mission EndDateTime'];


      // Convert the id to sr.no
      for (let i = 0; i < this.missionDetails.length; i++) {
        this.missionDetails[i].temperatureAlarmId = (i + 1)
      }

      const data = this.missionDetails.map((obj) =>
        Object.values({
          temperatureAlarmId: obj.temperatureAlarmId,
          yokogawaAlarmCellNo: obj.yokogawaAlarmCellNo,
          areaName: obj.areaName,
          floorName: obj.floorName,
          rackName: obj.rackName,
          userName: obj.userName,
          missionSource: obj.missionSource,
          currentDateTime: obj.currentDateTime,
          alarmOcurredTime: obj.alarmOcurredTime,
          alarmResolvedTime: obj.alarmResolvedTime,
          alarmMissionStartDateTime: obj.alarmMissionStartDateTime,
          alarmMissionEndDateTime: obj.alarmMissionEndDateTime,
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

        const fileName = "DumpTankMockdrillTestReport_" + (todayDate.getDate()) + (todayDate.getMonth() + 1) + (todayDate.getFullYear()) + (todayDate.getHours())
          + (todayDate.getMinutes()) + (todayDate.getSeconds());

        fileServer.saveAs(blob, fileName + '.xlsx');
      })



    }
    else {
      this.toastr.warning('Data is not available', 'warning', { timeOut: 10000, });
    }
  }

}
