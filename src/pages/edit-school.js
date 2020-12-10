// Libraries
import React from "react";
import { Redirect } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Input as ChakraInput,
  InputGroup as ChakraInputGroup,
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
import startCase from "lodash.startcase";
import { useDropzone } from "react-dropzone";

// Constants
import {
  ACCOUNTS,
  DROPZONE_STYLES,
  SCHOOL_ACCOUNTS,
  COLLECTIONS,
  BASE_SCHOOL
} from "../constants";

// Other
import { firebase, firebaseFirestore, firebaseStorage } from "../firebase";

const initialFormState = {
  ...BASE_SCHOOL,
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
    dispatch({ field: "description", value: props.school.description || "" });
    dispatch({ field: "website", value: props.school.website || "" });
    dispatch({ field: "email", value: props.school.email || "" });
    dispatch({ field: "phone", value: props.school.phone || "" });
    setHasPrefilledForm(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!props.isAuthenticated) {
      return;
    }

    setIsSubmitting(true);

    const data = {
      ...BASE_SCHOOL,
      description: state.description,
      website: state.website,
      email: state.email,
      phone: state.phone
    };

    if (state.file) {
      const storageRef = firebaseStorage.ref();
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
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
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

    firebaseFirestore
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

  if (!props.isAuthenticated) {
    return <Redirect to="/" noThrow />;
  }

  if (!props.user) {
    console.error(`No user found ${props.uri}`);
    return <Redirect to="/not-found" noThrow />;
  }

  if (!hasPrefilledForm) {
    prefillForm();
  }

  const schoolName = startCase(props.school.name.toLowerCase());

  return (
    <Box as="article" py={16} px={8} mx="auto" fontSize="xl" maxW="5xl">
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
          schoolName={schoolName}
          handleFieldChange={handleFieldChange}
          description={state.description}
          phone={state.phone}
          email={state.email}
          file={state.file}
          logo={state.logo}
        />
        <SocialAccountsSection
          schoolName={schoolName}
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
    </Box>
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
    <Box
      as="fieldset"
      borderWidth="1px"
      boxShadow="lg"
      rounded="lg"
      bg="white"
      pos="relative"
      mb={32}
    >
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
          <ChakraInput
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
          <ChakraInput
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
          <ChakraInput
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
    </Box>
  );
});

const SocialAccountsSection = React.memo(props => {
  return (
    <Box
      as="fieldset"
      borderWidth="1px"
      boxShadow="lg"
      rounded="lg"
      bg="white"
      pos="relative"
      mb={32}
    >
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
              <ChakraInputGroup size="lg">
                {account.icon || !!account.url ? (
                  <InputLeftAddon
                    children={
                      <React.Fragment>
                        <FontAwesomeIcon icon={account.icon} />
                        {!!account.url ? (
                          <Text ml={4}>{account.url}</Text>
                        ) : null}
                      </React.Fragment>
                    }
                  />
                ) : null}
                <ChakraInput
                  id={id}
                  name={id}
                  type="text"
                  placeholder={account.placeholder}
                  onChange={props.handleFieldChange}
                  value={props[id]}
                  roundedLeft="0"
                />
              </ChakraInputGroup>
            </FormControl>
          );
        })}
      </Stack>
    </Box>
  );
});

export default EditSchool;
