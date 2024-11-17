import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

function Signup({ type }) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSignin = async (e) => {
    // e.preventDefault();
    // console.log(formData)
    // try {
    //     const response = await axios.post( `http://localhost:3000/api/v1/users/signin`, formData, {
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       });
    //     console.log(response);
    // } catch (error) {
    //     console.log(error);
    // }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${backendUrl}/users/signup`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="min-h-screen  bg-black flex items-center justify-center">
      <div className="flex flex-col  items-center  gap-8 w-full max-w-5xl px-4">
        <div className="flex justify-center lg:justify-start w-full lg:w-1/2">
          <img
            src="https://th.bing.com/th/id/OIP.BfLoOPGLrpO1M9VAXjXXDAHaEJ?rs=1&pid=ImgDetMain"
            alt="Logo"
            className="w-1/2 lg:w-3/4 max-w-xs xl:w-full "
          />
        </div>

        <div className="bg-black text-white w-full ">
          <h2 className="text-4xl text-center font-bold mb-6 text-white">
            {type == "signup" ? "Join Today" : "Welcome back"}
          </h2>
          <form className="space-y-4">
            {type == "signup" && (
              <div>
                <label className="sr-only" htmlFor="fullname">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullname"
                  placeholder="Full Name"
                  className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
            )}
            <div>
              <label className="sr-only" htmlFor="username">
                Username
              </label>
              <input
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
                type="text"
                id="username"
                placeholder="Username"
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Email */}
            {type == "signup" && (
              <div>
                <label className="sr-only" htmlFor="email">
                  Email
                </label>
                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  type="email"
                  id="email"
                  placeholder="Email"
                  className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full bg-white hover:bg-gray-200 text-black font-bold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={type == "signin" ? handleSignin : handleSignup}
            >
              {type == "signup" ? "signup" : "signin"}
            </button>
          </form>

          {/* Signin Link */}
          <div className="mt-6 text-center text-gray-400">
            {type == "signup"
              ? "Already have an account ?"
              : "Don't have and account ?"}{" "}
            <Link
              to={type == "signup" ? "/signin" : "/signup"}
              className="text-blue-500 hover:underline "
            >
              {type == "signin" ? "Signup" : "Signin"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

Signup.propTypes = {
  // Add prop types validation
  type: PropTypes.string.isRequired,
};
