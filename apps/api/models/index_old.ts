import { Sequelize, DataTypes } from 'sequelize';

import {
  TABLES,
  MODELS,
  USER_STATUSES,
  PARTICIPANT_RESPONSES,
  PARTICIPANT_TYPES,
  TIMEZONES,
  REPORT_STATUSES,
  REPORT_ENTITIES,
  MAX_BIO_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_REPORT_REASON_LENGTH,
  BASE_LIMIT,
  BASE_OFFSET,
} from '../constants';

const sequelize = new Sequelize();

///////////////////////////////////////////////////////////////////////////
// Models

const School = sequelize.define(
  MODELS.SCHOOL,
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    handle: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    county: {
      type: DataTypes.STRING,
    },
    zip: {
      type: DataTypes.STRING,
    },
    geohash: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    website: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: TABLES.SCHOOLS,
  },
);

const User = sequelize.define(
  MODELS.USER,
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        // @ts-ignore
        return `${this.firstName} ${this.lastName}`;
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.keys(USER_STATUSES)),
      allowNull: false,
    },
    gravatar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    schoolId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'School',
        key: 'id',
      },
    },
    major: {
      type: DataTypes.STRING,
    },
    minor: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.STRING(MAX_BIO_LENGTH),
    },
    timezone: {
      type: DataTypes.ENUM(...TIMEZONES.map(({ value }) => value)),
    },
    hometown: {
      type: DataTypes.STRING,
    },
    birthdate: {
      type: DataTypes.DATEONLY,
    },
    twitter: {
      type: DataTypes.STRING,
    },
    twitch: {
      type: DataTypes.STRING,
    },
    youtube: {
      type: DataTypes.STRING,
    },
    skype: {
      type: DataTypes.STRING,
    },
    discord: {
      type: DataTypes.STRING,
    },
    battlenet: {
      type: DataTypes.STRING,
    },
    steam: {
      type: DataTypes.STRING,
    },
    xbox: {
      type: DataTypes.STRING,
    },
    psn: {
      type: DataTypes.STRING,
    },
    currentlyPlaying: {
      type: DataTypes.ARRAY,
    },
    favoriteGames: {
      type: DataTypes.ARRAY,
    },
  },
  {
    tableName: TABLES.USERS,
  },
);

// const SchoolUser = sequelize.define(
//     MODELS.PARTICIPANT,
//     {
//         id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true,
//             allowNull: false,
//         },
//         userId: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: User,
//                 key: "id",
//             },
//         },
//         schoolId: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: School,
//                 key: "id",
//             },
//         },
//     },
//     {
//         tableName: TABLES.PARTICIPANTS,
//     },
// );

const Team = sequelize.define(
  MODELS.TEAM,
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortName: {
      type: DataTypes.STRING,
    },
    website: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING(MAX_DESCRIPTION_LENGTH),
    },
    joinHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: TABLES.TEAMS,
  },
);

// const TeamAuth = sequelize.define(
//     MODELS.TEAM_AUTH,
//     {
//         id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true,
//             allowNull: false,
//         },
//         joinHash: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         teamId: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: Team,
//                 key: "id",
//             },
//         },
//     },
//     {
//         tableName: TABLES.TEAM_AUTHS,
//     },
// );

const Teammate = sequelize.define(
  MODELS.TEAMMATE,
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Team,
        key: 'id',
      },
    },
  },
  {
    tableName: TABLES.TEAMMATES,
  },
);

const Event = sequelize.define(
  MODELS.EVENT,
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    schoolId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'School',
        key: 'id',
      },
    },
    description: {
      type: DataTypes.STRING(MAX_DESCRIPTION_LENGTH),
    },
    isOnlineEvent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    game: {
      // Maybe this should be its own table?
      type: DataTypes.JSONB,
    },
    placeId: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    pageViews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    startDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: TABLES.EVENTS,
  },
);

// const EventResponse = sequelize.define(
//     MODELS.EVENT_RESPONSE,
//     {
//         id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true,
//             allowNull: false,
//         },
//         response: {
//             type: DataTypes.ENUM(...Object.keys(EVENT_RESPONSES)),
//             allowNull: false,
//             defaultValue: EVENT_RESPONSES.YES,
//         },
//         userId: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: "User",
//                 key: "id",
//             },
//         },
//         eventId: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: "Event",
//                 key: "id",
//             },
//         },
//     },
//     {
//         tableName: TABLES.EVENT_RESPONSES,
//     },
// );

const ParticipantType = sequelize.define(
  MODELS.PARTICIPANT_TYPE,
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.keys(PARTICIPANT_TYPES)),
      allowNull: false,
    },
    response: {
      type: DataTypes.ENUM(...Object.keys(PARTICIPANT_RESPONSES)),
      allowNull: false,
      defaultValue: PARTICIPANT_RESPONSES.YES,
    },
  },
  {
    tableName: TABLES.PARTICIPANT_TYPES,
  },
);

const Participant = sequelize.define(
  MODELS.PARTICIPANT,
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Event',
        key: 'id',
      },
    },
    participantTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ParticipantType',
        key: 'id',
      },
    },
  },
  {
    tableName: TABLES.PARTICIPANTS,
  },
);

const Role = sequelize.define(
  MODELS.ROLE,
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permissions: {
      type: DataTypes.ARRAY,
      allowNull: false,
    },
  },
  {
    tableName: TABLES.ROLES,
  },
);

// const TeammateRole = sequelize.define(
//     MODELS.TEAMMATE_ROLE,
//     {
//         id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true,
//             allowNull: false,
//         },
//         teammateId: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: "Teammate",
//                 key: "id",
//             },
//         },
//         roleId: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: "Role",
//                 key: "id",
//             },
//         },
//     },
//     {
//         tableName: TABLES.TEAMMATE_ROLES,
//     },
// );

// const Tournament = sequelize.define(
//     MODELS.TOURNAMENT,
//     {
//         id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true,
//             allowNull: false,
//         },
//     },
//     {
//         tableName: TABLES.TOURNAMENTS,
//     },
// );

const UserReport = sequelize.define(
  MODELS.USER_REPORT,
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    reportingUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    reason: {
      type: DataTypes.STRING(MAX_REPORT_REASON_LENGTH),
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSON,
    },
    entity: {
      type: DataTypes.ENUM(...REPORT_ENTITIES),
      allowNull: false,
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.keys(REPORT_STATUSES)),
      allowNull: false,
      defaultValue: REPORT_STATUSES.NEW,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: TABLES.USER_REPORTS,
  },
);

///////////////////////////////////////////////////////////////////////////
// Associations

User.belongsToMany(Event, { through: Participant });
Event.belongsToMany(User, { through: Participant });

User.belongsToMany(Team, { through: Teammate });
Team.belongsToMany(User, { through: Teammate });

School.hasMany(Event);
Event.belongsTo(School);
