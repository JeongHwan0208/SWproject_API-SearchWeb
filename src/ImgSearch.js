import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ImageSearch.css';

const Kakao = axios.create({
  baseURL: "https://dapi.kakao.com",
  headers: {
    Authorization: 'KakaoAK e126f907a220c29b6aa2fa390306d735'
  }
});

const kakaoImageSearch = params => {
  return Kakao.get("/v2/search/image", { params });
};

const ImageSearch = ({ title }) => {
  const [query, setQuery] = useState('');
  const [imageResults, setImageResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(9);
  const [noResults, setNoResults] = useState(false);

  const getImageResults = async () => {
    try {
      if (query === '') {
        setImageResults([]);
        setNoResults(false);
        return;
      }

      const params = {
        query: query,
        page: currentPage,
        size: pageSize
      };
      const result = await kakaoImageSearch(params);
      if (result.data.documents) {
        setImageResults(result.data.documents);
        setTotalPages(Math.ceil(result.data.meta.pageable_count / pageSize));
        setNoResults(result.data.documents.length === 0);
      } else {
        console.log('fail');
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getImageResults();
  }, [currentPage]);

  const onSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    getImageResults();
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="image-search-container">
      <h1 className="image-title">Image</h1>
      <form onSubmit={onSubmit} className="image-search-form">
        <input type="text" placeholder='검색어' value={query} onChange={(e) => setQuery(e.target.value)} className="image-search-input" />
        <button type="submit" className="image-search-button">검색</button>
      </form>
      <div className='image-results'>
        {noResults ? (
          <div className="no-image-results">검색 결과가 없습니다.</div>
        ) : (
          imageResults.map((result, index) => (
            <div key={index} className="image-result">
              <h2><a href={result.doc_url} className="image-result-link">{result.display_sitename}</a></h2>
              <img src={result.thumbnail_url} alt="Thumbnail" className="image-thumbnail" />
            </div>
          ))
        )}
      </div>
      <div className="image-pagination">
        <span>페이지:</span>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={handlePrevPage} disabled={currentPage === 1} className="image-prev-button">이전</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="image-next-button">다음</button>
      </div>
    </div>
  );
};

export default ImageSearch;
