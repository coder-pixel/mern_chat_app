import toast from "react-hot-toast";

export const successToast = (msg) => {
  toast.success(msg);
};

export const errorHandler = (err) => {
  toast.error(
    err?.message || err?.reason
      ? err?.message || err?.reason
      : "Something went wrong"
  );
};
