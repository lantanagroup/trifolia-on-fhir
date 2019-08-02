import {Component, OnInit} from '@angular/core';
import {Http, ResponseContentType} from '@angular/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public welcomeContent: string;
  public whatsNewContent: string;

  constructor(private http: Http) {
  }

  ngOnInit() {
    this.http.get('/help/Welcome.html', {responseType: ResponseContentType.Text})
      .subscribe((results) => {
        const content = results.text();
        const parser = new DOMParser();
        const parsedContent = parser.parseFromString(content, 'text/html');
        const topicContentDiv = parsedContent.querySelector('#topic-content');
        const topicNavigationDiv = topicContentDiv.querySelector('div.navigation');
        topicContentDiv.removeChild(topicNavigationDiv);
        this.welcomeContent = topicContentDiv.outerHTML;
      }, (err) => {
        console.log(err);
      });
    this.http.get('/help/Whatsnew.html', {responseType: ResponseContentType.Text})
      .subscribe((results) => {
        const content = results.text();
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
