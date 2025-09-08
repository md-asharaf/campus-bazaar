// src/types/index.ts
export interface Category {
    icon: string;
    name: string;
    count: number;
}

export interface Listing {
    id: number;
    title: string;
    price: string;
    image: string;
}

export interface Testimonial {
    quote: string;
    author: string;
}
