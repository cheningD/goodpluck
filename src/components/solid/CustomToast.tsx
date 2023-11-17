import { Show, createSignal, onMount } from "solid-js";

export default function CustomToast({ message = "", duration = 3000 }) {
  const [isVisible, setIsVisible] = createSignal(false);
  const toastType = () =>
    message.includes("success")
      ? "success"
      : message.includes("error")
        ? "error"
        : "info";

  onMount(() => {
    if (message) {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), duration);
    }
  });

  return (
    <Show when={isVisible()}>
      <div
        id="gp-custom-toast"
        class={`fixed bottom-4 right-4 p-4 rounded-lg shadow-md transition-opacity duration-300 ${
          isVisible() ? "opacity-100" : "opacity-0"
        } bg-white flex items-center`}
      >
        <div
          class={`h-3 w-3 rounded-full mr-2 animate-pulse ${
            toastType() === "success"
              ? "bg-green-500"
              : toastType() === "error"
                ? "bg-red-500"
                : "bg-gray-500"
          }`}
        />
        {message}
      </div>
    </Show>
  );
}
