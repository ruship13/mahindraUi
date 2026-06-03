import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';


import * as  fileServer from 'file-saver';
import { Workbook } from 'exceljs';
import { inventorySummaryReportService } from 'src/app/service/inventorySummaryReportService.service';
import { inventorySummaryDashboardDetailsModel } from 'src/app/models/inventorySummaryDashboardDetailsModel.model';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AuthenticationService } from 'src/app/service/auth.service';
import { CurrentPalletStockDetailsModel } from 'src/app/models/currentPalletStockDetails.model';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-inventory-summary-report',
  templateUrl: './inventory-summary-report.component.html',
  styleUrls: ['./inventory-summary-report.component.css']
})
export class InventorysummaryReportComponent implements OnInit,OnDestroy {
private intervalIds: any[] = [];
  ageingDetailsList: inventorySummaryDashboardDetailsModel[] = [];
  ageingRangeDetailsList: inventorySummaryDashboardDetailsModel[] = [];
  CurrentPalletStockDetailsEntity:CurrentPalletStockDetailsModel[]=[];
  agingReportDtOptions: DataTables.Settings = {};
  disableSearchButton: boolean = false;
  disableDateTime: boolean = true;
  constructor(private agingReportDetails: inventorySummaryReportService,
    private authService:AuthenticationService,
  private toastr:ToastrService) {

  }
  ngOnDestroy(): void {
  
    this.intervalIds.forEach(id => clearInterval(id));
    this.intervalIds = [];
  }
 ngOnInit(): void {
 
    this.fetchAllAgeingrangeReportDetails();
  
    this.agingReportDtOptions = {
      ajax: () => {
        this.fetchAllAgeingrangeReportDetails();
      },
      paging: true,
      pageLength: 10
    };

    
  }



  public fetchAllAgeingrangeReportDetails() {
    this.disableDateTime = true;
    this.disableSearchButton = false;
    this.agingReportDetails.fetchAllAgeingRangesDetais().subscribe(
      ageingDetailsList => {
        $('#agingDetailsId').DataTable().clear().destroy();
        this.ageingDetailsList = ageingDetailsList;

        $(function () {
          $("#agingDetailsId").DataTable();
        });
      }
    )
  }





