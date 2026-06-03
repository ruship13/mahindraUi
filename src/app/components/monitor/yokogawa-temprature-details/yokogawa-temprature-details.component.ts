import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Workbook } from 'exceljs';
import { ChartComponent, ApexNonAxisChartSeries, ApexPlotOptions, ApexChart, ApexDataLabels, ApexFill } from 'ng-apexcharts';
import { YokogawaTemperatureDetailsModel } from 'src/app/models/yokogawaTemperatureDetails.model';
import { YokogawaTemperatureDetailsService } from 'src/app/service/YokogawaTemperatureDetails.service';
import * as  fileServer from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { MasterPositionDetailsService } from 'src/app/service/masterpositionDetails.service';
import { MasterPositionDetailsModel } from 'src/app/models/masterpositionDetails.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as CryptoJS from 'crypto-js';




export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  labels: string[];
};

@Component({
  selector: 'app-yokogawa-temprature-details',
  templateUrl: './yokogawa-temprature-details.component.html',
  styleUrls: ['./yokogawa-temprature-details.component.css']
})
export class YokogawaTempratureDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('minTempChart') minTempChart!: ChartComponent;
  @ViewChild('maxTempChart') maxTempChart!: ChartComponent;
  yokogawaButtonColor: string = 'grey'; // default button color
  yokogawaUrl: string = 'http://10.194.250.53:8080/api/readcalc/';
  public minTempChartOptions: ChartOptions;
  public maxTempChartOptions: ChartOptions;
  private intervalId: any;
  showYokogawaAlert: boolean = false;


  private subscription: Subscription | undefined;

  batteryDtOptions: DataTables.Settings = {}
  alarmData: MasterPositionDetailsModel[] = [];
  yokogawaTempDetailsList: YokogawaTemperatureDetailsModel[] = [];
  yokogawaCurrentTemp: YokogawaTemperatureDetailsModel = new YokogawaTemperatureDetailsModel();


  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  daysInMonth: any[] = [];
  monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years: number[] = [];




  constructor(private yokogawaTempDetailsService: YokogawaTemperatureDetailsService, private toastr: ToastrService, private alarmService: MasterPositionDetailsService, private Http: HttpClient) {
    this.initializeYears();
    this.minTempChartOptions = {
      series: [], // Initialize with an empty array
      chart: {
        height: 350,
        type: 'radialBar',
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '50%'
          },
          dataLabels: {
            name: {
              show: true,
              fontSize: '22px',
              offsetY: -10
            },
            value: {
              show: true,
              fontSize: '25px',
              formatter: (val: number) => `${val}°C`,
              color: '#0e86d4',
              fontWeight: "bold"
            },
            total: {
              show: true,
              label: 'Min Temp.',
              formatter: () => `${this.yokogawaCurrentTemp.minTemp}°C`,
              color: '#0e86d4',
              fontSize: '22px',
            }
          }
        }
      },
      dataLabels: {
        enabled: true,
      },
      fill: {
        type: 'solid',
        colors: ['#20E647']
      },
      labels: ['Temperature'],
    };

    this.maxTempChartOptions = {
      series: [], // Initialize with an empty array
      chart: {
        height: 350,
        type: 'radialBar',
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '50%'
          },
          dataLabels: {
            name: {
              show: true,
              fontSize: '22px',
              offsetY: -10
            },
            value: {
              show: true,
              fontSize: '25px',
              formatter: (val: number) => `${val}°C`,
              color: '#0e86d4',
              fontWeight: "bold"

            },
            total: {
              show: true,
              label: 'Max Temp.',
              formatter: () => `${this.yokogawaCurrentTemp.maxTemp}°C`,
              color: '#0e86d4',
              fontSize: '22px',
            }
          }
        }
      },
      dataLabels: {
        enabled: true,
      },
      fill: {
        type: 'solid',
        colors: ['#FF4560']
      },
      labels: ['Temperature'],
    };
  }

  API_CONFIG = {
    base_url: 'http://10.194.250.53:8080/',
    request_uri: 'api/readcalc/',
    http_verb: 'GET',
    secret_key: 'EDX@Yokogawa4ATS'
  };

  ngOnInit(): void {
    this.SessionClearMethod();
    this.fetchCurrentTempDetails();
    this.fetchAllTemperatureDetail();
    this.fetchAlarmDetails();
    this.checkYokogawaUrl();

    this.intervalId = setInterval(() => {
      this.checkYokogawaUrl();
    }, 300000);//check  in every 5 mins
  }



  ngOnDestroy(): void {
    // 🧹 Clean up the interval when the component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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

    sessionStorage.setItem('yokogwa-temp', 'true'); // Mark dashboard as loaded
  }
  fetchAlarmDetails(): void {
    this.alarmService.fetchAlarmDetails().subscribe(
      data => {
        this.alarmData = data;
        console.log(data);
      },
      error => {
        console.log('Error fetching dispatch status details:', error);
      }
    );
  }

  // initializeYears() {
  //   const startYear = 2024; // Start from 2024
  //   const endYear = this.currentYear + 10; // End 10 years in the future
  //   for (let year = startYear; year <= endYear; year++) {
  //     this.years.push(year);
  //   }
  // }
  initializeYears() {
    const startYear = 2024; // Always start from 2024
    const endYear = new Date().getFullYear(); // End at the current year
    this.years = []; // Clear the years array before adding new years
    for (let year = startYear; year <= endYear; year++) {
      this.years.push(year);
    }
  }



  onYearChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.currentYear = +target.value;
    this.generateCalendar(this.yokogawaTempDetailsList);
  }

  generateCalendar(tempDetailsList: YokogawaTemperatureDetailsModel[]) {
    const daysInCurrentMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.daysInMonth = [];

    // Filter data for the current month and year
    const filteredTempDetails = tempDetailsList.filter(detail => {
      const detailDate = new Date(detail.createdDateTime);
      return detailDate.getFullYear() === this.currentYear && detailDate.getMonth() === this.currentMonth;
    });

    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const tempData = filteredTempDetails.find(d => new Date(d.createdDateTime).getDate() === i);
      this.daysInMonth.push({
        date: i,
        minTemp: tempData ? tempData.minTemp : null,
        maxTemp: tempData ? tempData.maxTemp : null
      });
    }
  }

  goToPreviousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar(this.yokogawaTempDetailsList);
  }

  goToNextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar(this.yokogawaTempDetailsList);
  }

  onMonthChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.currentMonth = +target.value;
    this.generateCalendar(this.yokogawaTempDetailsList);
  }

  public fetchAllTemperatureDetail() {
    this.yokogawaTempDetailsService.fetchAllTemperatureDetails().subscribe(tempList => {
      this.yokogawaTempDetailsList = tempList;
      // console.log(this.yokogawaTempDetailsList);
      this.generateCalendar(this.yokogawaTempDetailsList); // Generate calendar after fetching data
    });
  }

  // public fetchCurrentTempDetails() {
  //   this.yokogawaTempDetailsService.fetchCurrentDateTemperature().subscribe(currentTemp => {
  //     this.yokogawaCurrentTemp = currentTemp;
  //     console.log(this.yokogawaCurrentTemp);

  //     // Update chart options with fetched data
  //     this.minTempChartOptions.series = [this.yokogawaCurrentTemp.minTemp];
  //     this.maxTempChartOptions.series = [this.yokogawaCurrentTemp.maxTemp];

  //     console.log("**----***");
  //     console.log(this.minTempChartOptions.series = [this.yokogawaCurrentTemp.minTemp])
  //   });
  // }

  public fetchCurrentTempDetails() {
    this.yokogawaTempDetailsService.fetchCurrentDateTemperature().subscribe(currentTemp => {
      this.yokogawaCurrentTemp = currentTemp;
      // console.log(this.yokogawaCurrentTemp);

      // Update chart options with fetched data
      this.minTempChartOptions.series = [this.yokogawaCurrentTemp.minTemp];
      this.maxTempChartOptions.series = [this.yokogawaCurrentTemp.maxTemp];

      // Get the color classes for min and max temps
      const minTempClass = this.getMinTempClass(this.yokogawaCurrentTemp.minTemp);
      const maxTempClass = this.getMaxTempClass(this.yokogawaCurrentTemp.maxTemp);

      // Map the classes to actual color values
      const minTempFillColor = this.mapTempClassToColor(minTempClass);
      const maxTempFillColor = this.mapTempClassToColor(maxTempClass);

      // Update the chart colors dynamically
      this.minTempChartOptions.fill.colors = [minTempFillColor];
      this.maxTempChartOptions.fill.colors = [maxTempFillColor];

      // Force Angular to update the chart with new options (in case they are not updated automatically)
      this.minTempChart.updateOptions(this.minTempChartOptions);
      this.maxTempChart.updateOptions(this.maxTempChartOptions);
    });
  }

  mapTempClassToColor(tempClass: string): string {
    switch (tempClass) {
      case 'min-temp-green':
      case 'max-temp-green':
        return '#19be1e';  // Green color
      case 'min-temp-yellow':
      case 'max-temp-yellow':
        return '#FFEA00';  // Yellow color
      case 'min-temp-red':
      case 'max-temp-red':
        return '#FF4560';  // Red color
      default:
        return '#0e86d4';  // Default color
    }
  }


  getMinTempClass(minTemp: number): string {
    if (minTemp >= 0 && minTemp <= 54) {
      return 'min-temp-green';
    } else if (minTemp >= 55 && minTemp <= 62) {
      return 'min-temp-yellow';
    } else if (minTemp > 62) {
      return 'min-temp-red';
    }
    return ''; // Default class if no match
  }

  getMaxTempClass(maxTemp: number): string {
    if (maxTemp >= 0 && maxTemp <= 54) {
      return 'max-temp-green';
    } else if (maxTemp >= 55 && maxTemp <= 62) {
      return 'max-temp-yellow';
    } else if (maxTemp > 62) {
      return 'max-temp-red';
    }
    return '';
  }

