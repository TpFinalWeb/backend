import { PriceI } from "./price.Interface";
export interface GameI {
    _id: number;
    name: string;
    detailed_description: string;
    developers: string[];
    category: string[];
    price: PriceI[];
    supported_languages: string;
    popularity_score: number;
    header_image: string;
    release_date: string;
}
