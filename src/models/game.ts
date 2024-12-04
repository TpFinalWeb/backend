import { PriceI } from "../interfaces/priceInterface";
import { GameI } from "../interfaces/gameInterface";
import { release } from "os";

export class Game implements GameI {
    
    public _id: number = 0;              
    private _name: string = "";
    private _detailed_description: string = "";
    private _developers: string[] = [];
    private _supported_languages: string = "";
    private _category: string[] = [];       
    private _recommendation: number = 0;
    private _header_image: string = "";
    private _release_date: string = "";
    public _price: PriceI[] = [{ date: new Date(), price: 0 }];
    
    constructor(
        id: number,
        name: string,
        detailed_description: string,
        developers: string[],
        supported_languages: string,
        category: string[],
        popularit_score: number,
        header_image: string,
        price: PriceI[],
        release_date: string
    ) {
        this._id = id;
        this._name = name;
        this._detailed_description = detailed_description;
        this._developers = developers;
        this._supported_languages = supported_languages;
        this._category = category;
        this._recommendation = popularit_score;
        this._header_image = header_image;
        this._price = price;
        this._release_date = release_date;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get detailed_description(): string {
        return this._detailed_description;
    }

    set detailed_description(value: string) {
        this._detailed_description = value;
    }

    get developers(): string[] {
        return this._developers;
    }

    set developers(value: string[]) {
        this._developers = value;
    }

    get supported_languages(): string {
        return this._supported_languages;
    }

    set supported_languages(value: string) {
        this._supported_languages = value;
    }

    get category(): string[] {
        return this._category;
    }

    set category(value: string[] ) {
        this._category = value;
    }

    get popularit_score(): number {
        return this._recommendation;
    }

    set popularit_score(value: number) {
        this._recommendation = value;
    }

    get header_image(): string {
        return this._header_image;
    }

    set header_image(value: string) {
        this._header_image = value;
    }

    get price(): PriceI[] {
        return this._price;
    }

    set price(value: PriceI[]) {
        this._price = value;
    }
    get release_date(): string {
        return this._release_date;
    }
    set release_date(value: string) {
        this._release_date = value;
    }

    public toJSON(): GameI {
        return {
            _id: this._id,
            name: this._name,
            detailed_description: this._detailed_description,
            developers: this._developers,
            supported_languages: this._supported_languages,
            category: this._category,
            popularit_score: this._recommendation,
            header_image: this._header_image,
            price: this._price,
            release_date: this._release_date
        };
    }
}
