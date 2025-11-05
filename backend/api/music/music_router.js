import { Router } from "express";
import MusicAlbumController from "./musicalbum_controller.js";
import MusicSongController from "./musicsong_controller.js";

const router = new Router();

router
    .route("/music/albums")
    .get((req, res, next) => MusicAlbumController.list(req, res, next))
    // .post((req, res, next) => MusicAlbumController.create(req, res, next))
;

router
    .route("/music/albums/:primaryValue")
    .get((req, res, next) => MusicAlbumController.read(req, res, next))
//     .put((req, res, next) => MusicAlbumController.update(req, res, next))
;

router
    .route("/music/songs")
    .get((req, res, next) => MusicSongController.list(req, res, next))
    // .post((req, res, next) => MusicSongController.create(req, res, next))
;

router
    .route("/music/songs/:primaryValue")
    .get((req, res, next) => MusicSongController.read(req, res, next))
//     .put((req, res, next) => MusicSongController.update(req, res, next))
;

export default router;