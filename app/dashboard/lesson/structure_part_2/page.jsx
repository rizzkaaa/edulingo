"use client";

import { useRouter } from "next/navigation";

export default function StructurePart1Page() {

  const router = useRouter();

  const handleFinish = () => {

    const lessons =
      JSON.parse(localStorage.getItem("lessonStatus"));

    lessons[1].status = "done";
    lessons[2].status = "progress";

    localStorage.setItem(
      "lessonStatus",
      JSON.stringify(lessons)
    );

    router.push("/dashboard");

  };

  return (

    <div>

      <h1>
        Structure Part 1
      </h1>

      <button onClick={handleFinish}>
        SELESAI
      </button>

    </div>

  );

}