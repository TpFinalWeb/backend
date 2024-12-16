import mongoose from "mongoose";
import { Request, Response } from "express";

export class AggregationController{
    public static async executeAggregation(agg: any): Promise<any> {
            const coll = mongoose.connection.db?.collection('games');
            const cursor = coll?.aggregate(agg);
            const result = await cursor?.toArray();
            return result;
    }

    public static async getPlatformsWhereGamesReleaseFirst(req: Request, res: Response){
        const agg = [
            {
              '$unwind': '$platforms'
            }, {
              '$match': {
                'platforms.first_release_date': {
                  '$type': 'string', 
                  '$regex': '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
                }
              }
            }, {
              '$group': {
                '_id': '$_id', 
                'name': {
                  '$first': '$name'
                }, 
                'earliest_release': {
                  '$min': {
                    '$dateFromString': {
                      'dateString': '$platforms.first_release_date'
                    }
                  }
                }, 
                'earliest_platform': {
                  '$first': '$platforms.platform_name'
                }
              }
            }, {
              '$project': {
                '_id': 1, 
                'name': 1, 
                'earliest_release': {
                  '$dateToString': {
                    'format': '%Y-%m-%d', 
                    'date': '$earliest_release'
                  }
                }, 
                'earliest_platform': 1
              }
            }, {
              '$sort': {
                'earliest_release': -1
              }
            }, {
              '$group': {
                '_id': '$earliest_platform', 
                'gameCount': {
                  '$sum': 1
                }
              }
            }, {
              '$project': {
                'platformName': '$_id', 
                'gameCount': 1, 
                '_id': 0
              }
            }, {
              '$sort': {
                'gameCount': -1
              }
            }
        ];

        const result = await AggregationController.executeAggregation(agg);
        res.status(200).json({aggregation: result});
    }
    public static async getGamesPerPlatforms(req: Request, res: Response){
      const agg = [
        {
          $unwind: "$platforms"
        },
        {
          $group: {
            _id: "$platforms.platform_name",
            count: {
              $sum: 1
            }
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$count"
            },
            platforms: {
              $push: {
                platform_name: "$_id",
                count: "$count"
              }
            }
          }
        },
        {
          $unwind: "$platforms"
        },
        {
          $project: {
            _id: 0,
            platform_name: "$platforms.platform_name",
            count: "$platforms.count"
          }
        },
        {
          $sort: {
            count: -1
          }
        }
      ];

