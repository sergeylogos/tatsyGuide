import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import {Place} from "../../models/place/Place";
import {Events, Platform} from "ionic-angular";
import {BonuseProvider} from "../bonuse/bonuseProvider";
import {PlaceTypeProvider} from "../place-type/place-type";
import {EventProvider} from "../event/EventProvider";
import {NewsProvider} from "../news/NewsProvider";
import {ComplaintProvider} from "../complaint/complaint-provider";
import {DrinkApplicationProvider} from "../drinkApplication/drinkApplication-provider";
import {RatingProvider} from "../rating/rating-provider";
import {DepartmentProvider} from "../department/department-provider";
import {PlaceType} from "../../models/placeType/PlaceType";
import {switchMap} from "rxjs/operators";
import {zip} from "rxjs/observable/zip";
import _ from 'lodash';
import {Geolocation} from '@ionic-native/geolocation';
import {fromPromise} from "rxjs/observable/fromPromise";
import {Storage} from "@ionic/storage";
import {GlobalConfigsService} from "../../configs/GlobalConfigsService";
import {Observable} from "rxjs/Observable";

declare var window: any;
declare var position: any;

@Injectable()
export class PlacesProvider {

  constructor(
    private http: HttpClient, plt: Platform,
    private bonuseProvider: BonuseProvider,
    private eventProvider: EventProvider,
    private newsProvider: NewsProvider,
    private placeTypeService: PlaceTypeProvider,
    private complaintProvider: ComplaintProvider,
    private drinkApplicationProvider: DrinkApplicationProvider,
    private ratingService: RatingProvider,
    private departmentService: DepartmentProvider,
    private geolocation: Geolocation,
    private events: Events,
    private storage: Storage,
    private globalConfig: GlobalConfigsService
  ) {

    this.events.subscribe("favoritePlaces", () => {
      this.getAllPlaces();
    })
  }