  inventorySummaryDashboardDetailsExcelReport() {
    if (this.ageingDetailsList.length > 0) {



      const headerRowsCount = 7;


      const title = 'INVENTORY SUMMARY DASHBOARD DETAILS REPORT' + "    " + formatDate(new Date(), 'dd-MMM-yyyy HH:mm:ss', 'en-US');


      const header = ["Sr.No", "Model", "Part No", "Part Name", "Range 0-3 day's","Range 4-7 day's","Range 8-14 day's","Range 15-30 day's","Range 30+ day's", "Total Quantity"];


      // Convert the id to sr.no
      for (let i = 0; i < this.ageingDetailsList.length; i++) {
        this.ageingDetailsList[i].inventorySummaryDashboardDetailsId = (i + 1)
      }

      const data = this.ageingDetailsList.map((obj) =>
        Object.values({
          inventorySummaryDashboardDetailsId: obj.inventorySummaryDashboardDetailsId,
          productName: obj.productName,
          productvariantCode: obj.productvariantCode,
          productvariantName: obj.productvariantName,
          range0to3: obj.range0to3,
          range4to7: obj.range4to7,
          range8to14: obj.range8to14,
          range15to30: obj.range15to30,
          range30plus: obj.range30plus,
          totalQuantity: obj.totalQuantity,
        
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

        const fileName = "InventorySummeryReport_" + (todayDate.getDate()) + (todayDate.getMonth() + 1) + (todayDate.getFullYear()) + (todayDate.getHours())
          + (todayDate.getMinutes()) + (todayDate.getSeconds());

        fileServer.saveAs(blob, fileName + '.xlsx');
      })



    }
    else {
      alert("Data is not available");
    }
  }




  // header =[[ "Sr.No", "Model", "Part No", "Part Name", "Range 0-3","Range 4-7","Range 8-14","Range 15-30","Range 30+", "Total Quantity"]] ;
    
    

  // createPdf() {

  //   if (this.ageingDetailsList.length === 0) {
  //     alert('Data is not available');
  //     return;
  //   }

  // // doc = new jsPDF({ orientation: 'landscape', unit: 'px', floatPrecision: 2 });
  //   for (let i = 0; i < this.ageingDetailsList.length; i++) {
  //        this.ageingDetailsList[i].inventorySummaryDashboardDetailsId = (i + 1);
  //      }
  //   const Tabledata = this.ageingDetailsList.map((obj) =>
  //   Object.values({
  //     inventorySummaryDashboardDetailsId: obj.inventorySummaryDashboardDetailsId,
  //     productName: obj.productName,
  //     productvariantCode: obj.productvariantCode,
  //     productvariantName: obj.productvariantName,
  //     range0to3: obj.range0to3,
  //     range4to7: obj.range4to7,
  //     range8to14: obj.range8to14,
  //     range15to30: obj.range15to30,
  //     range30plus: obj.range30plus,
  //     totalQuantity: obj.totalQuantity,
        

  //   }
  //   )
   
  // );
  
  //   var doc = new jsPDF();

  //   doc.setFontSize(18);
  //   doc.text('InventorySummery Report', 11, 8);
  //   doc.text('User:', 150,8); doc.text(this.authService.currentUserValue.userName,165,8);
   
  //   doc.setFontSize(12);
  //   doc.setTextColor(100);
  //   doc.setLineWidth(2);
    
  //   doc.text('', 10, 10);
  //      doc.setFont('Italic');
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
  //   const fileName ='InventorySummeryReport_' + todayDate.getDate() + (todayDate.getMonth() + 1) + todayDate.getFullYear() + todayDate.getHours() +  todayDate.getMinutes() +todayDate.getSeconds() +'.pdf';
   
  //  doc.save(fileName+'.pdf');
   
  // }


  createPdf() {
    if (this.ageingDetailsList.length === 0) {
      this.toastr.warning('Data is not available for the report.', '', { timeOut: 5000 });
      return;
    }
  
    // Add Serial Number to each entry
    for (let i = 0; i < this.ageingDetailsList.length; i++) {
      this.ageingDetailsList[i].inventorySummaryDashboardDetailsId = (i + 1);
    }
  
    // Prepare Data for Table
    const Tabledata = this.ageingDetailsList.map((obj) =>
      Object.values({
        inventorySummaryDashboardDetailsId: obj.inventorySummaryDashboardDetailsId,
        productName: obj.productName,
        productvariantCode: obj.productvariantCode,
        productvariantName: obj.productvariantName,
        range0to3: obj.range0to3,
        range4to7: obj.range4to7,
        range8to14: obj.range8to14,
        range15to30: obj.range15to30,
        range30plus: obj.range30plus,
        totalQuantity: obj.totalQuantity,
      })
    );
  
    
    var doc = new jsPDF({ orientation: 'landscape' });
  
    // Add Title
    const title = 'INVENTORY SUMMARY REPORT for ' + formatDate(new Date(), 'dd-MMM-yyyy', 'en-US');
    doc.setFontSize(22);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  
    // Add User Information
    doc.setFontSize(12);
    doc.text('User: ' + this.authService.currentUserValue.userName, 10, 30);
  
   
    const headers = [["Sr.No", "Product Name", "Part No", "Part Name", "Range 0-3 day's", "Range 4-7 day's", "Range 8-14 day's", "Range 15-30 day's", "Range 30+ day's", "Total Quantity"]];
  
    
    (doc as any).autoTable({
      head: headers,
      body: Tabledata,
      startY: 50, 
      theme: 'grid',
      headStyles: {
        fillColor: [68, 114, 196], 
        textColor: [255, 255, 255], 
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
        lineColor: [0, 0, 0], 
        lineWidth: 0.1,
      },
    });
  
    // Add Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    // doc.text('This is a system-generated PDF document.', doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: 'center' });
  
    // Save the PDF
    const todayDate = new Date();
    const fileName = 'InventorySummaryReport_' + todayDate.getDate() + (todayDate.getMonth() + 1) + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + '.pdf';
    doc.save(fileName);
  }
  
}








