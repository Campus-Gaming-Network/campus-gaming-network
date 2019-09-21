/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    username
    firstName
    lastName
    hometown
    email
    birthdate
    isVerifiedStudent
    events {
      items {
        id
        title
        description
        location
        createdAt
        updatedAt
        startDateTime
        endDateTime
      }
      nextToken
    }
    school {
      id
      name
      handle
      description
      contactEmail
      website
      location
      events {
        nextToken
      }
      users {
        nextToken
      }
      createdAt
      updatedAt
      file {
        bucket
        region
        key
      }
    }
    major
    minor
    bio
    status
    createdAt
    updatedAt
    file {
      bucket
      region
      key
    }
    responses {
      items {
        id
        response
        createdAt
        updatedAt
      }
      nextToken
    }
    owner
  }
}
`;
export const listUsers = `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      username
      firstName
      lastName
      hometown
      email
      birthdate
      isVerifiedStudent
      events {
        nextToken
      }
      school {
        id
        name
        handle
        description
        contactEmail
        website
        location
        createdAt
        updatedAt
      }
      major
      minor
      bio
      status
      createdAt
      updatedAt
      file {
        bucket
        region
        key
      }
      responses {
        nextToken
      }
      owner
    }
    nextToken
  }
}
`;
export const getSchool = `query GetSchool($id: ID!) {
  getSchool(id: $id) {
    id
    name
    handle
    description
    contactEmail
    website
    location
    events {
      items {
        id
        title
        description
        location
        createdAt
        updatedAt
        startDateTime
        endDateTime
      }
      nextToken
    }
    users {
      items {
        id
        username
        firstName
        lastName
        hometown
        email
        birthdate
        isVerifiedStudent
        major
        minor
        bio
        status
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
    createdAt
    updatedAt
    file {
      bucket
      region
      key
    }
  }
}
`;
export const listSchools = `query ListSchools(
  $filter: ModelSchoolFilterInput
  $limit: Int
  $nextToken: String
) {
  listSchools(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      handle
      description
      contactEmail
      website
      location
      events {
        nextToken
      }
      users {
        nextToken
      }
      createdAt
      updatedAt
      file {
        bucket
        region
        key
      }
    }
    nextToken
  }
}
`;
export const getEvent = `query GetEvent($id: ID!) {
  getEvent(id: $id) {
    id
    school {
      id
      name
      handle
      description
      contactEmail
      website
      location
      events {
        nextToken
      }
      users {
        nextToken
      }
      createdAt
      updatedAt
      file {
        bucket
        region
        key
      }
    }
    title
    description
    location
    createdAt
    updatedAt
    owner {
      id
      username
      firstName
      lastName
      hometown
      email
      birthdate
      isVerifiedStudent
      events {
        nextToken
      }
      school {
        id
        name
        handle
        description
        contactEmail
        website
        location
        createdAt
        updatedAt
      }
      major
      minor
      bio
      status
      createdAt
      updatedAt
      file {
        bucket
        region
        key
      }
      responses {
        nextToken
      }
      owner
    }
    startDateTime
    endDateTime
    responses {
      items {
        id
        response
        createdAt
        updatedAt
      }
      nextToken
    }
  }
}
`;
export const listEvents = `query ListEvents(
  $filter: ModelEventFilterInput
  $limit: Int
  $nextToken: String
) {
  listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      school {
        id
        name
        handle
        description
        contactEmail
        website
        location
        createdAt
        updatedAt
      }
      title
      description
      location
      createdAt
      updatedAt
      owner {
        id
        username
        firstName
        lastName
        hometown
        email
        birthdate
        isVerifiedStudent
        major
        minor
        bio
        status
        createdAt
        updatedAt
        owner
      }
      startDateTime
      endDateTime
      responses {
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getEventResponse = `query GetEventResponse($id: ID!) {
  getEventResponse(id: $id) {
    id
    event {
      id
      school {
        id
        name
        handle
        description
        contactEmail
        website
        location
        createdAt
        updatedAt
      }
      title
      description
      location
      createdAt
      updatedAt
      owner {
        id
        username
        firstName
        lastName
        hometown
        email
        birthdate
        isVerifiedStudent
        major
        minor
        bio
        status
        createdAt
        updatedAt
        owner
      }
      startDateTime
      endDateTime
      responses {
        nextToken
      }
    }
    owner {
      id
      username
      firstName
      lastName
      hometown
      email
      birthdate
      isVerifiedStudent
      events {
        nextToken
      }
      school {
        id
        name
        handle
        description
        contactEmail
        website
        location
        createdAt
        updatedAt
      }
      major
      minor
      bio
      status
      createdAt
      updatedAt
      file {
        bucket
        region
        key
      }
      responses {
        nextToken
      }
      owner
    }
    response
    createdAt
    updatedAt
  }
}
`;
export const listEventResponses = `query ListEventResponses(
  $filter: ModelEventResponseFilterInput
  $limit: Int
  $nextToken: String
) {
  listEventResponses(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      event {
        id
        title
        description
        location
        createdAt
        updatedAt
        startDateTime
        endDateTime
      }
      owner {
        id
        username
        firstName
        lastName
        hometown
        email
        birthdate
        isVerifiedStudent
        major
        minor
        bio
        status
        createdAt
        updatedAt
        owner
      }
      response
      createdAt
      updatedAt
    }
    nextToken
  }
}
`;
export const searchUsers = `query SearchUsers(
  $filter: SearchableUserFilterInput
  $sort: SearchableUserSortInput
  $limit: Int
  $nextToken: String
) {
  searchUsers(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      username
      firstName
      lastName
      hometown
      email
      birthdate
      isVerifiedStudent
      events {
        nextToken
      }
      school {
        id
        name
        handle
        description
        contactEmail
        website
        location
        createdAt
        updatedAt
      }
      major
      minor
      bio
      status
      createdAt
      updatedAt
      file {
        bucket
        region
        key
      }
      responses {
        nextToken
      }
      owner
    }
    nextToken
  }
}
`;
export const searchSchools = `query SearchSchools(
  $filter: SearchableSchoolFilterInput
  $sort: SearchableSchoolSortInput
  $limit: Int
  $nextToken: String
) {
  searchSchools(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      name
      handle
      description
      contactEmail
      website
      location
      events {
        nextToken
      }
      users {
        nextToken
      }
      createdAt
      updatedAt
      file {
        bucket
        region
        key
      }
    }
    nextToken
  }
}
`;
export const searchEvents = `query SearchEvents(
  $filter: SearchableEventFilterInput
  $sort: SearchableEventSortInput
  $limit: Int
  $nextToken: String
) {
  searchEvents(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      school {
        id
        name
        handle
        description
        contactEmail
        website
        location
        createdAt
        updatedAt
      }
      title
      description
      location
      createdAt
      updatedAt
      owner {
        id
        username
        firstName
        lastName
        hometown
        email
        birthdate
        isVerifiedStudent
        major
        minor
        bio
        status
        createdAt
        updatedAt
        owner
      }
      startDateTime
      endDateTime
      responses {
        nextToken
      }
    }
    nextToken
  }
}
`;
