/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = `subscription OnCreateUser($owner: String!) {
  onCreateUser(owner: $owner) {
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
export const onUpdateUser = `subscription OnUpdateUser($owner: String!) {
  onUpdateUser(owner: $owner) {
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
export const onDeleteUser = `subscription OnDeleteUser {
  onDeleteUser {
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
export const onCreateSchool = `subscription OnCreateSchool {
  onCreateSchool {
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
export const onUpdateSchool = `subscription OnUpdateSchool {
  onUpdateSchool {
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
export const onDeleteSchool = `subscription OnDeleteSchool {
  onDeleteSchool {
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
export const onCreateEvent = `subscription OnCreateEvent($owner: String!) {
  onCreateEvent(owner: $owner) {
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
export const onUpdateEvent = `subscription OnUpdateEvent($owner: String!) {
  onUpdateEvent(owner: $owner) {
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
export const onDeleteEvent = `subscription OnDeleteEvent($owner: String!) {
  onDeleteEvent(owner: $owner) {
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
export const onCreateEventResponse = `subscription OnCreateEventResponse($owner: String!) {
  onCreateEventResponse(owner: $owner) {
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
export const onUpdateEventResponse = `subscription OnUpdateEventResponse($owner: String!) {
  onUpdateEventResponse(owner: $owner) {
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
export const onDeleteEventResponse = `subscription OnDeleteEventResponse {
  onDeleteEventResponse {
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
