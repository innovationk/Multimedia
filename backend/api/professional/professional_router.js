import { Router } from "express";
import ProfessionalController from "./professional_controller.js";
import AccountController from "../account/account_controller.js";

const router = new Router();

router
    .route("/professionals")
    .get((req, res, next) => ProfessionalController.list(req, res, next))
    .post(
        (req, res, next) => AccountController.checkAuthorisedAccount(req, res, next,  {
            and_admin_eq: 1
        }),
        (req, res, next) => ProfessionalController.create(req, res, next)
    );
;

router
    .route("/professionals/:primaryValue")
    .get((req, res, next) => ProfessionalController.read(req, res, next))
    .put(
        (req, res, next) => AccountController.checkAuthorisedAccount(req, res, next,  {
            and_admin_eq: 1
        }),
        (req, res, next) => ProfessionalController.update(req, res, next)
    )
    .delete((req, res, next) => ProfessionalController.tagDeleted(req, res, next))
;

router
    .route("/professionals/:primaryValue/image")
    .get((req, res, next) => ProfessionalController.getImage(req, res, next))
;

export default router;