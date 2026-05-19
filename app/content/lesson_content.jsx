"use client";

import {
  createContext,
  useContext,
  useState
} from "react";

const LessonContext = createContext();

export function LessonProvider({ children }) {

  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: "Structure Part 1",
      slug: "structure_part_1",
      status: "progress"
    },
    {
      id: 2,
      title: "Structure Part 2",
      slug: "structure_part_2",
      status: "locked"
    },
    {
      id: 3,
      title: "Reading Strategies",
      slug: "reading_strategist",
      status: "locked"
    },
    {
      id: 4,
      title: "Reading for Details",
      slug: "reading_for_details",
      status: "locked"
    },
    {
      id: 5,
      title: "Listening Comprehension",
      slug: "listening_comprehension",
      status: "locked"
    }
  ]);

  const finishLesson = (id) => {

    const updatedLessons = [...lessons];

    updatedLessons[id - 1].status = "done";

    if (updatedLessons[id]) {

      updatedLessons[id].status = "progress";

    }

    setLessons(updatedLessons);

  };

  return (

    <LessonContext.Provider
      value={{
        lessons,
        finishLesson
      }}
    >

      {children}

    </LessonContext.Provider>

  );

}

export function useLessons() {

  return useContext(LessonContext);

}