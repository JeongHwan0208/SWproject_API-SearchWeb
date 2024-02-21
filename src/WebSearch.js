import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WebSearch.css';

const Kakao = axios.create({
  baseURL: "https://dapi.kakao.com",
  headers: {
    Authorization: 'KakaoAK e126f907a220c29b6aa2fa390306d735'
  }
});

const kakaoWebSearch = params => {
  return Kakao.get("/v2/search/web", { params });
};

const removeHtmlTagsAndEntities = (htmlString) => {
  return htmlString.replace(/(<([^>]+)>|&[a-zA-Z]+;)/ig, '');
};

const WebSearch = ({ title }) => {
  const [query, setQuery] = useState('');
  const [webResults, setWebResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [searched, setSearched] = useState(false); // New state to track if search has been performed

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searched && query !== '') { // Only perform search if search has been initiated and query is not empty
          const params = {
            query: query,
            page: currentPage,
            size: pageSize
          };
          const result = await kakaoWebSearch(params);
          if (result.data.documents) {
            const webResultsWithoutTagsAndEntities = result.data.documents.map(result => ({
              ...result,
              title: removeHtmlTagsAndEntities(result.title),
              contents: removeHtmlTagsAndEntities(result.contents)
            }));
            setWebResults(webResultsWithoutTagsAndEntities);
            setTotalPages(Math.ceil(result.data.meta.pageable_count / pageSize));
          } else {
            console.log('fail');
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, [searched, query, currentPage, pageSize]);

  const onSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearched(true);
  };

  const handlePrevPage = async () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = async () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="web-search-container">
      <h1 className="web-search-title">Web</h1>
      <form onSubmit={onSubmit} className="web-search-form-container">
        <input type="text" placeholder='검색어' value={query} onChange={(e) => setQuery(e.target.value)} className="web-search-input" />
        <button type="submit" className="web-search-button">검색</button>
      </form>
      <div className='web-search-documents'>
        {webResults.length > 0 && webResults.map((result, index) => (
          <div key={index} className="web-search-result">
            <h2><a href={result.url} style={{ color: 'white', textDecoration: 'none' }}>{result.title}</a></h2>
            <p style={{ color: 'white' }}>{result.contents}</p>
          </div>
        ))}
        {webResults.length === 0 && searched && <div className="no-results">검색 결과가 없습니다.</div>}
      </div>
      <div className="web-search-pagination">
        <span>페이지:</span>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>이전</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>다음</button>
      </div>
    </div>
  );
};

export default WebSearch;
