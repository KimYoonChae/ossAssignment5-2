import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";

const API_BASE_URL = 'https://6915406484e8bd126af93a94.mockapi.io/books';

export default function CreatePage() {
    const navigate = useNavigate();
    
    // useState로 각 input 값 관리
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [genre, setGenre] = useState("");
    const [status, setStatus] = useState("");
    const [rating, setRating] = useState(0);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // useRef로 각 input 참조 (유효성 체크용)
    const titleRef = useRef(null);
    const authorRef = useRef(null);
    const genreRef = useRef(null);
    const statusRef = useRef(null);
    const ratingRef = useRef(null);

    // 유효성 검사 함수
    const validateForm = () => {
        if (!title.trim()) {
            alert("제목을 입력해주세요.");
            titleRef.current.focus();
            return false;
        }
        if (!author.trim()) {
            alert("저자를 입력해주세요.");
            authorRef.current.focus();
            return false;
        }
        if (!genre.trim()) {
            alert("장르를 입력해주세요.");
            genreRef.current.focus();
            return false;
        }
        if (!status) {
            alert("상태를 선택해주세요.");
            statusRef.current.focus();
            return false;
        }
        if (rating < 0 || rating > 5) {
            alert("평점은 0에서 5 사이의 값이어야 합니다.");
            ratingRef.current.focus();
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 유효성 검사
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const bookData = {
            title: title.trim(),
            author: author.trim(),
            genre: genre.trim(),
            status,
            rating: Number(rating)
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });

            if (!response.ok) throw new Error('등록에 실패했습니다.');
            
            alert('도서가 성공적으로 등록되었습니다.');
            navigate('/list');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-4">
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="mb-0">새 도서 등록</h2>
                            <button className="btn btn-outline-secondary" onClick={() => navigate('/list')}>
                                목록으로
                            </button>
                        </div>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label fw-bold">제목 <span className="text-danger">*</span></label>
                                <input
                                    ref={titleRef}
                                    type="text"
                                    id="title"
                                    className="form-control"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
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
                                        onChange={(e) => setAuthor(e.target.value)}
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
                                        onChange={(e) => setGenre(e.target.value)}
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
                                        onChange={(e) => setStatus(e.target.value)}
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
                                        onChange={(e) => setRating(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-top">
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                        {isSubmitting ? '등록 중...' : '등록하기'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/list')} disabled={isSubmitting}>
                                        취소
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}