import { useState } from "react";
import { errorHandler } from "../helpers";
import { useAuthContext } from "../context/AuthContext";

export const useAuth = ({
  initialFormFields,
  initialIsDirty,
  type = "signup",
}) => {
  const { setAuthUser } = useAuthContext();

  const [formFields, setFormFields] = useState(initialFormFields);
  const [isDirty, setIsDirty] = useState(initialIsDirty);
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState({
    submitLoading: false,
  });

  const _manageLoading = (key, value) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  const _onFormFieldsChange = (key, value) => {
    const newFormFields = { ...formFields };
    const newIsDirty = { ...isDirty };

    newFormFields[key] = value;
    newIsDirty[key] = true;

    setFormFields(newFormFields);
    setIsDirty(newIsDirty);

    _validateFormFields({ newFormFields, newIsDirty });
  };

  const _validateFormFields = ({ newFormFields, newIsDirty }) => {
    return new Promise((resolve) => {
      let isFormValid = true;
      const newErrors = { ...errors };

      Object.keys(newFormFields)?.forEach((key) => {
        if (newIsDirty?.[key]) {
          switch (key) {
            case "fullName":
              if (type === "signup") {
                if (!newFormFields?.[key]) {
                  newErrors[key] = "*Full name is required";
                  isFormValid = false;
                } else if (newFormFields?.[key]?.length < 3) {
                  newErrors[key] = "*Full name must be at least 3 characters";
                  isFormValid = false;
                } else {
                  delete newErrors[key];
                  newIsDirty[key] = false;
                }
              }
              break;

            case "username":
              if (!newFormFields?.[key]) {
                newErrors[key] = "*Username is required";
                isFormValid = false;
              } else if (
                newFormFields?.[key]?.length < 3 &&
                type === "signup"
              ) {
                newErrors[key] = "*Username must be at least 3 characters";
                isFormValid = false;
              } else {
                delete newErrors[key];
                newIsDirty[key] = false;
              }
              break;

            case "password":
              if (!newFormFields?.[key]) {
                newErrors[key] = "*Password is required";
                isFormValid = false;
              } else if (
                newFormFields?.[key]?.length < 6 &&
                type === "signup"
              ) {
                newErrors[key] = "*Password must be at least 6 characters";
                isFormValid = false;
              } else {
                delete newErrors[key];
                newIsDirty[key] = false;
              }
              break;

            case "confirmPassword":
              if (type === "signup") {
                if (!newFormFields?.[key]) {
                  newErrors[key] = "*Please confirm your password";
                  isFormValid = false;
                } else if (newFormFields?.[key] !== newFormFields?.password) {
                  newErrors[key] = "*Passwords do not match";
                  isFormValid = false;
                } else {
                  delete newErrors[key];
                  newIsDirty[key] = false;
                }
              }
              break;

            case "gender":
              if (type === "signup") {
                if (!newFormFields?.[key]) {
                  newErrors[key] = "*Please select a gender";
                  isFormValid = false;
                } else {
                  delete newErrors[key];
                  newIsDirty[key] = false;
                }
              }
              break;

            default:
              break;
          }
        }
      });

      setErrors(newErrors);
      setIsDirty(newIsDirty);

      resolve(isFormValid);
    });
  };

  const _markAllIsDirty = () => {
    return new Promise((resolve) => {
      const newIsDirty = { ...isDirty };

      Object.keys(isDirty)?.forEach((key) => {
        newIsDirty[key] = true;
      });

      resolve(newIsDirty);
    });
  };

  const _onSubmitHandler = async (e) => {
    try {
      if (e) e.preventDefault(); // prevent default form submission
      _manageLoading("submitLoading", true);

      const newFormFields = { ...formFields };
      const newIsDirty = await _markAllIsDirty();

      const isFormValid = await _validateFormFields({
        newFormFields,
        newIsDirty,
      });

      if (!isFormValid) {
        errorHandler({ reason: "Invalid Form" });
        return;
      } // form is not valid, do nothing

      const res = await fetch(`/api/auth/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formFields }),
      });
      const data = await res?.json();
      if (data?.error) {
        throw new Error(data?.error);
      }

      // save to localstorage and context
      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
    } catch (err) {
      console.error("Error in form submission:", err);
      errorHandler(err);
    } finally {
      _manageLoading("submitLoading", false);
    }
  };

  return {
    formFields,
    isDirty,
    errors,
    loading,
    onFormFieldsChange: _onFormFieldsChange,
    onSubmitHandler: _onSubmitHandler,
  };
};
