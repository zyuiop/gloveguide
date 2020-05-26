import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ResistanceModalComponent} from '../resistance-modal/resistance-modal.component';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  constructor(private modal: MatDialog) { }

  ngOnInit(): void {
  }

  resistanceModal() {
    this.modal.open(ResistanceModalComponent, { data : {}});
  }
}
