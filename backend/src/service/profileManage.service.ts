import { profileRepository } from "../Repository/profile.repository";
import { departmentRepository } from "../Repository/department.repository";
import { UpdateProfileDTO } from "../interface/updateProfileDTO.interface";
import { ProfileUpdateCriteria } from "../interface/profileUpdateCriteria.interface";
import { ProfileSearchCriteria } from "../interface/profileSearchCriteria.interface";


export default class ProfileManageService {
    private profileRepository;
    private departmentRepository;

    constructor() {
        this.profileRepository = profileRepository;
        this.departmentRepository = departmentRepository;
    }

    async updateProfile(profileId: string, data: UpdateProfileDTO) {

    if (!profileId || profileId.length !== 24) {
        throw new Error("Invalid profile ID");
    }
    const profile = await this.profileRepository.SearchByCriteria({ id: profileId });

    if (!profile[0]) {
        throw new Error("Profile not found");
    }

    const updatedProfileData: ProfileUpdateCriteria = {
        firstName: data.firstName || profile[0].firstName,
        lastName: data.lastName || profile[0].lastName,
        departmentId: data.departmentId !== null && data.departmentId !== undefined ? data.departmentId : profile[0].departmentId,
        year: data.year ? data.year : profile[0].year,
        updatedAt: new Date(),
};
        await this.profileRepository.UpdateProfile(profileId, updatedProfileData);
    }

    async getProfile(criteria: ProfileSearchCriteria) {
        try {
            return await this.profileRepository.SearchByCriteria(criteria);
        } catch (error) {
            throw new Error("Error occurred while fetching profile");
        }
    }
}