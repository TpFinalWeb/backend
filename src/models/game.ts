import { GameI } from '../interfaces/game.interface';

export class Game implements GameI {
    name: string;
    detailed_description: string;
    num_vote: number;
    score: number;
    sample_cover: {
        height: number;
        image: string;
        platforms: string[];
        thumbnail_image: string;
        width: number;
    };
    genres: {
        genre_category: string;
        genre_category_id: number;
        genre_id: number;
        genre_name: string;
    }[];
    platforms: {
        first_release_date: string;
        platform_id: number;
        platform_name: string;
    }[];

    constructor(
        name: string,
        detailed_description: string,
        num_vote: number,
        score: number,
        sample_cover: {
            height: number;
            image: string;
            platforms: string[];
            thumbnail_image: string;
            width: number;
        },
        genres: {
            genre_category: string;
            genre_category_id: number;
            genre_id: number;
            genre_name: string;
        }[],
        platforms: {
            first_release_date: string;
            platform_id: number;
            platform_name: string;
        }[]
    ) {
        this.name = name;
        this.detailed_description = detailed_description;
        this.num_vote = num_vote;
        this.score = score;
        this.sample_cover = sample_cover;
        this.genres = genres;
        this.platforms = platforms;
    }
}