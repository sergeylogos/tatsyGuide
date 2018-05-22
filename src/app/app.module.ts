import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MyApp} from './app.component';
import {PlacesProvider} from '../providers/places-service/PlacesProvider';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {BonuseProvider} from '../providers/bonuse/bonuseProvider';
import {PlaceTypeProvider} from '../providers/place-type/place-type';
import {EventProvider} from "../providers/event/EventProvider";
import {NewsProvider} from "../providers/news/NewsProvider";
import {ComplaintProvider} from "../providers/complaint/complaint-provider";
import {DrinkApplicationProvider} from "../providers/drinkApplication/drinkApplication-provider";
import {RatingProvider} from "../providers/rating/rating-provider";
import {DepartmentProvider} from "../providers/department/department-provider";
import {ClientProvider} from "../providers/client/ClientProvider";
import {GlobalConfigsService} from "../configs/GlobalConfigsService";
import {Geolocation} from '@ionic-native/geolocation';
import {HomePageModule} from "../pages/home/home.module";
import {PlaceDetailsModule} from "../pages/place-deatils/place-details.module";
import {MapModule} from "../pages/map/map.module";
import {EventPageModule} from "../pages/event/event.module";
import {BonusePageModule} from "../pages/bonuse/bonuse.module";
import {NewsPageModule} from "../pages/news/news.module";
import {PlaceInfoPageModule} from "../pages/place-info/place-info.module";
import {TestimonialPageModule} from "../pages/testimonial/testimonial.module";
import {LoginPageModule} from "../pages/login/login.module";
import {SignUpPageModule} from "../pages/sign-up/sign-up.module";
import {SignInPageModule} from "../pages/sign-in/sign-in.module";
import {NativePageTransitions} from '@ionic-native/native-page-transitions';
import {DrinkerApplicationPageModule} from "../pages/drinker-application/drinker-application.module";
import {HashTagProvider} from '../providers/hash-tag/hash-tag';
import {MessageProvider} from '../providers/message/message';
import {TopPlaceProvider} from '../providers/top-place/top-place';
import {BonuseMultilangProvider} from '../providers/bonuse-multilang/bonuse-multilang';
import {EventMultilangProvider} from '../providers/event-multilang/event-multilang';
import {NewsMultilangProvider} from '../providers/news-multilang/news-multilang';
import {PlaceMultilangProvider} from '../providers/place-multilang/place-multilang';
import {PlaceTypeMultilangProvider} from '../providers/place-type-multilang/place-type-multilang';
import {AuthProvider} from '../providers/auth/auth';
import {HttpInterceptorProvider} from '../providers/http-interceptor/http-interceptor';
import {LangProvider} from '../providers/lang/lang';
import {ModalTestimonialPageModule} from "../pages/modal-testimonial/modal-testimonial.module";
import {CreatePlacePageModule} from "../pages/create-place/create-place.module";
/*file transfer etc*/
import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file';
import {Camera} from '@ionic-native/camera';
import {MyPlacesPageModule} from "../pages/my-places/my-places.module";
import {MyFavoritePlacesPageModule} from "../pages/my-favorite-places/my-favorite-places.module";
import {MyRatingsPageModule} from "../pages/my-ratings/my-ratings.module";
import {ChooseLocationPageModule} from "../pages/choose-location/choose-location.module";
import {AddAvatarAndPhotosPageModule} from "../pages/add-avatar-and-photos/add-avatar-and-photos.module";
import {ImagePicker} from "@ionic-native/image-picker";
import {Base64} from "@ionic-native/base64";
import {CreateEventPageModule} from "../pages/create-event/create-event.module";
import {CreateBonusePageModule} from "../pages/create-bonuse/create-bonuse.module";
import {CreateNewsPageModule} from "../pages/create-news/create-news.module";

@NgModule({
  declarations: [
    MyApp,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    BrowserAnimationsModule,
    HomePageModule,
    PlaceDetailsModule,
    MapModule,
    EventPageModule,
    BonusePageModule,
    NewsPageModule,
    PlaceInfoPageModule,
    TestimonialPageModule,
    LoginPageModule,
    SignUpPageModule,
    SignInPageModule,
    DrinkerApplicationPageModule,
    ModalTestimonialPageModule,
    CreatePlacePageModule,
    MyPlacesPageModule,
    MyFavoritePlacesPageModule,
    MyRatingsPageModule,
    ChooseLocationPageModule,
    AddAvatarAndPhotosPageModule,
    CreateEventPageModule,
    CreateBonusePageModule,
    CreateNewsPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PlacesProvider,
    BonuseProvider,
    PlaceTypeProvider,
    EventProvider,
    NewsProvider,
    ComplaintProvider,
    DrinkApplicationProvider,
    RatingProvider,
    DepartmentProvider,
    ClientProvider,
    GlobalConfigsService,
    Geolocation,
    NativePageTransitions,
    AuthProvider,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorProvider,
      multi: true
    },
    LangProvider,
    HashTagProvider,
    MessageProvider,
    TopPlaceProvider,
    BonuseMultilangProvider,
    EventMultilangProvider,
    NewsMultilangProvider,
    PlaceMultilangProvider,
    PlaceTypeMultilangProvider,
    FileTransfer,
    // FileUploadOptions, ???
    FileTransferObject,
    File,
    Camera,
    ImagePicker,
    Base64
  ]
})
export class AppModule {
}
