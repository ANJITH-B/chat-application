import React from "react";
import { Camera, Ghost, LogInIcon, Send, UserPlus, X } from "lucide-react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";

const button = tv({
  base: " text-white active:scale-[0.98] transition-all  flex items-center justify-center gap-2",
  variants: {
    variant: {
      default: "bg-blue-500 text-white hover:bg-blue-500 w-full mt-4 py-3 mx-auto",
      primary: "bg-blue-500 text-white hover:bg-blue-500 w-full py-2 mx-auto rounded-sm disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500",
      secondary: "bg-gray-500 text-white hover:bg-gray-500 w-full py-2 mx-auto rounded-sm",
      outline:
        "bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
      link: "bg-transparent text-blue-500 cursor-pointer w-fit p-1 z-10",
      social: "bg-white text-black border border-gray-300 hover:border-gray-500 w-full mt-4 py-2 px-4 rounded-lg w-fit",
      icon: "bg-transparent text-black cursor-pointer w-fit p-1 px-2 z-10",
    },
  },
  defaultVariants: {
    variant: "default",
},
});

  const icons = {
    LogIn: <LogInIcon size={18} />,
    SignUp: <UserPlus size={18} />,
    Guest: <Ghost size={18} />,
    Send: <Send strokeWidth={1.5} size={20} />,
    Camera: <Camera strokeWidth={1.5} size={20} />,
    X: <X strokeWidth={1.5} size={20} />,
    Google: <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="G" className='w-5 h-5' />,
    Github: <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="G" className='w-5 h-5' />,
  };

type Props = {
  icon?: keyof typeof icons;
  children?: React.ReactNode;
  variant?: VariantProps<typeof button>["variant"];
  className?: string;
  onClick?: () => void ;
  type?: "button" | "submit" | "reset"; 
  disabled?: boolean;
};

const Button = ({ icon, children, variant, className, onClick, type, disabled}: Props) => {
  return (
    <button onClick={onClick} className={cn(button({ variant }), className)} type={type} disabled={disabled}>
      {children}
      {icon && icons[icon]}
    </button>
  );
};

export default Button;