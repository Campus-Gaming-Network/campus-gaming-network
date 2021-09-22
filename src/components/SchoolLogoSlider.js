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
  { id: "5vyhaFi1crtMIXjGT6fu", name: "Nazareth College" },
  { id: "6nc3PzeTwBL6KMgrb0aB", name: "Maryville University Of Saint Louis" },
  { id: "7MRHHpxpk8WdhIrx1OC9", name: "University Of Akron" },
  { id: "DHiimvWG3KTwPV2Hidpz", name: "Colorado School Of Mines" },
  {
    id: "GqcDKBksPkuugsXDMjO9",
    name: "University Of Illinois At Urbana Champaign",
  },
  { id: "GtOHc6rKQfY6xe9EU7KF", name: "Illinois Institute Of Technology" },
  { id: "Hl3jJ7t5fYXhbqq6thhe", name: "Carnegie Mellon University" },
  { id: "II9xWAyiQvPlTH4XlUK0", name: "University Of Houston" },
  { id: "KriCbXH62p0ALmUnhAvO", name: "University Of Kansas" },
  { id: "Lo0KrpADPKfyUVD6iqRv", name: "Arizona State University Tempe" },
  { id: "O1ZATKYzF2PfPw4YvWaP", name: "University Of Minnesota" },
  { id: "PJ2JPXRknFM7H2nSSYnw", name: "University Of North Carolina" },
  { id: "Ppqf1BWIuEMRDZ7OOtUF", name: "Marquette University" },
  { id: "RBfssIhRA1DABqSMIyBE", name: "University Of Colorado Boulder" },
  { id: "TOAicyiEln28ujf9Q3gD", name: "University Of San Diego" },
  { id: "YWoXjvriKdJU3NL0rutm", name: "University Of Wisconsin Madison" },
  { id: "Zth6ml8RWmARuz6YFWja", name: "Oregon State University" },
  { id: "f0BOkkpWNXrREMoPyjtZ", name: "University Of Iowa" },
  { id: "h7bbCtM1xmNER6ctZZlm", name: "University Of California Irvine" },
  { id: "hJn7eINet0z2BKu6ebxn", name: "Case Western Reserve University" },
  { id: "kXqUGz8O5qWRb63xeoZc", name: "Bethany Lutheran College" },
  { id: "lOg2MryS0jyrSdnefcPH", name: "Salisbury University" },
  { id: "lzWEb9OMTADUtGCQCKGL", name: "Depaul University" },
  { id: "msgtZCY40Dtr1rriwDtA", name: "Massachusetts Institute Of Technology" },
  { id: "pK3GuZyk6oDB0UVVAz7v", name: "Rutgers University" },
  { id: "sSxCDb4s71taea0MZKoA", name: "Harvard University" },
  { id: "wYYYropeY1yLMPh9dMES", name: "Michigan State University" },
  { id: "y61xIVTMIGrNZL3oeSRw", name: "University Of Central Florida" },
  { id: "zbt51IRo097p9peiBTYF", name: "Boise State University" },
  {
    id: "zxGU4sIS2C8NWfmDh7lB",
    name: "University Of Maryland Baltimore County",
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
      <Slider settings={{ ...settings, slidesToScroll: 1 }}>
        {schoolIds.map((school) => (
          <SchoolLogoSliderItem id={school.id} name={school.name} />
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
        href={`/school/${props.id}`}
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
