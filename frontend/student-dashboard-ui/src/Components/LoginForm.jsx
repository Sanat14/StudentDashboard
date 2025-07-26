import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const token = await user.getIdTokenResult(); // includes custom claims
      if (token.claims.role !== "teacher") {
        setError("Access denied. Only teachers can log in.");
        return;
      }

      onLogin(token.token); // send ID token to parent or store in app state
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Teacher Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Log In</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
