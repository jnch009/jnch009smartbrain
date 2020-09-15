import React from 'react';

const GridRow = ({title, value, editable, password, handleChange}) => (
  <article
    className='flex justify-around dt w-100 bb b--black-05 pa4 mt2'
    href='#0'
  >
    <div className='dtc v-mid pl3'>
      <h1 className='f4 f5-ns fw6 lh-title black mv0'>{title}</h1>
      {editable ? (
        <input
          type={password ? 'password' : 'text'}
          className='f4 fw4 mt0 mb0 black-60'
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
      ) : (
        <h2 className='f4 fw4 mt0 mb0 black-60'>{value}</h2>
      )}
    </div>
  </article>
);

export default GridRow;
