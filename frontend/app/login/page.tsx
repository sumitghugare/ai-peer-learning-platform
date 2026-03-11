// "use client";

// import { useState } from "react";
// import AuthInput from "@/components/AuthInput";
// import Link from "next/link";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   return (
//     <main className="min-h-screen flex items-center justify-center px-4">
//       <div className="w-full max-w-md bg-black/70 backdrop-blur p-8 rounded-2xl shadow-xl border border-gray-800">
//         <h1 className="text-3xl font-bold text-center mb-6">
//           Welcome Back 👋
//         </h1>

//         <form className="space-y-5">
//           <AuthInput
//             label="Email or Username"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <AuthInput
//             label="Password"
//             type="password"
//             placeholder="••••••••"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <button
//             type="submit"
//             className="
//               w-full
//               bg-white
//               text-black
//               py-3
//               rounded-lg
//               font-semibold
//               hover:bg-gray-200
//               transition
//             "
//           >
//             Login
//           </button>
//         </form>

//         <p className="text-sm text-gray-400 text-center mt-6">
//           Don’t have an account?{" "}
//           <Link href="/signup" className="text-white hover:underline">
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </main>
//   );
// }
"use client";

import { useState } from "react";
import { loginUser } from "@/services/api";
import AuthInput from "@/components/AuthInput";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser({ username, password });

      // 🔐 STORE TOKEN
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("user", JSON.stringify(res.user));

      router.push("/"); // redirect to home
    } catch {
      setError("Invalid username or password");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black/70 p-8 rounded-2xl border border-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome Back 👋
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <AuthInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button className="w-full bg-white text-black py-3 rounded-lg font-semibold">
            Login
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-white hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
