import Router from "express-promise-router";

import controllers from "../../controllers";

const router = Router();

router.get("/", controllers.School.getSchools);

router.get("/:handle", controllers.School.getSchoolByHandle);

router.put("/:handle", [isAuthenticated], controllers.School.updateSchool);

router.get("/:handle/users", controllers.School.getSchoolUsers);

router.get("/:handle/events", controllers.School.getSchoolEvents);

export default router;
