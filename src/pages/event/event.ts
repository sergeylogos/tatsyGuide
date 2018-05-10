import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Place} from "../../models/place/Place";
import {GlobalConfigsService} from "../../configs/GlobalConfigsService";

/**
 * Generated class for the EventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {

  globalHost: string;
  place: Place;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private   gc: GlobalConfigsService,
  ) {
    this.place = this.navParams.data;


    this.globalHost = this.gc.getGlobalHost();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPage');
  }

}
