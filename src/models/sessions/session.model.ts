
import { AddressModel } from "../shared/address.model";

export class SessionModel {
    sessionid:string;
    sessionType: string;
    sportid:string;
    sportName: string;
    playTypeId: string;
    playTypeName: string;
    organizerId: string;
    organizerName: string;
    addressl: AddressModel;
    maxParticipantsCount: number;
    participantsCount: number;
    startDate: number;
    endDate: number;
    registrationOpenAt: number;
    registrationClosAt: number;
    venueId: string;
    venueName: string
    distance: string;
    ageLimit: number;
    ageStart: number;
    ageEnd: number;
    rankTypeId: string;
    rankName: string;
    rankingLevelFrom: number;
    rankingLevelTo: number;
    comments: string;
    sessionStatus: string;
    registrationOpenAtStr: string;
    registrationClosAtStr: string;
    startDateStr: string;
    endDateStr: string;
    userDeviceId: string;
    ipAddress: string;
    
}
