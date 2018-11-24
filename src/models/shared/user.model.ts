import { AddressModel } from '../shared/address.model';
export class UserModel
 {
    address: AddressModel;
    birthDate: any;
    createdBy: string;
    createdDate: any;
    createdFrom: any;
    dateFormat: string;
    dateTimeFormat: string;
    defaultLanguage: string;
    displayName: string;
    emailViewed: any;
    emailid: string;
    externalReference: any;
    fax: any;
    firstName: string;
    identifier: any;
    ipAddress: string;
    isOtpVerified: boolean;
    isRestricted: boolean;
    lastLogin: string;
    lastName: string;
    notificationRegistrationKey: string;
    otp: string;
    password: string;
    phoneNumber: string;
    photo: any;
    promocodeCode:string;
    pushViewed: any;
    sex: string;
    status: number;
    timeFormat: string;
    timeZone: string;
    updatedBy: string;
    updatedDate: any;
    userDeviceId: string;
    userLocation: AddressModel;
    userName: string;
    userType: any;
    userid: string;
    userProfileImage: string;
    


    public static setDisplayName(user:UserModel) {
        let lastName = user.lastName? user.lastName: "";
        user.displayName = user.firstName + " " + lastName;
    }
}