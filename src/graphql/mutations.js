/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
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
export const updateUser = `mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
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
export const deleteUser = `mutation DeleteUser($input: DeleteUserInput!) {
  deleteUser(input: $input) {
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
export const createSchool = `mutation CreateSchool($input: CreateSchoolInput!) {
  createSchool(input: $input) {
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
export const updateSchool = `mutation UpdateSchool($input: UpdateSchoolInput!) {
  updateSchool(input: $input) {
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
export const deleteSchool = `mutation DeleteSchool($input: DeleteSchoolInput!) {
  deleteSchool(input: $input) {
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
export const createEvent = `mutation CreateEvent($input: CreateEventInput!) {
  createEvent(input: $input) {
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
export const updateEvent = `mutation UpdateEvent($input: UpdateEventInput!) {
  updateEvent(input: $input) {
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
export const deleteEvent = `mutation DeleteEvent($input: DeleteEventInput!) {
  deleteEvent(input: $input) {
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
export const createEventResponse = `mutation CreateEventResponse($input: CreateEventResponseInput!) {
  createEventResponse(input: $input) {
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
export const updateEventResponse = `mutation UpdateEventResponse($input: UpdateEventResponseInput!) {
  updateEventResponse(input: $input) {
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
export const deleteEventResponse = `mutation DeleteEventResponse($input: DeleteEventResponseInput!) {
  deleteEventResponse(input: $input) {
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
