export default function Header(){
    return(
    <>
      <header className="bg-primary text-white text-center p-4">
        <h1>도서 관리 시스템</h1>
        <p className="text-muted">REST API 기반 CRUD</p>
      </header>
       <div id="feedback" className="alert d-none mb-3" role="alert"></div>
    </>
    );
}
