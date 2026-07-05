import { userRepository } from "../Repository/user.repository";
import { profileRepository } from "../Repository/profile.repository";
import { tokenRepository } from "../Repository/token.repository";
import { departmentRepository } from "../Repository/department.repository";
import { UserCreateDTO } from "../interface/createUserDTO.interface";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";

export default class AuthService {
    private userRepository;
    private profileRepository;
    private departmentRepository;
    private tokenRepository;

    constructor() {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.departmentRepository = departmentRepository;
        this.tokenRepository = tokenRepository;
    }

    async registerUser(data: UserCreateDTO) {
        const existingUser = await this.userRepository.SearchByCriteria({ email: data.email });

        if (existingUser.length > 0) {
            throw new Error("User with this email already exists");
        }

        const existingDepartment = await this.departmentRepository.SearchByCriteria({ 
            faculty: data.profileData.faculty, 
            major: data.profileData.departmentName 
        });

        if (!existingDepartment[0]) {
            throw new Error("Department not found");
        }

        const profile = await this.profileRepository.CreateProfile({
            firstName: data.profileData.firstName,
            lastName: data.profileData.lastName,
            departmentId: existingDepartment[0].id,
            year: data.profileData.year
        });

        if (!profile || !profile.id) {
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

        const rawRefreshToken = generateRandomToken();

        await this.saveRefreshToken(rawRefreshToken, user.id);

        const accessToken = jsonwebtoken.sign(
            { 
                userId: user.id, 
                email: user.email, 
                profileId: user.profileId, 
                isAdmin: user.isAdmin 
            },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "5m" }
        );

        return {
            refreshToken: rawRefreshToken,
            accessToken: accessToken
        };
    }

    async saveRefreshToken(token: string, userId: string) {
        const hashedRefreshToken = crypto.createHash('sha256').update(token).digest('hex');
        
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);

        return this.tokenRepository.CreateToken({
            userId: userId.toString(),
            token: hashedRefreshToken,
            expiration: expirationDate
        });
    }

    async verifyAccessToken(token: string) {
        try {
            const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET || "default_secret");
            return decoded;
        }
        catch (error) {
            throw new Error("Invalid or expired access token");
        }
    }

    async refreshAccessToken(refreshToken: string) {
        const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const tokenRecord = await this.tokenRepository.SearchByToken(hashedRefreshToken);

        if (!tokenRecord) {
            throw new Error("Invalid refresh token");
        }

        if (new Date() > tokenRecord.expiration) {
            throw new Error("Refresh token has expired");
        }

        const user = await this.userRepository.SearchByCriteria({ id: tokenRecord.userId });

        if (user.length === 0 || !user[0]) {
            throw new Error("User not found");
        }

        const accessToken = jsonwebtoken.sign(
            { 
                userId: user[0].id, 
                email: user[0].email, 
                profileId: user[0].profileId, 
                isAdmin: user[0].isAdmin 
            },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "5m" }
        );

        return { accessToken };
    }

}

const generateRandomToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
};