import React from "react";
import GenderCheckbox from "../../components/GenderCheckbox";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ErrorMessage from "../../components/ErrorMessage";

const initialFormFields = {
  fullName: "",
  username: "",
  password: "",
  confirmPassword: "",
  gender: "",
};
const initialIsDirty = {
  fullName: false,
  username: false,
  password: false,
  confirmPassword: false,
  gender: false,
};

const Signup = () => {
  const {
    formFields,
    isDirty,
    errors,
    loading,
    onFormFieldsChange,
    onSubmitHandler,
  } = useAuth({ initialFormFields, initialIsDirty, type: "signup" });

  console.log({ formFields, isDirty, errors });
  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Sign Up <span className="text-blue-500"> ChatApp</span>
        </h1>

        <form>
          <div className="form-control">
            <label className="label p-2">
              <span className="text-base label-text">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full input input-bordered h-10"
              value={formFields?.fullName}
              onChange={(e) => onFormFieldsChange("fullName", e.target.value)}
            />
            <ErrorMessage errors={errors} errorKey="fullName" />
          </div>

          <div className="form-control">
            <label className="label p-2">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              type="text"
              placeholder="johndoe"
              className="w-full input input-bordered h-10"
              value={formFields?.username}
              onChange={(e) => onFormFieldsChange("username", e.target.value)}
            />
            <ErrorMessage errors={errors} errorKey="username" />
          </div>

          <div className="form-control">
            <label className="label p-2">
              <span className="text-base label-text">Password</span>
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

          <div className="form-control">
            <label className="label p-2">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full input input-bordered h-10"
              value={formFields?.confirmPassword}
              onChange={(e) =>
                onFormFieldsChange("confirmPassword", e.target.value)
              }
            />
            <ErrorMessage errors={errors} errorKey="confirmPassword" />
          </div>

          <GenderCheckbox
            onCheckboxChange={onFormFieldsChange}
            selectedGender={formFields?.gender}
          />

          <Link
            to={"/login"}
            className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
          >
            Already have an account?
          </Link>

          <div>
            <button
              className="btn btn-block btn-sm mt-2 border border-slate-700"
              disabled={loading?.submitLoading}
              onClick={onSubmitHandler}
            >
              {loading?.submitLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
