"use client";

import { useRouter } from "next/navigation";

export default function ReadingStrategistPage() {

  const router = useRouter();

  const handleFinish = () => {

    const lessons =
      JSON.parse(
        localStorage.getItem("lessonStatus")
      );

    if (!lessons) return;

    if (lessons[2].status === "done") {

      router.push("/dashboard");

      return;

    }

    lessons[2].status = "done";

    if (
      lessons[3] &&
      lessons[3].status === "locked"
    ) {

      lessons[3].status = "progress";

    }

    localStorage.setItem(
      "lessonStatus",
      JSON.stringify(lessons)
    );

    router.push("/dashboard");

  };

  return (

    <div>

      <h1>Reading Strategies</h1>

      <button onClick={handleFinish}>
        SELESAI
      </button>

    </div>

  );

}