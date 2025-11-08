import { Router } from "express";
import VideoController from "./video_controller.js";

const router = new Router();

router
    .route("/videos")
    .get((req, res, next) => VideoController.list(req, res, next))
    // .post((req, res, next) => VideoController.create(req, res, next))
;

router
    .route("/videos/:primaryValue")
    .get((req, res, next) => VideoController.read(req, res, next))
//     .put((req, res, next) => VideoController.update(req, res, next))
;

router
    .route("/videos/:primaryValue/stream")
    .get((req, res, next) => VideoController.stream(req, res, next))
;

router
    .route("/videos/:primaryValue/download")
    .get((req, res, next) => VideoController.download(req, res, next))
;

export default router;