import "./Loader.css";

/**
 * Reusable logo-based loading indicator.
 *
 * Usage:
 *   <Loader />                         // full-screen overlay (default)
 *   <Loader fullScreen={false} />       // inline, fits parent container
 *   <Loader size={60} />                // custom logo size in px
 */
const Loader = ({ fullScreen = true, size = 200 }) => {
  return (
    <div className={fullScreen ? "loader-overlay" : "loader-inline"}>
      <div className="loader-content">
        <img
          src="/assets/loader.png"
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
};

export default Loader;