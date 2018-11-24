import { AddressModel } from "../shared/address.model";

export class ReservationItemModel {
    // id: string;
    // date: Date;
    // dateStr: Date // Formatted date
    // time: string;
    // sport: string;
    // sportPlayType: any; 
    // playerCount: number;
    // status: string; // Open, Completed, cancelled
    // ownerId: string; // Id Of the User who created the session
    // ownerName: string; // Name of the user who created the session
    // playerName: string; // Contains name of the user who accepted the session
    // type: string // Event, Session or Venue booking 
    // message: string;
    // image: string;
    // startTime: number;
    // startTimeStr: string // Formatted
    // endTime: number;
    // endTimeStr:string;// Formatted
    // isFree: boolean;
    // amount: string;
    // address: AddressModel;

    address: AddressModel;
    actionType: string;
    canCancel: boolean;
    dateStr: string;
    displayStatus: string;
    displayName: string;
    eventId: string;
    playerId: string;
    reservationType: string;
    sessionRegistrationId: string;
    sessionId: string;
    sportId: string;
    sportName: string;
    showVenue: boolean;
    timeStr: string;
    userId: string;
    venueName: string;
    venueId: string; 
    organizerId: string;  
    organizerName: string;
}