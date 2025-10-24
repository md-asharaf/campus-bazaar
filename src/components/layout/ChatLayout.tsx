import type React from "react"

function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className=" h-screen  ">
            {children}
        </div>
    )
}

export default ChatLayout