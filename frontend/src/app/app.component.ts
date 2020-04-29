import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DisclaimerComponent} from './components/disclaimer/disclaimer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private static CONDITIONS_ACCEPTED = 'conditions_accepted';
  private static CONDITIONS_ACCEPTED_DURATION_HOURS = 12;

  title = 'frontend';
  gloveTypes: string[] = undefined;


  constructor(private modalService: NgbModal) {
  }

  ngOnInit(): void {
    const lastModal = localStorage.getItem(AppComponent.CONDITIONS_ACCEPTED);

    if (!lastModal || Number.parseInt(lastModal, 10) < Date.now()) {
      this.modalService.open(DisclaimerComponent, {size: 'xl', centered: true, backdrop: 'static'})
        .result.then(result => {
        if (result === true) {
          localStorage.setItem(AppComponent.CONDITIONS_ACCEPTED,
            (Date.now() + (AppComponent.CONDITIONS_ACCEPTED_DURATION_HOURS * 24 * 60 * 1000)).toString(10));
        }
      });
    }
  }
}
