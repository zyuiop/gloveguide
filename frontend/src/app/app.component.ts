import {Component, OnInit} from '@angular/core';
import {SubstancesService} from './services/substances.service';
import {Substance} from './data/substance';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DisclaimerComponent} from './components/disclaimer/disclaimer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  gloveTypes: string[] = undefined;


  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.modalService.open(DisclaimerComponent, { size: 'xl', centered: true, backdrop: 'static' })
      .result.then(result => {
        console.log(result);
    });
  }
}
