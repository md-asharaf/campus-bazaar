"use client";

import * as React from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { useHotkeys } from "react-hotkeys-hook";

export function SearchPopover() {
    const [open, setOpen] = React.useState(false);

    // Toggle with Ctrl+K (or Cmd+K on Mac)
    useHotkeys("ctrl+k, cmd+k", (e) => {
        e.preventDefault();
        setOpen((prev) => !prev);
    });

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="px-3 py-2 text-sm border rounded-xl text-white"
            >
                Search Products... <kbd className="ml-2 text-xs">Ctrl K</kbd>
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search Products..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup heading="Quick Access">
                        <CommandItem>📚 Textbooks</CommandItem>
                        <CommandItem>🎧 Electronics</CommandItem>
                        <CommandItem>👕 Clothing</CommandItem>
                        <CommandItem>🚲 Cycles</CommandItem>
                        <CommandItem>🏠 Rentals</CommandItem>
                    </CommandGroup>

                    <CommandGroup heading="For Students">
                        <CommandItem>Sell an Item</CommandItem>
                        <CommandItem>View My Listings</CommandItem>
                        <CommandItem>Messages</CommandItem>
                        <CommandItem>Saved Items</CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
