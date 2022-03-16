import axios from "axios";
import { BASE_API_URL, COOKIES } from "src/constants/other";
import { parseCookies } from "nookies";

const instance = axios.create({ baseURL: BASE_API_URL });

const DEFAULT_VERSION = "v1";

const DEFAULT_OPTIONS = {
  version: DEFAULT_VERSION,
};

export const API = (options = {}) => {
  const opts = {
    ...DEFAULT_OPTIONS,
    ...(options || {}),
  };

  const cookies = parseCookies();
  const createUrl = (url) => `/${opts.version}${url}`;
  const requests = {
    get: (url, ...args) => instance.get(createUrl(url), ...args),
    post: (url, ...args) => instance.post(createUrl(url), ...args),
    put: (url, ...args) => instance.put(createUrl(url), ...args),
    delete: (url, ...args) => instance.delete(createUrl(url), ...args),
  };

  instance.interceptors.request.use((config) => {
    if (Boolean(cookies[COOKIES.AUTH_TOKEN])) {
      config.headers.common.Authorization = `Bearer ${
        cookies[COOKIES.AUTH_TOKEN]
      }`;
    }

    return config;
  });

  return {
    Auth: {
      getUser: (id, config = {}) => requests.get(`/auth/user/${id}`, config),
    },
    Users: {
      getAll: (config = {}) => requests.get("/users", config),
      getOne: (id, config = {}) => requests.get(`/users/${id}`, config),
      create: (config = {}) => requests.post("/users", config),
      update: (id, config = {}) => requests.put(`/users/${id}`, config),
      delete: (id, config = {}) => requests.delete(`/users/${id}`, config),
      getEvents: (id, config = {}) =>
        requests.get(`/users/${id}/events`, config),
      getTeams: (id, config = {}) => requests.get(`/users/${id}/teams`, config),
      getRoles: (id, config = {}) => requests.get(`/users/${id}/roles`, config),
      getRole: (userId, roleId, config = {}) =>
        requests.get(`/users/${userId}/roles/${roleId}`, config),
    },
    Schools: {
      getAll: (config = {}) => requests.get("/schools", config),
      getOneByHandle: (handle, config = {}) =>
        requests.get(`/schools/${handle}`, config),
      updateByHandle: (handle, config = {}) =>
        requests.put(`/schools/${handle}`, config),
      getUsers: (handle, config = {}) =>
        requests.get(`/schools/${handle}/users`, config),
      getEvents: (handle, config = {}) =>
        requests.get(`/schools/${handle}/events`, config),
    },
    Teams: {
      getAll: (config = {}) => requests.get("/teams", config),
      getOne: (id, config = {}) => requests.get(`/teams/${id}`, config),
      create: (config = {}) => requests.post("/teams", config),
      update: (id, config = {}) => requests.put(`/teams/${id}`, config),
      delete: (id, config = {}) => requests.delete(`/teams/${id}`, config),
      getAllTeammates: (id, config = {}) =>
        requests.get(`/teams/${id}/teammates`, config),
      createTeammate: (id, config = {}) =>
        requests.post(`/teams/${id}/teammates`, config),
      getOneTeammate: (teamId, teammateId, config = {}) =>
        requests.get(`/teams/${teamId}/teammates/${teammateId}`, config),
      deleteTeammate: (teamId, teammateId, config = {}) =>
        requests.delete(`/teams/${teamId}/teammates/${teammateId}`, config),
      createTeammateRole: (teamId, teammateId, config = {}) =>
        requests.post(`/teams/${teamId}/teammates/${teammateId}/roles`, config),
      updateTeammateRole: (teamId, teammateId, roleId, config = {}) =>
        requests.put(
          `/teams/${teamId}/teammates/${teammateId}/roles/${roleId}`,
          config
        ),
      deleteTeammateRole: (teamId, teammateId, roleId, config = {}) =>
        requests.delete(
          `/teams/${teamId}/teammates/${teammateId}/roles/${roleId}`,
          config
        ),
    },
    Events: {
      getAll: (config = {}) => requests.get("/events", config),
      getOne: (id, config = {}) => requests.get(`/events/${id}`, config),
      create: (config = {}) => requests.post("/events", config),
      update: (id, config = {}) => requests.put(`/events/${id}`, config),
      delete: (id, config = {}) => requests.delete(`/events/${id}`, config),
      getAllParticipants: (id, config = {}) =>
        requests.get(`/events/${id}/participants`, config),
      createParticipant: (id, config = {}) =>
        requests.post(`/events/${id}/participants`, config),
      getOneParticipant: (eventId, participantId, config = {}) =>
        requests.get(
          `/events/${eventId}/participants/${participantId}`,
          config
        ),
      updateParticipant: (eventId, participantId, config = {}) =>
        requests.put(
          `/events/${eventId}/participants/${participantId}`,
          config
        ),
      deleteParticipant: (eventId, participantId, config = {}) =>
        requests.delete(
          `/events/${eventId}/participants/${participantId}`,
          config
        ),
    },
  };
};
