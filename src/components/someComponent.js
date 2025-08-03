const user = JSON.parse(localStorage.getItem('user'));
return (
  <>
    {user?.role === 'admin' && <button>Create Exam</button>}
    {/* ... */}
  </>
);
