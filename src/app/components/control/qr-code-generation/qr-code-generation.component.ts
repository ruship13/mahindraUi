// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { error } from 'jquery';
// import { QRCodeDetailsModel } from 'src/app/models/qrCodeDetails.model';
// import { QRCodeDetailsService } from 'src/app/service/qrCodeDetails.service';

// @Component({
//   selector: 'app-qr-code-generation',
//   templateUrl: './qr-code-generation.component.html',
//   styleUrls: ['./qr-code-generation.component.css']
// })
// export class QrCodeGenerationComponent implements OnInit {
//   qrForm!:FormGroup;
//   qrCodeData: string = '';
//   materialCode: string = '';
//   materialDescription: string = '';
//   quantity: number |null=null;
//   materialInspectionStatus: string = '';
//   mfgDate: string = '';
//   expiryDate: string = '';
//   batchNumber: string = '';
//   input1: string = '';
//   input2: string = '';
//   input3: string = '';
//   input4: string = '';
//   input5: string = '';
//   isQRCodeGenerated :number = 0;
  


  
//   constructor(private qrSerice: QRCodeDetailsService) { 
    
  
//   }

//   ngOnInit(): void {
   
//   }
//   // onEnterPress(event: any) {
//   //   if (event.key === 'Enter') {
//   //     const values = this.qrCodeData.split(',');
//   //     console.log('materialBarcode ::' + this.qrCodeData);
//   //     if (values.length >= 0) {
//   //       this.materialCode = values[0];
//   //       if (/^[a-zA-Z0-9]+$/.test(this.materialCode)) {
//   //       this.materialCodeError = false;
//   //       } else {
//   //         this.materialCodeError = true;
//   //         this.materialCode = '';
//   //       }
        

//   //       this.materialDescription = values[1];
//   //       this.quantity = parseInt(values[2], 10);
//   //       this.materialInspectionStatus = values[3];
//   //       this.mfgDate = values[4];
//   //       this.expiryDate = values[5];
//   //       this.batchNumber = values[6];
//   //     }
//   //   }
//   // }
//   onEnterPress(event: any) {
//     if (event.key === 'Enter') {
//       const values = this.qrCodeData.split(',');
//       console.log("materialBarcode ::" + this.qrCodeData);
//       if (values.length >= 0) {
//         this.materialCode = values[0];
//         this.materialDescription = values[1];
//         this.quantity = parseInt(values[2], 10);
//         this.materialInspectionStatus = values[3];
//         this.mfgDate = values[4];
//         this.expiryDate = values[5];
//         this.batchNumber = values[6];

//       }

//     }

//   }
//   resetData() {
//     this.qrCodeData = '';
//     this.materialCode = '';
//     this.materialDescription = '';
//     this.quantity = 0
//     this.materialInspectionStatus = '';
//     this.mfgDate = '';
//     this.expiryDate = '';
//     this.batchNumber = '';
//     this.input1 = '';
//     this.input2 = '';
//     this.input3 = '';
//     this.input4 = '';
//     this.input5 = '';
//   }
//   GenerateQRCode() {
//     this.qrCodeData = `${this.materialCode},${this.materialDescription},${this.quantity},${this.materialInspectionStatus},${this.mfgDate},${this.expiryDate},${this.batchNumber},${this.input1},${this.input2},${this.input3},${this.input4},${this.input5}`;

//     const dataToSend = {
//       qrCodeData: this.qrCodeData,
//       materialCode: this.materialCode,
//       materialDescription: this.materialDescription,
//       quantity: this.quantity,
//       materialInspectionStatus: this.materialInspectionStatus,
//       mfgDate: this.mfgDate,
//       expiryDate: this.expiryDate,
//       batchNumber: this.batchNumber,
//       input1: this.input1,
//       input2: this.input2,
//       input3: this.input3,
//       input4: this.input4,
//       input5: this.input5,
//       isQRCodeGenerated :this.isQRCodeGenerated =0,

//     };
//     this.qrSerice.saveData(dataToSend).subscribe(
//       (response) => {
//         console.log("Data successfully added");
//         this.resetData();
//       },
//       (error) => {
//         console.error('Error while soring data', error);
//       }
//     );


//   }
// }








