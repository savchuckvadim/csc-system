/**
 * Type-safe translation keys
 * Auto-completion support for translation keys
 */

// Common translation keys
export type CommonTranslationKey =
    | "loading"
    | "error"
    | "success"
    | "cancel"
    | "save"
    | "delete"
    | "edit"
    | "submit"
    | "back"
    | "next"
    | "required"
    | "companyName"
    | "companyTagline"
    | "allRightsReserved";

// Navigation translation keys
export type NavigationTranslationKey =
    | "home"
    | "about"
    | "contacts"
    | "login"
    | "register"
    | "profile"
    | "settings"
    | "logout"
    | "privacy"
    | "terms"
    | "navigationSection"
    | "accountSection"
    | "legalSection";

// Helper type for typed translation function
export type TypedTranslation<T extends string> = (
    key: T,
    values?: Record<string, string | number | Date>,
    formats?: any
) => string;

// Helper function to create typed translation
export function createTypedTranslation<T extends string>(
    translationFn: (
        key: string,
        values?: Record<string, string | number | Date>,
        formats?: any
    ) => string
): TypedTranslation<T> {
    return translationFn as TypedTranslation<T>;
}
