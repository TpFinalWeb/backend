/**
 * @swagger
 * tags:
 *   name: graphs
 *   description: The graphs managing API
 */

/**
 * @swagger
 * /getPlatformsPopularity:
 *   get:
 *     tags: 
 *        - graphs
 *     summary: Get the popularity of platforms based on votes and games count.
 *     responses:
 *       200:
 *         description: A list of platforms with their average popularity.
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /getPlatformsWhereGamesReleaseFirst:
 *   get:
 *     tags: 
 *        - graphs
 *     summary: Get platforms where games are released first.
 *     responses:
 *       200:
 *         description: A list of platforms with the count of games released first.
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /getGamesPerPlatforms:
 *   get:
 *     tags: 
 *        - graphs
 *     summary: Get the number of games per platform.
 *     responses:
 *       200:
 *         description: A list of platforms with the count of games.
 *       500:
 *         description: Internal server error.
*/
/**
 * @swagger
 * /getGenrePopularity:
 *   get:
 *     tags: 
 *        - graphs
 *     summary: Get the popularity of genres based on the count of games.
 *     responses:
 *       200:
 *         description: A list of genres with their popularity.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /getGenrePopularity:
 *   get:
 *     tags: 
 *        - graphs
 *     summary: Get the popularity of genres based on the count of games.
 *     responses:
 *       200:
 *         description: A list of genres with their popularity.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /getGenreYearlyPopularity:
 *   get:
 *     tags: 
 *        - graphs
 *     summary: Get the yearly popularity of a specific genre.
 *     parameters:
 *       - in: query
 *         name: genre_name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the genre.
 *     responses:
 *       200:
 *         description: A list of yearly popularity data for the specified genre.
 *       400:
 *         description: Please provide a genre name.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /getNumOfGameOfEachGenre:
 *   get:
 *     tags: 
 *        - graphs
 *     summary: Get the number of games for each genre.
 *     responses:
 *       200:
 *         description: A list of genres with the count of games.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /getPlatPopularityBy2Months:
 *   get:
 *     tags: 
 *        - graphs
 *     summary: Get the popularity of platforms within a specific two-month range.
 *     parameters:
 *       - in: query
 *         name: startMonth
 *         schema:
 *           type: integer
 *         required: true
 *         description: The start month (1-12).
 *       - in: query
 *         name: endMonth
 *         schema:
 *           type: integer
 *         required: true
 *         description: The end month (1-12).
 *     responses:
 *       200:
 *         description: A list of platforms with their popularity within the specified range.
 *       400:
 *         description: Please provide a valid month.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /getTop10GamesOfPlatform:
 *   get:
 *     tags: 
 *        - graphs
 *     summary: Get the top 10 games of a specific platform.
 *     parameters:
 *       - in: query
 *         name: platform_name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the platform.
 *     responses:
 *       200:
 *         description: A list of the top 10 games for the specified platform.
 *       400:
 *         description: Please provide a platform name.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /getTop10GamesOfGenre:
 *   get:
 *     tags: 
 *        - graphs
 *     summary: Get the top 10 games of a specific genre.
 *     parameters:
 *       - in: query
 *         name: genre_name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the genre.
 *     responses:
 *       200:
 *         description: A list of the top 10 games for the specified genre.
 *       400:
 *         description: Please provide a genre name.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /getPlatformQualityByTime:
 *   get:
 *     tags: 
 *        - graphs
 *     summary: Get the quality of a platform over time.
 *     parameters:
 *       - in: query
 *         name: platform_name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the platform.
 *     responses:
 *       200:
 *         description: A list of quality data for the specified platform over time.
 *       400:
 *         description: Please provide a platform name.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /getGenreQualityByTime:
 *   get:
 *     tags: 
 *        - graphs
 *     summary: Get the quality of a genre over time.
 *     parameters:
 *       - in: query
 *         name: genre_name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the genre.
 *     responses:
 *       200:
 *         description: A list of quality data for the specified genre over time.
 *       400:
 *         description: Please provide a genre name.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /getGOTY:
 *   get:
 *     tags: 
 *        - graphs
 *     summary: Get the Game of the Year (GOTY) for each year.
 *     responses:
 *       200:
 *         description: A list of GOTY for each year.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /getAllGenres:
 *   get:
 *     tags: 
 *        - graphs
 *     summary: Get a list of all genres.
 *     responses:
 *       200:
 *         description: A list of all genres.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /getAllPlatforms:
 *   get:
 *     tags: 
 *        - graphs
 *     summary: Get a list of all platforms.
 *     responses:
 *       200:
 *         description: A list of all platforms.
 *       500:
 *         description: Internal server error.
 */
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