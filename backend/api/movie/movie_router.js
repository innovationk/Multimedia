import { Router } from "express";
import MovieController from "./movie_controller.js";

const router = new Router();

router
    .route("/movies")
    .get((req, res, next) => MovieController.list(req, res, next))
    // .post((req, res, next) => MovieController.create(req, res, next))
;

router
    .route("/movies/:primaryValue")
    .get((req, res, next) => MovieController.read(req, res, next))
//     .put((req, res, next) => MovieController.update(req, res, next))
;

router
    .route("/movies/:primaryValue/stream")
    .get((req, res, next) => MovieController.stream(req, res, next))
//     .put((req, res, next) => MovieController.update(req, res, next))
;

export default router;