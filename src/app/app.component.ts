import { Component, OnInit, ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Angular-pwa';
  apiData: any;
  constructor(
    private http: HttpClient,
    private update: SwUpdate,
    private appRef: ApplicationRef
  ) {
    this.updateClient();
    this.checkUpdate();
  }

  ngOnInit() {
    this.http.get('http://dummy.restapiexample.com/api/v1/employees').subscribe(
      (res: any) => {
        this.apiData = res.data;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  updateClient() {
    if (!this.update.isEnabled) {
      console.log('Not Enabled');
      return;
    }
    this.update.available.subscribe((event) => {
      console.log(`current`, event.current, `available `, event.available);
      if (confirm('update available for the app please conform')) {
        this.update.activateUpdate().then(() => location.reload());
      }
    });

    this.update.activated.subscribe((event) => {
      console.log(`current`, event.previous, `available `, event.current);
    });
  }

  checkUpdate() {
    this.appRef.isStable.subscribe((isStable) => {
      if (isStable) {
        const timeInterval = interval(8 * 60 * 60 * 1000);

        timeInterval.subscribe(() => {
          this.update.checkForUpdate().then(() => console.log('checked'));
          console.log('update checked');
        });
      }
    });
  }
}
