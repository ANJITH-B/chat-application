import { Command, Search } from "lucide-react";
import { useEffect, useRef } from "react";

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
}


export const SearchBar = ({ searchTerm, setSearchTerm }: SearchBarProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="w-full px-3 py-2 bg-[#E7E7E5] border border-[#D4D4D4] rounded-lg text-sm focus:outline-none mb-2 flex gap-2">
            <Search strokeWidth={1} size={18} />
            <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="w-full h-full outline-none text-xs pb-0.5"
            />
            <div className="flex items-center justify-center gap-1">
                <Command strokeWidth={1} size={13} />
                <p className="text-xs">K</p>
            </div>
        </div>
    );
};

