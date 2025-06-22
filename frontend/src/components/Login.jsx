import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "", // Only used for register
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.warn("Failed to parse JSON:", e);
      }

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      // Save token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // optional

      alert("Logged in successfully");

      await fetch("/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: formData.deviceName }),
      });

      alert(`${isLogin ? "Logged in" : "Registered"} successfully`);
      if (isLogin) {
        navigate("/dashboard");
      } else {
        navigate("/subscription");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-darkblue text-white p-4 max-w-md my-10 mx-auto rounded-xl py-10 px-10 align-center items-center">
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setIsLogin(true)}
          className={`px-4 py-2 rounded-l ${
            isLogin ? "bg-[#FF6500]" : "bg-[#1E3E62]"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`px-4 py-2 rounded-r ${
            !isLogin ? "bg-[#FF6500]" : "bg-[#1E3E62]"
          }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className="w-full p-2 rounded bg-[#0B192C] border border-gray-600"
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          className="w-full p-2 rounded bg-[#0B192C] border border-gray-600"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          className="w-full p-2 rounded bg-[#0B192C] border border-gray-600"
          required
        />
        <input
          type="text"
          name="deviceName"
          placeholder="Device Name"
          onChange={handleChange}
          value={formData.deviceName || ""}
          className="w-full p-2 rounded bg-[#0B192C] border border-gray-600"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#FF6500] text-black p-2 rounded"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
}
