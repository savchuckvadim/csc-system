import { getApiBaseUrl, apiFetchJsonWithRefresh } from "@/modules/shared";

export interface CrmMemberListItem  {
    id: string;
    userId: string;
    email: string;
    name: string;
    surname: string | null;
    phone: string | null;
    status: string;
    isActive: boolean;
    emailConfirmed: boolean;
    createdAt: string;
}

export interface CrmMemberDetails extends CrmMemberListItem {
    birthday: string | null;
    address: string | null;
    membershipNumber: string | null;
    notes: string | null;
    updatedAt: string;
    identityDocuments: Array<{
        id: string;
        type: string;
        side: string;
        storagePath: string;
        createdAt: string;
    }>;
    signature: {
        id: string;
        storagePath: string;
        createdAt: string;
    } | null;
    mjStatuses: Array<{
        id: string;
        code: string;
        name: string;
    }>;
    documents: Array<{
        id: string;
        type: string;
        name: string;
        number: string | null;
    }>;
}

async function crmRequest<T>(path: string, init?: RequestInit): Promise<T> {
    return apiFetchJsonWithRefresh<T>(path, init);
}

export async function getCrmMembers(limit: number = 100): Promise<CrmMemberListItem[]> {
    return crmRequest<CrmMemberListItem[]>(`/crm/members?limit=${limit}`, {
        method: "GET",
    });
}

export async function getCrmMemberById(memberId: string): Promise<CrmMemberDetails | null> {
    return crmRequest<CrmMemberDetails | null>(`/crm/members/${memberId}`, {
        method: "GET",
    });
}

export function getIdentityDocumentPreviewUrl(memberId: string, documentId: string): string {
    return `${getApiBaseUrl()}/crm/members/${memberId}/identity-documents/${documentId}/preview`;
}

export function getSignaturePreviewUrl(memberId: string): string {
    return `${getApiBaseUrl()}/crm/members/${memberId}/signature/preview`;
}

export async function updateCrmMember(
    memberId: string,
    payload: {
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
): Promise<CrmMemberDetails> {
    return crmRequest<CrmMemberDetails>(`/crm/members/${memberId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export async function updateCrmMemberFiles(
    memberId: string,
    payload: {
        documentType?: string;
        documentFirst?: string;
        documentSecond?: string;
        signature?: string;
    }
): Promise<CrmMemberDetails> {
    return crmRequest<CrmMemberDetails>(`/crm/members/${memberId}/files`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}
