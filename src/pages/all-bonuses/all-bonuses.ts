import {Component} from '@angular/core';
import {App, InfiniteScroll, IonicPage, ModalController, NavController, NavParams, Refresher} from 'ionic-angular';
import {Bonuse} from "../../models/promo/bonuse/Bonuse";
import {BonuseProvider} from "../../providers/bonuse/bonuseProvider";
import {GlobalConfigsService} from "../../configs/GlobalConfigsService";
import {UpdateBonusePage} from "../update-bonuse/update-bonuse";
import {AuthProvider} from "../../providers/auth/auth";
import {ModalChooseLangPage} from "../modal-choose-lang/modal-choose-lang";
import {SingleBonusePage} from "../single-bonuse/single-bonuse";

@IonicPage()
@Component({
  selector: 'page-all-bonuses',
  templateUrl: 'all-bonuses.html',
})
export class AllBonusesPage {

  principal;

  bonuses: Bonuse[] = [];
  globalHost: string;

  skip = 0;
  pageSize = 7;
  limit = this.pageSize;
  allLoaded = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private gc: GlobalConfigsService,
    private bonuseService: BonuseProvider,
    private app: App,
    private auth: AuthProvider,
    public modal: ModalController,
  ) {
  }

  ngOnInit() {
    this.auth.loadPrincipal().subscribe((principal) => {
      this.principal = principal;
      this.globalHost = this.gc.getGlobalHost();
      this.loadBonuses().subscribe((bonuses) => {
        this.bonuses = bonuses;
      });
    })
  }

  doRefresh(refresher: Refresher) {
    this.skip = 0;
    this.allLoaded = false;

    this.loadBonuses()
      .subscribe((bonuses) => {
        this.bonuses = bonuses;
        refresher.complete();
      });
  }

  loadBonuses() {
    return this.bonuseService.find({
      aggregate: [
        {$match: {topPromo: true}},
        {
          $lookup: {
            from: 'multilangs',
            localField: '_id',
            foreignField: 'promo',
            as: 'multilang',
          }
        },
        {$unwind: "$multilang"},
        {
          $lookup: {
            from: 'multilangs',
            localField: 'place',
            foreignField: 'place',
            as: 'place',
          }
        },
        {$unwind: "$place"},
        {$match: {'place.lang': this.gc.getGlobalLang(), 'multilang.lang': this.gc.getGlobalLang()}},
        {
          $project: {
            _id: 1,
            createdAt: 1,
            place: 1,
            multilang: 1,
            startDate: 1,
            endDate: 1,
            image: 1,
            kind: 1,
          }
        },
        {$sort: {createdAt: -1}},
        {$skip: this.skip},
        {$limit: this.limit},
      ]
    })

  }

  removePromo(promo: any) {
    this.bonuseService.remove(promo._id).subscribe();
    this.bonuses.splice(this.bonuses.indexOf(promo), 1);
  }

  updatePromo(promo: any) {
    let modalItem = this.modal.create(ModalChooseLangPage, {
      object: promo,
      page: UpdateBonusePage
    });
    modalItem.present();
  }

  loadNextBonusesPage(event: InfiniteScroll) {
    if (this.allLoaded) {
      event.complete();
    } else {
      this.setNextPage();
      this.loadBonuses()
        .subscribe((bonuses) => {
          if (bonuses.length < this.pageSize) this.allLoaded = true;
          this.bonuses.push(...bonuses);
          event.complete();
        })
    }

  }

  setNextPage() {
    this.skip += this.pageSize;
  }

  goToSingleBonuse(bonuse) {
    this.app.getRootNav().push(SingleBonusePage, {bonuse: bonuse, pm: bonuse.place});
  }
}
