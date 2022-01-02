////////////////////////////////////////////////////////////////////////////////
// User Constants

export const SLICK_SETTINGS = {
  lazyLoad: true,
  focusOnSelect: false,
  infinite: false,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  rows: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1.5,
      },
    },
  ],
  swipeToSlide: true,
  variableWidth: false,
  arrows: true,
};
