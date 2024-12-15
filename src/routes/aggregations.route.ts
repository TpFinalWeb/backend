import { Router } from "express";
import { AggregationController } from "../controllers/aggregation.controller";

const aggregationRoutes = Router();


aggregationRoutes.get("/getPlatformsWhereGamesReleaseFirst", AggregationController.getPlatformsWhereGamesReleaseFirst);


export default aggregationRoutes;