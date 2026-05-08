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
    category: string;     // 'Бани' | 'Кухни' | 'Тераси' | 'Спални' | 'Хол'
    materials?: string;
    duration?: string;
    key: string;
    keySmall?: string;
    url: string;
    urlSmall?: string;
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
