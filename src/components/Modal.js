import "./Modal.css";

export default function Modal(){
    return(
        <>
    <div className="modal fade" id="book-modal" tabindex="-1" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="book-modal-label">도서 정보</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div className="modal-body">
          <form id="book-form">
            <input type="hidden" id="book-id"/>
            
            <div className="mb-3">
              <label for="title" className="form-label">제목</label>
              <input type="text" id="title" className="form-control" required/>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label for="author" className="form-label">저자</label>
                <input type="text" id="author" className="form-control" required/>
              </div>
              <div className="col-md-6 mb-3">
                <label for="genre" className="form-label">장르</label>
                <input type="text" id="genre" className="form-control" required/>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label for="status" className="form-label">상태</label>
                <select id="status" className="form-select" required>
                  <option value="">선택</option>
                  <option value="읽음">읽음</option>
                  <option value="읽는 중">읽는 중</option>
                  <option value="읽을 예정">읽을 예정</option>
                  <option value="보관 중">보관 중</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label for="rating" className="form-label">평점 (0-5)</label>
                <input type="number" id="rating" className="form-control" min="0" max="5" step="0.5" value="0" required />
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
          <button type="submit" form="book-form" className="btn btn-primary">저장</button>
        </div>
      </div>
    </div>
  </div>
  </>
    );
}