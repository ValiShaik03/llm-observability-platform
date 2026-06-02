import { useState } from "react";
import axios from "axios";

export default function RegisterPage({ onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/register",
        {
          username,
          password,
        }
      );

      alert(res.data.message);
      onBack();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-slate-800 p-10 rounded-3xl w-96">

        <h1 className="text-3xl font-bold text-white mb-6">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 rounded-xl mb-4 bg-slate-700 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-xl mb-4 bg-slate-700 text-white"
        />

        <button
          onClick={register}
          className="w-full bg-blue-600 p-3 rounded-xl text-white"
        >
          Register
        </button>

      </div>
    </div>
  );
}