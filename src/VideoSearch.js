import React, { useState } from 'react';
import axios from 'axios';
import './VideoSearch.css';

const Kakao = axios.create({
  baseURL: "https://dapi.kakao.com",
  headers: {
    Authorization: 'KakaoAK e126f907a220c29b6aa2fa390306d735'
  }
});

const kakaoVideoSearch = params => {
  return Kakao.get("/v2/search/vclip", { params });
};

const VideoSearch = ({ title }) => {
  const [query, setQuery] = useState('');
  const [videoResults, setVideoResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  const getVideoResults = async (page) => {
    try {
      if (query === '') {
        setVideoResults([]);
      } else {
        const params = {
          query: query,
          page: page,
          size: pageSize
        };
        const result = await kakaoVideoSearch(params);
        if (result.data.documents) {
          setVideoResults(result.data.documents);
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
    await getVideoResults(1);
  };

  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await getVideoResults(pageNumber);
  };

  const handlePrevPage = async () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      await getVideoResults(newPage);
    }
  };
  
  const handleNextPage = async () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      await getVideoResults(newPage);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="video-search-container">
      <h1 className="video-title">Video</h1>
      <form onSubmit={onSubmit} className="video-form-container">
        <input type="text" placeholder='검색어' value={query} onChange={(e) => setQuery(e.target.value)} className="video-input" />
        <button type="submit" className="video-button">검색</button>
      </form>
      <div className='video-documents'>
        {videoResults.map((result, index) => (
          <div key={index} className="video-result">
            <h2><a href={result.url}>{result.title}</a></h2>
            <p>{result.datetime}</p>
            <p>재생 시간: {formatDuration(result.play_time)}</p>
            <img src={result.thumbnail} alt="Thumbnail" />
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="video-pagination">
          <span>페이지:</span>
          <select value={currentPage} onChange={(e) => handlePageChange(parseInt(e.target.value))}>
          </select>
          <span>{currentPage} / {totalPages}</span>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>이전</button>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>다음</button>
        </div>
      )}
    </div>
  );
};

export default VideoSearch;
