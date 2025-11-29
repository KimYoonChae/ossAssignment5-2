import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Header";

const API_BASE_URL = 'https://6915406484e8bd126af93a94.mockapi.io/books';

export default function DetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/${id}`);
                if (!response.ok) throw new Error('도서 정보를 불러오는 데 실패했습니다.');
                const data = await response.json();
                setBook(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm(`'${book.title}'을(를) 정말 삭제하시겠습니까?`)) {
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('삭제 실패');
            alert('삭제되었습니다.');
            navigate('/list');
        } catch (err) {
            setError(err.message);
        }
    };

    const getBadgeClass = (rating) => {
        if (rating >= 4) return 'bg-success';
        if (rating >= 2) return 'bg-warning text-dark';
        return 'bg-secondary';
    };

    const getStatusBadgeClass = (status) => {
        const statusMap = {
            '읽음': 'bg-primary',
            '읽는 중': 'bg-info',
            '읽을 예정': 'bg-warning text-dark'
        };
        return statusMap[status] || 'bg-secondary';
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

    if (error || !book) {
        return (
            <>
                <Header />
                <div className="container mt-4">
                    <div className="alert alert-danger">{error || '도서를 찾을 수 없습니다.'}</div>
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
                        <div className="d-flex justify-content-between align-items-start mb-4">
                            <h2 className="mb-0">도서 상세 정보</h2>
                            <button className="btn btn-outline-secondary" onClick={() => navigate('/list')}>
                                목록으로
                            </button>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">ID</label>
                                <p className="form-control-plaintext">{book.id}</p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <label className="form-label fw-bold">제목</label>
                                <p className="form-control-plaintext fs-5 fw-semibold">{book.title}</p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">저자</label>
                                <p className="form-control-plaintext">{book.author}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">장르</label>
                                <p className="form-control-plaintext">
                                    <span className="badge bg-light text-dark fs-6">{book.genre}</span>
                                </p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">상태</label>
                                <p className="form-control-plaintext">
                                    <span className={`badge ${getStatusBadgeClass(book.status)} fs-6`}>{book.status}</span>
                                </p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">평점</label>
                                <p className="form-control-plaintext">
                                    <span className={`badge ${getBadgeClass(book.rating)} fs-6`}>{book.rating || 0} / 5</span>
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-top">
                            <div className="d-flex gap-2">
                                <button className="btn btn-primary" onClick={() => navigate(`/update/${book.id}`)}>
                                    수정하기
                                </button>
                                <button className="btn btn-danger" onClick={handleDelete}>
                                    삭제하기
                                </button>
                              
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}