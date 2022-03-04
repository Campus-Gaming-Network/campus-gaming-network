import Router from "express-promise-router";

import { isAuthenticated } from "../../auth";

import controllers from "../../controllers";

const router = Router();

router.get("/user/:id", [isAuthenticated], controllers.User.getUserByUid);

export default router;
