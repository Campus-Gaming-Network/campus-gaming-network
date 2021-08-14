// Libraries
import React from "react";
import { Box, Flex, Heading, Img, VisuallyHidden } from "@chakra-ui/react";
import shuffle from "lodash.shuffle";

// Components
import SchoolLogo from "src/components/SchoolLogo";
import Slider from "./Slider";

////////////////////////////////////////////////////////////////////////////////
// SchoolLogoSlider

// TODO: Map the id's to school names for alt/title tag
const schoolIds = shuffle([
  "5vyhaFi1crtMIXjGT6fu",
  "6nc3PzeTwBL6KMgrb0aB",
  "7MRHHpxpk8WdhIrx1OC9",
  "DHiimvWG3KTwPV2Hidpz",
  "GqcDKBksPkuugsXDMjO9",
  "GtOHc6rKQfY6xe9EU7KF",
  "Hl3jJ7t5fYXhbqq6thhe",
  "II9xWAyiQvPlTH4XlUK0",
  "KriCbXH62p0ALmUnhAvO",
  "Lo0KrpADPKfyUVD6iqRv",
  "O1ZATKYzF2PfPw4YvWaP",
  "PJ2JPXRknFM7H2nSSYnw",
  "Ppqf1BWIuEMRDZ7OOtUF",
  "RBfssIhRA1DABqSMIyBE",
  "TOAicyiEln28ujf9Q3gD",
  "YWoXjvriKdJU3NL0rutm",
  "Zth6ml8RWmARuz6YFWja",
  "f0BOkkpWNXrREMoPyjtZ",
  "h7bbCtM1xmNER6ctZZlm",
  "hJn7eINet0z2BKu6ebxn",
  "kXqUGz8O5qWRb63xeoZc",
  "lOg2MryS0jyrSdnefcPH",
  "lzWEb9OMTADUtGCQCKGL",
  "msgtZCY40Dtr1rriwDtA",
  "pK3GuZyk6oDB0UVVAz7v",
  "sSxCDb4s71taea0MZKoA",
  "wYYYropeY1yLMPh9dMES",
  "y61xIVTMIGrNZL3oeSRw",
  "zbt51IRo097p9peiBTYF",
  "zxGU4sIS2C8NWfmDh7lB",
]);
const half = Math.ceil(schoolIds.length / 2);
const firstHalf = schoolIds.slice(0, half);
const secondHalf = schoolIds.slice(-half);

const settings = {
  arrows: false,
  lazyLoad: false,
  focusOnSelect: false,
  swipeToSlide: false,
  dots: false,
  infinite: true,
  slidesToShow: 6,
  autoplay: true,
  speed: 5000,
  autoplaySpeed: 5000,
  pauseOnHover: false,
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
        {firstHalf.map((id) => (
          <Box>
            <Flex p={2} align="center" justify="center" w={40} h={40}>
              <SchoolLogo
                rounded="full"
                borderWidth={2}
                bg="white"
                p={1}
                shadow="md"
                borderStyle="solid"
                schoolId={id}
                h="100%"
                w="100%"
              />
            </Flex>
          </Box>
        ))}
      </Slider>
      <Slider settings={{ ...settings, slidesToScroll: -1 }}>
        {secondHalf.map((id) => (
          <Box>
            <Flex p={2} align="center" justify="center" w={40} h={40}>
              <SchoolLogo
                rounded="full"
                borderWidth={2}
                bg="white"
                p={1}
                shadow="md"
                borderStyle="solid"
                schoolId={id}
                h="100%"
                w="100%"
              />
            </Flex>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default SchoolLogoSlider;
