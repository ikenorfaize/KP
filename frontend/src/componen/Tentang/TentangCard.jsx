import React, { useEffect, useState } from "react";
import "./Tentang.css";

const TentangCard = ({ title, children, isOpen, onToggle }) => {
  const [_shouldAnimate, _setShouldAnimate] = useState(false);

  useEffect(() => {
    _setShouldAnimate(true);
  }, [_setShouldAnimate]);

  return (
    <div
      className={`tentang-card ${isOpen ? "active" : ""}`}
      onClick={onToggle}
      style={{
        backgroundColor: isOpen ? "#1e7e34" : "#fff",
        color: isOpen ? "#fff" : "#111",
        transition: "all 0.3s ease",
      }}
    >
      <div className="tentang-card-header">
        <span className="tentang-card-title">{title}</span>
        <span
          className="tentang-card-arrow"
          style={{
            color: isOpen ? "#fff" : "#111",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease, color 0.3s ease",
          }}
        >
          {isOpen ? "▲" : "▼"}
        </span>
      </div>

      <div
        className="tentang-card-content-wrapper"
        style={{
          maxHeight: isOpen ? "500px" : "0",
          opacity: isOpen ? 1 : 0,
          overflow: "hidden",
          backgroundColor: isOpen ? "#1e7e34" : "#fff",
          transition: "all 0.3s ease",
        }}
      >
        <div className="tentang-card-content">{children}</div>
      </div>
    </div>
  );
};

export default TentangCard;
