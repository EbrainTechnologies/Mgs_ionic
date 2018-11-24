import { UserModel } from "./user.model";
import { FeatureModel } from "./feature.model";
import { UserFeatureModel } from "./user-feature.model";

export class UserInfoModel {
    user: UserModel;
    feature: FeatureModel;
    userFeature: UserFeatureModel;
    message: string;
    status: number;
}