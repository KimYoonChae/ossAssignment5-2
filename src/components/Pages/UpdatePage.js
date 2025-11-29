import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Header";

const API_BASE_URL = 'https://6915406484e8bd126af93a94.mockapi.io/books';

export default function UpdatePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [genre, setGenre] = useState("");
    const [status, setStatus] = useState("");
    const [rating, setRating] = useState(0);
    const [updateCount, setUpdateCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const titleRef = useRef(null);
    const authorRef = useRef(null);
    const genreRef = useRef(null);
    const statusRef = useRef(null);
    const ratingRef = useRef(null);
    const isInitialLoad = useRef(true);

    useEffect(() => {
        const fetchBook = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/${id}`);
                if (!response.ok) throw new Error('도서 정보를 불러오는 데 실패했습니다.');
                const data = await response.json();
                setTitle(data.title);
                setAuthor(data.author);
                setGenre(data.genre);
                setStatus(data.status);
                setRating(data.rating || 0);
                setTimeout(() => {
                    isInitialLoad.current = false;
                }, 100);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    const validateField = (field, value, ref) => {
        if (field === 'title' || field === 'author' || field === 'genre') {
            if (!value.trim()) {
                alert(`${field === 'title' ? '제목' : field === 'author' ? '저자' : '장르'}을(를) 입력해주세요.`);
                ref.current.focus();
                return false;
            }
        }
        if (field === 'status' && !value) {
            alert('상태를 선택해주세요.');
            ref.current.focus();
            return false;
        }
        if (field === 'rating' && (value < 0 || value > 5)) {
            alert('평점은 0에서 5 사이의 값이어야 합니다.');
            ref.current.focus();
            return false;
        }
        return true;
    };

    const updateBookField = async (field, value, ref) => {
        if (isInitialLoad.current) return;
        if (!validateField(field, value, ref)) {
            return;
        }

        const bookData = {
            title,
            author,
            genre,
            status,
            rating: Number(rating),
            [field]: field === 'rating' ? Number(value) : value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });

            if (!response.ok) throw new Error('수정에 실패했습니다.');
            setUpdateCount(prev => prev + 1);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);
        updateBookField('title', value, titleRef);
    };

    const handleAuthorChange = (e) => {
        const value = e.target.value;
        setAuthor(value);
        updateBookField('author', value, authorRef);
    };

    const handleGenreChange = (e) => {
        const value = e.target.value;
        setGenre(value);
        updateBookField('genre', value, genreRef);
    };

    const handleStatusChange = (e) => {
        const value = e.target.value;
        setStatus(value);
        updateBookField('status', value, statusRef);
    };

    const handleRatingChange = (e) => {
        const value = e.target.value;
        setRating(value);
        updateBookField('rating', value, ratingRef);
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="container mt-4">
                    <div className="text-center py-5">불러오는 중...</div>
                </div>
            </>
        );
    }

    if (error && !title) {
        return (
            <>
                <Header />
                <div className="container mt-4">
                    <div className="alert alert-danger">{error}</div>
                    <button className="btn btn-secondary" onClick={() => navigate('/list')}>목록으로</button>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="container mt-4">
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h2 className="mb-0">도서 수정</h2>
                                <div className="mt-2">
                                    <span className="badge bg-info text-dark fs-6">
                                        총 수정 횟수: {updateCount}회
                                    </span>
                                </div>
                            </div>
                    
                        </div>

                        {error && (
                            <div className="alert alert-warning" role="alert">
                                {error}
                            </div>
                        )}

                     

                        <div className="mb-3">
                            <label htmlFor="title" className="form-label fw-bold">제목 <span className="text-danger">*</span></label>
                            <input
                                ref={titleRef}
                                type="text"
                                id="title"
                                className="form-control"
                                value={title}
                                onChange={handleTitleChange}
                                placeholder="도서 제목을 입력하세요"
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="author" className="form-label fw-bold">저자 <span className="text-danger">*</span></label>
                                <input
                                    ref={authorRef}
                                    type="text"
                                    id="author"
                                    className="form-control"
                                    value={author}
                                    onChange={handleAuthorChange}
                                    placeholder="저자명을 입력하세요"
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="genre" className="form-label fw-bold">장르 <span className="text-danger">*</span></label>
                                <input
                                    ref={genreRef}
                                    type="text"
                                    id="genre"
                                    className="form-control"
                                    value={genre}
                                    onChange={handleGenreChange}
                                    placeholder="장르를 입력하세요"
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="status" className="form-label fw-bold">상태 <span className="text-danger">*</span></label>
                                <select
                                    ref={statusRef}
                                    id="status"
                                    className="form-select"
                                    value={status}
                                    onChange={handleStatusChange}
                                >
                                    <option value="">선택하세요</option>
                                    <option value="읽음">읽음</option>
                                    <option value="읽는 중">읽는 중</option>
                                    <option value="읽을 예정">읽을 예정</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="rating" className="form-label fw-bold">평점 (0-5) <span className="text-danger">*</span></label>
                                <input
                                    ref={ratingRef}
                                    type="number"
                                    id="rating"
                                    className="form-control"
                                    min="0"
                                    max="5"
                                    step="0.5"
                                    value={rating}
                                    onChange={handleRatingChange}
                                />
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-top">
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-primary" onClick={() => navigate(`/detail/${id}`)}>
                                    상세보기
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => navigate('/list')}>
                                    목록으로
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}