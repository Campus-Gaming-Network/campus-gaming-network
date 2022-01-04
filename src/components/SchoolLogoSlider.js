// Libraries
import React from "react";
import {
  Box,
  Heading,
  VisuallyHidden,
  useBoolean,
  Text,
} from "@chakra-ui/react";
import shuffle from "lodash.shuffle";

// Components
import SchoolLogo from "src/components/SchoolLogo";
import Slider from "src/components/Slider";
import Link from "src/components/Link";

////////////////////////////////////////////////////////////////////////////////
// SchoolLogoSlider

// TODO: Map the id's to school names for alt/title tag
const schoolIds = shuffle([
  { id: "5vyhaFi1crtMIXjGT6fu", name: "Nazareth College", handle: "nazareth-college" },
  { id: "6nc3PzeTwBL6KMgrb0aB", name: "Maryville University Of Saint Louis", handle: "maryville-university-of-saint-louis" },
  { id: "7MRHHpxpk8WdhIrx1OC9", name: "University Of Akron", handle: "university-of-akron-main-campus" },
  { id: "DHiimvWG3KTwPV2Hidpz", name: "Colorado School Of Mines", handle: "colorado-school-of-mines" },
  {
    id: "GqcDKBksPkuugsXDMjO9",
    name: "University Of Illinois At Urbana Champaign",
    handle: "university-of-illinois-at-urbana-champaign"
  },
  { id: "GtOHc6rKQfY6xe9EU7KF", name: "Illinois Institute Of Technology", handle: "illinois-institute-of-technology" },
  { id: "Hl3jJ7t5fYXhbqq6thhe", name: "Carnegie Mellon University", handle: "carnegie-mellon-university" },
  { id: "II9xWAyiQvPlTH4XlUK0", name: "University Of Houston", handle: "university-of-houston" },
  { id: "KriCbXH62p0ALmUnhAvO", name: "University Of Kansas", handle: "university-of-kansas" },
  { id: "Lo0KrpADPKfyUVD6iqRv", name: "Arizona State University Tempe", handle: "arizona-state-university-tempe" },
  { id: "O1ZATKYzF2PfPw4YvWaP", name: "University Of Minnesota", handle: "university-of-minnesota-twin-cities" },
  { id: "PJ2JPXRknFM7H2nSSYnw", name: "University Of North Carolina", handle: "university-of-north-carolina-at-chapel-hill" },
  { id: "Ppqf1BWIuEMRDZ7OOtUF", name: "Marquette University", handle: "marquette-university" },
  { id: "RBfssIhRA1DABqSMIyBE", name: "University Of Colorado Boulder", handle: "university-of-colorado-boulder" },
  { id: "TOAicyiEln28ujf9Q3gD", name: "University Of San Diego", handle: "university-of-san-diego" },
  { id: "YWoXjvriKdJU3NL0rutm", name: "University Of Wisconsin Madison", handle: "university-of-wisconsin-madison" },
  { id: "Zth6ml8RWmARuz6YFWja", name: "Oregon State University", handle: "oregon-state-university" },
  { id: "f0BOkkpWNXrREMoPyjtZ", name: "University Of Iowa", handle: "university-of-iowa" },
  { id: "h7bbCtM1xmNER6ctZZlm", name: "University Of California Irvine", handle: "university-of-california-irvine" },
  { id: "hJn7eINet0z2BKu6ebxn", name: "Case Western Reserve University", handle: "case-western-reserve-university" },
  { id: "kXqUGz8O5qWRb63xeoZc", name: "Bethany Lutheran College", handle: "bethany-lutheran-college" },
  { id: "lOg2MryS0jyrSdnefcPH", name: "Salisbury University", handle: "salisbury-university" },
  { id: "lzWEb9OMTADUtGCQCKGL", name: "Depaul University", handle: "depaul-university" },
  { id: "msgtZCY40Dtr1rriwDtA", name: "Massachusetts Institute Of Technology", handle: "massachusetts-institute-of-technology" },
  { id: "pK3GuZyk6oDB0UVVAz7v", name: "Rutgers University", handle: "rutgers-university-new-brunswick" },
  { id: "sSxCDb4s71taea0MZKoA", name: "Harvard University", handle: "harvard-university" },
  { id: "wYYYropeY1yLMPh9dMES", name: "Michigan State University", handle: "michigan-state-university" },
  { id: "y61xIVTMIGrNZL3oeSRw", name: "University Of Central Florida", handle: "university-of-central-florida" },
  { id: "zbt51IRo097p9peiBTYF", name: "Boise State University", handle: "boise-state-university" },
  {
    id: "zxGU4sIS2C8NWfmDh7lB",
    name: "University Of Maryland Baltimore County",
    handle: "university-of-maryland-baltimore-county"
  },
]);
// const half = Math.ceil(schoolIds.length / 2);
// const firstHalf = schoolIds.slice(0, half);
// const secondHalf = schoolIds.slice(-half);

const settings = {
  arrows: false,
  lazyLoad: false,
  focusOnSelect: false,
  swipeToSlide: true,
  draggable: true,
  dots: false,
  infinite: true,
  slidesToShow: 7,
  slidesToScroll: 1,
  centerMode: true,
  autoplay: true,
  speed: 5000,
  autoplaySpeed: 0,
  cssEase: "linear",
  pauseOnHover: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 7,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
      },
    },
  ],
};

const SchoolLogoSlider = () => {
  return (
    <Box as="section" py={4}>
      <VisuallyHidden>
        <Heading as="h3" fontSize="xl" pb={4}>
          Find your school
        </Heading>
      </VisuallyHidden>
      <Slider settings={settings}>
        {schoolIds.map((school) => (
          <SchoolLogoSliderItem
            key={school.id}
            id={school.id}
            name={school.name}
            handle={school.handle}
          />
        ))}
      </Slider>
    </Box>
  );
};

const SchoolLogoSliderItem = (props) => {
  const [isHovered, setIsHovered] = useBoolean();

  return (
    <Box>
      <Link
        href={`/school/${props.handle}`}
        pos="relative"
        d="flex"
        alignItems="center"
        justifyContent="center"
        w={40}
        h={40}
        borderWidth={2}
        bg="white"
        borderStyle="solid"
        rounded="full"
        _hover={{ shadow: "md" }}
        onMouseEnter={() => setIsHovered.on()}
        onMouseLeave={() => setIsHovered.off()}
      >
        <SchoolLogo
          schoolId={props.id}
          schoolName={props.name}
          h={24}
          w={24}
          opacity={isHovered ? 0.5 : 1}
        />
        {isHovered ? (
          <Text
            d="block"
            w="103px"
            mx="auto"
            my="0"
            fontSize="xs"
            as="span"
            fontWeight="bold"
            textTransform="uppercase"
            pos="absolute"
            bottom={8}
            px={2}
            py={1}
            borderWidth={2}
            bg="gray.100"
            borderStyle="solid"
            rounded="md"
          >
            View school
          </Text>
        ) : null}
      </Link>
    </Box>
  );
};

export default SchoolLogoSlider;
