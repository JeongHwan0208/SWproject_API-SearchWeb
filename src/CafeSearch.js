import React, { useState } from 'react';
import axios from 'axios';
import './CafeSearch.css'; // CSS 파일을 불러옵니다.

const Kakao = axios.create({
  baseURL: "https://dapi.kakao.com",
  headers: {
    Authorization: 'KakaoAK e126f907a220c29b6aa2fa390306d735'
  }
});

const kakaoCafeSearch = params => {
  return Kakao.get("/v2/search/cafe", { params });
};

const removeHtmlTagsAndEntities = (htmlString) => {
  return htmlString.replace(/(<([^>]+)>|&[^;]+;)/ig, '');
};

const CafeSearch = ({ title }) => {
  const [query, setQuery] = useState('');
  const [cafeResults, setCafeResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  const getCafeResults = async () => {
    try {
      if (query === '') {
        setCafeResults([]);
      } else {
        const params = {
          query: query,
          page: currentPage,
          size: pageSize
        };
        const result = await kakaoCafeSearch(params);
        if (result.data.documents) {
          const cafeResultsCleaned = result.data.documents.map(result => ({
            ...result,
            title: removeHtmlTagsAndEntities(result.title),
            contents: removeHtmlTagsAndEntities(result.contents),
            cafename: removeHtmlTagsAndEntities(result.cafename)
          }));
          setCafeResults(cafeResultsCleaned);
          setTotalPages(Math.ceil(result.data.meta.pageable_count / pageSize));
        } else {
          console.log('fail');
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    getCafeResults();
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    getCafeResults();
  };

  return (
    <div className="cafe-search-container">
      <h1 className="cafe-title">Cafe</h1>
      <form className="cafe-search-form" onSubmit={onSubmit}>
        <input className="cafe-search-input" type="text" placeholder='검색어' value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="cafe-search-button" type="submit">검색</button>
      </form>
      <div className='cafe-results'>
        {cafeResults.map((result, index) => (
          <div key={index} className="cafe-result">
            <h2 className="cafe-result-title"><a href={result.url}>{result.title}</a></h2>
            <p className="cafe-result-name">{result.cafename}</p>
            <p className="cafe-result-datetime">{result.datetime}</p>
            <img className="cafe-result-thumbnail" src={result.thumbnail} alt="Thumbnail" />
          </div>
        ))}
      </div>
      <div className="cafe-pagination">
        <span className="cafe-pagination-text">페이지:</span>
        <span className="cafe-pagination-page">{currentPage} / {totalPages}</span>
        <button className="cafe-pagination-prev" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>이전</button>
        <button className="cafe-pagination-next" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>다음</button>
      </div>
    </div>
  );
};

export default CafeSearch;
