import { Router } from "express";
import BookController from "./book_controller.js";
import AccountController from "../account/account_controller.js";

const router = new Router();

router
    .route("/books")
    .get((req, res, next) => BookController.list(req, res, next))
    .post(
        (req, res, next) => AccountController.checkAuthorisedAccount(req, res, next,  {
            and_admin_eq: 1
        }),
        (req, res, next) => BookController.create(req, res, next)
    );
;

router
    .route("/books/:primaryValue")
    .get((req, res, next) => BookController.read(req, res, next))
    .put(
        (req, res, next) => AccountController.checkAuthorisedAccount(req, res, next,  {
            and_admin_eq: 1
        }),
        (req, res, next) => BookController.update(req, res, next)
    )
    .delete((req, res, next) => BookController.tagDeleted(req, res, next))
;

export default router;