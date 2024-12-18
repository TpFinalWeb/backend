import { Router } from "express";
import { AggregationController } from "../controllers/aggregation.controller";

const aggregationRoutes = Router();
aggregationRoutes.get("/getPlatformsPopularity", AggregationController.getPlatformPopularity);
aggregationRoutes.get("/getPlatformsWhereGamesReleaseFirst", AggregationController.getPlatformsWhereGamesReleaseFirst);
aggregationRoutes.get("/getGamesPerPlatforms", AggregationController.getGamesPerPlatforms);

aggregationRoutes.get("/getGenrePopularity", AggregationController.getGenrePopularity);
aggregationRoutes.get("/getGenreYearlyPopularity", AggregationController.getGenreYearlyPopularity);
aggregationRoutes.get("/getNumOfGameOfEachGenre", AggregationController.getNumOfGameOfEachGenre);


aggregationRoutes.get("/getPlatPopularityBy2Months", AggregationController.getPlatPopularityBy2Months);
aggregationRoutes.get("/getTop10GamesOfPlatform", AggregationController.getTop10GamesOfPlatform);
aggregationRoutes.get("/getTop10GamesOfGenre", AggregationController.getTop10GamesOfGenre);

aggregationRoutes.get("/getPlatformQualityByTime", AggregationController.getPlatformQualityByTime);
aggregationRoutes.get("/getGenreQualityByTime", AggregationController.getGenreQualityByTime);
aggregationRoutes.get("/getGOTY", AggregationController.getGOTY);

aggregationRoutes.get("/getAllGenres", AggregationController.getAllGenres);
aggregationRoutes.get("/getAllPlatforms", AggregationController.getAllPlatforms);

export default aggregationRoutes;