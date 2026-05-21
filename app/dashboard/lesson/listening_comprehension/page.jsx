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

    if (lessons[4].status === "done") {

      router.push("/dashboard");

      return;

    }

    lessons[4].status = "done";

    localStorage.setItem(
      "lessonStatus",
      JSON.stringify(lessons)
    );

    router.push("/dashboard");

  };

  return (

    <div>

      <h1>Listening Comprehension</h1>

      <button onClick={handleFinish}>
        SELESAI
      </button>

    </div>

  );

}