checkYokogawaUrl(): void {
 
  this.yokogawaTempDetailsService.createYokogawaTemperatureDetails()
    .subscribe({
      next: (res) => {
        console.log('Yokogawa API response:', res);

        if (res === 'CONNECTED') {
          this.yokogawaButtonColor = 'green';
          this.showYokogawaAlert = false;
        } else {
          this.yokogawaButtonColor = 'red';
          this.showYokogawaAlert = true;
        }
      },
      error: (err) => {
        console.error('Connection error:', err);
        this.yokogawaButtonColor = 'red';
        this.showYokogawaAlert = true;
      }
    });

}

  // checkYokogawaUrl() {
  //   try {
  //     const message = this.API_CONFIG.http_verb + this.API_CONFIG.request_uri;
  //     const hmacSignature = CryptoJS.HmacSHA256(message, this.API_CONFIG.secret_key).toString(CryptoJS.enc.Hex);

  //     const headers = new HttpHeaders({
  //       'Authorization': hmacSignature,
  //       'Timestamp': Math.floor(Date.now() / 1000).toString()
  //     });

  //     const fullUrl = this.API_CONFIG.base_url + this.API_CONFIG.request_uri;

  //     this.Http.get(fullUrl, { headers, responseType: 'json' }).subscribe(
  //       (data) => {
  //         console.log('Yokogawa response:', data);
  //         this.yokogawaButtonColor = 'green';
  //         this.showYokogawaAlert = false; // hide popup if previously shown
  //       },
  //       (error) => {
  //         console.error('Yokogawa API error:', error);
  //         this.yokogawaButtonColor = 'red';
  //         this.showYokogawaAlert = true; // show popup on error
  //       }
  //     );
  //   } catch (e) {
  //     console.error('Error generating HMAC or request:', e);
  //     this.yokogawaButtonColor = 'red';
  //     this.showYokogawaAlert = true; // show popup on exception
  //   }
  // }



  generateTemperatureDetailsExcelReport() {
    if (this.daysInMonth.length > 0) {
      const headerRowsCount = 4;
      const title = 'YOKOGAWA TEMPERATURE DETAILS REPORT ' + ' ' + formatDate(new Date(), 'dd-MMM-yyyy', 'en-US');
      const header = ["Sr.No", "Date", "Min Temperature", "Max Temperature"];

      // Convert the daysInMonth to the format required for Excel with formatted date
      const data = this.daysInMonth.map((day, index) => [
        index + 1, // Sr.No
        formatDate(new Date(this.currentYear, this.currentMonth, day.date), 'dd-MMM-yyyy', 'en-US'), // Formatted Date
        day.minTemp !== null ? day.minTemp : 'No Data', // Min Temp
        day.maxTemp !== null ? day.maxTemp : 'No Data', // Max Temp
      ]);


      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('Yokogawa Temperature Data');

      // Add Title Row
      let titleRow = worksheet.addRow([title]);
      titleRow.font = { name: 'Calibri', family: 4, size: 22 };
      worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.mergeCells(`A${titleRow.number}:D${titleRow.number}`);

      // Blank Row
      worksheet.addRow([]);

      // Add Header Row
      let headerRow = worksheet.addRow(header);
      headerRow.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4472C4' },
        };
        cell.font = {
          color: { argb: 'FFFFFF' },
          size: 12,
          bold: true,
        };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      // Add data to worksheet
      worksheet.addRows(data);

      // Adjust column widths
      worksheet.getColumn(2).width = 25; // Adjusted width for full date
      worksheet.getColumn(3).width = 20;
      worksheet.getColumn(4).width = 20;

      // Footer Row
      let footerRow = worksheet.addRow(['This is a system-generated excel sheet.']);
      footerRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F1F5F9' },
      };
      footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell('A' + (data.length + headerRowsCount + 1)).alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.mergeCells(`A${footerRow.number}:D${footerRow.number}`);

      // Save the file in Excel format
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const todayDate = new Date();
        const fileName = "YokogawaTemperatureDetailsReport_" + (todayDate.getDate()) + (todayDate.getMonth() + 1) + (todayDate.getFullYear()) + (todayDate.getHours()) + (todayDate.getMinutes()) + (todayDate.getSeconds());
        fileServer.saveAs(blob, fileName + '.xlsx');
      });
    } else {
      this.toastr.warning('Data is not available for the selected month.', '', { timeOut: 5000 });
    }
  }






  createPdf() {
    if (this.daysInMonth.length === 0) {
      this.toastr.warning('Data is not available for the selected month.', '', { timeOut: 5000 });
      return;
    }

    // Prepare Data with formatted date
    const Tabledata = this.daysInMonth.map((day, index) => [
      index + 1, // Sr.No
      formatDate(new Date(this.currentYear, this.currentMonth, day.date), 'dd-MMM-yyyy', 'en-US'), // Formatted Date
      day.minTemp !== null ? day.minTemp : 'No Data', // Min Temp
      day.maxTemp !== null ? day.maxTemp : 'No Data', // Max Temp
    ]);


    // Initialize jsPDF document in landscape orientation
    var doc = new jsPDF({ orientation: 'landscape' });

    // Add Title
    const title = 'YOKOGAWA TEMPERATURE DETAILS REPORT for ' + ' ' + formatDate(new Date(), 'dd-MMM-yyyy', 'en-US');

    doc.setFontSize(22);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    // Add Header
    const headers = [["Sr.No", "Date", "Min Temperature", "Max Temperature"]];

    // AutoTable for Data
    (doc as any).autoTable({
      head: headers,
      body: Tabledata,
      startY: 50, // Position to start the table
      theme: 'grid',
      headStyles: {
        fillColor: [68, 114, 196], // Header background color (same as Excel)
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
    const fileName = 'YokogawaTemperatureDetailsReport_' + todayDate.getDate() + (todayDate.getMonth() + 1) + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + '.pdf';
    doc.save(fileName);
  }






}
function interval(arg0: number) {
  throw new Error('Function not implemented.');
}

