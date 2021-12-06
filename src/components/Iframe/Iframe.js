import React from 'react';
import css from './iframe.module.css';

const Iframe = ({ source }) => {
  if (!source) {
    return <></>;
  }

  return (
    <div className={css.iframeContainer}>
      <iframe
        title='CovidCertificate'
        frameBorder='0'
        scrolling='no'
        className={css.iframeBlock}
        src={source}
      ></iframe>
    </div>
  );
};

export default Iframe;
