import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BlogSearch.css'; // CSS 파일을 불러옵니다.

const Kakao = axios.create({
  baseURL: "https://dapi.kakao.com",
  headers: {
    Authorization: 'KakaoAK e126f907a220c29b6aa2fa390306d735'
  }
});

const kakaoBlogSearch = params => {
  return Kakao.get("/v2/search/blog", { params });
};

const removeHtmlTagsAndEntities = (htmlString) => {
  return htmlString.replace(/(<([^>]+)>|&[a-zA-Z]+;)/ig, '');
};

const BlogSearch = ({ title }) => {
  const [query, setQuery] = useState('');
  const [blogResults, setBlogResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  const getBlogResults = async (pageNumber) => {
    try {
      const params = {
        query: query,
        page: pageNumber,
        size: pageSize
      };
      const result = await kakaoBlogSearch(params);
      if (result.data.documents) {
        const blogResultsCleaned = result.data.documents.map(result => ({
          ...result,
          title: removeHtmlTagsAndEntities(result.title),
          blogname: removeHtmlTagsAndEntities(result.blogname),
          contents: removeHtmlTagsAndEntities(result.contents)
        }));
        setBlogResults(blogResultsCleaned);
        setTotalPages(Math.ceil(result.data.meta.pageable_count / pageSize));
      } else {
        console.log('fail');
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    getBlogResults(1); // 페이지 번호를 1로 설정하여 첫 페이지의 결과를 가져옵니다.
  };

  const handlePrevPage = async () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      getBlogResults(currentPage - 1); // 이전 페이지의 결과를 가져옵니다.
    }
  };

  const handleNextPage = async () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      getBlogResults(currentPage + 1); // 다음 페이지의 결과를 가져옵니다.
    }
  };

  return (
    <div className="blog-search-container">
      <h1 className="blog-title">Blog</h1>
      <form onSubmit={onSubmit} className="blog-search-form">
        <input type="text" className="blog-search-input" placeholder='검색어' value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit" className="blog-search-button">검색</button>
      </form>
      <div className="blog-results">
        {blogResults.map((result, index) => (
          <div key={index} className="blog-result">
            <h2><a href={result.url} className="blog-result-title">{result.title}</a></h2>
            <p className="blog-result-blogname">{result.blogname}</p>
            <p className="blog-result-datetime">{result.datetime}</p>
            <img src={result.thumbnail} alt="Thumbnail" className="blog-result-thumbnail" />
          </div>
        ))}
      </div>
      <div className="blog-pagination">
        <span className="pagination-label">페이지:</span>
        <span className="pagination-info">{currentPage} / {totalPages}</span>
        <button onClick={handlePrevPage} disabled={currentPage === 1} className="prev-button">이전</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="next-button">다음</button>
      </div>
    </div>
  );
};

export default BlogSearch;
