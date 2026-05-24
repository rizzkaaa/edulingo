import SmallShadowBorder from "./SmallShadowBorder";
export default function BoxList({ items, backgroundColor, color }) {
  return (
    <>
      {items.map((e) => (
        <SmallShadowBorder
          key={e}
          backgroundColor={backgroundColor}
          color={color}
        >
          {e}
        </SmallShadowBorder>
      ))}
    </>
  );
}
