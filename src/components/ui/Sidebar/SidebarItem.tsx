import { ReactNode } from "react";

import { NavLink, NavLinkProps } from "react-router";

interface IProps extends NavLinkProps {
  icon?: ReactNode;
  children?: ReactNode;
  name: string;
}

const SidebarItem = ({ name, icon, children, ...rest }: IProps) => {
  return (
    <div>
      <NavLink
        className="flex items-center gap-1 w-full p-2 text-primary hover:bg-black/5 hover:text-primary-hover cursor-pointer rounded-lg transition-all duration-150 ease-in-out group"
        {...rest}
      >
        {icon}
        <p className="text-base flex-1 ms-3 ltr:text-left rtl:text-right whitespace-nowrap font-medium">{name}</p>
        {children}
      </NavLink>
    </div>
  );
};

export default SidebarItem;
