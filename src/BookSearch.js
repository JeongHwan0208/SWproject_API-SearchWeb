import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookContent from './BookContent';
import { Link } from 'react-router-dom';
import './BookSearch.css';

const Kakao = axios.create({
  baseURL: "https://dapi.kakao.com",
  headers: {
    Authorization: 'KakaoAK e126f907a220c29b6aa2fa390306d735'
  }
});

const kakaoBookSearch = params => {
  return Kakao.get("/v3/search/book", { params });
};

const removeHtmlTagsAndEntities = (htmlString) => {
  return htmlString.replace(/(<([^>]+)>|&[a-zA-Z]+;)/ig, '');
};

const BookSearch = ({ title }) => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(9); // 9개씩 보이도록 변경
  const [noResults, setNoResults] = useState(false);

  const getBook = async (page) => {
    try {
      if (query === '') {
        setBooks([]);
        setNoResults(false); // 검색어가 없을 때는 결과가 없음을 표시하지 않음
      } else {
        const params = {
          query: query,
          page: page,
          size: pageSize,
          target: 'title'
        };
        const result = await kakaoBookSearch(params);
        if (result.data.documents.length === 0) {
          setBooks([]); // 검색 결과가 없는 경우 빈 배열 설정
          setTotalPages(1); // 전체 페이지 수를 1로 설정
          setNoResults(true); // 결과가 없음을 표시
        } else {
          setBooks(result.data.documents.map(book => ({ ...book, showDetails: false })));
          setTotalPages(Math.ceil(result.data.meta.pageable_count / pageSize));
          setNoResults(false); // 결과가 있음을 표시
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setCurrentPage(1); // 검색할 때마다 첫 페이지로 초기화
    await getBook(1); 
  };

  const handleClickBook = (index) => {
    setBooks(prevBooks => prevBooks.map((book, i) => {
      if (i === index) {
        return { ...book, showDetails: !book.showDetails }; 
      } else {
        return { ...book, showDetails: false }; 
      }
    }));
  };

  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await getBook(pageNumber);
  };

  const handlePrevPage = async () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      await getBook(newPage);
    }
  };
  
  const handleNextPage = async () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      await getBook(newPage);
    }
  };

  return (
    <div className="book-search-container">
      <h1 className="title">Book</h1>
      <div className="form-container">
        <form onSubmit={onSubmit}>
          <input type="text" className="search-input" placeholder='검색어' value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="submit" className="search-button">검색</button>
        </form>
      </div>
      <div className='documents'>
        {noResults && (
          <div className="no-results">검색 결과가 없습니다.</div>
        )}
        {!noResults && books.map((book, index) => (
          <div key={index} onClick={() => handleClickBook(index)} className="book-item">
            <img src={book.thumbnail ? book.thumbnail : 'http://via.placeholder.com/120X150'} alt="" />
            <div className='ellipsis'>{book.title}</div>
            {book.showDetails && (
              <BookContent
                key={book.isbn}
                id={<a href={book.url}>{book.title}</a>}
                year={book.datetime}
                title={book.title}
                price={book.price.toString()}
                auth={book.authors.toString()}
                publisher={book.publisher}
              />
            )}
          </div>
        ))}
      </div>
      <div className="container">
        <span>페이지:</span>
        <select value={currentPage} onChange={(e) => handlePageChange(parseInt(e.target.value))}>
          {Array.from({ length: totalPages }, (_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>이전</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>다음</button>
      </div>
    </div>
  );
};

export default BookSearch;
