import {Component} from '@angular/core';
import {App, InfiniteScroll, IonicPage, NavController, NavParams, Refresher} from 'ionic-angular';
import {Place} from "../../models/place/Place";
import {GlobalConfigsService} from "../../configs/GlobalConfigsService";
import {EventProvider} from "../../providers/event/EventProvider";
import {CreateEventPage} from "../create-event/create-event";
import {UpdateEventPage} from "../update-event/update-event";
import {AuthProvider} from "../../providers/auth/auth";


@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {
  principal;

  globalHost: string;
  events: Event[] = [];
  place: Place;

  skip = 0;
  pageSize = 7;
  limit = this.pageSize;
  allLoaded = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private gc: GlobalConfigsService,
    private eventService: EventProvider,
    private app: App,
    private auth: AuthProvider
  ) {
  }

  ngOnInit() {
    this.globalHost = this.gc.getGlobalHost();
    this.place = this.navParams.data;

    this.auth.loadPrincipal().subscribe((principal) => {
      this.principal = principal;
      this.loadEvents()
        .subscribe((events) => {
          this.events = events;
        });
    });
  }

  goToCreateEvent() {
    this.app.getRootNav().push(CreateEventPage, {place: this.place});
  }


  doRefresh(refresher: Refresher) {
    this.skip = 0;
    this.allLoaded = false;

    this.loadEvents()
      .subscribe((events) => {
        this.events = events;
        refresher.complete();
      });
  }

  loadEvents() {
    return this.eventService.find({
      query: {place: this.navParams.data._id},
      populate: [
        {
          path: 'multilang',
          match: {lang: this.gc.getGlobalLang()}
        }
      ],
      skip: this.skip,
      limit: this.limit
    })
  }

  removePromo(promo: any) {
    this.eventService.remove(promo._id).subscribe();
    this.events.splice(this.events.indexOf(promo), 1);
  }

  updatePromo(promo: any) {
    this.app.getRootNav().push(UpdateEventPage, {promo: promo});
  }

  loadNextEventsPage(event: InfiniteScroll) {
    if (this.allLoaded) {
      event.complete();
    } else {
      this.setNextPage();
      this.loadEvents()
        .subscribe((events) => {
          if (events.length < this.pageSize) this.allLoaded = true;
          this.events.push(...events);
          event.complete();
        })
    }
  }

  setNextPage() {
    this.skip += this.pageSize;
  }
}
