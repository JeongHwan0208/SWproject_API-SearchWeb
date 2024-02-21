import React from 'react';

const BookContent = ({ id, year, title, cover, price, auth, publisher }) => {
  return (
    <div>
      <p>Year: {year}</p>
      <p>Price: {price}</p>
      <p>Authors: {auth}</p>
      <p>Publisher: {publisher}</p>
      <p>Link: {id}</p>
    </div>
  );
};

export default BookContent;
