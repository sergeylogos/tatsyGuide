import {Component} from '@angular/core';
import {
  App,
  Events,
  InfiniteScroll,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  Refresher
} from 'ionic-angular';
import {PlacesProvider} from "../../providers/places-service/PlacesProvider";
import {BonuseProvider} from "../../providers/bonuse/bonuseProvider";
import {ClientProvider} from "../../providers/client/ClientProvider";
import {Place} from "../../models/place/Place";
import {PlaceDeatilsPage} from "../place-deatils/place-deatils";
import {Client} from "../../models/client/Client";
import {HttpClient} from "@angular/common/http";
import {GlobalConfigsService} from "../../configs/GlobalConfigsService";
import {AuthProvider} from "../../providers/auth/auth";
import {PlaceMultilangProvider} from "../../providers/place-multilang/place-multilang";
import {Geolocation} from "@ionic-native/geolocation";
import {ObjectUtils} from "../../utils/ObjectUtils";

@IonicPage()
@Component({
  selector: 'page-all-places',
  templateUrl: 'all-places.html',
})
export class AllPlacesPage {

  places: Place[] = [];
  globalHost: string;
  principal: Client;
  searchStr: string = '';
  placeQuery: any = {};
  placeMultilangQuery: any = {};
  eventData: any = {};

  skip = 0;
  pageSize = 10;
  limit = this.pageSize;
  allLoaded = false;
  scrollEvent = false;

  constructor(
    private app: App,
    private http: HttpClient,
    private globalVars: GlobalConfigsService,
    public navCtrl: NavController,
    private navParams: NavParams,
    private placesService: PlacesProvider,
    private geolocation: Geolocation,
    private clientService: ClientProvider,
    private bonuseService: BonuseProvider,
    private events: Events,
    private auth: AuthProvider,
    private placeMultilangService: PlaceMultilangProvider,
    private loadingCtrl: LoadingController,
    private globalConfig : GlobalConfigsService
  ) {
    this.globalHost = globalVars.getGlobalHost();
  }

  ngOnInit() {

    console.log(this.globalConfig.deviceLang , '!!!!!!!!!!!!!!!!!!!!!!!');
    this.eventData = {};
    this.auth.principal.subscribe(principal => this.principal = principal);
    this.auth.loadPrincipal().subscribe();

    this.placeQuery = {
      query: {},
      sort: {},
    };
    this.placeMultilangQuery = {
      query: {},
      sort: {},
    };

    this.events.subscribe('functionCall:find', (eventData) => {
      this.skip = 0;
      this.allLoaded = false;
      this.eventData = eventData;
      this.findPlacesByFilter(eventData);
    });

    this.findPlacesByFilter(this.eventData);
  }

  doRefresh(refresher: Refresher) {
    this.skip = 0;
    this.allLoaded = false;
    this.findPlacesByFilter(this.eventData, refresher);
  }

  prepareQueryies(eventData) {
    this.placeMultilangQuery.sort = {};
    this.placeQuery.sort = {};
    this.placeMultilangQuery.query = {};
    this.placeQuery.query = {};

    if (eventData.sort === 'rating' || eventData.sort === 'averagePrice') {
      this.placeQuery.sort[eventData.sort] = eventData.direction ? 1 : -1
    }
    if (eventData.sort === 'name') {
      this.placeMultilangQuery.sort['multilang.' + eventData.sort] = eventData.direction ? 1 : -1
    }
    if (eventData.placeType) {
      this.placeQuery.query.types = eventData.placeType;
    }
    for (const feature in eventData.filterFeature) {
      if (!eventData.filterFeature[feature]) delete eventData.filterFeature[feature];
      this.placeQuery.query['features.' + feature] = eventData.filterFeature[feature];
    }
    if (!ObjectUtils.isEmpty(eventData.range) && eventData.range.upper !== 10000 && eventData.range.lower !== 0) {
      this.placeQuery.query.averagePrice = {$gte: eventData.range.lower, $lte: eventData.range.upper};
    }
    if (this.searchStr)
      this.placeMultilangQuery.query['multilang.name'] = {$regex: this.searchStr, $options: "i"};
    else
      delete this.placeMultilangQuery.query['multilang.name'];
    if (this.eventData.city)
      this.placeMultilangQuery.query['multilang.address.city'] = this.eventData.city;
    else
      delete this.placeMultilangQuery.query['multilang.address.city'];
  }

