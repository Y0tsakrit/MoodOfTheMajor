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

    let department = profile[0].departmentId;

    const updatedProfileData: ProfileUpdateCriteria = {
        firstName: data.firstName || profile[0].firstName,
        lastName: data.lastName || profile[0].lastName,
        departmentId: data.departmentId || department,
        year: data.year ? data.year : profile[0].year,
        updatedAt: new Date(),
    };
        await this.profileRepository.UpdateProfile(profileId, updatedProfileData);
    }

    async getProfile(criteria: ProfileSearchCriteria, isAdmin: boolean = false) {
        try {
            const profiles = await this.profileRepository.SearchByCriteria(criteria);
            const totalProfiles = await Promise.all(profiles.map(async (profile) => {
                const department = await this.departmentRepository.SearchByCriteria({ id: profile.departmentId });
                return {
                    id: profile.id,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    year: profile.year,
                    department: department[0] || null,
                    isAdmin: isAdmin
                };
            }));
            return totalProfiles;
        } catch (error) {
            throw new Error("Error occurred while fetching profile");
        }
    }
}