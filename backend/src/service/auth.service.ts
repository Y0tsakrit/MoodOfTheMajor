import { userRepository } from "../Repository/user.repository";
import { profileRepository } from "../Repository/profile.repository";
import { departmentRepository } from "../Repository/department.repository";
import { UserCreateDTO } from "../interface/createUserDTO.interface";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";


export default class AuthService {
    private userRepository;
    private profileRepository;
    private departmentRepository;

    constructor() {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.departmentRepository = departmentRepository;
    }

    async registerUser(data: UserCreateDTO) {
        const existingUser = await this.userRepository.SearchByCriteria({ email: data.email });

        if (existingUser.length > 0) {
            throw new Error("User with this email already exists");
        }

        const existingDepartment = await this.departmentRepository.SearchByCriteria({ faculty: data.profileData.faculty, major: data.profileData.departmentName });

        if (!existingDepartment[0]) {
            throw new Error("Department not found");
        }

        const profile = await this.profileRepository.CreateProfile({
            firstName: data.profileData.firstName,
            lastName: data.profileData.lastName,
            departmentId: existingDepartment[0].id,
            year: data.profileData.year
        });

        if (!profile) {
            throw new Error("Failed to create profile");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.userRepository.CreateUser({
            email: data.email,
            password: hashedPassword,
            isAdmin: false,
            profileId: profile.id,
            CreatedAt: new Date(),
            UpdatedAt: new Date()
        });

        if (!user) {
            throw new Error("Failed to create user");
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                isAdmin: user.isAdmin,
                profileId: user.profileId,
                CreatedAt: user.CreatedAt,
                UpdatedAt: user.UpdatedAt
            }
        };
    }

    async loginUser(email: string, password: string) {
        const users = await this.userRepository.SearchByCriteria({ email });

        if (users.length === 0) {
            throw new Error("Invalid email or password");
        }

        const user = users[0];

        if (!user) {
            throw new Error("Invalid email or password");
        }


        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        const token = jsonwebtoken.sign(
            { userId: user.id, email: user.email, profileId: user.profileId},
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "24h" }
        );
        return {
            token: token
        };
    }
}