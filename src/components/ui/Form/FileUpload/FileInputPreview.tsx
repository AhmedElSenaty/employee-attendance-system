import { CircleAlert, CircleCheck, File } from "lucide-react";
import { forwardRef, Ref } from "react";

interface IProps {
  isSelected?: boolean;
  isError?: boolean;
}

const FileInputPreview = forwardRef(({ isSelected, isError, ...rest }: IProps, ref: Ref<HTMLInputElement>) => {

  return (
    <div 
      className="flex justify-center rounded-lg border border-dashed border-[#19355a]/25 px-6 py-10 cursor-pointer"
    >
      <div className="text-center">
        <div className="mx-auto size-12 text-gray-300">
          {!isSelected ? <File className="w-full h-full text-secondary" /> : (
            !isError ? <CircleCheck className="w-full h-full text-green-500" /> : <CircleAlert className="w-full h-full text-red-500" />
          )}
        </div>
        <div className="mt-4 flex text-lg text-gray-600">
          <label className={`relative cursor-pointer rounded-lg bg-white font-semibold  focus-within:ring-2 ${!isSelected ? "text-[#b38e19] focus-within:ring-[#b38e19]" : (!isError ? "text-green-500 focus-within:ring-green-500" : "text-red-500 focus-within:ring-red-500")} focus-within:ring-offset-2`}>
            <span>Upload a file</span>
            <input 
              ref={ref}
              type="file" 
              className="sr-only" 
              {...rest}
            />
          </label>
        </div>
      </div>
    </div>
  )
})

export default FileInputPreview
