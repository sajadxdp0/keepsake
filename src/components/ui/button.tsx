import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-mono text-xs font-medium outline-none transition-[background-color,border-color,color,transform] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-primary-foreground hover:bg-white hover:text-black",
        outline: "border-border bg-transparent text-foreground hover:border-primary hover:text-primary",
        ghost: "border-transparent bg-transparent text-muted-foreground hover:text-foreground",
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 px-3 text-[10px]",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
