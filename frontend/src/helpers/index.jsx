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

export function formatDate(inputDate) {
  const date = new Date(inputDate);
  const now = new Date();
  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const timeString = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  if (diffHours < 24 && now.getDate() === date.getDate()) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }

  if (
    diffDays === 1 ||
    (diffHours < 48 &&
      now.getDate() - date.getDate() === 1 &&
      now.getMonth() === date.getMonth())
  ) {
    return `Yesterday, ${timeString}`;
  }

  const dateString = date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });

  return `${dateString}, ${timeString}`;
}

export const capitalize = (str) => {
  if (!str) return "";

  return str?.slice(0, 1)?.toUpperCase() + str?.slice(1);
};
