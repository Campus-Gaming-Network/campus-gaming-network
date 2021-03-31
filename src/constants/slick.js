////////////////////////////////////////////////////////////////////////////////
// User Constants

export const SLICK_SETTINGS = {
  lazyLoad: true,
  focusOnSelect: true,
  infinite: false,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
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
};
