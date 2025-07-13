import React, { useState } from "react";
import "./Tentang.css";

const TentangCard = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleCard = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={`tentang-card ${isOpen ? "green" : "white"}`}
      style={{ cursor: "pointer" }}
    >
      <div className="tentang-card-header" onClick={toggleCard}>
        <span className="tentang-card-title">{title}</span>
        <span className="tentang-card-arrow">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && <div className="tentang-card-content">{children}</div>}
    </div>
  );
};

export default TentangCard;
