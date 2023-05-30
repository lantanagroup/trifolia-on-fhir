import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import {Http, ResponseContentType} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public welcomeContent: string;
  public whatsNewContent: string;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get('/help/Welcome.html', {responseType: 'text'})
      .subscribe((results) => {
        const content = results;
        const parser = new DOMParser();
        const parsedContent = parser.parseFromString(content, 'text/html');
        const topicContentDiv = parsedContent.querySelector('#topic-content');
        const topicNavigationDiv = topicContentDiv.querySelector('div.navigation');
        topicContentDiv.removeChild(topicNavigationDiv);
        this.welcomeContent = topicContentDiv.outerHTML;
      }, (err) => {
        console.log(err);
      });
    this.http.get('/help/WhatsNew.html', {responseType: 'text'})
      .subscribe((results) => {
        const content = results;
        const parser = new DOMParser();
        const parsedContent = parser.parseFromString(content, 'text/html');
        const topicContentDiv = parsedContent.querySelector('#topic-content');
        const topicNavigationDiv = topicContentDiv.querySelector('div.navigation');
        topicContentDiv.removeChild(topicNavigationDiv);
        this.whatsNewContent = topicContentDiv.outerHTML;
      }, (err) => {
        console.log(err);
      });
  }
}
