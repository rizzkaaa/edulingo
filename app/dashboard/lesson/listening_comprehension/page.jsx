"use client";

import { useRouter } from "next/navigation";

export default function ListeningComprehensionPage() {

  const router = useRouter();

  const handleFinish = () => {

    const lessons =
      JSON.parse(
        localStorage.getItem("lessonStatus")
      );

    if (!lessons) return;

    if (lessons[6].status === "done") {

      router.push("/dashboard");

      return;

    }

    lessons[6].status = "done";

    if (
      lessons[7] &&
      lessons[7].status === "locked"
    ) {

      lessons[7].status = "progress";

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
        Listening Comprehension
      </h1>

      <button onClick={handleFinish}>
        SELESAI
      </button>

    </div>

  );

}