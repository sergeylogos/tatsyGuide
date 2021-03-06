import {Component, EventEmitter, Input, Output} from '@angular/core';
@Component({
  selector: 'drink-application',
  templateUrl: 'drink-application.html'
})
export class DrinkApplicationComponent {

  @Input() drinkApp;
  @Input() showControlButtons;

  @Output() onOpenDrinkApplication = new EventEmitter();
  @Output() onRemoveDrinkApplication = new EventEmitter();
  @Output() onUpdateDrinkApplication = new EventEmitter();

  constructor() {
  }

  openDrinkApplication(drinkApp) {
    this.onOpenDrinkApplication.emit(this.drinkApp);
  }

  removeDrinkApp(drinkApp, event) {
    event.stopPropagation();
    this.onRemoveDrinkApplication.emit(this.drinkApp);
  }

  updateDrinkApp(drinkApp, event) {
    event.stopPropagation();
    this.onUpdateDrinkApplication.emit(this.drinkApp);
  }


}
