import { ReactNode } from "react"

interface IProps {
  children?: ReactNode,
  className?: string
}

const InputErrorMessage = ({ children = "", className="" }: IProps) => {
  return (
    children ? 
    (<span className={`block mt-1 ml-1 text-red-600 text-base ${className}`}>{children}</span>) : null
  )
}

export default InputErrorMessage