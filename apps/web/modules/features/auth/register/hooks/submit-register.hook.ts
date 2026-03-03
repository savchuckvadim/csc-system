"use client";
import { useMutation } from "@tanstack/react-query";

import {
    MemberRegistrationSiteService,
    OpenAPI,
    type RegisterMemberDto,
    type RegisterMemberResponseDto,
} from "@workspace/api-client/generated";

export interface RegisterFormSubmitData {
    name: string;
    surname: string;
    email: string;
    phone: string;
    birthday: string;
    documentType: string;
    documentNumber: string;
    password: string;
    repeatPassword: string;
    isMedical: boolean;
    isRecreation: boolean;
    isMj: boolean;
    documentFirst?: File;
    documentSecond?: File;
    signature: string;
}

function configureOpenApiClient() {
    OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
}

function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
}

async function mapToRegisterMemberDto(data: RegisterFormSubmitData): Promise<RegisterMemberDto> {
    const documentFirst = data.documentFirst ? await toBase64(data.documentFirst) : undefined;
    const documentSecond = data.documentSecond ? await toBase64(data.documentSecond) : undefined;

    return {
        email: data.email,
        password: data.password,
        name: data.name,
        surname: data.surname,
        phone: data.phone,
        birthday: data.birthday,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        isMedical: data.isMedical,
        isMj: data.isMj,
        isRecreation: data.isRecreation,
        documentFirst,
        documentSecond,
        signature: data.signature,
        
    };
}

export const useSubmitRegister = () => {
    return useMutation<RegisterMemberResponseDto, Error, RegisterFormSubmitData>({
        mutationFn: async (data) => {
            configureOpenApiClient();
            const payload = await mapToRegisterMemberDto(data);
            return MemberRegistrationSiteService.membersAuthRegister("false", payload);
        },
    });
};