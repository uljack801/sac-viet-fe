import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"


export const ShowAlert = (title: string) => {
    return (
        <div>
            <Alert className="absolute top-1/5 right-0 w-auto px-10 mr-1 bg-green-200/30 text-green-400/65 border-0">
                <Terminal />
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription></AlertDescription>
            </Alert>
        </div>
    )
}