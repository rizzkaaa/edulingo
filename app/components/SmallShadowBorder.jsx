const styles = {
  box: {
    border: "2px solid #2c2a26",
    boxShadow: "2px 2px #2c2a26",
    padding: "10px 15px",
    fontWeight: "700",
  },
};

export default function SmallShadowBorder({
  backgroundColor,
  color,
  children,
}) {
  return (
    <div
      style={{ ...styles.box, backgroundColor: backgroundColor, color: color }}
    >
      {children}
    </div>
  );
}
