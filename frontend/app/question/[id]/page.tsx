
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAnswers,
  createAnswer,
  getVoteScore,
  voteAnswer,
} from "@/services/api";

type Question = {
  id: number;
  title: string;
  body: string;
  tags?: string;
};

type Answer = {
  id: number;
  body: string;
  score: number;
};

export default function QuestionDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const questionId = Array.isArray(id) ? Number(id[0]) : Number(id);

  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [error, setError] = useState("");

  // -----------------------------
  // Get Token Helper
  // -----------------------------
  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  // -----------------------------
  // Fetch Question
  // -----------------------------
  useEffect(() => {
    if (!questionId || Number.isNaN(questionId)) return;

    fetch(`http://127.0.0.1:8000/questions/${questionId}`)
      .then((res) => res.json())
      .then(setQuestion)
      .catch(() => setError("Failed to load question"));
  }, [questionId]);

  // -----------------------------
  // Fetch Answers + Votes
  // -----------------------------
  async function fetchAnswersWithVotes() {
    if (!questionId || Number.isNaN(questionId)) return;

    setLoading(true);
    setError("");

    try {
      const data = await getAnswers(questionId);

      if (!Array.isArray(data)) {
        setAnswers([]);
        return;
      }

      const enriched = await Promise.all(
        data.map(async (a: any) => {
          const scoreData = await getVoteScore(a.id);
          return { ...a, score: scoreData.score ?? 0 };
        })
      );

      setAnswers(enriched);
    } catch {
      setError("Failed to load answers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnswersWithVotes();
  }, [questionId]);

  // -----------------------------
  // AI BEST ANSWER
  // -----------------------------
  const bestAnswer =
    answers.length > 0
      ? [...answers]
          .filter((a) => a.score > 0)
          .sort((a, b) => b.score - a.score)[0]
      : null;

  if (!question) {
    return (
      <p className="text-center text-gray-400 mt-20">
        Loading question...
      </p>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">

        {/* QUESTION */}
        <h1 className="text-2xl font-bold mb-4">
          {question.title}
        </h1>

        <p className="text-gray-700 mb-4">
          {question.body}
        </p>

        {/* TAGS */}
        {question.tags && (
          <div className="flex flex-wrap gap-2 mb-6">
            {question.tags.split(",").map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 px-3 py-1 rounded-full"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* ANSWERS */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">
            Answers ({answers.length})
          </h2>

          {loading && (
            <p className="text-gray-400">Loading answers...</p>
          )}

          {error && (
            <p className="text-red-500">{error}</p>
          )}

          {!loading && answers.length === 0 && (
            <p className="text-gray-500 mb-4">
              No answers yet.
            </p>
          )}

          {/* ANSWER LIST */}
          <div className="space-y-4">
            {answers.map((a) => {
              const isBest = bestAnswer?.id === a.id;

              return (
                <div
                  key={a.id}
                  className={`flex gap-6 p-4 border rounded-lg transition ${
                    isBest
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:shadow"
                  }`}
                >
                 {/* VOTING */}
<div className="flex items-center gap-3">

  {/* UPVOTE */}
  <button
    onClick={async () => {
      try {
        await voteAnswer({
          answer_id: a.id,
          value: 1,
        });

        fetchAnswersWithVotes();
      } catch (err: any) {
        if (err.message.includes("401")) {
          router.push("/login");
        } else {
          alert("Voting failed. Try again.");
        }
      }
    }}
    className="px-3 py-1 rounded-full border hover:bg-blue-100 text-blue-600 transition"
  >
    👍
  </button>

  <span className="font-semibold text-gray-700">
    {a.score}
  </span>

  {/* DOWNVOTE */}
  <button
    onClick={async () => {
      try {
        await voteAnswer({
          answer_id: a.id,
          value: -1,
        });

        fetchAnswersWithVotes();
      } catch (err: any) {
        if (err.message.includes("401")) {
          router.push("/login");
        } else {
          alert("Voting failed. Try again.");
        }
      }
    }}
    className="px-3 py-1 rounded-full border hover:bg-red-100 text-red-500 transition"
  >
    👎
  </button>

</div>
                  {/* ANSWER BODY */}
                  <div className="flex-1">
                    {isBest && (
                      <span className="inline-block mb-2 px-3 py-1 text-xs font-semibold bg-green-600 text-white rounded-full">
                        🧠 AI Recommended
                      </span>
                    )}

                    <p className="text-gray-800 leading-relaxed">
                      {a.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* WRITE ANSWER */}
          {!getToken() && (
            <button
              onClick={() => router.push("/login")}
              className="mt-6 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Login to Write Answer
            </button>
          )}

          {getToken() && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-6 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Write an Answer
            </button>
          )}

          {showForm && getToken() && (
            <div className="mt-4">
              <textarea
                className="w-full border p-3 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                rows={4}
                placeholder="Write your answer here..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
              />

              <div className="flex gap-2 mt-2">
                <button
                  onClick={async () => {
                    const token = getToken();

                    if (!token) {
                      router.push("/login");
                      return;
                    }

                    if (!answerText.trim()) return;

                    try {
                      await createAnswer({
                        body: answerText,
                        question_id: questionId,
                      });

                      setAnswerText("");
                      setShowForm(false);
                      fetchAnswersWithVotes();
                    } catch {
                      localStorage.removeItem("token");
                      router.push("/login");
                    }
                  }}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Submit Answer
                </button>

                <button
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}


// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import {
//   getAnswers,
//   createAnswer,
//   getVoteScore,
//   voteAnswer,
// } from "@/services/api";

// type Question = {
//   id: number;
//   title: string;
//   body: string;
//   tags?: string;
// };

// type Answer = {
//   id: number;
//   body: string;
//   score: number;
// };

// export default function QuestionDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const questionId = Array.isArray(id) ? Number(id[0]) : Number(id);

//   const [question, setQuestion] = useState<Question | null>(null);
//   const [answers, setAnswers] = useState<Answer[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [showForm, setShowForm] = useState(false);
//   const [answerText, setAnswerText] = useState("");
//   const [error, setError] = useState("");

//   const [token, setToken] = useState<string | null>(null);

//   // -----------------------------------
//   // Check login reactively
//   // -----------------------------------
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setToken(localStorage.getItem("token"));
//     }
//   }, []);

//   // -----------------------------------
//   // Fetch question
//   // -----------------------------------
//   useEffect(() => {
//     if (!questionId || Number.isNaN(questionId)) return;

//     fetch(`http://127.0.0.1:8000/questions/${questionId}`)
//       .then((res) => res.json())
//       .then(setQuestion)
//       .catch(() => setError("Failed to load question"));
//   }, [questionId]);

//   // -----------------------------------
//   // Fetch answers + vote scores
//   // -----------------------------------
//   async function fetchAnswersWithVotes() {
//     if (!questionId || Number.isNaN(questionId)) return;

//     setLoading(true);
//     setError("");

//     try {
//       const data = await getAnswers(questionId);

//       if (!Array.isArray(data)) {
//         setAnswers([]);
//         return;
//       }

//       const enriched = await Promise.all(
//         data.map(async (a: any) => {
//           const scoreData = await getVoteScore(a.id);
//           return { ...a, score: scoreData.score ?? 0 };
//         })
//       );

//       setAnswers(enriched);
//     } catch {
//       setError("Failed to load answers");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchAnswersWithVotes();
//   }, [questionId]);

//   // -----------------------------------
//   // AI BEST ANSWER (highest score > 0)
//   // -----------------------------------
//   const bestAnswer =
//     answers.length > 0
//       ? [...answers]
//           .filter((a) => a.score > 0)
//           .sort((a, b) => b.score - a.score)[0]
//       : null;

//   if (!question) {
//     return (
//       <p className="text-center text-gray-400 mt-20">
//         Loading question...
//       </p>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">

//         {/* QUESTION */}
//         <h1 className="text-2xl font-bold mb-4">
//           {question.title}
//         </h1>

//         <p className="text-gray-700 mb-4">
//           {question.body}
//         </p>

//         {/* TAGS */}
//         {question.tags && (
//           <div className="flex flex-wrap gap-2 mb-6">
//             {question.tags.split(",").map((tag) => (
//               <span
//                 key={tag}
//                 className="text-xs bg-gray-100 px-3 py-1 rounded-full"
//               >
//                 #{tag.trim()}
//               </span>
//             ))}
//           </div>
//         )}

//         {/* ANSWERS */}
//         <div className="border-t pt-6">
//           <h2 className="text-xl font-semibold mb-4">
//             Answers ({answers.length})
//           </h2>

//           {loading && (
//             <p className="text-gray-400">Loading answers...</p>
//           )}

//           {error && (
//             <p className="text-red-500">{error}</p>
//           )}

//           {!loading && answers.length === 0 && (
//             <p className="text-gray-500 mb-4">
//               No answers yet.
//             </p>
//           )}

//           {/* ANSWER LIST */}
//           <div className="space-y-4">
//             {answers.map((a) => {
//               const isBest = bestAnswer?.id === a.id;

//               return (
//                 <div
//                   key={a.id}
//                   className={`flex gap-6 p-4 border rounded-lg transition ${
//                     isBest
//                       ? "border-green-500 bg-green-50"
//                       : "border-gray-200 hover:shadow"
//                   }`}
//                 >
//                   {/* VOTING */}
//                   <div className="flex items-center gap-3">

//                     <button
//                       disabled={!token}
//                       onClick={async () => {
//                         try {
//                           await voteAnswer({
//                             answer_id: a.id,
//                             value: 1,
//                           });
//                           fetchAnswersWithVotes();
//                         } catch {
//                           router.push("/login");
//                         }
//                       }}
//                       className={`px-3 py-1 rounded-full border transition
//                         ${
//                           token
//                             ? "hover:bg-blue-100 text-blue-600"
//                             : "opacity-40 cursor-not-allowed"
//                         }`}
//                     >
//                       👍
//                     </button>

//                     <span className="font-semibold text-gray-700">
//                       {a.score}
//                     </span>

//                     <button
//                       disabled={!token}
//                       onClick={async () => {
//                         try {
//                           await voteAnswer({
//                             answer_id: a.id,
//                             value: -1,
//                           });
//                           fetchAnswersWithVotes();
//                         } catch {
//                           router.push("/login");
//                         }
//                       }}
//                       className={`px-3 py-1 rounded-full border transition
//                         ${
//                           token
//                             ? "hover:bg-red-100 text-red-500"
//                             : "opacity-40 cursor-not-allowed"
//                         }`}
//                     >
//                       👎
//                     </button>

//                   </div>

//                   {/* ANSWER BODY */}
//                   <div className="flex-1">
//                     {isBest && (
//                       <span className="inline-block mb-2 px-3 py-1 text-xs font-semibold bg-green-600 text-white rounded-full">
//                         🧠 AI Recommended
//                       </span>
//                     )}

//                     <p className="text-gray-800 leading-relaxed">
//                       {a.body}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* WRITE ANSWER */}
//           {!token && (
//             <button
//               onClick={() => router.push("/login")}
//               className="mt-6 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
//             >
//               Login to Write Answer
//             </button>
//           )}

//           {token && !showForm && (
//             <button
//               onClick={() => setShowForm(true)}
//               className="mt-6 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
//             >
//               Write an Answer
//             </button>
//           )}

//           {showForm && token && (
//             <div className="mt-4">
//               <textarea
//                 className="w-full border p-3 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
//                 rows={4}
//                 placeholder="Write your answer here..."
//                 value={answerText}
//                 onChange={(e) => setAnswerText(e.target.value)}
//               />

//               <div className="flex gap-2 mt-2">
//                 <button
//                   onClick={async () => {
//                     if (!answerText.trim()) return;

//                     try {
//                       await createAnswer({
//                         body: answerText,
//                         question_id: questionId,
//                       });

//                       setAnswerText("");
//                       setShowForm(false);
//                       fetchAnswersWithVotes();
//                     } catch {
//                       router.push("/login");
//                     }
//                   }}
//                   className="bg-black text-white px-4 py-2 rounded"
//                 >
//                   Submit Answer
//                 </button>

//                 <button
//                   onClick={() => setShowForm(false)}
//                   className="bg-gray-200 px-4 py-2 rounded"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           )}

//         </div>
//       </div>
//     </main>
//   );
// }
