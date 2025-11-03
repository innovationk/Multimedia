import { Router } from "express";
import AccountController from "./account_controller.js";

const router = new Router();

router
    .route("/login")
    .put((req, res, next) => AccountController.login(req, res, next))
    ;

router
    .route("/logout")
    .put(AccountController.checkAuthorisedAccount, (req, res, next) => AccountController.logout(req, res, next))
    ;

export default router;