      const result = await AggregationController.executeAggregation(agg);
      res.status(200).json({aggregation: result});
  }
  public static async getGenrePopularity(req: Request, res: Response){
    const agg = [
      {
        $unwind: "$genres"
      }
      ,{ 
        "$match": {
          "genres.genre_category": "Basic Genres"
        }
      },
      {
        $group: {
          _id: "$genres.genre_name",
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$count" },
          genres: { $push: { genre_name: "$_id", count: "$count" } }
        }
      },
    {
        $unwind: "$genres"
      },
      {
        $project: {
          _id: 0,
          genre_name: "$genres.genre_name",
          count: "$genres.count"
        }
      },    {$sort: {  count: -1 }
            }];

    const result = await AggregationController.executeAggregation(agg);
    res.status(200).json({aggregation: result});
}
public static async getGenreYearlyPopularity(req: Request, res: Response){
  console.log(req.body.genre_name);
  if (req.body.genre_name !== undefined && req.body.genre_name !== ""){ 
  const agg = [
    { 
      "$unwind": "$platforms" // Unwind the platforms array to process each release date individually
    },
    {
      "$addFields": {
        "converted_release_date": {
          "$cond": {
            "if": {
              "$regexMatch": {
                "input": "$platforms.first_release_date",
                "regex": "^\\d{4}-\\d{2}-\\d{2}$"
              }
            },
            "then": {
              "$dateFromString": {
                "dateString": "$platforms.first_release_date"
              }
            },
            "else": null
          }
        }
      }
    },
    { 
      "$match": {
        "converted_release_date": { "$ne": null } 
      }
    },
    {
      "$addFields": {
        "release_year": { "$year": "$converted_release_date" } 
      }
    },
    { "$unwind": "$genres" }, 
    { 
      "$match": {
        "genres.genre_category": "Basic Genres", 
        "genres.genre_name": req.body.genre_name 
      }
    },
    { 
      "$group": { 
        "_id": {
          "genre_id": "$genres.genre_id", 
          "release_year": "$release_year" 
        },
        "genre_name": { "$first": "$genres.genre_name" },
        "total_score": {
          "$sum": {
            "$cond": { 
              "if": {
                "$and": [
                  { "$ne": [{ "$ifNull": ["$num_vote", 0] }, null] },
                  { "$ne": ["$num_vote", 0] }
                ]
              },
              "then": "$num_vote",
              "else": 0
            }
          }
        },
        "countOfItemWithScoreNotNull": {
          "$sum": {
            "$cond": { 
              "if": {
                "$and": [
                  { "$ne": [{ "$ifNull": ["$num_vote", 0] }, null] },
                  { "$ne": ["$num_vote", 0] }
                ]
              },
              "then": 1,
              "else": 0
            }
          }
        }
      }
    },
    {
      "$project": {
        "genre_name": 1,
        "release_year": "$_id.release_year",
        "average_score": {
          "$cond": {
            "if": { "$gt": ["$countOfItemWithScoreNotNull", 0] },
            "then": { "$divide": ["$total_score", "$countOfItemWithScoreNotNull"] },
            "else": 0
          }
        },
        "total_score": 1,
        "countOfItemWithScoreNotNull": 1
      }
    },
    { 
      "$sort": { "release_year": 1 } // Sort by release_year in ascending order
    }
  ];

  const result = await AggregationController.executeAggregation(agg);
  res.status(200).json({aggregation: result});}
  else{
    res.status(400).json({message: "Please provide a genre name"});
  }
}
public static async getNumOfGameOfEachGenre(req: Request, res: Response){
  const agg =  [
    {
      $unwind: "$genres"
    },{
      $match: {
        "genres.genre_category_id": 1
      }
    },
    {
      $group: {
        _id: "$genres.genre_name",
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$count" },
        genres: { $push: { genre_name: "$_id", count: "$count" } }
      }
    },
    {
      $unwind: "$genres"
    },
    {
      $project: {
        _id: 0,
        genre_name: "$genres.genre_name",
        count: "$genres.count",
      }
    },    {$sort: {  count: -1 }
    }];

  const result = await AggregationController.executeAggregation(agg);
  res.status(200).json({aggregation: result});
}
public static async getPlatPopularityBy2Months(req: Request, res: Response){
  const agg =  [
    { "$unwind": "$platforms" },  // Unwind the platforms array to process each release date individually
    {
      "$addFields": {
        "converted_release_date": {
          "$cond": {
            "if": {
              "$regexMatch": { "input": "$platforms.first_release_date", "regex": "^\\d{4}-\\d{2}-\\d{2}$" } // Matches complete dates like YYYY-MM-DD
            },
            "then": {
              "$dateFromString": {
                "dateString": "$platforms.first_release_date"
              }
            },
            "else": null // Set invalid or incomplete dates to null
          }
        }
      }
    },
    { 
      "$match": {
        "converted_release_date": { "$ne": null }  // Ignore entries with null converted_release_date
      }
    },
    {
      "$addFields": {
        "release_month": { "$month": "$converted_release_date" }, // Extract the month
        "release_year": { "$year": "$converted_release_date" } // Extract the month
  
      }
    },
    { 
      "$match": { 
        "$and": [
        { "release_year": { "$gte": 2010 } },  // Filter for years 2020 to 2022
        { "release_month": { "$gte": req.body.startMonth|| 0, "$lte": req.body.endMonth || 12} }     // Filter for months October to December
      ]
      }
    },
    { 
      "$group": { 
        "_id": "$platforms.platform_name",  // Group by platform
        "platform_name": { "$first": "$platforms.platform_name" },
        "total_votes": {
          "$sum": {
            "$cond": { 
              "if": { "$ne": ["$num_vote", null] },
              "then": "$num_vote",
              "else": 0
            }
          }
        },
        "games_count": {
          "$sum": {
            "$cond": { 
              "if": {
                "$and": [
                  { "$ne": [{ "$ifNull": ["$num_vote", 0] }, null] },
                  { "$ne": ["$num_vote", 0] }
                ]
              },
              "then": 1,
              "else": 0
            }
          }
        }
      }
    }, {
        $match: {
          "games_count" :{$gt: 20}
          }},
    {
      "$project": {
        "platform_name": 1,
        "average_popularity": {
          "$cond": {
            "if": { "$gt": ["$games_count", 0] },
            "then": { "$divide": ["$total_votes", "$games_count"] },
            "else": 0
          }
        }
      }
    },
    { "$sort": { "average_popularity": -1 } }  // Sort by average popularity descending
  ];

  const result = await AggregationController.executeAggregation(agg);
  res.status(200).json({aggregation: result});
}
}
