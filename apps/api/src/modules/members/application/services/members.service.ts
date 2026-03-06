import { ConflictException, Injectable } from "@nestjs/common";

import { RegisterMemberDto } from "@members/api/dto/register-member.dto";
import { DocumentRepository } from "@members/domain/repositories/document-repository.interface";
import { MemberDocumentRepository } from "@members/domain/repositories/member-document-repository.interface";
import { MemberMjStatusRepository } from "@members/domain/repositories/member-mj-status-repository.interface";
import { MemberRepository } from "@members/domain/repositories/member-repository.interface";
import { MjStatusRepository } from "@members/domain/repositories/mj-status-repository.interface";
import { UserRepository } from "@users/domain/repositories/user-repository.interface";
import { hash } from "bcrypt";

@Injectable()
export class MembersService {
    constructor(
        private readonly memberRepository: MemberRepository,
        private readonly userRepository: UserRepository,
        private readonly mjStatusRepository: MjStatusRepository,
        private readonly memberMjStatusRepository: MemberMjStatusRepository,
        private readonly documentRepository: DocumentRepository,
        private readonly memberDocumentRepository: MemberDocumentRepository
    ) {}

    private async hashPassword(password: string): Promise<string> {
        const hashFn = hash as unknown as (value: string, rounds: number) => Promise<string>;
        return hashFn(password, 10);
    }

    /**
     * Проверка существования пользователя и его ролей
     */
    async checkUserExists(email: string): Promise<{
        exists: boolean;
        hasEmployee: boolean;
        hasMember: boolean;
        message?: string;
    }> {
        const user = await this.userRepository.findByEmailWithRelations(email);

        if (!user) {
            return {
                exists: false,
                hasEmployee: false,
                hasMember: false,
            };
        }

        const hasEmployee = !!user.employee;
        const hasMember = !!user.member;

        let message: string | undefined;
        if (hasEmployee && !hasMember) {
            message =
                "You are already registered as an Employee. Do you want to register as a Member?";
        } else if (hasMember) {
            message = "You are already registered as a Member.";
        }

        return {
            exists: true,
            hasEmployee,
            hasMember,
            message,
        };
    }

    /**
     * Создание Member с User
     */
    async createMember(
        dto: RegisterMemberDto,
        force: boolean = false
    ): Promise<{
        userId: string;
        memberId: string;
    }> {
        // Проверяем существование пользователя через репозиторий
        const existingUser = await this.userRepository.findByEmailWithRelations(dto.email);

        if (existingUser) {
            // Если уже есть Member - ошибка
            if (existingUser.member) {
                throw new ConflictException("User is already registered as Member");
            }

            // Если есть Employee, но не force - нужно подтверждение
            if (existingUser.employee && !force) {
                throw new ConflictException(
                    "User already exists as Employee. Please confirm registration as Member."
                );
            }

            // Используем существующего User
            const passwordHash = await this.hashPassword(dto.password);
            await this.userRepository.update(existingUser.id, { passwordHash });

            // Создаем Member через репозиторий
            const member = await this.memberRepository.create({
                userId: existingUser.id,
                name: dto.name,
                surname: dto.surname,
                phone: dto.phone,
                birthday: dto.birthday ? new Date(dto.birthday) : undefined,
                membershipNumber: undefined,
                address: dto.address,
                status: "inProgress",
            });

            // Создаем MjStatus связи
            await this.createMjStatuses(member.id, dto);

            // Создаем Document связи
            if (dto.documentType && dto.documentNumber) {
                await this.createDocument(member.id, dto.documentType, dto.documentNumber);
            }

            return {
                userId: existingUser.id,
                memberId: member.id,
            };
        }

        // Создаем нового User и Member
        const passwordHash = await this.hashPassword(dto.password);
        const user = await this.userRepository.create({
            email: dto.email,
            passwordHash,
        });

        // Создаем Member через репозиторий
        const member = await this.memberRepository.create({
            userId: user.id,
            name: dto.name,
            surname: dto.surname,
            phone: dto.phone,
            birthday: dto.birthday ? new Date(dto.birthday) : undefined,
            membershipNumber: undefined,
            address: dto.address,
            status: "inProgress",
        });

        // Создаем MjStatus связи
        await this.createMjStatuses(member.id, dto);

        // Создаем Document связи
        if (dto.documentType && dto.documentNumber) {
            await this.createDocument(member.id, dto.documentType, dto.documentNumber);
        }

        return {
            userId: user.id,
            memberId: member.id,
        };
    }

    /**
     * Создание связей MjStatus
     */
    private async createMjStatuses(memberId: string, dto: RegisterMemberDto) {
        const statuses: string[] = [];
        if (dto.isMedical) statuses.push("medical");
        if (dto.isMj) statuses.push("mj");
        if (dto.isRecreation) statuses.push("recreation");

        for (const code of statuses) {
            let mjStatus = await this.mjStatusRepository.findByCode(code);
            if (!mjStatus) {
                // Создаем статус если не существует
                mjStatus = await this.mjStatusRepository.create({
                    code,
                    name: code.charAt(0).toUpperCase() + code.slice(1),
                });
            }
            await this.memberMjStatusRepository.create({
                memberId,
                mjStatusId: mjStatus.id,
            });
        }
    }

    /**
     * Создание связи Document
     */
    private async createDocument(memberId: string, documentType: string, documentNumber: string) {
        let document = await this.documentRepository.findByType(documentType);
        if (!document) {
            // Создаем документ если не существует
            document = await this.documentRepository.create({
                type: documentType,
                name: documentType,
            });
        }
        await this.memberDocumentRepository.create({
            memberId,
            documentId: document.id,
            number: documentNumber,
        });
    }

    /**
     * Получить Member по userId
     */
    async findByUserId(userId: string) {
        return this.memberRepository.findByUserId(userId);
    }
}
