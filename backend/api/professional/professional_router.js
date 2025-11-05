import { Router } from "express";
import ProfessionalController from "./professional_controller.js";

const router = new Router();

router
    .route("/professionals")
    .get((req, res, next) => ProfessionalController.list(req, res, next))
    // .post((req, res, next) => ProfessionalController.create(req, res, next))
;

router
    .route("/professionals/:primaryValue")
    .get((req, res, next) => ProfessionalController.read(req, res, next))
//     .put((req, res, next) => ProfessionalController.update(req, res, next))
;

export default router;