  findPlacesByFilter(eventData, completeAfter?: any) {
    this.prepareQueryies(eventData);
    let res = this.placesService.find({
      aggregate: [
        {$match: {allowed: true, ...this.placeQuery.query}},
        {
          $lookup: {
            from: 'multilangs',
            localField: '_id',
            foreignField: 'place',
            as: 'multilang',
          }
        },
        {$unwind: "$multilang"},
        {
          $lookup: {
            from: 'multilangs',
            localField: 'types',
            foreignField: 'placeType',
            as: 'types',
          }
        },
        {$unwind: "$types"},
        {$match: {'types.lang': this.globalVars.getGlobalLang(), 'multilang.lang': this.globalVars.getGlobalLang()}},
        {$match: this.placeMultilangQuery.query},
        {
          $group: {
            _id: '$_id',
            types: {$push: '$types'},
            multilang: {$addToSet: '$multilang'},
            phone: {$first: '$phone'},
            email: {$first: '$email'},
            averagePrice: {$first: '$averagePrice'},
            reviews: {$first: '$reviews'},
            rating: {$first: '$rating'},
            allowed: {$first: '$allowed'},
            avatar: {$first: '$avatar'},
            location: {$first: '$location'},
            features: {$first: '$features'},
            topCategories: {$first: '$topCategories'},
            images: {$first: '$images'},
            days: {$first: '$days'},
            hashTags: {$first: '$hashTags'},
          }
        },
        {
          $sort: (() => {
            let sort = {review: 1};
            if (Object.keys(this.placeQuery.sort).length > 0) {
              sort = this.placeQuery.sort;
            } else if (Object.keys(this.placeMultilangQuery.sort).length > 0) {
              sort = this.placeMultilangQuery.sort;
            } else {
              sort = {review: 1};
            }
            return sort;
          })()
        },
        {$skip: this.skip},
        {$limit: this.limit},
      ]
    });

    res.subscribe((places) => {
      if (this.scrollEvent) {
        this.scrollEvent = false;
        if (places.length < this.pageSize) this.allLoaded = true;
        this.places.push(...places);
      } else {
        this.skip = 0;
        this.allLoaded = false;
        this.places = places;
      }
      for (const place of this.places) {
        place.distance = this.placesService.findDistance(this.globalVars.globalPosition, place);
      }
      if (eventData.sort === 'location') {
        this.places = this.places.sort((a, b) => {
          if (eventData.direction > 0)
            return a.distance - b.distance;
          else {
            return b.distance - a.distance;
          }
        });
      }
      if (completeAfter) {
        completeAfter.complete();
      }
    });
  }

  onSearchPlaces(event) {
    this.skip = 0;
    this.allLoaded = false;
    setTimeout(() => {
      this.searchStr = event.target.value;
      this.findPlacesByFilter(this.eventData);
    }, 500);
  }

  toDetails(id) {
    let spinner = this.loadingCtrl.create({
      dismissOnPageChange: true,
      enableBackdropDismiss: true
    });
    spinner.present();
    let placesSubscriber = this.placesService
      .findOne(
        id,
        {
          populate: [
            {path: 'multilang', match: {lang: this.globalVars.getGlobalLang()}},
            {
              path: 'types',
              populate: {path: 'multilang', match: {lang: this.globalVars.getGlobalLang()}}
            },
          ]
        }
      ).subscribe((foundedPlace) => {
        this.app.getRootNav().push(PlaceDeatilsPage, foundedPlace);
      });
    spinner.onWillDismiss(() => {
      placesSubscriber.unsubscribe();
    });
  }

  loadNextPlacesPage(event: InfiniteScroll) {
    if (this.allLoaded) {
      event.complete();
    } else {
      this.setNextPage();
      this.scrollEvent = true;
      this.findPlacesByFilter(this.eventData, event);
    }
  }

  setNextPage() {
    this.skip += this.pageSize;
  }
}
