import { createSignal, onMount } from "solid-js"
import { useStore } from "@nanostores/solid"
import toast, { Toaster } from "solid-toast" // Corrected import
import { isCartOpen } from "../../store"

const toastPosition = "bottom-right"

export default function Banner() {
  const $isCartOpen = useStore(isCartOpen)
  const [isUserLoggedIn, setIsUserLoggedIn] = createSignal(false)

  onMount(async () => {
    try {
      const response = await fetch("/api/check-auth")
      const { loggedIn } = await response.json()
      setIsUserLoggedIn(loggedIn)
    } catch (error) {
      toast.error("Error fetching auth status")
      console.error("Error fetching auth status:", error)
    }
  })

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", { method: "POST" })
      const data = await response.json()
      if (response.ok) {
        setIsUserLoggedIn(false)
        toast.success("Logged out successfully!", {
          position: toastPosition,
        })
      } else {
        toast.error("Logout failed", {
          position: toastPosition,
        })
        console.error("Logout failed:", data.message)
      }
    } catch (error) {
      toast.error("Error during logout", {
        position: toastPosition,
      })
      console.error("Error during logout:", error)
    }
  }

  return (
    <div>
      <div class="bg-black h-10 text-white py-2 px-6 w-full hidden md:flex justify-between items-center">
        {/* Left Side Link */}
        <a href="https://pluck.eco" class="hover:underline">
          Get free delivery from local businesses
        </a>
        {/* Right Side Links */}
        <div class="flex space-x-10">
          <a href="#" onClick={() => isCartOpen.set(!$isCartOpen())}>
            Please Enter Your Zip
          </a>
          {isUserLoggedIn() ? (
            <div class="flex space-x-4">
              <a href="#" onClick={handleLogout}>
                Log out
              </a>
            </div>
          ) : (
            <div class="flex space-x-4">
              <a href="/login">Log in</a>
              <a href="/join">Join</a>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  )
}
