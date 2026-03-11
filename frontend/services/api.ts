// function getAuthHeaders() {
//   const token = localStorage.getItem("token");
//   return {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };
// }


// // frontend/services/api.ts

// const BASE_URL = "http://127.0.0.1:8000";

// /**
//  * Fetch all questions from backend
//  */
// export async function getQuestions() {
//   const res = await fetch(`${BASE_URL}/questions`);

//   if (!res.ok) {
//     throw new Error("Failed to fetch questions");
//   }

//   return res.json();
// }

// /**
//  * Create a new question
//  */
// export async function createQuestion(data: {
//   title: string;
//   body: string;
//   tags: string;
//   user_id: number;
// }) {
//   const res = await fetch(`${BASE_URL}/questions`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     const errorText = await res.text();
//     console.error("Backend error:", errorText);
//     throw new Error(errorText);
//   }

//   return res.json();
// }

// export async function getAnswers(questionId: number) {
//   const res = await fetch(
//     `http://127.0.0.1:8000/answers/question/${questionId}`
//   );
//   return res.json();
// }

// export async function createAnswer(data: {
//   body: string;
//   question_id: number;
// }) {
//   const res = await fetch("http://127.0.0.1:8000/answers", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// }

// export async function searchQuestions(params: {
//   q?: string;
//   tag?: string;
// }) {
//   const query = new URLSearchParams(params as any).toString();

//   const res = await fetch(
//     `http://127.0.0.1:8000/questions/search?${query}`
//   );

//   if (!res.ok) {
//     throw new Error("Failed to search questions");
//   }

//   return res.json();
// }

// export async function voteAnswer(data: {
//   user_id: number;
//   answer_id: number;
//   value: number;
// }) {
//   await fetch("http://127.0.0.1:8000/votes", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
// }


// export async function getVoteScore(answerId: number) {
//   const res = await fetch(
//     `http://127.0.0.1:8000/votes/answer/${answerId}`
//   );
//   return res.json();
// }

// export async function checkDuplicateQuestion(data: {
//   title: string;
//   body: string;
// }) {
//   const res = await fetch(
//     `http://127.0.0.1:8000/questions/check-duplicate?title=${encodeURIComponent(
//       data.title
//     )}&body=${encodeURIComponent(data.body)}`
//   );

//   if (!res.ok) {
//     throw new Error("Duplicate check failed");
//   }

//   return res.json();
// }

// // ---------------- AUTH ----------------

// export async function signupUser(data: {
//   username: string;
//   email: string;
//   password: string;
// }) {
//   const res = await fetch("http://127.0.0.1:8000/auth/signup", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     const err = await res.text();
//     throw new Error(err);
//   }

//   return res.json();
// }

// export async function loginUser(data: {
//   username: string;
//   password: string;
// }) {
//   const res = await fetch("http://127.0.0.1:8000/auth/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     const err = await res.text();
//     throw new Error(err);
//   }

//   return res.json();
// }
// frontend/services/api.ts

const BASE_URL = "http://127.0.0.1:8000";

/* ======================================
   🔐 AUTH TOKEN HELPERS
====================================== */

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function getAuthHeaders() {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(res: Response) {
  if (res.status === 401) {
    localStorage.removeItem("token");
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Something went wrong");
  }

  return res.json();
}

/* ======================================
   📝 QUESTIONS
====================================== */

export async function getQuestions() {
  const res = await fetch(`${BASE_URL}/questions`);
  return handleResponse(res);
}

// export async function createQuestion(data: {
//   title: string;
//   body: string;
//   tags: string;
// }) {
//   const res = await fetch(`${BASE_URL}/questions`, {
//     method: "POST",
//     headers: getAuthHeaders(),
//     body: JSON.stringify(data),
//   });

//   return handleResponse(res);
// }
export async function createQuestion(data: {
  title: string;
  body: string;
  tags: string;
}) {
  const res = await fetch(`${BASE_URL}/questions`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }

  return res.json();
}


/* ======================================
   💬 ANSWERS
====================================== */

export async function getAnswers(questionId: number) {
  const res = await fetch(
    `${BASE_URL}/answers/question/${questionId}`
  );
  return handleResponse(res);
}

export async function createAnswer(data: {
  body: string;
  question_id: number;
}) {
  const res = await fetch(`${BASE_URL}/answers`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

/* ======================================
   🔍 SEARCH
====================================== */

export async function searchQuestions(params: {
  q?: string;
  tag?: string;
}) {
  const query = new URLSearchParams(params as any).toString();

  const res = await fetch(
    `${BASE_URL}/questions/search?${query}`
  );

  return handleResponse(res);
}

/* ======================================
   👍 VOTING (Protected)
====================================== */

export async function voteAnswer(data: {
  answer_id: number;
  value: number;
}) {
  const res = await fetch(`${BASE_URL}/votes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function getVoteScore(answerId: number) {
  const res = await fetch(
    `${BASE_URL}/votes/answer/${answerId}`
  );
  return handleResponse(res);
}

/* ======================================
   🤖 DUPLICATE CHECK
====================================== */

export async function checkDuplicateQuestion(data: {
  title: string;
  body: string;
}) {
  const res = await fetch(
    `${BASE_URL}/questions/check-duplicate?title=${encodeURIComponent(
      data.title
    )}&body=${encodeURIComponent(data.body)}`
  );

  return handleResponse(res);
}

/* ======================================
   🔐 AUTH
====================================== */

export async function signupUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function loginUser(data: {
  username: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await handleResponse(res);

  // ✅ Save token
  localStorage.setItem("token", result.access_token);

  return result;
}

/* ======================================
   🚪 LOGOUT
====================================== */

export function logoutUser() {
  localStorage.removeItem("token");
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

