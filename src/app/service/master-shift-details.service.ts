import { HttpClient } from "@angular/common/http"
import { BASE_URL } from "../utils/const"
import { MasterShiftDetailsModel } from "../models/master-shift-details.model"
import { Injectable } from "@angular/core"
import { Observable, map } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class MasterShiftDetailsService {

  
    constructor(private http:HttpClient){}

    public fetchAllMasterShiftDetails(){
        return this.http.get<MasterShiftDetailsModel[]>(`${BASE_URL}masterShiftDetails/fetchallmastershiftdetails`);
    }

    // public fetchShiftByCurrentTime() {
    //     const currentDate = new Date();
    //     const currentTime = currentDate.getHours() + ':' + currentDate.getMinutes(); // Get the current time HH:mm
    
    //     return this.http.get<MasterShiftDetailsModel[]>(`${BASE_URL}masterShiftDetails/fetchallmastershiftdetails`).pipe(
    //       map((shiftDetails: MasterShiftDetailsModel[]) => {
    //         // Find the shift based on the current time
    //         const currentShift = shiftDetails.find(shift => {
    //           const shiftStartTime = shift.shiftStartTime;
    //           const shiftEndTime = shift.shiftEndTime;
    //           // Comparing if the current time falls within the shift start and end times
    //           return currentTime >= shiftStartTime && currentTime < shiftEndTime;
    //         });
    
    //         return currentShift; // Return the shift for the current time
    //       })
    //     );
    //   }

    // public fetchShiftByCurrentTime() {
    //   console.log("get3")
    //   const currentDate = new Date();
    //   const currentTime = currentDate.getHours() + ':' + currentDate.getMinutes(); 
    //   console.log("get3"+currentTime)
    //   console.log("get3"+currentDate)
    //   return this.http.get<MasterShiftDetailsModel[]>(`${BASE_URL}masterShiftDetails/fetchallmastershiftdetails`).pipe(
    //     map((shiftDetails: MasterShiftDetailsModel[]) => {
         
    //       const currentShift = shiftDetails.find(shift => {
    //         const shiftStartTime = shift.shiftStartTime;
    //         const shiftEndTime = shift.shiftEndTime;
           
    //         return currentTime >= shiftStartTime && currentTime < shiftEndTime;
    //       });
    // console.log("currentShift"+currentShift)
    //       return currentShift; 
    //     })
    //   );
    // }
    
    fetchShiftByCurrentTime(): Observable<MasterShiftDetailsModel | undefined> {
      const currentDate = new Date();
      const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes(); // Convert current time to minutes
    
      return this.http.get<MasterShiftDetailsModel[]>(`${BASE_URL}masterShiftDetails/fetchallmastershiftdetails`).pipe(
        map((shiftDetails: MasterShiftDetailsModel[]) => {
          const currentShift = shiftDetails.find(shift => {
            const shiftStartTime = this.convertToMinutes(shift.shiftStartTime);
            const shiftEndTime = this.convertToMinutes(shift.shiftEndTime);
    
            // Handling shift times that span across midnight
            if (shiftStartTime <= shiftEndTime) {
              return currentTime >= shiftStartTime && currentTime < shiftEndTime;
            } else {
              // If shift end time is less than start time, it spans across midnight
              // So, check if the current time is after start time or before end time
              return currentTime >= shiftStartTime || currentTime < shiftEndTime;
            }
          });
    
          // console.log("Current Shift:", currentShift);
          return currentShift;
        })
      );
    }
    
    private convertToMinutes(timeString: string): number {
      const [hours, minutes] = timeString.split(':').map(Number);
      return hours * 60 + minutes;
    }
    
}
