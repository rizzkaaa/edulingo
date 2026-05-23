const styles = {
  progressBar: {
    border: "2px solid #2c2a26",
    height: "15px",
    width: "100%",
    boxShadow: "2px 2px 0 #2c2c2c",
  },
  progressFill: {
    backgroundColor: "#c5502a",
    height: "100%",
  },
};

export default function LessonProgressBar({ widthFill }) {
  return (
    <div style={styles.progressBar}>
      <div style={{ ...styles.progressFill, width: `${widthFill}%` }}></div>
    </div>
  );
}
