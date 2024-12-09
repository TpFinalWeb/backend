export interface GameI {
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
  }
  