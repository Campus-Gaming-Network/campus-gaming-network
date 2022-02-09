import Router from "express-promise-router";

import { isAuthenticated } from "../../auth";

import controllers from "../../controllers";

const router = Router();

router.get("/", controllers.User.getUsers);

router.get("/:id", controllers.User.getUserById);

router.post("/", controllers.User.createUser);

router.put("/:id", [isAuthenticated], controllers.User.updateUser);

router.delete("/:id", [isAuthenticated], controllers.User.deleteUser);

router.get("/:id/events", controllers.User.getUserEvents);

router.get("/:id/teams", controllers.User.getUserTeams);

router.get("/:id/roles", controllers.User.getUserRoles);

router.get("/:userId/roles/:roleId", controllers.User.getUserRole);

router.delete(
  "/:userId/roles/:roleId",
  [isAuthenticated],
  controllers.User.deleteUserRole
);

export default router;
