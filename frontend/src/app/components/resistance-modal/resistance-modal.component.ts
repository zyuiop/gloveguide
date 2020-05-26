import {Component, Inject, OnInit} from '@angular/core';
import {Glove} from '../../data/gloves';
import {Substance} from '../../data/substance';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {parseResistance, Resistance} from '../../data/resistance';
import {ResistancesService} from '../../services/resistances.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-resistance-modal',
  templateUrl: './resistance-modal.component.html',
  styleUrls: ['./resistance-modal.component.css']
})
export class ResistanceModalComponent implements OnInit {
  glove: Glove;
  substance: Substance;
  concentration: number;
  resistance: string;

  inserting = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ResistanceModalData, private resistances: ResistancesService, private snack: MatSnackBar,
              private modal: MatDialogRef<ResistanceModalComponent>) {
    this.glove = this.data.glove;
    this.substance = this.data.substance;
    this.concentration = this.data.concentration;
    this.resistance = this.data.resistance;
  }

  ngOnInit(): void {
  }

  get resistanceObject(): Resistance {
    if (!this.substance || !this.concentration || !this.glove || !this.resistance) {
      return undefined;
    }

    const minMax = parseResistance(this.resistance);

    if (!minMax) {
      return undefined;
    }

    return {glove: this.glove, concentration: this.concentration, substance: this.substance, min: minMax[0], max: minMax[1]};
  }

  get resistanceArray() {
    const res = this.resistanceObject;

    if (res) {
      return [[res]];
    } else {
      return [];
    }
  }

  submit() {
    const res = this.resistanceObject;

    if (!res) {
      this.snack.open('Cannot save data: one of the fields is missing or invalid.', undefined, {duration: 2000});
      return;
    }

    if (this.inserting) {
      return;
    }
    this.inserting = true;

    this.resistances.insertGloveResistance(this.resistanceArray)
      .subscribe(ok => {
        this.resistances.update();
        this.snack.open('Resistance data updated!', undefined, {duration: 2000});
        this.modal.close();
      }, err => {
        this.inserting = false;
        this.snack.open('An error occurred while updating/inserting... Please try again later. (Code: ' + err.status + ' ' + err.statusText + ')', undefined, {duration: 2000});
      });
  }

}

export class ResistanceModalData {
  glove?: Glove;
  substance?: Substance;
  concentration?: number;
  resistance?: string;
}
