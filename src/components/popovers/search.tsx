import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { useHotkeys } from "react-hotkeys-hook";
import { MagnifyingGlassIcon, ClockIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const recentSearches = [
    "MacBook Air M2",
    "Engineering textbooks",
    "Gaming chair",
    "iPhone 14"
];

export function SearchPopover() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useHotkeys("ctrl+k, cmd+k", (e) => {
        e.preventDefault();
        setOpen((prev) => !prev);
    });

    const handleSearch = () => {
        if (query.trim()) {
            setOpen(false);
            navigate(`/items?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
        if (!open) setQuery("");
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="group relative flex items-center gap-3 w-full sm:w-auto min-w-[200px] lg:min-w-[280px] px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-border"
            >
                <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1 text-left">
                    Search items, categories...
                </span>
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-muted text-muted-foreground rounded border border-border">
                    ⌘K
                </kbd>
            </button>

            <CommandDialog
                open={open}
                onOpenChange={handleOpenChange}
            >
                <div className="relative">
                    <CommandInput
                        placeholder="Search for textbooks, electronics, furniture, and more..."
                        className="pl-4 h-14 border-0 border-b border-border rounded-none focus:ring-0"
                        value={query}
                        onValueChange={setQuery}
                        onKeyDown={e => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSearch();
                            }
                        }}
                    />
                </div>
                <CommandList className="max-h-[70vh] p-4">
                    <CommandEmpty>
                        <h3 className="text-lg text-center py-12 text-muted-foreground mb-2">No results found</h3>
                    </CommandEmpty>
                    {!query && (
                        <CommandGroup heading="Recent Searches">
                            {recentSearches.map((search, index) => (
                                <CommandItem
                                    key={index}
                                    className="cursor-pointer flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary"
                                    onSelect={() => {
                                        setQuery(search);
                                        setTimeout(() => {
                                            setOpen(false);
                                            setQuery("");
                                            navigate(`/items?q=${encodeURIComponent(search)}`);
                                        }, 100);
                                    }}
                                >
                                    <ClockIcon className="w-4 h-4 text-muted-foreground" />
                                    <span className="flex-1">{search}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}
