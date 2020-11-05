import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {QueueInfo} from '../../../../../../libs/tof-lib/src/lib/queue-info';

@Component({
  selector: 'trifolia-fhir-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit {
  queueInfos: QueueInfo[];
  message: string;

  constructor(private http: HttpClient) { }

  async init() {
    this.queueInfos = null;
    this.queueInfos = <any> await this.http.get('/api/manage/queue').toPromise();

    this.queueInfos.forEach(qi => {
      if (qi.queuedAt) {
        qi.queuedAt = new Date(qi.queuedAt);
      }
      if (qi.publishStartedAt) {
        qi.publishStartedAt = new Date(qi.publishStartedAt);
      }
    })
  }

  async cancel(packageId: string) {
    try {
      await this.http.post(`/api/manage/queue/${encodeURIComponent(packageId)}/cancel`, null).toPromise();
      this.message = `Queue ${packageId} has been canceled`;

      setTimeout(() => this.init(), 3000);
    } catch (ex) {
      this.message = `Error canceling queue ${packageId}: ${ex.message}`;
    }
  }

  async ngOnInit() {
    await this.init();
  }
}
