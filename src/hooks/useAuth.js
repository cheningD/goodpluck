import { createSignal } from "solid-js"
import toast from "solid-toast"

export function useAuth() {
  const [isUserLoggedIn, setIsUserLoggedIn] = createSignal(false)

  // Check if user is logged in
  const checkAuth = async () => {
    try {
      const response = await fetch(`/api/check-auth`)

      if (response.status === 401) {
        setIsUserLoggedIn(false)
      } else {
        const { loggedIn } = await response.json()
        setIsUserLoggedIn(loggedIn)
      }
    } catch (error) {
      toast.error("Error fetching auth status")
      console.error("Error fetching auth status:", error)
      setIsUserLoggedIn(false)
    }
  }

  // Handle user logout
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", { method: "POST" })
      const data = await response.json()
      if (response.ok) {
        setIsUserLoggedIn(false)
        toast.success("Logged out successfully!")
      } else {
        toast.error("Logout failed")
        console.error("Logout failed:", data.message)
      }
    } catch (error) {
      toast.error("Error during logout")
      console.error("Error during logout:", error)
    }
  }

  // Handle user login
  const handleLogin = async () => {}

  return { isUserLoggedIn, checkAuth, handleLogout }
}
