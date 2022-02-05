"use strict";

const roles = [
  {
    name: "School Admin",
    textkey: "school-admin",
    permissions: ["school.edit"],
  },
  {
    name: "Event Admin",
    textkey: "event-admin",
    permissions: ["event.edit", "event.delete"],
  },
  {
    name: "Team Leader",
    textkey: "team-leader",
    permissions: [
      "teammate.promote",
      "teammate.kick",
      "team.edit",
      "team.delete",
    ],
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
