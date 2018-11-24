import { EventDiscountModel } from './event-discount.model';
import { AddressModel } from '../shared/address.model';

export class EventModel
{
	accountIdentifier: string;
	accountName: string;
	address: AddressModel;
	ageLimit: number;
	comments: string;
	currencyCode: string;
	endDate: Date;
	endDateStr: string;
	entryFee: number;
	eventDiscounts: EventDiscountModel[]; 
	eventId: string;
	eventName: string;
	eventOrganizerId: string;
	eventOrganizerName: string;
	eventPhotoUrl: string;
	eventStatus: string;
	eventType: string;
	eventVideoUrl: string;
	isAgeRestricted: boolean;
	isCompetitive: number;
	isFeatured: number;
	isFree:boolean;
	isPublic: number;
	isRegistrationClosed:boolean;
	maxParticipantsCount: number;
	organizerId: string;
	organizerName: string;
	participantsCount: number;
	registrationClosAt: Date;
	registrationClosStr: string;
	registrationOpenAt: Date;
	registrationOpenStr: string;
	sports: string[];
	startDate: Date;
	startDateStr: string;
	venueId: string;
	venueName: string;
	
	status: string;
	createdBy: string;
	createdDate: Date;
	updatedBy: string;
	updatedDate: Date;

	//User's specifi data
	registrationStatus: string;
	
}