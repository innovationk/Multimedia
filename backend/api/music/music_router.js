import { Router } from "express";
import AlbumController from "./album_controller.js";
import SongController from "./song_controller.js";
import AccountController from "../account/account_controller.js";

const router = new Router();

router
    .route("/albums")
    .get((req, res, next) => AlbumController.list(req, res, next))
    .post(
        (req, res, next) => AccountController.checkAuthorisedAccount(req, res, next,  {
            and_admin_eq: 1
        }),
        (req, res, next) => AlbumController.create(req, res, next)
    );
;

router
    .route("/albums/:primaryValue")
    .get((req, res, next) => AlbumController.read(req, res, next))
    .put(
        (req, res, next) => AccountController.checkAuthorisedAccount(req, res, next,  {
            and_admin_eq: 1
        }),
        (req, res, next) => AlbumController.update(req, res, next)
    )
    .delete((req, res, next) => AlbumController.tagDeleted(req, res, next))
;

router
    .route("/albums/:primaryValue/image")
    .get((req, res, next) => AlbumController.getImage(req, res, next))
;

router
    .route("/songs")
    .get((req, res, next) => SongController.list(req, res, next))
    .post(
        (req, res, next) => AccountController.checkAuthorisedAccount(req, res, next,  {
            and_admin_eq: 1
        }),
        (req, res, next) => SongController.create(req, res, next)
    );
;

router
    .route("/songs/:primaryValue")
    .get((req, res, next) => SongController.read(req, res, next))
    .put(
        (req, res, next) => AccountController.checkAuthorisedAccount(req, res, next,  {
            and_admin_eq: 1
        }),
        (req, res, next) => SongController.update(req, res, next)
    )
;

export default router;