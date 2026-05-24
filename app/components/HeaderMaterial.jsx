"use client"
import styles from './HeaderMaterial.module.css'
import SmallShadowBorder from "@/app/components/SmallShadowBorder";
import Image from "next/image";
import BorderLeftBox from './BorderLeftBox';

export default function HeaderMaterial({currentId, length, sub_material, borderColor='#e8a838'}) {
  return (
    <BorderLeftBox borderColor={borderColor} backgroundColor={'#FDFAF5'} className={styles.container}>
      <div className={styles.left}>
        <h5>
          SUB MATERI {currentId} DARI {length}
        </h5>
        <h1>{sub_material.title}</h1>
        <div className={styles.line}></div>
        <p>{sub_material.description}</p>
        <div>
          <SmallShadowBorder backgroundColor="#2D7A5E" color="white">
            ✓ TEORI
          </SmallShadowBorder>
          <SmallShadowBorder backgroundColor="#E8A838" color="black">
            → 5 SOAL
          </SmallShadowBorder>
          <SmallShadowBorder backgroundColor="#D9D3CC" color="black">
            🔒 40 SOAL
          </SmallShadowBorder>
        </div>
      </div>
      <Image
        src={`/images/material-decoration/${sub_material.image}.png`}
        alt={`images${sub_material.image}`}
        width={403}
        height={259}
      />
    </BorderLeftBox>
  );
}
