import {Lang} from "../lang/Lang";
import {Multilang} from "./Multilang";

export class EventMultilang extends Multilang{
  constructor(
    public id: string = '',
    public header: string = '',
    public description: string = '',
    public promo: string = '',
    public lang: Lang = null
  ) {
    super(lang);
  }
}
