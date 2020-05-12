import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-locale-switcher',
  templateUrl: './locale-switcher.component.html',
  styleUrls: ['./locale-switcher.component.css']
})
export class LocaleSwitcherComponent implements OnInit {

  constructor(public router: Router, @Inject(LOCALE_ID) private _locale: string) { }

  ngOnInit(): void {
  }

  get locale() {
    return this._locale.split('-')[0];
  }

  get url() {
    return window.location.pathname;
  }

}
