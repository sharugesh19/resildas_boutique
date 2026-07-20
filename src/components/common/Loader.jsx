import { createPortal } from "react-dom";
import "./Loader.css";

const Loader = ({ fullScreen = true, size = 200 }) => {
  const content = (
    <div className={fullScreen ? "loader-overlay" : "loader-inline"}>
      <div className="loader-content">
        <img
          src="/assets/loader.webp"
          alt="Resilda's Boutique"
          className="loader-logo"
          style={{ width: size, height: size }}
        />
        <div className="loader-bar">
          <span></span>
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return createPortal(content, document.body);
  }
  return content;
};

export default Loader;