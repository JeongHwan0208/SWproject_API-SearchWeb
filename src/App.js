import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import BookSearch from './BookSearch';
import WebSearch from './WebSearch';
import VideoSearch from './VideoSearch'; 
import ImageSearch from './ImgSearch';
import BlogSearch from './BlogSearch';
import CafeSearch from './CafeSearch';
import './App.css'; 

const App = () => {
  return (
    <Router>
      <div className="banner">
      <NavLink to="/" className="main-link">Search-Web</NavLink>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book-search" element={<BookSearch title="책 검색하기" />} />
        <Route path="/web-search" element={<WebSearch title="웹 검색하기" />} />
        <Route path="/video-search" element={<VideoSearch title="동영상 검색하기" />} /> 
        <Route path="/img-search" element={<ImageSearch title="이미지 검색하기" />} /> 
        <Route path="/blog-search" element={<BlogSearch title="블로그 검색하기" />} /> 
        <Route path="/cafe-search" element={<CafeSearch title="카페 검색하기" />} /> 
      </Routes>
    </Router>
  );
};

const Home = () => {
  return (
    <div className="nav-container">
      <NavLink className="nav-link" to="/book-search">Book</NavLink>
      <NavLink className="nav-link" to="/web-search">Web</NavLink>
      <NavLink className="nav-link" to="/video-search">Video</NavLink>
      <NavLink className="nav-link" to="/img-search">Image</NavLink>
      <NavLink className="nav-link" to="/blog-search">Blog</NavLink>
      <NavLink className="nav-link" to="/cafe-search">Cafe</NavLink>
    </div>
  );
};

export default App;
