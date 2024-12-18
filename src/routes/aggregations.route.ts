import { Router } from "express";
import { AggregationController } from "../controllers/aggregation.controller";
import { authentificateToken, authorizeRole } from "../middlewares/user.middleware";

const aggregationRoutes = Router();
const user = "user";
const admin = "admin";

aggregationRoutes.get("/getPlatformsPopularity", authentificateToken, authorizeRole([user, admin]), AggregationController.getPlatformPopularity);
aggregationRoutes.get("/getPlatformsWhereGamesReleaseFirst", authentificateToken, authorizeRole([user, admin]), AggregationController.getPlatformsWhereGamesReleaseFirst);
aggregationRoutes.get("/getGamesPerPlatforms", authentificateToken, authorizeRole([user, admin]), AggregationController.getGamesPerPlatforms);

aggregationRoutes.get("/getGenrePopularity", authentificateToken, authorizeRole([user, admin]), AggregationController.getGenrePopularity);
aggregationRoutes.get("/getGenreYearlyPopularity", authentificateToken, authorizeRole([user, admin]), AggregationController.getGenreYearlyPopularity);
aggregationRoutes.get("/getNumOfGameOfEachGenre", authentificateToken, authorizeRole([user, admin]), AggregationController.getNumOfGameOfEachGenre);


aggregationRoutes.get("/getPlatPopularityBy2Months", authentificateToken, authorizeRole([user, admin]), AggregationController.getPlatPopularityBy2Months);
aggregationRoutes.get("/getTop10GamesOfPlatform", authentificateToken, authorizeRole([user, admin]), AggregationController.getTop10GamesOfPlatform);
aggregationRoutes.get("/getTop10GamesOfGenre", authentificateToken, authorizeRole([user, admin]), AggregationController.getTop10GamesOfGenre);

aggregationRoutes.get("/getPlatformQualityByTime", authentificateToken, authorizeRole([user, admin]), AggregationController.getPlatformQualityByTime);
aggregationRoutes.get("/getGenreQualityByTime", authentificateToken, authorizeRole([user, admin]), AggregationController.getGenreQualityByTime);
aggregationRoutes.get("/getGOTY", authentificateToken, authorizeRole([user, admin]), AggregationController.getGOTY);

aggregationRoutes.get("/getAllGenres", authentificateToken, authorizeRole([user, admin]), AggregationController.getAllGenres);
aggregationRoutes.get("/getAllPlatforms", authentificateToken, authorizeRole([user, admin]), AggregationController.getAllPlatforms);

export default aggregationRoutes;