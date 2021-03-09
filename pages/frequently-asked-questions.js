// Libraries
import React from "react";
import { Box, Text, Link } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faLink } from "@fortawesome/free-solid-svg-icons";

// Components
import Article from "src/components/Article";
import Card from "src/components/Card";
import PageHeading from "src/components/PageHeading";
import OutsideLink from "src/components/OutsideLink";
import SiteLayout from "src/components/SiteLayout";

////////////////////////////////////////////////////////////////////////////////
// FrequentlyAskedQuestions

const FrequentlyAskedQuestions = () => {
  return (
    <SiteLayout title="Frequently Asked Questions">
      <Article>
        <PageHeading>Frequently Asked Questions</PageHeading>
        <Card>
          <dl>
            {QUESTIONS.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  {item.question}
                  {item.answer}
                </React.Fragment>
              );
            })}
          </dl>
        </Card>
      </Article>
    </SiteLayout>
  );
};

////////////////////////////////////////////////////////////////////////////////
// QuestionWrapper

const QuestionWrapper = props => {
  return (
    <Box as="dt" flex="1" textAlign="left" fontWeight="bold" fontSize="md">
      <Link
        href={`#${props.id}`}
        id={props.id}
        color="gray.400"
        d="inline-flex"
        mr={2}
      >
        <FontAwesomeIcon icon={faLink} size="xs" />
      </Link>
      {props.children}
    </Box>
  );
};

////////////////////////////////////////////////////////////////////////////////
// AnswerWrapper

const AnswerWrapper = props => {
  return (
    <Box as="dd" flex="1" textAlign="left" fontSize="md" pb={4}>
      {props.children}
    </Box>
  );
};

////////////////////////////////////////////////////////////////////////////////
// ExternalLink

const ExternalLink = props => {
  return (
    <OutsideLink href={props.href}>
      {props.children}
      <Text as="span" ml={1}>
        <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
      </Text>
    </OutsideLink>
  );
};

////////////////////////////////////////////////////////////////////////////////
// VerifyEmail=
const IGDBLink = props => {
  return (
    <ExternalLink href="https://www.igdb.com/discover">
      {props.children ? props.children : "Internet Games Database (IGDB)"}
    </ExternalLink>
  );
};

////////////////////////////////////////////////////////////////////////////////
// GithubLink

const GithubLink = props => {
  return (
    <ExternalLink href="https://github.com/bsansone/campus-gaming-network">
      {props.children ? props.children : "GitHub"}
    </ExternalLink>
  );
};

////////////////////////////////////////////////////////////////////////////////
// DiscordLink

const DiscordLink = props => {
  return (
    <ExternalLink href="https://discord.gg/dpYU6TY">
      {props.children ? props.children : "Discord"}
    </ExternalLink>
  );
};

////////////////////////////////////////////////////////////////////////////////
// GravatarLink

const GravatarLink = props => {
  return (
    <ExternalLink href="https://en.gravatar.com/">
      {props.children ? props.children : "Gravatar"}
    </ExternalLink>
  );
};

////////////////////////////////////////////////////////////////////////////////
// BuyMeACoffeeLink

const BuyMeACoffeeLink = props => {
  const href = `https://www.buymeacoffee.com/${
    props.page ? props.page : ""
  }`.trim();

  return (
    <ExternalLink href={href}>
      {props.children ? props.children : "Buy Me a Coffee"}
    </ExternalLink>
  );
};

////////////////////////////////////////////////////////////////////////////////
// Questions

