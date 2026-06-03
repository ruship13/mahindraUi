import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from './service/auth.service';
import { YokogawaTemperatureDetailsService } from './service/YokogawaTemperatureDetails.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ats_mahindra_electric_cc_ui';

  username!: string
  dashboardActive!: boolean;
  showYokogawaAlert: boolean = false;
  private intervalId: any;

  constructor(public authService: AuthenticationService
    , private route: Router, private yokogawaService: YokogawaTemperatureDetailsService) {

      this.route.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
         this.checkYokogawaUrl();
      });
  }

  ngOnInit(): void {
    this.checkYokogawaUrl();
    this.intervalId = setInterval(() => {
      this.checkYokogawaUrl();
    }, 300000); // 5 mins
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }  

  checkYokogawaUrl(): void {
    if (this.authService.currentUserValue === null) {
      this.showYokogawaAlert = false;
      return;
    }
    this.yokogawaService.createYokogawaTemperatureDetails()
      .subscribe({
        next: (res) => {
          if (res === 'CONNECTED') {
            this.showYokogawaAlert = false;
          } else {
            this.showYokogawaAlert = true;
          }
        },
        error: (err) => {
          console.error('Connection error:', err);
          this.showYokogawaAlert = true;
        }
      });
  }

  logout() {
    this.authService.logout();
    this.route.navigate(['/login'])

  }

   goToBatteryAlarm() {
    console.log("gett link")
    window.open(
    'http://10.192.65.167:8085/BatteryPackalarmdashboard','_blank'
  );
}

  goToLink(url: string) {
    window.open(url, "_blank");
  }
  isLoggedIn$!: Observable<boolean>;

}
