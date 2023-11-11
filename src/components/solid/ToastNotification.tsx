// src/components/ToastNotification.jsx
import { onMount } from "solid-js"
import toast from "solid-toast"

function ToastNotification() {
  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const isLoggedIn = urlParams.get("logged_in")

    if (isLoggedIn) {
      toast.success("You are already logged in!")
    }
  })

  return null
}

export default ToastNotification
