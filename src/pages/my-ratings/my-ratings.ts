import {Component} from '@angular/core';
import {App, InfiniteScroll, IonicPage, ModalController, NavController, NavParams, Refresher} from 'ionic-angular';
import {RatingProvider} from "../../providers/rating/rating-provider";
import {Rating} from "../../models/rating/Rating";
import {GlobalConfigsService} from "../../configs/GlobalConfigsService";
import {Client} from "../../models/client/Client";
import {AuthProvider} from "../../providers/auth/auth";
import {UpdateRatingPage} from "../update-rating/update-rating";
import {Observable} from "rxjs/Observable";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-my-ratings',
  templateUrl: 'my-ratings.html',
})
export class MyRatingsPage {

  principal: Client;
  ratings: Rating[] = [];

  skip = 0;
  pageSize = 7;
  limit = this.pageSize;
  allLoaded = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private ratingProvider: RatingProvider,
    private globalConfigProvider: GlobalConfigsService,
    private modal: ModalController,
    private auth: AuthProvider,
    private app: App,
    private translate : TranslateService,
    private globalConfig : GlobalConfigsService
  ) {
    // this.translate.setDefaultLang("en");
    // this.translate.use(this.globalConfig.deviceLang);
    this.auth.loadPrincipal().subscribe((principal) => {
      this.principal = principal;
      this.loadRatings().subscribe(ratings => this.ratings = ratings);
    });
  }

  ngOnInit() {
  }

  doRefresh(refresher: Refresher) {
    this.skip = 0;
    this.allLoaded = false;

    this.loadRatings().subscribe(ratings => {
      this.ratings = ratings;
      refresher.complete();
    });
  }

  loadRatings() {
    return new Observable<Rating[]>((subscriber) => {
      this.ratingProvider.find({
        query: {client: (<any>this.principal)._id},
        populate: [
          {path: 'client'},
          {
            path: 'place',
            populate: [{path: 'multilang', match: {lang: this.globalConfigProvider.getGlobalLang()}}]
          }
        ],
        skip: this.skip,
        limit: this.limit
      }).subscribe((ratings) => {
        let okRatings = [];
        let otherRatingIds = [];
        for (const rating of ratings) {
          if (!rating.place.multilang || rating.place.multilang.length === 0) {
            otherRatingIds.push(rating._id);
          } else {
            okRatings.push(rating);
          }
        }
        if (otherRatingIds.length > 0) {
          this.ratingProvider.find({
            query: {_id: {$in: otherRatingIds}},
            populate: [
              {path: 'client'},
              {
                path: 'place',
                populate: [{path: 'multilang', options: {limit: 1}}]
              }
            ],
            skip: this.skip,
            limit: this.limit
          }).subscribe((ratings) => {
            okRatings.push(...ratings);
            subscriber.next(okRatings);
          });
        } else {
          subscriber.next(okRatings);
        }
      })
    });
  }

  removeRating(rating) {
    this.ratingProvider.remove(rating._id);
    this.ratings.splice(this.ratings.indexOf(rating), 1);
  }

  updateRating(rating) {
    this.app.getRootNav().push(UpdateRatingPage, {rating: rating});
  }

  loadNextRatingsPage(event: InfiniteScroll) {
    if (this.allLoaded) {
      event.complete();
    } else {
      this.setNextPage();
      this.loadRatings()
        .subscribe((ratings) => {
          if (ratings.length < this.pageSize) this.allLoaded = true;
          this.ratings.push(...ratings);
          event.complete();
        })
    }

  }

  setNextPage() {
    this.skip += this.pageSize;
  }
}
