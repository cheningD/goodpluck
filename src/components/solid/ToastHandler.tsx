import { onMount } from "solid-js"
import toast, { Toaster } from "solid-toast"

export default function ToastHandler(props) {
  onMount(() => {
    if (props.message) {
      if (props.message.startsWith("Success")) {
        toast.success(props.message, {
          duration: 3000,
          position: "bottom-right",
        })
      } else {
        toast.error(props.message, {
          duration: 3000,
          position: "bottom-right",
        })
      }
    }
  })

  return <Toaster gutter={8} />
}
