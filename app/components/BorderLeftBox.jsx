const styles = {
  container: {
    border: "2px solid",
    borderLeft: "8px solid",
    boxShadow: "4px 4px #2c2a26",
    padding: "30px",
  },
};
export default function BorderLeftBox({
  children,
  className,
  borderColor,
  backgroundColor,
  style
}) {
    console.log(className);
    
  return (
    <div
      style={{
        ...styles.container,
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        ...style
      }}
      className={className}
    >
      {children}
    </div>
  );
}
