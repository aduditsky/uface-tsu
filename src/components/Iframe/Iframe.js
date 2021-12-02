import React from 'react';
import css from './iframe.module.css';

const Iframe = ({ source }) => {
  if (!source) {
    return;
  }

  const src = source;
  return (
    <div className={css.iframeContainer}>
      <iframe
        frameBorder='0'
        scrolling='no'
        className={css.iframeBlock}
        src={src}
      ></iframe>
    </div>
  );
};

export default Iframe;
