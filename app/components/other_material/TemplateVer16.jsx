import BorderLeftBox from "../BorderLeftBox";
import ListSentence from "../ListSentences";

const styles = {
  container: {
    marginTop: "30px",
  },
};

export default function TemplateVer16({ material }) {
  return (
    <div style={styles.container}>
      <BorderLeftBox borderColor={"#C5502A"} backgroundColor={"#FDFAF5"}>
        <h3>{material.title}</h3>
        <ListSentence material={material.sentences} bgColor={"#E8A838"} />
      </BorderLeftBox>
    </div>
  );
}