const QUESTIONS = [
  {
    question: (
      <QuestionWrapper id="does-campus-gaming-network-cost-anything-to-use">
        Does Campus Gaming Network cost anything to use?
      </QuestionWrapper>
    ),
    answer: <AnswerWrapper>No, it is completely free to use.</AnswerWrapper>
  },
  {
    question: (
      <QuestionWrapper id="how-does-campus-gaming-network-make-money">
        How does Campus Gaming Network make money?
      </QuestionWrapper>
    ),
    answer: (
      <AnswerWrapper id="we-make-money-by-donations-from-our-users-through-a-service-called-buy-me-a-coffee">
        We make money by donations from our users through a service called{" "}
        <BuyMeACoffeeLink />. If you like what we do and want to donate to help
        with development costs, you can visit our{" "}
        <BuyMeACoffeeLink page="cgnbrandon">
          Buy Me a Coffee page
        </BuyMeACoffeeLink>
        .
      </AnswerWrapper>
    )
  },
  {
    question: (
      <QuestionWrapper id="where-does-my-profile-picture-come-from">
        Where does my profile picture come from?
      </QuestionWrapper>
    ),
    answer: (
      <AnswerWrapper>
        Your profile picture is managed by <GravatarLink /> . It is linked to
        your email address or your last known IP address. If you do not have a{" "}
        <GravatarLink /> account tied to your email you are given a default
        randomized profile picture.
      </AnswerWrapper>
    )
  },
  {
    question: (
      <QuestionWrapper id="how-do-i-change-my-profile-picture">
        How do I change my profile picture?
      </QuestionWrapper>
    ),
    answer: (
      <AnswerWrapper>
        To change your profile picture, you need to make a <GravatarLink />{" "}
        account with the same email address you used to sign up for Campus
        Gaming Network. Once you have created a <GravatarLink /> account you can
        upload a profile picture there and it will automatically be used on
        Campus Gaming Network and any other website that uses the{" "}
        <GravatarLink /> service.
      </AnswerWrapper>
    )
  },
  {
    question: (
      <QuestionWrapper id="will-you-allow-uploading-of-profile-pictures-without-gravatar">
        Will you allow uploading of profile pictures without <GravatarLink />?
      </QuestionWrapper>
    ),
    answer: (
      <AnswerWrapper>
        Maybe sometime in the future, but for right now, to keep costs down we
        are taking advantage of their service.
      </AnswerWrapper>
    )
  },
  {
    question: (
      <QuestionWrapper id="where-does-the-list-of-games-come-from">
        Where does the list of games come from?
      </QuestionWrapper>
    ),
    answer: (
      <AnswerWrapper>
        Our list of games comes from the <IGDBLink />
      </AnswerWrapper>
    )
  },
  {
    question: (
      <QuestionWrapper id="i-cant-find-a-certain-game-what-gives">
        I can't find a certain game, what gives?
      </QuestionWrapper>
    ),
    answer: (
      <AnswerWrapper>
        You would need to take that up with the{" "}
        <ExternalLink href="https://www.igdb.com/discover">
          Internet Games Database (IGDB)
          <Text as="span" ml={1}>
            <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
          </Text>
        </ExternalLink>
        , we have no control over that.
      </AnswerWrapper>
    )
  },
  {
    question: (
      <QuestionWrapper id="is-there-a-mobile-app">
        Is there a mobile app?
      </QuestionWrapper>
    ),
    answer: (
      <AnswerWrapper>
        Not currently, but we plan to develop a native mobile app for both iOS
        and Android in the future.
      </AnswerWrapper>
    )
  },
  {
    question: (
      <QuestionWrapper id="what-happens-if-something-on-the-site-doesnt-work-as-expected">
        What happens if something on the site doesn't work as expected?
      </QuestionWrapper>
    ),
    answer: (
      <AnswerWrapper>
        You can email us at{" "}
        <Link
          href="mailto:support@campusgamingnetwork.com"
          color="brand.500"
          fontWeight={600}
        >
          support@campusgamingnetwork.com
        </Link>
        , join our <DiscordLink />, or open an issue on our <GithubLink />. We
        will try to reach back and look into the issue as soon as we can.
      </AnswerWrapper>
    )
  },
  {
    question: <QuestionWrapper id="who-are-you">Who are you?</QuestionWrapper>,
    answer: (
      <AnswerWrapper>
        An avid gamer, software developer, living in Salt Lake City, who wants
        to see more people connected through video games.
      </AnswerWrapper>
    )
  }
];

export default FrequentlyAskedQuestions;
