import { Sequelize, ModelDefined } from 'sequelize';
import User from './user.model';
import School from './school.model';
import Event from './event.model';
import Teams from './team.model';
import Teammate from './teammate.model';
import Participant from './participant.model';
import ParticipantType from './participantType.model';
import UserReport from './userReport.model';

const modelDefiners = {
  School,
  User,
  Event,
  Teammate,
  Teams,
  ParticipantType,
  Participant,
  UserReport,
};

const models: { [key: string]: ModelDefined<any, any> } = {};

export const registerModels = (sequelize: Sequelize) => {
  for (const [key, val] of Object.entries(modelDefiners)) {
    models[key] = val(sequelize);
  }
};

export const setupModelAssociations = (sequelize: Sequelize) => {
  sequelize.models.School.hasMany(sequelize.models.User);
  sequelize.models.User.belongsTo(sequelize.models.School);

  sequelize.models.User.belongsToMany(sequelize.models.Event, { through: sequelize.models.Participant });
  sequelize.models.Event.belongsToMany(sequelize.models.User, { through: sequelize.models.Participant });

  sequelize.models.ParticipantType.hasMany(sequelize.models.Participant);
  sequelize.models.Participant.belongsTo(sequelize.models.ParticipantType);

  sequelize.models.User.belongsToMany(sequelize.models.Team, { through: sequelize.models.Teammate });
  sequelize.models.Team.belongsToMany(sequelize.models.User, { through: sequelize.models.Teammate });

  sequelize.models.School.hasMany(sequelize.models.Event);
  sequelize.models.Event.belongsTo(sequelize.models.School);

  sequelize.models.User.hasMany(sequelize.models.UserReport);
  sequelize.models.UserReport.belongsTo(sequelize.models.User);
};

export default models;
