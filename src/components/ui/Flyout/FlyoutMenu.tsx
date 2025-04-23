import { ReactNode } from "react";
import clsx from "clsx";

interface IProps {
  className?: string;
  children: ReactNode;
}

const FlyoutMenu = ({ className, children }: IProps) => {
  return (
    <div
      className={clsx(className)}
      >
        <>
          {children}
        </>
    </div>
  )
}

export default FlyoutMenu;