import {Component} from '@angular/core';
import {App, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {GlobalConfigsService} from "../../configs/GlobalConfigsService";
import {HomePage} from "../home/home";
import {AuthProvider} from "../../providers/auth/auth";

@IonicPage()
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {

  login: string = "vasya";
  password: string = "vaysa";
  message: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: HttpClient,
    private globalVars: GlobalConfigsService,
    private app: App,
    private events: Events,
    private auth: AuthProvider,
  ) {
  }


  signInMe() {
    var obj = {login: this.login, password: this.password};
    this.auth.logIn(obj).subscribe(() => {
      this.app.getRootNav().setRoot(HomePage);
    }, (error) => {
      console.log(error);
    });
  }

}
