import {Component} from '@angular/core';
import {App, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {GlobalConfigsService} from "../../configs/GlobalConfigsService";
import {AuthProvider} from "../../providers/auth/auth";
import {HomePage} from "../home/home";

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  name: string = "vaysa";
  surname: string = "pupkin";
  email: string = "vasya@vaysa.com";
  login: string = "vasya";
  password: string = "vaysa";

  message: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: HttpClient,
    private globalVars: GlobalConfigsService,
    private app: App,
    private auth: AuthProvider
  ) {

  }

  signUpMe() {
    this.auth.registration({
      name: this.name, surname: this.surname, email: this.email,
      login: this.login, password: this.password
    }).subscribe(() => {
      this.app.getRootNav().setRoot(HomePage);
    }, (error) => {
      console.log(error);
    });
  }
}
