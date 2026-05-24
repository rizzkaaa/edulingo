import SmallShadowBorder from "./SmallShadowBorder";
  
export default function BoxList({ items, backgroundColor, color, textAlign = 'start'}) {
  return (
    <>
      {items.map((e) => (
        <SmallShadowBorder
          key={e}
          backgroundColor={backgroundColor}
          color={color}
          textAlign={textAlign}
        >
          {e}
        </SmallShadowBorder>
      ))}
    </>
  );
}
