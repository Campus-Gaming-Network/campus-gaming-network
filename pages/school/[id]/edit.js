// Libraries
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  FormControl,
  FormLabel,
  Box,
  Button,
  Textarea,
  Heading,
  Text,
  useToast,
  FormHelperText,
  Image
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import nookies from "nookies";
import safeJsonStringify from "safe-json-stringify";

// Constants
import { SCHOOL_ACCOUNTS } from "src/constants/school";
import { DROPZONE_STYLES } from "src/constants/styles";
import { COLLECTIONS } from "src/constants/firebase";
import { ACCOUNTS, COOKIES, PRODUCTION_URL } from "src/constants/other";
import { AUTH_STATUS } from "src/constants/auth";

// Other
import firebase from "src/firebase";
import firebaseAdmin from "src/firebaseAdmin";

// Components
import SiteLayout from "src/components/SiteLayout";
import Article from "src/components/Article";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async context => {
  let cookies;
  let token;
  let authStatus;

  try {
    cookies = nookies.get(context);
    token =
      Boolean(cookies) && Boolean(cookies[COOKIES.AUTH_TOKEN])
        ? await firebaseAdmin.auth().verifyIdToken(cookies[COOKIES.AUTH_TOKEN])
        : null;
    authStatus =
      Boolean(token) && Boolean(token.uid)
        ? AUTH_STATUS.AUTHENTICATED
        : AUTH_STATUS.UNAUTHENTICATED;

    if (authStatus === AUTH_STATUS.UNAUTHENTICATED) {
      return { notFound: true };
    }
  } catch (error) {
    return { notFound: true };
  }

  const { school } = await getSchoolDetails(context.params.id);

  if (!Boolean(school)) {
    return { notFound: true };
  }

  const data = {
    school
  };

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// Form Reducer

const initialFormState = {
  description: "",
  email: "",
  website: "",
  phone: "",
  logo: "",
  file: null
};

const formReducer = (state, { field, value }) => {
  return {
    ...state,
    [field]: value
  };
};

////////////////////////////////////////////////////////////////////////////////
// EditSchool

const EditSchool = props => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasPrefilledForm, setHasPrefilledForm] = React.useState(false);
  const [state, dispatch] = React.useReducer(formReducer, initialFormState);
  const toast = useToast();
  const handleFieldChange = React.useCallback(e => {
    dispatch({ field: e.target.name, value: e.target.value });
  }, []);

  const prefillForm = () => {
    dispatch({
      field: "description",
      value: props.school.description || initialFormState.description
    });
    dispatch({
      field: "website",
      value: props.school.website || initialFormState.website
    });
    dispatch({
      field: "email",
      value: props.school.email || initialFormState.email
    });
    dispatch({
      field: "phone",
      value: props.school.phone || initialFormState.phone
    });
    setHasPrefilledForm(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setIsSubmitting(true);

    const data = {
      description: state.description,
      website: state.website,
      email: state.email,
      phone: state.phone
    };

    if (state.file) {
      const storageRef = firebase.storage().ref();
      const uploadTask = storageRef
        .child(`schools/${props.school.id}/images/logo.jpg`)
        .put(state.file);

      uploadTask.on(
        "state_changed",
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          console.log(`Upload is ${progress}% done`);

          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING:
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        error => {
          toast({
            title: "An error occurred.",
            description: error,
            status: "error",
            isClosable: true
          });
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://storage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log("File available at", downloadURL);
          });
          toast({
            title: "Logo updated.",
            description: "Your school logo has been updated.",
            status: "success",
            isClosable: true
          });
        }
      );
    }

    firebase
      .firestore()
      .collection(COLLECTIONS.SCHOOLS)
      .doc(props.school.id)
      .update(data)
      .then(() => {
        setIsSubmitting(false);
        toast({
          title: "School updated.",
          description: "Your school has been updated.",
          status: "success",
          isClosable: true
        });
      })
      .catch(error => {
        setIsSubmitting(false);
        toast({
          title: "An error occurred.",
          description: error.message,
          status: "error",
          isClosable: true
        });
      });

    setIsSubmitting(false);
  };

  if (!hasPrefilledForm) {
    prefillForm();
  }

  return (
    <SiteLayout meta={{ title: `Edit ${props.school.formattedName}`, og: { url: `${PRODUCTION_URL}/school/${props.school.id}/edit` } }}>
      <Article>
        <Stack as="form" spacing={32} onSubmit={handleSubmit}>
          <Heading as="h2" size="2xl">
            Edit School
          </Heading>
          <Button
            colorScheme="brand"
            type="submit"
            size="lg"
            w="full"
            mt={-12}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Update School"}
          </Button>
          <DetailSection
            dispatch={dispatch}
            schoolName={props.school.formattedName}
            handleFieldChange={handleFieldChange}
            description={state.description}
            phone={state.phone}
            email={state.email}
            file={state.file}
            logo={state.logo}
          />
          <SocialAccountsSection
            schoolName={props.school.formattedName}
            handleFieldChange={handleFieldChange}
            {...Object.keys(ACCOUNTS).reduce(
              (acc, cur) => ({
                ...acc,
                [cur]: state[cur]
              }),
              {}
            )}
          />
          <Button
            colorScheme="brand"
            type="submit"
            size="lg"
            w="full"
            mt={-12}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Update School"}
          </Button>
        </Stack>
      </Article>
    </SiteLayout>
  );
};

