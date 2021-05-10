// Libraries
import React from "react";
import LazyLoad from "react-lazyload";

////////////////////////////////////////////////////////////////////////////////
// SliderLazyLoad

const SliderLazyLoad = (props) => {
  return (
    <LazyLoad once height={250} offset={200}>
      {props.children}
    </LazyLoad>
  );
};

export default SliderLazyLoad;
