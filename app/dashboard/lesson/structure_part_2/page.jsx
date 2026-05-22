"use client";

import { useRouter } from "next/navigation";

export default function StructurePart2Page() {

  const router = useRouter();

  const handleFinish = () => {

    const lessons =
      JSON.parse(
        localStorage.getItem("lessonStatus")
      );

    if (!lessons) return;

    if (lessons[3].status === "done") {

      router.push("/dashboard");

      return;

    }

    lessons[3].status = "done";

    if (
      lessons[4] &&
      lessons[4].status === "locked"
    ) {

      lessons[4].status = "progress";

    }

    localStorage.setItem(
      "lessonStatus",
      JSON.stringify(lessons)
    );

    router.push("/dashboard");

  };

  return (

    <div>

      <h1>
        Structure Part 2
      </h1>

      <button onClick={handleFinish}>
        SELESAI
      </button>

    </div>

  );

}