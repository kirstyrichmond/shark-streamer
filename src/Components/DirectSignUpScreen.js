import React, { useRef, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// This directly uses firebase instead of the imported auth
export const SignUpScreen = ({ emailRef: propsEmailRef }) => {
  const [email, setEmail] = useState(propsEmailRef?.current?.value || "");
  const passwordRef = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("SignUpScreen render with email:", email);

  const register = async (e) => {
    e.preventDefault();
    
    if (!passwordRef.current?.value) {
      setError("Password is required");
      return;
    }
    
    setLoading(true);
    setError("");
    
    console.log("Attempting to register with:", email);
    
    try {
      // Direct Firebase auth call
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(
        email,
        passwordRef.current.value
      );
      
      // Success! 
      console.log("User registered successfully:", userCredential.user.email);
    } catch (error) {
      console.error("Registration error:", error.code, error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: "300px", 
      margin: "0 auto", 
      padding: "20px", 
      color: "white",
      textAlign: "center"
    }}>
      <h1 style={{ marginBottom: "20px" }}>Sign Up</h1>
      
      {error && (
        <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>
      )}
      
      <form onSubmit={register}>
        <input
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            backgroundColor: "#333",
            border: "none",
            borderRadius: "4px",
            color: "white"
          }}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        
        <input
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            backgroundColor: "#333",
            border: "none",
            borderRadius: "4px",
            color: "white"
          }}
          ref={passwordRef}
          type="password"
          placeholder="Password"
          required
        />
        
        <button
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#e50914",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1
          }}
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};