import { useState, useEffect } from "react";
import { fetchWithAuth } from "./utils/fetchWithAuth";
import LoginForm from "./Components/LoginForm";

function App() {
  const [idToken, setIdToken] = useState(() => {
    // Restore token from localStorage if available
    return localStorage.getItem("idToken");
  });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (idToken) {
      localStorage.setItem("idToken", idToken); // Save to localStorage
    } else {
      localStorage.removeItem("idToken");
    }
  }, [idToken]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetchWithAuth("http://localhost:5265/api/students", idToken);
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    if (idToken) {
      fetchStudents();
    }
  }, [idToken]);

  const handleLogout = () => {
    setIdToken(null);
    localStorage.removeItem("idToken");
  };

  return (
    <div>
      {!idToken ? (
        <LoginForm onLogin={(token) => setIdToken(token)} />
      ) : (
        <div>
          <h1>Welcome, Teacher!</h1>
          <button onClick={handleLogout}>Log Out</button>
          <h2>Student List</h2>
          <ul>
            {students.map((s) => (
              <li key={s.id}>{s.fullName}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
