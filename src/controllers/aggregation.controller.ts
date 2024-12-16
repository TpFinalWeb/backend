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
}