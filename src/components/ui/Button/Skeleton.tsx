import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

// 1. Define the skeleton style with cva
const buttonSkeletonVariants = cva("bg-gray-300 animate-pulse", {
  variants: {
    size: {
      xs: "h-6 px-2 py-1",
      sm: "h-8 px-3 py-1.5",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-6 py-3",
      xl: "h-14 px-8 py-4",
    },
    shape: {
      square: "rounded-none",
      rounded: "rounded-lg",
      pill: "rounded-full",
    },
    fullWidth: {
      true: "w-full",
      false: "w-auto",
    },
  },
});

// 2. Define component props
interface SkeletonProps extends VariantProps<typeof buttonSkeletonVariants> {
  className?: string;
}

// 3. Component
const ButtonSkeleton = ({
  size = "lg",
  shape = "rounded",
  fullWidth = true,
  className,
}: SkeletonProps) => {
  return (
    <div
      className={clsx(
        buttonSkeletonVariants({ size, shape, fullWidth }),
        className
      )}
    />
  );
};

export default ButtonSkeleton;
