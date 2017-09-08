import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  private mylinks: Array<any> = [];

  constructor(
    private AuthService: AuthService,

  ) { }

  ngOnInit() {
    // console.log('123');
    // return this.AuthService.getTest().subscribe(data => console.log(data));

    // define here your own links menu structure
    this.mylinks = [
      {
        'title': 'Home',
        'icon': 'dashboard',
        'link': ['/home']
      },
      {
        'title': 'Client',
        'icon': 'usd',
        'link': ['/client']
      },
      {
        'title': 'Sub menu',
        'icon': 'link',
        'sublinks': [
          {
            'title': 'Page 2',
            'link': ['/page/2'],
          },
          {
            'title': 'Page 3',
            'link': ['/page/3'],
          }
        ]
      },
      {
        'title': 'External Link',
        'icon': 'google',
        'link': ['http://google.com'],
        'external': true,
        'target': '_blank'
      },
      {
        'title': 'External Links',
        'icon': 'link',
        'sublinks': [
          {
            'title': 'Github',
            'link': ['http://github.com'],
            'icon': 'github',
            'external': true,
            'target': '_blank'
          },
          {
            'title': 'Yahoo',
            'link': ['http://yahoo.com'],
            'icon': 'yahoo',
            'external': true,
            'target': '_blank'
          }
        ]
      }
    ];
  }

}
