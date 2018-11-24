import { AppSettings } from "../../app/app-settings";

export class SportModel {
    bgImage: string;
    sportId : string;
    name: string;; 
    orderBy: number;
    status : number;
    imageUrl:string;
    sportPlayTypeList : SportPlayTypeModel[];

    public static setImageUrl(sport: SportModel) {
        sport.imageUrl = `${AppSettings.API_STARTPOINT}${sport.imageUrl}`
    }
}

export class SportPlayTypeModel{
    playTypeId: string;
    playTypeName: string;
    description: string;
    maxPlayerCount: number;
    orderBy: number;
    playerCount: number;
    sportId: string;
    sportsName: string;
    status: number;
}