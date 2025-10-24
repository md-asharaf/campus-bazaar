import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
    name: string;
    online: boolean;
    avatar?: string;
}

const ChatHeader = ({ name, online, avatar }: ChatHeaderProps) => {
    return (
        <header className="flex items-center justify-between px-4 py-3 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 mt-3">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={avatar} alt={name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 h-3 w-3 ${online ? "bg-green-500" : "bg-red-500"} rounded-full border-2 border-background`} ></div>
                </div>
                <div>
                    <h2 className="font-semibold text-foreground">{name}</h2>
                    <span className={`text-xs text-muted-foreground ${online ? "text-green-500" : "text-red-500"}`}>
                        {online ? "Online" : "Offline"}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <Button className="group bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95">
                    <ArrowLeft className="transform transition-transform duration-300 group-hover:-translate-x-1" />
                    <span className="inline-block max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out group-hover:max-w-[200px]">
                        Return to Home
                    </span>
                </Button>
            </div>


        </header>
    );
};

export default ChatHeader;
