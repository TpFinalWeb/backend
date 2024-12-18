import cron from 'node-cron';
import { AggregationController } from '../controllers/aggregation.controller';
import connectToDb from '../utils/mongodb.utils';
import { Request, Response } from 'express';
import { Game } from '../models/game.model';

export async function chornotime(): Promise<void> {
    cron.schedule('40 3 */2 * *', async () => {
    try{
    await connectToDb().then(async () => {
      console.log('Connected to MongoDB');
      console.log('Running scheduled task: getPlatformPopularity');
        try {
            const mockResponse: Response = {
                statusCode: 0, 
                status: function (code: number) {
                  this.statusCode = code; 
                  return this;
                },
                json: function (data: any) {
                  console.log('Response Data:', data.aggregation);
                  return this; 
                },
            } as Response;
            await AggregationController.getPlatformPopularity({} as Request, mockResponse)
            await AggregationController.getGenrePopularity({} as Request, mockResponse)
          } catch (error) {
            console.error('Error running scheduled task:', error);
          }
      try {
        const scores = await Game.aggregate([
            { $group: { _id: null, averageScore: { $avg: "$score" } } },
        ]);
        console.log("Moyenne des scores :", scores[0].averageScore);
        const Maxscores = await Game.aggregate([
            { $group: { _id: null, averageScore: { $max: "$score" } } },
        ]);
        console.log("Maximum des scores :", Maxscores[0].averageScore);
        const Minscores = await Game.aggregate([
            { $match: { score: { $ne: 0 } } },
            { $group: { _id: null, averageScore: { $min: "$score" } } }
        ]);
        console.log("Minimum des scores :", Minscores[0].averageScore);
        const votes = await Game.aggregate([
            {
              $match: {
                num_vote: { $ne: 0  }
              },
            },
            {
              $group: {
                _id: null,
                averageScore: { $avg: "$num_vote" },
              },
            },
          ]);
        console.log("Moyenne des votes (ne conte pas 0) :", votes[0].averageScore);
        const Maxvotes = await Game.aggregate([
            { $group: { _id: null, averageScore: { $max: "$num_vote" } } },
        ]);
        console.log("Maximum des votes :", Maxvotes[0].averageScore);
      } catch (error) {
        console.error('Error running scheduled task:', error);
      }
  
   
      } )
    
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }});
  }