import React from "react";
import { Ghost, LogInIcon, UserPlus } from "lucide-react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";

const button = tv({
  base: " text-white active:scale-[0.98] transition-all  flex items-center justify-center gap-2",
  variants: {
    variant: {
      default: "bg-blue-500 text-white hover:bg-blue-500 w-full mt-4 py-3 mx-auto",
      outline:
        "bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
      link: "bg-transparent text-blue-500 cursor-pointer w-fit p-1 z-10",
      social: "bg-white text-black border border-gray-300 hover:border-gray-500 w-full mt-4 py-3 px-4 rounded-lg w-fit",
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
    Google: <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="G" className='w-5 h-5' />,
    Github: <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="G" className='w-5 h-5' />,
  };

type Props = {
  icon?: keyof typeof icons;
  children: React.ReactNode;
  variant?: VariantProps<typeof button>["variant"];
  className?: string;
  onClick?: () => void ;
};

const Button = ({ icon, children, variant, className, onClick}: Props) => {
  return (
    <button onClick={onClick} className={cn(button({ variant }), className)}>
      {children}
      {icon && icons[icon]}
    </button>
  );
};

export default Button;