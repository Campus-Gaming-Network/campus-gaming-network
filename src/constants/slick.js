////////////////////////////////////////////////////////////////////////////////
// User Constants

export const SLICK_SETTINGS = {
  lazyLoad: true,
  focusOnSelect: false,
  infinite: false,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 2,
  rows: 1,
  responsive: [
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
  ],
  swipeToSlide: true,
  variableWidth: false,
  arrows: true,
};
