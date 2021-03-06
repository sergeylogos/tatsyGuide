import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Client} from "../../models/client/Client";
import {ComplaintProvider} from "../complaint/complaint-provider";
import {DrinkApplicationProvider} from "../drinkApplication/drinkApplication-provider";
import {RatingProvider} from "../rating/rating-provider";
import {DepartmentProvider} from "../department/department-provider";
import {BonuseProvider} from "../bonuse/bonuseProvider";
import {EventProvider} from "../event/EventProvider";
import {NewsProvider} from "../news/NewsProvider";
import {GlobalConfigsService} from "../../configs/GlobalConfigsService";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ClientProvider {

  constructor(
    private http: HttpClient,
    private complaintService: ComplaintProvider,
    private drinkApplicationService: DrinkApplicationProvider,
    private ratingService: RatingProvider,
    private departmentService: DepartmentProvider,
    private bonuseService: BonuseProvider,
    private eventService: EventProvider,
    private newsService: NewsProvider,
    private globalConfig: GlobalConfigsService
  ) {
  }


  find(request): Observable<Client[]> {
    let url = this.globalConfig.getGlobalHost() + `/api/clients?`;
    for (const key in request) {
      if (request[key]) {
        url += `${key}=${JSON.stringify(request[key])}&`;
      }
    }
    return this.http.get<Client[]>(url);
  }

  update(id: string, client: any): Observable<any> {
    return this.http.put<Client>(`${this.globalConfig.getGlobalHost()}/api/clients/${id}`, client);
  }

  remove(_id: any) {
    return this.http.delete(`${this.globalConfig.getGlobalHost()}/api/clients/${_id}`);
  }
}
