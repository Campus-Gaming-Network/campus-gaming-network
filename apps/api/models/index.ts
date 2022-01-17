import User from './user.model';
import School from './school.model';
import Event from './event.model';
import Teams from './team.model';
import Teammate from './teammate.model';
import Participant from './participant.model';
import ParticipantType from './participantType.model';
import UserReport from './userReport.model';

const modelDefiners = [School, User, Event, Teammate, Teams, ParticipantType, Participant, UserReport];

export const registerModels = (sequelize: any) => {
  for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
  }
};

export const setupModelAssociations = (sequelize: any) => {
  const { models } = sequelize;

  models.School.hasMany(models.User);
  models.User.belongsTo(models.School);

  models.User.belongsToMany(models.Event, { through: models.Participant });
  models.Event.belongsToMany(models.User, { through: models.Participant });

  models.ParticipantType.hasMany(models.Participant);
  models.Participant.belongsTo(models.ParticipantType);

  models.User.belongsToMany(models.Team, { through: models.Teammate });
  models.Team.belongsToMany(models.User, { through: models.Teammate });

  models.School.hasMany(models.Event);
  models.Event.belongsTo(models.School);

  models.User.hasMany(models.UserReport);
  models.UserReport.belongsTo(models.User);
};

export default modelDefiners;
