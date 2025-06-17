"use client"
import { useState } from "react";
import { TbMessage2Bolt } from "react-icons/tb";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const Chatbox = () => {
    const [inputMessage, setInputMessage] = useState('');
    const [result, setResult] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (!inputMessage.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: inputMessage })
            });
            const data = await res.json();
            console.log(data.data.candidates[0].content.parts[0].text);

            setResult([...result, data.data.candidates[0].content.parts[0].text]);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <Popover>
                <PopoverTrigger>
                    <TbMessage2Bolt className="w-8 h-8" />
                </PopoverTrigger>
                <PopoverContent className="h-96 w-80 mr-6 flex flex-col justify-between">
                    <div className="h-5/6 overflow-y-auto">
                        <p>{result}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            className="mt-0"
                            placeholder="Bạn cần hỗ trợ gì?"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleClick();
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            variant="outline"
                            onClick={handleClick}
                            disabled={loading}
                        >
                            {loading ? "Đang gửi..." : "Gửi"}
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
