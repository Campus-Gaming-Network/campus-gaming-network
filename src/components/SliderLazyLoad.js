import React from "react";
import LazyLoad from "react-lazyload";

const SliderLazyLoad = (props) => {
  return (
    <LazyLoad once height={250} offset={200}>
      {props.children}
    </LazyLoad>
  );
};

export default SliderLazyLoad;
