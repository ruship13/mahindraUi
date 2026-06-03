import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccessMatrixModel } from 'src/app/models/accessMatrix.model';
import { MasterUserDetailsModel } from 'src/app/models/masterUserDetails.model';
import { AccessMatrixService } from 'src/app/service/accessMatrix.service';
import { AuthenticationService } from 'src/app/service/auth.service';



@Component({
  selector: 'app-access-matrix',

  templateUrl: './access-matrix.component.html',
  styleUrls: ['./access-matrix.component.css']
})
export class AccessMatrixComponent implements OnInit {
  accesmatrixDtOptions: DataTables.Settings = {}
  accessMatrixList: AccessMatrixModel[] = [];
  accessMatrix: AccessMatrixModel[] = [];
  accessMatrix1: AccessMatrixModel = new AccessMatrixModel();
  updateAllMatrix: AccessMatrixModel = new AccessMatrixModel();
  isCheck: boolean = false;
  isChecked: boolean = false;
  numericValue: number = 0;
  admin!: boolean;
  currentUser: MasterUserDetailsModel | undefined;


  constructor(private accessMatrixService: AccessMatrixService,
    private toastr:ToastrService,
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    this.getAllAccessMatrixDetails();
    this.getAllAccessMatrixDetails1();
  }


  public isMonitor(): boolean {
    return this.currentUser?.roleName === 'MONITOR'
  }


  public getAllAccessMatrixDetails() {
    this.accessMatrixService.getAllAccessMatrixDetails().subscribe(manualList => {
      this.accessMatrixList = manualList;
      // console.log("fetchAll...." + this.accessMatrixList)

    })
  }


  getAllAccessMatrixDetails1() {
    this.accessMatrixService.getAllAccessMatrixDetails().subscribe((matrices: AccessMatrixModel[]) => {
      this.accessMatrix = matrices;
     
    });

  }


  // showHideStatus(event: any) {

  //   if (event.target.checked == true) {
  //     this.accessMatrixList[0].operator = 1
  //     this.isCheck = true;
  //     //this.addCheckBoxStatus(formlist)
  //     console.log(1)
  //   }
  //   else {
  //     this.isCheck = false;
  //     this.accessMatrixList[0].operator = 0
  //    // this.addCheckBoxStatus(formlist);
  //     console.log(0)
  //   }
  // }





  updateNumericValue(access: AccessMatrixModel) {
    access.admin = access.admin ? 1 : 0;
    access.operator = access.operator ? 1 : 0;
    access.supervisor = access.supervisor ? 1 : 0;
    access.monitor=access.monitor ?1 : 0;
    this.accessMatrixService.updateAccessMatrix(access).subscribe(
      response => {
        this.toastr.success('Component Updated Successfully.', 'Success', { timeOut: 10000, });
        // console.log('Database updated successfully:', response);
      },
      error => {
     
        console.error('Error updating database:', error);
      }
    );
  }


}
