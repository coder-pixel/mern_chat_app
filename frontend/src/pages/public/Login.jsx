import React, { useEffect, useState } from "react";

const Login = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="h-full w-full rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-50 border border-gray-100 p-6">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Login
          <span className="text-red-500"> Chatly</span>
        </h1>

        <form>
          <div>
            <label className="label p-2">
              <span className="ml-2 text-sm text-base label-text">
                Username
              </span>
            </label>

            <input
              type="text"
              placeholder="Enter username"
              className="w-full input input-bordered h-10"
              // value={username}
              // onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="label">
              <span className="ml-2 text-sm text-base label-text">
                Password
              </span>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full input input-bordered h-10"
              //   value={password}
              //   onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <a
            href="#"
            className="text-sm hover:underline hover:text-blue-500 mt-2 inline-block"
          >
            <span className="ml-2 ">{"Don't"} have an account? </span>
          </a>
          <div>
            <button className="btn btn-block btn-sm mt-2" disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner "></span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
