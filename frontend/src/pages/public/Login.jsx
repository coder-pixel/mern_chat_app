import React from "react";
import { Link } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import { useAuth } from "../../hooks/useAuth";

const initialFormFields = {
  username: "",
  password: "",
};
const initialIsDirty = {
  username: false,
  password: false,
};

const Login = () => {
  const { formFields, errors, loading, onFormFieldsChange, onSubmitHandler } =
    useAuth({ initialFormFields, initialIsDirty, type: "login" });

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="h-full w-full rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-50 border border-gray-100 p-6">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Login
          <span className="text-red-500"> Chatly</span>
        </h1>

        <form>
          <div className="form-control">
            <label className="label p-2">
              <span className="ml-2 text-sm label-text">Username</span>
            </label>

            <input
              type="text"
              placeholder="Enter username"
              className="w-full input input-bordered h-10"
              value={formFields?.username}
              onChange={(e) => onFormFieldsChange("username", e.target.value)}
            />
            <ErrorMessage errors={errors} errorKey="username" />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="ml-2 text-sm text-base label-text">
                Password
              </span>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full input input-bordered h-10"
              value={formFields?.password}
              onChange={(e) => onFormFieldsChange("password", e.target.value)}
            />
            <ErrorMessage errors={errors} errorKey="password" />
          </div>

          <Link
            to="/signup"
            className="text-sm hover:underline hover:text-blue-500 mt-2 inline-block"
          >
            <span className="ml-2 ">{"Don't"} have an account? </span>
          </Link>

          <div>
            <button
              className="btn btn-block btn-sm mt-2"
              disabled={loading?.submitLoading}
              onClick={onSubmitHandler}
            >
              {loading?.submitLoading ? (
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
