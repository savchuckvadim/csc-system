import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Patch,
    Query,
    StreamableFile,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

import { MembersService } from "@members/application/services/members.service";
import { StorageService } from "@storage/application/services/storage.service";

import { Public } from "@common/decorators/auth/public.decorator";

@ApiTags("CRM Members (temporary public)")
@Controller("crm/members")
export class CrmMembersController {
    constructor(
        private readonly membersService: MembersService,
        private readonly storageService: StorageService
    ) {}

    @Get()
    @Public()
    @ApiOperation({ summary: "List members for CRM preview (without authentication)" })
    @ApiQuery({ name: "limit", required: false, type: Number, example: 100 })
    async list(@Query("limit") limit?: string) {
        const parsedLimit = Number.parseInt(limit ?? "", 10);
        const take = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 100;
        const members = await this.membersService.findAll(take);

        return members.map((member) => ({
            id: member.id,
            userId: member.userId,
            email: member.user.email,
            name: member.name,
            surname: member.surname,
            phone: member.phone,
            status: member.status,
            isActive: member.isActive,
            emailConfirmed: false,
            createdAt: member.createdAt,
        }));
    }

    @Get(":id")
    @Public()
    @ApiOperation({ summary: "Get member details for CRM preview (without authentication)" })
    async byId(@Param("id") id: string) {
        const member = await this.membersService.findById(id);

        if (!member) {
            return null;
        }

        return {
            id: member.id,
            userId: member.userId,
            email: member.user.email,
            name: member.name,
            surname: member.surname,
            phone: member.phone,
            birthday: member.birthday,
            status: member.status,
            isActive: member.isActive,
            emailConfirmed: false,
            address: member.address,
            membershipNumber: member.membershipNumber,
            notes: member.notes,
            createdAt: member.createdAt,
            updatedAt: member.updatedAt,
            identityDocuments: member.identityDocuments.map((doc) => ({
                id: doc.id,
                type: doc.type,
                side: doc.side,
                storagePath: doc.storagePath,
                createdAt: doc.createdAt,
            })),
            signature: member.signature
                ? {
                      id: member.signature.id,
                      storagePath: member.signature.storagePath,
                      createdAt: member.signature.createdAt,
                  }
                : null,
            mjStatuses: member.memberMjStatuses.map((item) => ({
                id: item.mjStatus.id,
                code: item.mjStatus.code,
                name: item.mjStatus.name,
            })),
            documents: member.memberDocuments.map((item) => ({
                id: item.document.id,
                type: item.document.type,
                name: item.document.name,
                number: item.number,
            })),
        };
    }

    @Patch(":id")
    @Public()
    @ApiOperation({ summary: "Update member details from CRM (temporary no-auth)" })
    async update(
        @Param("id") id: string,
        @Body()
        dto: {
            name?: string;
            surname?: string;
            phone?: string;
            birthday?: string;
            membershipNumber?: string;
            address?: string;
            status?: string;
            notes?: string;
            isMedical?: boolean;
            isMj?: boolean;
            isRecreation?: boolean;
            documentType?: string;
            documentNumber?: string;
        }
    ) {
        const updated = await this.membersService.updateCrmMember(id, dto);
        if (!updated) {
            throw new NotFoundException("Member not found");
        }
        return this.byId(updated.id);
    }

    @Patch(":id/files")
    @Public()
    @ApiOperation({ summary: "Re-upload member files from CRM (temporary no-auth)" })
    async updateFiles(
        @Param("id") id: string,
        @Body()
        dto: {
            documentType?: string;
            documentFirst?: string;
            documentSecond?: string;
            signature?: string;
        }
    ) {
        const updated = await this.membersService.updateCrmMemberFiles(id, dto);
        if (!updated) {
            throw new NotFoundException("Member not found");
        }
        return this.byId(updated.id);
    }

    @Get(":id/identity-documents/:documentId/preview")
    @Public()
    @ApiOperation({ summary: "Preview identity document image" })
    async identityDocumentPreview(
        @Param("id") memberId: string,
        @Param("documentId") documentId: string
    ): Promise<StreamableFile> {
        const member = await this.membersService.findById(memberId);
        const document = member?.identityDocuments.find((doc) => doc.id === documentId);

        if (!document) {
            throw new NotFoundException("Identity document not found");
        }

        const fileBuffer = await this.storageService.getFile(document.storagePath);
        return new StreamableFile(fileBuffer, {
            type: this.resolveMimeType(document.storagePath),
        });
    }

    @Get(":id/signature/preview")
    @Public()
    @ApiOperation({ summary: "Preview signature image" })
    async signaturePreview(@Param("id") memberId: string): Promise<StreamableFile> {
        const member = await this.membersService.findById(memberId);
        if (!member?.signature) {
            throw new NotFoundException("Signature not found");
        }

        const fileBuffer = await this.storageService.getFile(member.signature.storagePath);
        return new StreamableFile(fileBuffer, {
            type: this.resolveMimeType(member.signature.storagePath),
        });
    }

    private resolveMimeType(storagePath: string): string {
        const normalizedPath = storagePath.toLowerCase();
        if (normalizedPath.endsWith(".png")) return "image/png";
        if (normalizedPath.endsWith(".jpg") || normalizedPath.endsWith(".jpeg")) return "image/jpeg";
        if (normalizedPath.endsWith(".webp")) return "image/webp";
        if (normalizedPath.endsWith(".gif")) return "image/gif";
        if (normalizedPath.endsWith(".pdf")) return "application/pdf";
        return "application/octet-stream";
    }
}
