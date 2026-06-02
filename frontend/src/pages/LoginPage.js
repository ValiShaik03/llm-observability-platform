import { useState } from "react";
import axios from "axios";

export default function LoginPage({ onLogin,setShowRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/login",
        {
          username,
          password,
        }
      );

      if (res.data.message === "Login successful") {

    localStorage.setItem("loggedIn", "true");

    localStorage.setItem(
      "username",
      res.data.username
    );

    onLogin();
}
    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-slate-950">

      <div className="bg-slate-800 p-8 rounded-3xl w-96">

        <h1 className="text-3xl font-bold mb-6 text-center">
          LLM Platform Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          className="w-full p-3 mb-4 rounded bg-slate-700"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-3 mb-4 rounded bg-slate-700"
        />

        <button
          onClick={login}
          className="w-full bg-blue-600 p-3 rounded-xl"
        >
          Login
        </button>

        <button
  onClick={() => setShowRegister(true)}
  className="w-full mt-3 text-blue-400"
>
  Create Account
</button>

      </div>

    </div>
  );
}