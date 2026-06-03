import { Component, OnDestroy, OnInit } from '@angular/core';
import { masterAgingDaysDetails } from 'src/app/models/masterAgingDaysDetails.model';
import { MasterAgeingDaysDetailsService } from 'src/app/service/masterAgingDaysDetails.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-master-aging-days-details',
  templateUrl: './master-aging-days-details.component.html',
  styleUrls: ['./master-aging-days-details.component.css']
})
export class MasterAgingDaysDetailsComponent implements OnInit,OnDestroy {
   private subscriptions: Subscription = new Subscription();
  AgeingDaysList: masterAgingDaysDetails[] = [];
  ageingDaysId: DataTables.Settings = {};
  editProductAgeingDaysDetailsInstance: masterAgingDaysDetails = new masterAgingDaysDetails();

  constructor(private masterAgeingDaysService: MasterAgeingDaysDetailsService, private toastr: ToastrService) {}
  ngOnDestroy(): void {
  
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.fetchAgeingDays();
  }

  public fetchAgeingDays() {
    this.masterAgeingDaysService.fetchAllAgeingDaysDetais().subscribe(
      ageingDaysList => {
        $('#masterAgingDaysId').DataTable().clear().destroy();
        this.AgeingDaysList = ageingDaysList;
        // console.log("list" + this.AgeingDaysList);
        $(function () {
          $("#masterAgingDaysId").DataTable();
        });

        $(function () {
          $("#reasonId").DataTable({
            "language": {
              paginate: {
                "first": "First",
                "last": "last",
                "next": "Entries",
                "previous": "Show:"
              }
            }
          });
        });

        if (this.AgeingDaysList == null) {
          alert("Data not found");
        }
      }
    );
  }

  public editAgingDaysRow(editProductAgeingDaysDetailsInstance: masterAgingDaysDetails) {
  
    this.editProductAgeingDaysDetailsInstance = { ...editProductAgeingDaysDetailsInstance };
  }

  public editAgeingDaysDetails() {
    this.masterAgeingDaysService.updateMasterAgeingDaysDetails(this.editProductAgeingDaysDetailsInstance).subscribe(
      response => {
        if (response.status == 200) {
          this.toastr.success(response.message, 'Success', { timeOut: 5000 });
          this.fetchAgeingDays(); 
        }
      },
      error => {
        this.toastr.error(error.error.message, 'Error', { timeOut: 5000 });
      }
    );
  }
}
