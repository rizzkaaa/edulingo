"use client";

import styles from "./page.module.css";

import {
  FaGithub,
  FaEnvelope
} from "react-icons/fa";

const developers = [
  {
    name:"AGUS PRAYOGA",
    role:"BACKEND DEV",
    quote:"Making grammar as intuitive as swipe left on a bad match."
  },
  {
    name:"ALIEF RYANDANU",
    role:"UI/UI DESIGNER",
    quote:"Designing interfaces that are as clear as my English explanations."
  },
  {
    name:"DANISWARA AHMAD FADHILAH",
    role:"BACKEND DEV",
    quote:"I speak Fluent English and Fluent React. Both are equally complex."
  },
  {
    name:"EVAN MAHESA",
    role:"UI/UX DESIGNER",
    quote:"Scalability is just my love language for databases."
  },
  {
    name:"GABRIEL JONATHAN EDI PUTRA",
    role:"UI/UX DESIGNER",
    quote:"Teaching machines to understand nuance, one epoch at a time."
  },
  {
    name:"KELVIN ADITYA PRATAMA",
    role:"FRONTEND DEV",
    quote:"Words are blocks, I just build the most efficient castles with them."
  },
  {
    name:"M. RASYID AL GIFFAHRY",
    role:"BACKEND DEV",
    quote:"I organize data better than I organize my actual life."
  },
  {
    name:"RIZKA LAYLA RAMADHANI",
    role:"FRONTEND DEV",
    quote:"If it can be broken, I will find it. And then I will fix it."
  },
];

export default function DeveloperTeamPage(){

  return(

    <div className={styles.container}>

      <h1 className={styles.pageTitle}>
        Development Team
      </h1>

      <div className={styles.fullLine}></div>

      <section className={styles.heroSection}>

        <div className={styles.heroContent}>

          <h2>
            MEET THE TEAM
          </h2>

          <p>
            The dedicated squad building the future of English learning.
            We're a mix of linguists, engineers, and designers obsessed with academic mastery.
          </p>

        </div>

        <div className={styles.cornerShape}></div>

      </section>

      <div className={styles.teamGrid}>

        {
          developers.map((dev,index)=>(

            <div
              key={index}
              className={styles.teamCard}
            >

              <img
                src="/images/default_profile.png"
                alt={dev.name}
                className={styles.avatar}
              />

              <h3>
                {dev.name}
              </h3>

              <span className={styles.role}>
                {dev.role}
              </span>

              <p className={styles.quote}>
                "{dev.quote}"
              </p>

              <div className={styles.cardLine}></div>

              <div className={styles.cardIcons}>

                <FaGithub/>

                <FaEnvelope/>

              </div>

            </div>

          ))
        }

      </div>

      <section className={styles.bottomBanner}>

        <h2>
          BUILT FOR MODERN ENGLISH LEARNERS
        </h2>

        <p>
          Join the movement of students reclaiming their learning journey
          with structured urgency and raw clarity.
        </p>

        <button>
          JOIN OUR MISSION
        </button>

      </section>

    </div>

  );

}