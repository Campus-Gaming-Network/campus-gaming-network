"use strict";

const roles = [
  {
    name: "School Admin",
    permissions: ["school.update"],
  },
  {
    name: "Event Admin",
    permissions: ["event.update", "event.delete"],
  },
  {
    name: "Team Leader",
    permissions: [
      "teammate.update",
      "teammate.delete",
      "team.update",
      "team.delete",
    ],
  },
  {
    name: "Team Officer",
    permissions: ["teammate.update"],
  },
].map((role) => ({
  ...role,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("roles", roles, {});
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete("roles", null, {});
  },
};
