import React, { useRef, useEffect } from "react";

export const useAnimation = () => {
  const el = useRef();
  useEffect(() => {
    if (el.current) {
      let { current } = el;
      current.classList.add("loaded");
    }
  });
  return { ref: el };
};
