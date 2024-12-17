import { Router } from "express";
import { AggregationController } from "../controllers/aggregation.controller";

const aggregationRoutes = Router();


aggregationRoutes.get("/getPlatformsWhereGamesReleaseFirst", AggregationController.getPlatformsWhereGamesReleaseFirst);

aggregationRoutes.get("/getGamesPerPlatforms", AggregationController.getGamesPerPlatforms);
aggregationRoutes.get("/getGenrePopularity", AggregationController.getGenrePopularity);
aggregationRoutes.get("/getGenreYearlyPopularity", AggregationController.getGenreYearlyPopularity);
aggregationRoutes.get("/getNumOfGameOfEachGenre", AggregationController.getNumOfGameOfEachGenre);
aggregationRoutes.get("/getPlatPopularityBy2Months", AggregationController.getPlatPopularityBy2Months);
aggregationRoutes.get("/getAllGenres", AggregationController.getAllGenres);
export default aggregationRoutes;