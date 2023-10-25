import { createSignal } from "solid-js";

export const [sidebarOpen, setSidebarOpen] = createSignal(false);

export default function Banner() {
  return (
    <div class="bg-black h-10 text-white py-2 px-6 w-full hidden md:flex justify-between items-center">
      {/* Left Side Link */}
      <a href="https://pluck.eco" class="hover:underline">
        Get free delivery from local businesses
      </a>

      {/* Right Side Links */}
      <div class="flex space-x-10">
        <a href="#" onClick={() => setSidebarOpen(!sidebarOpen())}>
          Please Enter Your Zip
        </a>
        <div class="flex space-x-4">
          <a href="/login">Log in</a>
          <a href="/join">Join</a>
        </div>
      </div>
    </div>
  );
}
