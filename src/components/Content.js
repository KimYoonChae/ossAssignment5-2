import { useState, useEffect, useMemo } from "react";
import "./Content.css";

const API_BASE_URL = 'https://6915406484e8bd126af93a94.mockapi.io/books';

export default function Content(){
    const [allBooks, setAllBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentFilter, setCurrentFilter] = useState('all');
    const [currentSort, setCurrentSort] = useState('id');

    const fetchBooks = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) throw new Error('데이터를 불러오는 데 실패했습니다.');
            const data = await response.json();
            setAllBooks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const getBadgeClass = (rating) => {
        if (rating >= 4) return 'bg-success';
        if (rating >= 2) return 'bg-warning text-dark';
        return 'bg-secondary';
    };

    const getStatusBadgeClass = (status) => {
        const statusMap = {
            '읽음': 'bg-primary',
            '읽는 중': 'bg-info',
            '읽을 예정': 'bg-warning text-dark',
            '보관 중': 'bg-secondary'
        };
        return statusMap[status] || 'bg-secondary';
    };

    const counts = useMemo(() => ({
        all: allBooks.length,
        '읽는 중': allBooks.filter(b => b.status === '읽는 중').length,
        '읽을 예정': allBooks.filter(b => b.status === '읽을 예정').length,
        '읽음': allBooks.filter(b => b.status === '읽음').length,
        '보관 중': allBooks.filter(b => b.status === '보관 중').length,
    }), [allBooks]);

    const displayedBooks = useMemo(() => {
        const filtered = currentFilter === 'all'
            ? allBooks
            : allBooks.filter(book => book.status === currentFilter);

        const sorted = [...filtered];
        switch (currentSort) {
            case 'rating-desc':
                return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'rating-asc':
                return sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
            case 'title':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'id':
            default:
                return sorted.sort((a, b) => a.id - b.id);
        }
    }, [allBooks, currentFilter, currentSort]);

    const filterOptions = ['all', '읽는 중', '읽을 예정', '읽음', '보관 중'];

    return( 
    <div className="card">
      <div className="card-body">
        <div className="filter-bar mb-3">
          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
            <div className="d-flex gap-2 flex-wrap">
              {filterOptions.map(filter => (
                <button 
                  key={filter}
                  className={`btn btn-sm btn-outline-primary filter-btn ${currentFilter === filter ? 'active' : ''}`}
                  onClick={() => setCurrentFilter(filter)}
                >
                  {filter === 'all' ? '전체' : filter} ({counts[filter] || 0})
                </button>
              ))}
            </div>
            <div className="d-flex gap-2">
              <select id="sort-select" className="form-select form-select-sm" style={{width: 'auto'}} value={currentSort} onChange={(e) => setCurrentSort(e.target.value)}>
                <option value="id">ID 순</option>
                <option value="rating-desc">평점 높은 순</option>
                <option value="rating-asc">평점 낮은 순</option>
                <option value="title">제목 순</option>
              </select>
              <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#book-modal">
                + 새 도서
              </button>
              <button className="btn btn-outline-secondary btn-sm" onClick={fetchBooks}>
                새로고침
              </button>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{width: '60px'}}>ID</th>
                <th>제목</th>
                <th>저자</th>
                <th>장르</th>
                <th>상태</th>
                <th style={{width: '80px'}}>평점</th>
                <th className="text-end" style={{width: '120px'}}>관리</th>
              </tr>
            </thead>
            <tbody>
                {isLoading ? (
                    <tr><td colSpan="7" className="text-center py-4">불러오는 중...</td></tr>
                ) : error ? (
                    <tr><td colSpan="7" className="text-center text-danger py-4">{error}</td></tr>
                ) : displayedBooks.length === 0 ? (
                    <tr><td colSpan="7" className="text-center text-muted py-4">
                        {currentFilter === 'all' ? '등록된 도서가 없습니다' : `'${currentFilter}' 상태의 도서가 없습니다`}
                    </td></tr>
                ) : (
                    displayedBooks.map(book => (
                        <tr key={book.id}>
                            <td>{book.id}</td>
                            <td><strong>{book.title}</strong></td>
                            <td>{book.author}</td>
                            <td><span className="badge bg-light text-dark">{book.genre}</span></td>
                            <td><span className={`badge ${getStatusBadgeClass(book.status)}`}>{book.status}</span></td>
                            <td><span className={`badge ${getBadgeClass(book.rating)}`}>{book.rating || 0}</span></td>
                            <td className="text-end">
                                <button className="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#book-modal">수정</button>
                                <button className="btn btn-sm btn-outline-danger ms-1">삭제</button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
}