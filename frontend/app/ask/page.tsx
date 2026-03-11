// "use client";

// import { useState } from "react";
// import { createQuestion } from "@/services/api";

// export default function AskQuestion() {
//   const [title, setTitle] = useState("");
//   const [body, setBody] = useState("");
//   const [tags, setTags] = useState("");
//   const [duplicates, setDuplicates] = useState<any[]>([]);
//   const [message, setMessage] = useState("");

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setMessage("");
//     setDuplicates([]);

//     const res = await createQuestion({
//       title,
//       body,
//       tags,
//       user_id: 1,
//     });

//     if (res.duplicate) {
//       setDuplicates(res.similar_questions || []);
//     } else {
//       setMessage("✅ Question posted successfully!");
//       setTitle("");
//       setBody("");
//       setTags("");
//     }
//   }

//   return (
//     <main className="max-w-3xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Ask a Question</h1>

//      <form
//   onSubmit={handleSubmit}
//   className="bg-white p-6 rounded-xl shadow-lg space-y-5"
// >
//   {/* Title */}
//   <input
//     className="
//       w-full
//       border border-gray-300
//       p-3
//       rounded-lg
//       text-gray-900
//       placeholder-gray-400
//       focus:outline-none
//       focus:ring-2
//       focus:ring-black
//       focus:border-black
//     "
//     placeholder="Enter a clear, specific question title"
//     value={title}
//     onChange={(e) => setTitle(e.target.value)}
//     required
//   />

//   {/* Body */}
//   <textarea
//     className="
//       w-full
//       border border-gray-300
//       p-3
//       rounded-lg
//       text-gray-900
//       placeholder-gray-400
//       focus:outline-none
//       focus:ring-2
//       focus:ring-black
//       focus:border-black
//     "
//     placeholder="Describe your problem in detail. Include what you tried."
//     rows={5}
//     value={body}
//     onChange={(e) => setBody(e.target.value)}
//     required
//   />

//   {/* Tags */}
//   <input
//     className="
//       w-full
//       border border-gray-300
//       p-3
//       rounded-lg
//       text-gray-900
//       placeholder-gray-400
//       focus:outline-none
//       focus:ring-2
//       focus:ring-black
//       focus:border-black
//     "
//     placeholder="Tags (e.g. python, fastapi, react)"
//     value={tags}
//     onChange={(e) => setTags(e.target.value)}
//     required
//   />

//   {/* Submit Button */}
//   <button
//     type="submit"
//     className="
//       w-full
//       bg-black
//       text-white
//       py-3
//       rounded-lg
//       font-semibold
//       hover:bg-gray-800
//       transition
//     "
//   >
//     Submit Question
//   </button>
// </form>


//       {duplicates.length > 0 && (
//         <div className="mt-6 bg-yellow-50 border border-yellow-300 p-4 rounded">
//           <p className="font-semibold text-yellow-800">
//             ⚠ Similar questions already exist:
//           </p>
//           <ul className="list-disc list-inside mt-2">
//             {duplicates.map((q) => (
//               <li key={q.id}>{q.title}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {message && (
//         <p className="mt-4 text-green-600 font-medium text-center">
//           {message}
//         </p>
//       )}
//     </main>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { createQuestion, checkDuplicateQuestion } from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Duplicate = {
  id: number;
  title: string;
  similarity: number;
};

export default function AskQuestion() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");

  const [duplicates, setDuplicates] = useState<Duplicate[]>([]);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");

  /* ===========================
     🔐 AUTH CHECK
  =========================== */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // 🚀 force login
    }
  }, [router]);

  /* ===========================
     🤖 LIVE DUPLICATE CHECK
  =========================== */
  useEffect(() => {
    if (title.trim().length < 10) {
      setDuplicates([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setChecking(true);

      try {
        const data = await checkDuplicateQuestion({
          title,
          body,
        });

        setDuplicates(Array.isArray(data) ? data : []);
      } catch {
        setDuplicates([]);
      }

      setChecking(false);
    }, 600);

    return () => clearTimeout(timeout);
  }, [title, body]);

  /* ===========================
     📝 SUBMIT QUESTION
  =========================== */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      await createQuestion({
        title,
        body,
        tags,
      });

      setMessage("✅ Question posted successfully!");
      setTitle("");
      setBody("");
      setTags("");
      setDuplicates([]);

      setTimeout(() => {
        router.push("/");
      }, 1200);

    } catch (err: any) {
      if (err.message.includes("401")) {
        router.push("/login");
      } else {
        setMessage("❌ Failed to post question");
      }
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Ask a Question</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg space-y-5"
      >
        {/* Title */}
        <input
          className="
            w-full
            border border-gray-300
            p-3
            rounded-lg
            text-gray-900
            placeholder-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-black
            focus:border-black
          "
          placeholder="Enter a clear, specific question title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Duplicate Warning */}
        {checking && (
          <p className="text-sm text-gray-400">
            Checking for similar questions…
          </p>
        )}

        {duplicates.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-300 p-4 rounded">
            <p className="font-semibold text-yellow-800 mb-2">
              ⚠ Similar questions already exist:
            </p>
            <ul className="list-disc list-inside space-y-1">
              {duplicates.map((q) => (
                <li key={q.id}>
                  <Link
                    href={`/question/${q.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {q.title}
                  </Link>
                  <span className="ml-2 text-xs text-gray-500">
                    ({Math.round(q.similarity * 100)}% similar)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Body */}
        <textarea
          className="
            w-full
            border border-gray-300
            p-3
            rounded-lg
            text-gray-900
            placeholder-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-black
            focus:border-black
          "
          placeholder="Describe your problem in detail. Include what you tried."
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />

        {/* Tags */}
        <input
          className="
            w-full
            border border-gray-300
            p-3
            rounded-lg
            text-gray-900
            placeholder-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-black
            focus:border-black
          "
          placeholder="Tags (e.g. python, fastapi, react)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="
            w-full
            bg-black
            text-white
            py-3
            rounded-lg
            font-semibold
            hover:bg-gray-800
            transition
          "
        >
          Submit Question
        </button>
      </form>

      {message && (
        <p className="mt-4 text-green-600 font-medium text-center">
          {message}
        </p>
      )}
    </main>
  );
}
