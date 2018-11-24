import { AddressModel } from "../shared/address.model";
import { DateTime } from "../../../node_modules/ionic-angular/umd";
import { Time } from "../../../node_modules/@angular/common";
import { SportPlayTypeModel } from "../shared/sport.model";

export class VenuSearchModel {
    sportName: string;
    sportId: string;
    address: AddressModel;
    playingDate: string;
    startTime: Time;
    endTime: Time;
    searchRange: number;
}