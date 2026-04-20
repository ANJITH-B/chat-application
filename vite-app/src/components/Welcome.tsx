import { Plus } from "lucide-react"
import Button from "./ui/button"


export const Welcome = ({ message, button }: { message: string, button: { onClick: () => void, label: string } }) => {

  return (
    <div className="bg-[#E7E7E5] flex-1 w-full h-[400px] py-10 flex flex-col items-center justify-center gap-3 p-5 rounded-lg">
      <p className="text-sm text-black">{message}</p>
      <Button className="text-xs bg-[#d0d0d0] hover:bg-[#c0c0c0] rounded-lg gap-1 pr-3 pb-1.5" variant="icon" onClick={button.onClick}>
        <Plus size={16} /> {button.label}
      </Button>
    </div>
  )
}