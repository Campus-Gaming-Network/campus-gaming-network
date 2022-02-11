import { Sequelize, ModelDefined } from "sequelize";
import User from "./user.model";
import School from "./school.model";
import Event from "./event.model";
import Team from "./team.model";
import Teammate from "./teammate.model";
import Participant from "./participant.model";
import Role from "./role.model";
import UserRole from "./userRole.model";

const modelDefiners = {
  School,
  User,
  Event,
  Teammate,
  Team,
  Participant,
  Role,
  UserRole,
};

let models: { [key: string]: ModelDefined<any, any> } = {};

export const registerModels = (sequelize: Sequelize) => {
  for (const [key, val] of Object.entries(modelDefiners)) {
    models[key] = val(sequelize);
  }
};

export const setupModelAssociations = (sequelize: Sequelize) => {
  sequelize.models.School.hasMany(sequelize.models.User, {
    foreignKey: "schoolId",
  });
  sequelize.models.User.belongsTo(sequelize.models.School, {
    foreignKey: "schoolId",
    as: "school",
  });

  // sequelize.models.User.hasMany(sequelize.models.Event, { foreignKey: "creatorId" });
  // sequelize.models.Event.hasOne(sequelize.models.User);

  sequelize.models.User.belongsToMany(sequelize.models.Event, {
    through: sequelize.models.Participant,
    foreignKey: "userId",
  });
  sequelize.models.Event.belongsToMany(sequelize.models.User, {
    through: sequelize.models.Participant,
    foreignKey: "eventId",
  });
  sequelize.models.Team.belongsToMany(sequelize.models.Event, {
    through: sequelize.models.Participant,
    foreignKey: "teamId",
  });
  sequelize.models.Event.belongsToMany(sequelize.models.Team, {
    through: sequelize.models.Participant,
    foreignKey: "eventId",
  });
  sequelize.models.Participant.belongsTo(sequelize.models.User, {
    foreignKey: "userId",
    as: "user",
  });
  sequelize.models.Participant.belongsTo(sequelize.models.Team, {
    foreignKey: "teamId",
    as: "team",
  });

  sequelize.models.User.belongsToMany(sequelize.models.Team, {
    through: sequelize.models.Teammate,
    foreignKey: "userId",
  });
  sequelize.models.Team.belongsToMany(sequelize.models.User, {
    through: sequelize.models.Teammate,
    foreignKey: "teamId",
  });

  sequelize.models.Teammate.belongsTo(sequelize.models.User, {
    foreignKey: "userId",
    as: "user",
  });
  sequelize.models.Teammate.belongsTo(sequelize.models.Team, {
    foreignKey: "teamId",
    as: "team",
  });

  // sequelize.models.School.hasMany(sequelize.models.Event, { foreignKey: "schoolId" });
  // sequelize.models.Event.belongsTo(sequelize.models.School);

  sequelize.models.User.belongsToMany(sequelize.models.Role, {
    through: sequelize.models.UserRole,
    foreignKey: "userId",
  });
  sequelize.models.Role.belongsToMany(sequelize.models.User, {
    through: sequelize.models.UserRole,
    foreignKey: "roleId",
  });
  sequelize.models.UserRole.belongsTo(sequelize.models.User, {
    foreignKey: "userId",
    as: "user",
  });
  sequelize.models.UserRole.belongsTo(sequelize.models.Role, {
    foreignKey: "roleId",
    as: "role",
  });
};

export default models;
