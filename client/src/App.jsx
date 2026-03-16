import { useState, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post("/api/generate", {
        userInput: input,
      });
      setResult(res.data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      setResult({ error: "Something went wrong. Please try again." });
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <div className="bg-orbs">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
      </div>

      <div className="hero">
        <div className="badge">✨ Powered by Gemini AI</div>
        <h1 className="title">💥 PhobiaBreaker</h1>
        <p className="subtitle">Drop your idea. We'll break your fear and build your future.</p>
      </div>

      <div className="glass-box">
        <label className="input-label">🧠 What's your idea?</label>
        <textarea
          placeholder="e.g. an app that helps students find study partners near campus..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
        />
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? (
            <span className="btn-inner"><span className="dot-loader"></span> Analyzing your idea...</span>
          ) : (
            <span className="btn-inner">🚀 Break the Phobia</span>
          )}
        </button>
      </div>

      {result && !result.error && (
        <div className="results" ref={resultRef}>
          <div className="fear-card glass-box">
            <div className="fear-top">
              <span>😱 Fear Score</span>
              <span className="score-badge">{result.fearScore}/10</span>
            </div>
            <div className="bar-track">
              <div className="bar-glow" style={{ width: `${result.fearScore * 10}%` }}></div>
            </div>
            <p className="fear-msg">"{result.fearMessage}"</p>
          </div>

          <div className="cards-grid">
            <div className="card card-purple">
              <div className="card-icon">🗺️</div>
              <h3>MVP Plan</h3>
              <p>{result.mvpPlan}</p>
            </div>
            <div className="card card-blue">
              <div className="card-icon">⚙️</div>
              <h3>Tech Stack</h3>
              <p>{result.techStack}</p>
            </div>
            <div className="card card-green">
              <div className="card-icon">🚀</div>
              <h3>Similar Startup</h3>
              <p>{result.similarStartup}</p>
            </div>
            <div className="card card-orange">
              <div className="card-icon">🔥</div>
              <h3>Roast + Motivate</h3>
              <p>{result.roast}</p>
            </div>
          </div>

          <div className="pitch-section glass-box">
            <div className="pitch-header">
              <span className="mic-icon">🎤</span>
              <h3>Your Pitch Script</h3>
            </div>
            <div className="pitch-content">
              <p>{result.pitchScript}</p>
            </div>
          </div>

          <button className="reset-btn" onClick={() => { setResult(null); setInput(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            🔄 Try Another Idea
          </button>
        </div>
      )}

      {result?.error && <div className="error-msg">❌ {result.error}</div>}
    </div>
  );
}

export default App;