  getAllPlaces(target = {}) {
    target = JSON.stringify(target);
    let fetchHahTags = JSON.stringify({hashTag: {}});
    let fetchTopPlaces = JSON.stringify({topPlace: {}});
    let fetchTypes = JSON.stringify({placeType: {}});
    let fetchPlaceMultilang = JSON.stringify({placeMultilang: {query: {lang: this.globalConfig.getGlobalLang()}}});
    // let fetchTypes = JSON.stringify({placeType: {query: {lang: lang}}});

    let placesRequest = this
      .http
      .get<Place[]>(this.globalConfig.getGlobalHost() + `/api/places?target=${target}&fetch=[${fetchHahTags},${fetchTopPlaces},${fetchTypes},${fetchPlaceMultilang}]`);
    return placesRequest.pipe(switchMap((places) => {
        let placeIds = [];
        for (const place of places) {
          placeIds.push(place.id);
        }
        let targetToBonuses = {
          query: {
            place: placeIds
          }
        };
        let fetchToBonuses = [
          {
            bonuseMultilang: {
              query: {
                lang: this.globalConfig.getGlobalLang()
              }
            },
          },
          {
            client: {}
          }
        ];
        let targetToEvents = {
          query: {
            place: placeIds
          }
        };
        let fetchToEvents = [
          {
            eventMultilang: {
              query: {
                lang: this.globalConfig.getGlobalLang()
              }
            },

          },
          {
            client: {}
          }
        ];
        let targetToNews = {
          query: {
            place: placeIds
          }
        };
        let fetchToNews = [
          {
            newsMultilang: {
              query: {
                lang: this.globalConfig.getGlobalLang()
              }
            },

          },
          {
            client: {}
          }
        ];
        let targetToComplaints = {
          query: {
            place: placeIds
          }
        };
        let fetchToComplaints = [
          {
            client: {}
          }
        ];
        let targetToDrinkApp = {
          query: {
            place: placeIds
          }
        };
        let fetchToDrinkApp = [
          {
            client: {}
          }
        ];
        let targetToRating = {
          query: {
            place: placeIds
          }
        };
        let fetchToRating = [
          {
            client: {}
          }
        ];
        let targetToDepartment = {
          query: {
            place: placeIds
          }
        };
        let fetchToDepartment = [
          {
            client: {}
          }
        ];
        let fetchToPlaceType = [
          {
            placeTypeMultilang: {query: {lang: this.globalConfig.getGlobalLang()}}
          }
        ];
        let bonuses = this.bonuseProvider.getBonuses(targetToBonuses, fetchToBonuses);
        let events = this.eventProvider.getEvents(targetToEvents, fetchToEvents);
        let news = this.newsProvider.getNews(targetToNews, fetchToNews);
        let placeTypes = this.placeTypeService.getPlaceTypes({}, fetchToPlaceType);
        let complaints = this.complaintProvider.getComplaints(targetToComplaints, fetchToComplaints);
        let drinkApplications = this.drinkApplicationProvider.getDrinkApplications(targetToDrinkApp, fetchToDrinkApp);
        let ratings = this.ratingService.getRatings(targetToRating, fetchToRating);
        let departments = this.departmentService.getDepartments(targetToDepartment, fetchToDepartment);
        let geopositionObservable = fromPromise(this.geolocation.getCurrentPosition());
        return zip(bonuses, events, news, placeTypes, complaints, drinkApplications, ratings, departments, geopositionObservable,
          (bonuses, events, news, placeTypesWithMultilang, complaints, drinkApplications, ratings, departments, geoPosition) => {
            for (const bonuse of bonuses) {
              for (const place of places) {
                if (bonuse.place === place.id) {
                  if (!place.promos) place.promos = [];
                  place.promos.push(bonuse);
                }
              }
            } // bonuses merge loop
            for (const event of events) {
              for (const place of places) {
                if (event.place === place.id) {
                  if (!place.promos) place.promos = [];
                  place.promos.push(event);
                }
              }
            }
            for (const singleNews of news) {
              for (const place of places) {
                if (singleNews.place === place.id) {
                  if (!place.promos) place.promos = [];
                  place.promos.push(singleNews);
                }
              }
            }
            for (const place of places) {
              let newTypes: PlaceType[] = [];
              for (const oldType of place.types) {
                for (const newType of placeTypesWithMultilang) {
                  if (oldType.id === newType._id) {
                    newTypes.push(newType);
                  }
                }
              }
              place.types = newTypes;
            }
            for (const complaint of complaints) {
              for (const place of places) {
                if (!place.complaints) place.complaints = [];
                if (place.id === complaint.place)
                  place.complaints.push(complaint)
              }
            }
            for (const drinkApp of drinkApplications) {
              for (const place of places) {
                if (!place.drinkApplications) place.drinkApplications = [];
                if (place.id === drinkApp.place)
                  place.drinkApplications.push(drinkApp)
              }
            }
            for (const rating of ratings) {
              for (const place of places) {
                if (!place.ratings) place.ratings = [];
                if (place.id === rating.place)
                  place.ratings.push(rating)
              }
            }
            for (const department of departments) {
              for (const place of places) {
                if (!place.departments) place.departments = [];
                if (place.id === department.place)
                  place.departments.push(department);
              }
            }

            for (const place of places) {
              place.distance = this.findDistance(geoPosition.coords, place);
            }
            return places;
          })
      })
    );
  }

  create(place: Place): Observable<Place> {
    return this.http.post<Place>(`${this.globalConfig.getGlobalHost()}/api/places`, place);
  }

  update(id: string, place: Place): Observable<Place> {
    return this.http.put<Place>(`${this.globalConfig.getGlobalHost()}/api/places/${id}`, place);
  }


  findDistance(myPosition, place) {

    let lat1 = myPosition.latitude;
    let lon1 = myPosition.longitude;
    let lat2 = place.location.lat;
    let lon2 = place.location.lng;
    let p = 0.017453292519943295;
    let a = 0.5 - Math.cos((lat2 - lat1) * p) / 2 + Math.cos(lat1 * p) * Math.cos(lat2 * p) * (1 - Math.cos((lon2 - lon1) * p)) / 2;
    return 12742 * Math.asin(Math.sqrt(a));

  }

  promisefyMyPosition(): Promise<any> {
    return new Promise(resolve => {
      window.navigator.geolocation.getCurrentPosition(position => {
        resolve(position);
      });

    })
  }


  async findDistanceToPlace(place: Place): Promise<number> {
    let position = await this.promisefyMyPosition();
    let myPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    function findDistance() {

      let lat1 = myPosition.lat;
      let lon1 = myPosition.lng;
      let lat2 = place.location.lat;
      let lon2 = place.location.lng;
      let p = 0.017453292519943295;
      let a = 0.5 - Math.cos((lat2 - lat1) * p) / 2 + Math.cos(lat1 * p) * Math.cos(lat2 * p) * (1 - Math.cos((lon2 - lon1) * p)) / 2;
      return 12742 * Math.asin(Math.sqrt(a));

    }

    return findDistance();

  }
}


