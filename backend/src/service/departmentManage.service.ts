import {departmentRepository} from '../Repository/department.repository';
import { DepartmentCreateDTO } from '../interface/createDepartmentDTO.interface';
import { DepartmentCreateCriteria } from '../interface/departmentCreateCriteria.interface';
import {DepartmentSearchCriteria} from '../interface/departmentSearchCriteria.interface';

export default class DepartmentManageService {
    private departmentRepository;

    constructor() {
        this.departmentRepository = departmentRepository;
    }

    async getDepartment(criteria: DepartmentSearchCriteria) {

        const department = await this.departmentRepository.SearchByCriteria(criteria);
        return department;
    }

    async createDepartment(data: DepartmentCreateDTO) {
        
        const payload : DepartmentCreateDTO = {
            faculty: (data.faculty).toLowerCase(),
            major: (data.major).toLowerCase()
        };

        const existingDepartment = await this.departmentRepository.SearchByCriteria(payload);
        if (existingDepartment.length > 0) {
            throw new Error('Department already exists');
        }

        const finalData: DepartmentCreateCriteria = {
            ...data,
            CreatedAt: new Date(),
            UpdatedAt: new Date()
        };
        const newDepartment = await this.departmentRepository.CreateDepartment(finalData);
        return newDepartment;
    }

}