const DetailSection = React.memo(props => {
  const [thumbnail, setThumbnail] = React.useState(null);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    multiple: false,
    accept: "image/jpeg, image/png",
    onDrop: ([file]) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
      console.log({ file });
      const test = {
        ...file,
        preview: URL.createObjectURL(file)
      };
      console.log({ test });
      props.dispatch({
        field: "file",
        value: file
      });
      setThumbnail({
        ...file,
        preview: URL.createObjectURL(file)
      });
    }
  });

  const style = React.useMemo(
    () => ({
      ...DROPZONE_STYLES.BASE,
      ...(isDragActive ? DROPZONE_STYLES.ACTIVE : {}),
      ...(isDragAccept ? DROPZONE_STYLES.ACCEPT : {}),
      ...(isDragReject ? DROPZONE_STYLES.REJECT : {})
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  React.useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      if (props.file && props.file.preview) {
        URL.revokeObjectURL(props.file.preview);
      }
    },
    [props.file]
  );

  return (
    <Card as="fieldset" p={0} mb={32}>
      <Box pos="absolute" top="-5rem">
        <Text as="legend" fontWeight="bold" fontSize="2xl">
          Details
        </Text>
        <Text color="gray.500">
          Basic information about {props.schoolName}.
        </Text>
      </Box>
      <Stack spacing={6} p={8}>
        <FormControl>
          <FormLabel htmlFor="logo" fontSize="lg" fontWeight="bold">
            Logo
          </FormLabel>
          <Box {...getRootProps({ style })} mb={4}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <Text>Drop the files here ...</Text>
            ) : (
              <Text>
                Drag 'n' drop some files here, or click to select files
              </Text>
            )}
          </Box>
          {thumbnail ? (
            <Box>
              <Image
                src={thumbnail.preview}
                maxW={100}
                maxH={100}
                borderWidth="1px"
                borderColor="gray.300"
                loading="lazy"
              />
              <Text fontSize="lg">{thumbnail.path}</Text>
            </Box>
          ) : null}
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="logoDescription" fontSize="lg" fontWeight="bold">
            Logo Description
          </FormLabel>
          <Input
            id="logoDescription"
            name="logoDescription"
            type="text"
            placeholder="A crimson hawk with a yellow beak"
            onChange={props.handleFieldChange}
            value={props.logoDescription}
            size="lg"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="email" fontSize="lg" fontWeight="bold">
            Email
          </FormLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="esports@school.edu"
            onChange={props.handleFieldChange}
            value={props.email}
            size="lg"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="phone" fontSize="lg" fontWeight="bold">
            Phone
          </FormLabel>
          <Input
            id="phone"
            name="phone"
            type="phone"
            placeholder="(123) 456-7890"
            onChange={props.handleFieldChange}
            value={props.phone}
            size="lg"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="description" fontSize="lg" fontWeight="bold">
            Description
          </FormLabel>
          <Textarea
            id="description"
            name="description"
            onChange={props.handleFieldChange}
            value={props.description}
            placeholder={`Write any information you want to tell people about ${props.schoolName}`}
            size="lg"
            resize="vertical"
            maxLength="10000"
            h="150px"
            aria-describedby="bio-helper-text"
          />
          <FormHelperText id="bio-helper-text">
            Limit 10,000 characters.
          </FormHelperText>
        </FormControl>
      </Stack>
    </Card>
  );
});

const SocialAccountsSection = React.memo(props => {
  return (
    <Card as="fieldset" p={0} mb={32}>
      <Box pos="absolute" top="-5rem">
        <Text as="legend" fontWeight="bold" fontSize="2xl">
          Social Accounts
        </Text>
        <Text color="gray.500">
          Other places where people can connect with {props.schoolName}.
        </Text>
      </Box>
      <Stack spacing={6} p={8}>
        {Object.keys(SCHOOL_ACCOUNTS).map(id => {
          const account = SCHOOL_ACCOUNTS[id];

          return (
            <FormControl key={id}>
              <FormLabel htmlFor={id} fontSize="lg" fontWeight="bold">
                {account.label}
              </FormLabel>
              <InputGroup size="lg">
                {account.icon || Boolean(account.url) ? (
                  <InputLeftAddon
                    children={
                      <React.Fragment>
                        <FontAwesomeIcon icon={account.icon} />
                        {Boolean(account.url) ? (
                          <Text ml={4}>{account.url}</Text>
                        ) : null}
                      </React.Fragment>
                    }
                  />
                ) : null}
                <Input
                  id={id}
                  name={id}
                  type="text"
                  placeholder={account.placeholder}
                  onChange={props.handleFieldChange}
                  value={props[id]}
                  roundedLeft="0"
                />
              </InputGroup>
            </FormControl>
          );
        })}
      </Stack>
    </Card>
  );
});

export default EditSchool;
