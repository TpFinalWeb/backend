import mongoose from "mongoose";
import { Request, Response } from "express";
import { count } from "console";
import { platform } from "os";

export class AggregationController {
  
  public static async executeAggregation(agg: any): Promise<any> {
    const coll = mongoose.connection.db?.collection("games");
    const cursor = coll?.aggregate(agg);
    const result = await cursor?.toArray();
    return result;
  }
  public static async getPlatformPopularity(req: Request, res: Response) {
    try {
      const agg = [
        {
          $unwind: "$platforms",
        },
        {
          $group: {
            _id: "$platforms.platform_name",
            total_votes: {
              $sum: {
                $cond: {
                  if: { $ne: ["$num_vote", null] },
                  then: "$num_vote",
                  else: 0,
                },
              },
            },
            games_count: {
              $sum: {
                $cond: {
                  if: {
                    $and: [
                      { $ne: [{ $ifNull: ["$num_vote", 0] }, null] },
                      { $ne: ["$num_vote", 0] },
                    ],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
        },
        {
          $match: {
            games_count: { $gt: 30 },
          },
        },
        {
          $project: {
            platform_name: "$_id",
            average_popularity: {
              $cond: {
                if: { $gt: ["$games_count", 0] },
                then: { $divide: ["$total_votes", "$games_count"] },
                else: 0,
              },
            },
          },
        },
        { $sort: { average_popularity: -1 } },
      ];

      const result = await AggregationController.executeAggregation(agg);
      res.status(200).json({ aggregation: result });
    } catch (error) {
      res.status(500).json({ message: "Internal Err" });
    }
  }
  public static async getPlatformsWhereGamesReleaseFirst(
    req: Request,
    res: Response
  ) {
    try {
      const agg = [
        {
          $unwind: "$platforms",
        },
        {
          $match: {
            "platforms.first_release_date": {
              $type: "string",
              $regex: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            name: {
              $first: "$name",
            },
            earliest_release: {
              $min: {
                $dateFromString: {
                  dateString: "$platforms.first_release_date",
                },
              },
            },
            earliest_platform: {
              $first: "$platforms.platform_name",
            },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            earliest_release: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$earliest_release",
              },
            },
            earliest_platform: 1,
          },
        },
        {
          $sort: {
            earliest_release: -1,
          },
        },
        {
          $group: {
            _id: "$earliest_platform",
            gameCount: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            platformName: "$_id",
            gameCount: 1,
            _id: 0,
          },
        },
        {
          $sort: {
            gameCount: -1,
          },
        },
      ];

      const result = await AggregationController.executeAggregation(agg);
      res.status(200).json({ aggregation: result });
    } catch (error) {
      res.status(500).json({ message: "Internal Err" });
    }
  }
  public static async getGamesPerPlatforms(req: Request, res: Response) {
    try {
      const agg = [
        {
          $unwind: "$platforms",
        },
        {
          $group: {
            _id: "$platforms.platform_name",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$count",
            },
            platforms: {
              $push: {
                platform_name: "$_id",
                count: "$count",
              },
            },
          },
        },
        {
          $unwind: "$platforms",
        },
        {
          $project: {
            _id: 0,
            platform_name: "$platforms.platform_name",
            count: "$platforms.count",
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ];

      const result = await AggregationController.executeAggregation(agg);
      res.status(200).json({ aggregation: result });
    } catch (error) {
      res.status(500).json({ message: "Internal Err" });
    }
  }
  public static async getGenrePopularity(req: Request, res: Response) {
    try {
      const agg = [
        {
          $unwind: "$genres",
        },
        {
          $match: {
            "genres.genre_category": "Basic Genres",
          },
        },
        {
          $group: {
            _id: "$genres.genre_name",
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$count" },
            genres: { $push: { genre_name: "$_id", count: "$count" } },
          },
        },
        {
          $unwind: "$genres",
        },
        {
          $project: {
            _id: 0,
            genre_name: "$genres.genre_name",
            count: "$genres.count",
          },
        },
        { $sort: { count: -1 } },
      ];

      const result = await AggregationController.executeAggregation(agg);
      res.status(200).json({ aggregation: result });
    } catch (error) {
      res.status(500).json({ message: "Internal Err" });
    }
  }
  public static async getGenreYearlyPopularity(req: Request, res: Response) {
    try {
      const genre_name = req.query.genre_name as string;
      if (genre_name !== undefined && genre_name  !== "") {
        const agg = [
          {
            $unwind: "$platforms", // Unwind the platforms array to process each release date individually
          },
          
          {
            $addFields: {
              converted_release_date: {
                $cond: {
                  if: {
                    $regexMatch: {
                      input: "$platforms.first_release_date",
                      regex: "^\\d{4}-\\d{2}-\\d{2}$",
                    },
                  },
                  then: {
                    $dateFromString: {
                      dateString: "$platforms.first_release_date",
                    },
                  },
                  else: null,
                },
              },
            },
          },
          {
            $match: {
              converted_release_date: { $ne: null },
            },
          },
          {
            $addFields: {
              release_year: { $year: "$converted_release_date" },
            },
          },
          { $unwind: "$genres" },
          {
            $match: {
              "genres.genre_category": "Basic Genres",
              "genres.genre_name": genre_name,
              num_vote: { $ne: null, $gt: 0 }
            },
          },
          {
            $group: {
              _id: {
                genre_id: "$genres.genre_id",
                release_year: "$release_year",
              },
              genre_name: { $first: "$genres.genre_name" },
              total_vote: {
                $sum: {
                  $cond: {
                    if: {
                      $and: [
                        { $ne: [{ $ifNull: ["$num_vote", 0] }, null] },
                        { $ne: ["$num_vote", 0] },
                      ],
                    },
                    then: "$num_vote",
                    else: 0,
                  },
                },
              },
              countOfItemWithScoreNotNull: {
                $sum: {
                  $cond: {
                    if: {
                      $and: [
                        { $ne: [{ $ifNull: ["$num_vote", 0] }, null] },
                        { $ne: ["$num_vote", 0] },
                      ],
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
            },
          },
          {
            $project: {
              genre_name: 1,
              release_year: "$_id.release_year",
              average_vote: {
                $cond: {
                  if: { $gt: ["$countOfItemWithScoreNotNull", 0] },
                  then: {
                    $divide: ["$total_vote", "$countOfItemWithScoreNotNull"],
                  },
                  else: 0,
                },
              },
              total_vote: 1,
              countOfItemWithScoreNotNull: 1,
            },
          },
          {
            $sort: { release_year: 1 }, // Sort by release_year in ascending order
          },
        ];

        const result = await AggregationController.executeAggregation(agg);
        res.status(200).json({ aggregation: result });
      } else {
        res.status(400).json({ message: "Please provide a genre name" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Err" });
    }
  }
  public static async getNumOfGameOfEachGenre(req: Request, res: Response) {
    try {
      const agg = [
        {
          $unwind: "$genres",
        },
        {
          $match: {
            "genres.genre_category_id": 1,
          },
        },
        {
          $group: {
            _id: "$genres.genre_name",
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$count" },
            genres: { $push: { genre_name: "$_id", count: "$count" } },
          },
        },
        {
          $unwind: "$genres",
        },
        {
          $project: {
            _id: 0,
            genre_name: "$genres.genre_name",
            count: "$genres.count",
          },
        },
        { $sort: { count: -1 } },
      ];

      const result = await AggregationController.executeAggregation(agg);
      res.status(200).json({ aggregation: result });
    } catch (error) {
      res.status(500).json({ message: "Internal Err" });
    }
  }


  public static async getPlatPopularityBy2Months(req: Request, res: Response) {
    try {
      const startMonth = parseInt(req.query.startMonth as string) || 0;
      const endMonth = parseInt(req.query.endMonth as string) || 12;

      if (
        startMonth < 1 ||
        startMonth > 12 ||
        endMonth < 1 ||
        endMonth > 12 ||
        startMonth < endMonth
      ) {
        const agg =  [
          { $unwind: "$platforms" }, // Unwind the platforms array to process each release date individually
        {
          $addFields: {
            converted_release_date: {
              $cond: {
                if: {
                  $regexMatch: {
                    input: "$platforms.first_release_date",
                    regex: "^\\d{4}-\\d{2}-\\d{2}$",
                  }, 
                },
                then: {
                  $dateFromString: {
                    dateString: "$platforms.first_release_date",
                  },
                },
                else: null, 
              },
            },
          },
        },
        {
          $match: {
            "genres.genre_category": "Basic Genres",
          },
        },
        {
          $match: {
            converted_release_date: { $ne: null }, 
          },
        },
        {
          $addFields: {
            release_month: { $month: "$converted_release_date" }, 
            release_year: { $year: "$converted_release_date" },
          },
        },
        {
          $match: {
            $and: [
              { release_year: { $gte: 2010 } }, 
              { release_month: { $gte: startMonth, $lte: endMonth } }, 
            ],
          },
        },
        {
          $group: {
            _id: "$platforms.platform_name", 
            platform_name: { $first: "$platforms.platform_name" },
            total_votes: {
              $sum: {
                $cond: {
                  if:{
                    $and: [
                      { $ne: [{ $ifNull: ["$num_vote", 0] }, null] },
                      { $ne: ["$num_vote", 0] },
                    ],
                  },
                  then: "$num_vote",
                  else: 0,
                },
              },
            },
            games_count: {
              $sum: {
                $cond: {
                  if: {
                    $and: [
                      { $ne: [{ $ifNull: ["$num_vote", 0] }, null] },
                      { $ne: ["$num_vote", 0] },
                    ],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
        },
        {
          $match: {
            games_count: { $gt: 100 },
          },
        },
        {
          $project: {
            platform_name: 1,
            average_popularity: {
              $cond: {
                if: { $gt: ["$games_count", 0] },
                then: { $divide: ["$total_votes", "$games_count"] },
                else: 0,
              },
            },
          },
        },
        { $sort: { average_popularity: -1 } }, // Sort by average popularity descending
      ];

        const result = await AggregationController.executeAggregation(agg);
        res.status(200).json({ aggregation: result });
      } else {
        res.status(400).json({ message: "Please provide a valid month" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Err" });
    }
  }
  public static async getTop10GamesOfPlatform(req: Request, res: Response) {
  try {
    const platform_name = req.query.platform_name as string || "";
    if (platform_name !== "" && platform_name !== undefined) {
      const agg = [
        { 
          $unwind: "$platforms" 
        },
        {
          $match: {
            "platforms.platform_name": platform_name,
            score: { $ne: null, $gt: 0 }
            
          },
        },
        {
          $sort: { score: -1 } 
        },
        {
          $limit: 10 
        },
        {
          $project: {
            name: 1,
            score: 1,
            platform_name: "$platforms.platform_name",
            first_release_date: "$platforms.first_release_date",
            detailed_description: "$detailed_description",
            _id: 0
          }
        }
      ];
      const result = await AggregationController.executeAggregation(agg);
      res.status(200).json({ aggregation: result });
    } else {
      res.status(400).json({ message: "Please provide a platform name" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Err" });
  }
  }
  public static async getTop10GamesOfGenre(req: Request, res: Response) {
    try {
      const genre_name = req.query.genre_name as string || "";
      if (genre_name !== "" && genre_name !== undefined) {
        const agg =[
          { 
            $unwind: "$genres" 
          },
          {
            $match: {
              "genres.genre_name": genre_name,
              score: { $ne: null, $gt: 0 }
            },
          },
          {
            $sort: { score: -1 }
          },
          {
            $limit: 10
          },
          {
            $project: {
              name: 1,
              score: 1,
              platform_name: "$platforms.platform_name",
              first_release_date: "$platforms.first_release_date",
              detailed_description: "$detailed_description",
              _id: 0
            }
          }
        ];
        const result = await AggregationController.executeAggregation(agg);
        res.status(200).json({ aggregation: result });
      } else {
        res.status(400).json({ message: "Please provide a platform name" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Err" });
    }
    }
  
  public static async getPlatformQualityByTime(req: Request, res: Response) {
    try{
      const platform_name = req.query.platform_name as string || "";
      if (platform_name !== "" || platform_name !== undefined) {
      const agg = [
        { 
          $unwind: "$platforms" 
        },
        {
          $addFields: {
            converted_release_date: {
              $cond: {
                if: {
                  $regexMatch: {
                    input: "$platforms.first_release_date",
                    regex: "^\\d{4}-\\d{2}-\\d{2}$",
                  },
                },
                then: { $dateFromString: { dateString: "$platforms.first_release_date" } },
                else: null,
              },
            },
          },
        },
        
        {
          $match: {
            converted_release_date: { $ne: null },
            "platforms.platform_name": platform_name,
            score: { $ne: null, $gt: 0 }
          },
        },
        {
          $addFields: {
            release_year: { $year: "$converted_release_date" },
          },
        },
        {
          $group: {
            _id: {
              platform_name: "$platforms.platform_name",
              release_year: "$release_year",
            },
            total_score: { $sum: "$score" },
            count_of_scores: { $sum: 1 },
          },
        },
        {
          $project: {
            platform_name: "$_id.platform_name",
            release_year: "$_id.release_year",
            average_score: {
              $cond: [
                { $gt: ["$count_of_scores", 0] },
                { $divide: ["$total_score", "$count_of_scores"] },
                0,
              ],
            },
            total_score: 1,
            count_of_scores: 1,
            _id: 0,
          },
        },
        {
          $sort: { release_year: 1, platform_name: 1 },
        },
      ]
      
      const result = await AggregationController.executeAggregation(agg);
      res.status(200).json({ aggregation: result });
    } else{
      res.status(400).json({ message: "Please provide a platform name" });
    }
    } catch (error) {
      res.status(500).json({ message: "Internal Err" });
    }
  }
  public static async getGenreQualityByTime(req: Request, res: Response) {
    try{
      const genre_name = req.query.genre_name as string || "";
      console.log(genre_name);
      if (genre_name !== "" || genre_name !== undefined) {
      const agg = [
        { 
          $unwind: "$platforms" 
        },
        {
          $addFields: {
            converted_release_date: {
              $cond: {
                if: {
                  $regexMatch: {
                    input: "$platforms.first_release_date",
                    regex: "^\\d{4}-\\d{2}-\\d{2}$",
                  },
                },
                then: { $dateFromString: { dateString: "$platforms.first_release_date" } },
                else: null,
              },
            },
          },
        },
        { 
          $unwind: "$genres" 
        },
        {
          $match: {
            converted_release_date: { $ne: null },
            "genres.genre_name": genre_name,
            score: { $ne: null, $gt: 0 },
          },
        },
        {
          $addFields: {
            release_year: { $year: "$converted_release_date" },
          },
        },
        {
          $group: {
            _id: {
              genre_name: "$genres.genre_name",
              release_year: "$release_year",
            },
            total_score: { $sum: "$score" },
            count_of_scores: { $sum: 1 },
          },
        },
        {
          $project: {
            genre_name: "$_id.genre_name",
            release_year: "$_id.release_year",
            average_score: {
              $cond: [
                { $gt: ["$count_of_scores", 0] },
                { $divide: ["$total_score", "$count_of_scores"] },
                0,
              ],
            },
            total_score: 1,
            count_of_scores: 1,
            _id: 0,
          },
        },
        {
          $sort: { release_year: 1, genre_name: 1 },
        },
      ]
      
      
      
      const result = await AggregationController.executeAggregation(agg);
      res.status(200).json({ aggregation: result });
    } else{
      res.status(400).json({ message: "Please provide a platform name" });
    }
    } catch (error) {
      res.status(500).json({ message: "Internal Err" });
    }
  }
  public static async getGOTY(req: Request, res: Response) {
    try {
      const agg = 
      [
        {
          $unwind: "$platforms" 
        },
        {
          $addFields: {
            converted_release_date: {
              $cond: {
                if: {
                  $regexMatch: {
                    input: "$platforms.first_release_date",
                    regex: "^\\d{4}-\\d{2}-\\d{2}$"
                  }
                },
                then: { $dateFromString: { dateString: "$platforms.first_release_date" } },
                else: null
              }
            }
          }
        },
        {
          $match: {
            converted_release_date: { $ne: null },
            score: { $ne: null, $gt: 0 },
            num_vote: { $ne: null, $gt: 2 }
          }
        },
        {
          $group: {
            _id: "$name", 
            earliest_release_date: { $min: "$converted_release_date" }, 
            score: { $first: "$score" }, 
            platform_name: { $first: "$platforms.platform_name" } 
          }
        },
        {
          $addFields: {
            release_year: { $year: "$earliest_release_date" }
          }
        },
        {
          $sort: { release_year: 1, score: -1 } 
        },
        {
          $group: {
            _id: "$release_year", 
            top_game: { $first: "$_id" }, 
            top_score: { $first: "$score" },
            platform_name: { $first: "$platform_name" }
          }
        },
        {
          $project: {
            release_year: "$_id",
            top_game: 1,
            top_score: 1,
            platform_name: 1,
            _id: 0
          }
        },
        {
          $sort: { release_year: 1 }
        }
      ]
      
      const result = await AggregationController.executeAggregation(agg);
      res.status(200).json({ aggregation: result });
    } catch (error) {
      res.status(500).json({ message: "Internal Err" });
    }
  }

  public static async getAllPlatforms(req: Request, res: Response) {
    try {
      const agg = [
        {
          $unwind: "$platforms",
        },
        {
          $group: {
            _id: "$platforms.platform_name",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            platform_name: "$_id",
            count: 1,
            _id: 0,
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ];
      const result = await AggregationController.executeAggregation(agg);
      res.status(200).json({ aggregation: result });
    } catch (error) {
      res.status(500).json({ message: "Internal Err" });
    }
  }
  public static async getAllGenres(req: Request, res: Response) {
      try {
        const agg = [
          {
            $unwind: "$genres",
          },
          {
            $group: {
              _id: "$genres.genre_name",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              genre_name: "$_id",
              count: 1,
              _id: 0,
            },
          },
          {
            $sort: {
              count: -1,
            },
          },
        ];
        const result = await AggregationController.executeAggregation(agg);
        res.status(200).json({ aggregation: result });
      } catch (error) {
        res.status(500).json({ message: "Internal Err" });
      }
  }
}
