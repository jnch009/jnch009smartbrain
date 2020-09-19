import React from 'react';

import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit, inputField }) => {
  return (
    <div>
      <p className='f3'>
        {'This Magic Brain will detect faces in your pictures. Give it a try!'}
      </p>
      <div className='center'>
        <div className='form w-100 w-75-ns center pv4 pa4-ns br3 shadow-5 dib-ns flex flex-column items-center'>
          <input
            className='f4 pa2 w-70 center mb0-ns mb2'
            type='text'
            value={inputField}
            onChange={e => onInputChange(e)}
          />
          <button
            className='tc w-30-ns w-70 o-90 glow f6 link ph3 pv2 dib white bg-light-purple'
            onClick={onButtonSubmit}
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
