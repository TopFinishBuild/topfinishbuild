export interface ContactInquiry {
    _id?: string;
    name: string;
    phone?: string;
    email?: string;
    message: string;
    service?: string;
    status: 'new' | 'read' | 'replied';
    createdAt: Date;
}

export interface GalleryImage {
    _id?: string;
    label: string;
    category: string;
    duration?: string;
    city?: string;
    area?: string;
    key: string;
    keySmall?: string;
    url: string;
    urlSmall?: string;
    order?: number;
    deleted?: boolean;
    createdAt: Date;
}

export interface Category {
    _id: string;
    name: string;
    order?: number;
    createdAt: Date;
}

export interface Partner {
    _id?: string;
    name: string;
    key: string;
    keySmall?: string;
    url: string;
    urlSmall?: string;
    order?: number;
    createdAt: Date;
}

export interface Testimonial {
    _id?: string;
    text: string;
    name: string;
    subtitle: string;
    initials: string;
    stars?: number;
    order?: number;
    createdAt: Date;
}

export interface BeforeAfterPair {
    _id?: string;
    title: string;
    beforeKey: string;
    beforeKeySmall?: string;
    beforeUrl: string;
    beforeUrlSmall?: string;
    afterKey: string;
    afterKeySmall?: string;
    afterUrl: string;
    afterUrlSmall?: string;
    order?: number;
    createdAt: Date;
}

export interface User {
    _id: string;
    email: string;
    password?: string;
    name: string;
    role: 'admin' | 'editor';
}

export type WatermarkPosition =
    | 'top-left'    | 'top-center'    | 'top-right'
    | 'middle-left' | 'center'        | 'middle-right'
    | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface WatermarkSettings {
    enabled: boolean;
    /** S3 key of the logo, absent until one is uploaded */
    key?: string;
    url?: string;
    position: WatermarkPosition;
    /** 0..1 */
    opacity: number;
    /** logo width as % of the image width */
    size: number;
    /** edge padding as % of the image width */
    margin: number;
}

/** The single `settings` document, always `_id: 'main'`. */
export interface SiteSettings {
    _id: string;
    calendarVisible?: boolean;
    phone1?: string;
    phone2?: string;
    email1?: string;
    email2?: string;
    watermark?: WatermarkSettings;
    updatedAt?: Date;
}

export interface S3UploadResult {
    key: string;
    url: string;
}

export interface S3UploadWithVariantsResult {
    key: string;
    keySmall: string;
    url: string;
    urlSmall: string;
}
