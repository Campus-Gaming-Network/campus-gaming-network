import React from "react";
import { Redirect } from "@reach/router";
import sortBy from "lodash.sortby";
import { Box, Select as ChakraSelect, } from "@chakra-ui/core";
import "./App.css";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import * as constants from "./constants";
import {
  useFormFields,
  createGravatarHash
} from "./utilities";
import PageWrapper from "../components/PageWrapper";
import Label from "../components/Label";
import Input from "../components/Input";

const db = firebase.firestore();

const Signup = props => {
  const [fields, handleFieldChange] = useFormFields({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    school: "",
    status: ""
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [schools, setSchools] = React.useState([]);
  const [schoolOptions, setSchoolOptions] = React.useState([]);
  const [isShowingPassword, setIsShowingPassword] = React.useState(false);

  // TODO: Impractical, we should use Algolia or ElasticSearch to query these
  React.useEffect(() => {
    const loadSchools = async () => {
      db.collection("schools")
        .get()
        .then(snapshot => {
          setSchools(snapshot.docs);
          setSchoolOptions(
            sortBy(
              snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              })),
              ["name"]
            )
          );
        });
    };

    loadSchools();
  }, []);

  if (props.isAuthenticated) {
    return <Redirect to="/" noThrow />;
  }

  function handleSubmit(e) {
    e.preventDefault();

    setIsSubmitting(true);

    firebase
      .auth()
      .createUserWithEmailAndPassword(fields.email, fields.password)
      .then(({ user }) => {
        db.collection("users")
          .doc(user.uid)
          .set({
            firstName: fields.firstName,
            lastName: fields.lastName,
            status: fields.status,
            gravatar: createGravatarHash(fields.email),
            school: schools.find(school => school.id === fields.school).ref
          });
        setIsSubmitting(false);
      })
      .catch(error => {
        alert(error.message);
        setIsSubmitting(false);
      });
  }

  function togglePasswordVisibility() {
    setIsShowingPassword(!isShowingPassword);
  }

  return (
    <PageWrapper>
      <Box
        as="fieldset"
        borderWidth="1px"
        boxShadow="lg"
        rounded="lg"
        bg="white"
        pos="relative"
        p={12}
      >
        <form onSubmit={handleSubmit}>
          <h1 className="text-5xl font-bold leading-none">Create an account</h1>
          <hr className="my-12" />
          <div className="md:flex md:items mb-6">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              autoFocus
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Jane"
              required
              onChange={handleFieldChange}
              value={fields.firstName}
            />
          </div>
          <div className="md:flex md:items-center mb-6">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Doe"
              required
              onChange={handleFieldChange}
              value={fields.lastName}
            />
          </div>
          <div className="md:flex md:items-center mb-6">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jdoe@gmail.com"
              required
              onChange={handleFieldChange}
              value={fields.email}
            />
          </div>
          <div className="md:flex md:items-stretch mb-6">
            <Label htmlFor="password">Password</Label>
            <div className="w-full">
              <Input
                id="password"
                name="password"
                type={isShowingPassword ? "text" : "password"}
                placeholder="******************"
                required
                onChange={handleFieldChange}
                value={fields.password}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-sm italic"
              >
                {isShowingPassword ? "Hide" : "Show"} password
              </button>
              <div className="text-sm">
                <p className="font-bold mt-4">Password Must</p>
                <ul className="flex flex-wrap list-disc pl-4">
                  <li className="w-1/2">Have One number</li>
                  <li className="w-1/2">Have One uppercase character</li>
                  <li className="w-1/2">Have One lowercase character</li>
                  <li className="w-1/2">Have One special character</li>
                  <li className="w-1/2">Have 8 characters minimum</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <Label htmlFor="school">School</Label>
            <ChakraSelect
              id="school"
              required
              onChange={handleFieldChange}
              value={fields.school}
              size="lg"
            >
              <option value="">Select a school</option>
              {schoolOptions.map(school => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </ChakraSelect>
          </div>
          <div className="md:flex md:items-center">
            <Label htmlFor="status">Status</Label>
            <ChakraSelect
              id="status"
              required
              onChange={handleFieldChange}
              value={fields.status}
              size="lg"
            >
              {constants.STUDENT_STATUS_OPTIONS.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </ChakraSelect>
          </div>
          <Button
            disabled={isSubmitting}
            variant="purple"
            type="submit"
            className="my-12 w-full"
          >
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </Button>
          <p>
            Already a member?{" "}
            <Link to="/login" className={constants.STYLES.LINK.DEFAULT}>
              Log in
            </Link>
          </p>
        </form>
      </Box>
    </PageWrapper>
  );
};

export default Signup;
