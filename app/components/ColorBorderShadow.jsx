const styles = {
  box: {
    border: "2px solid",
    borderTop: "6px solid",
    boxShadow: "4px 4px #2c2a26",
    padding: "20px 30px 30px",
    backgroundColor: "#FDFAF5",
  },
};
export default function ColorBorderShadow({ children, borderColor, className}) {
  return (
    <div
      style={{...styles.box, borderColor: borderColor }}
      className={className}
    >
      {children}
    </div>
  );
}
