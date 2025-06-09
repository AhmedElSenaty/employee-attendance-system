import { Sun, Moon } from "lucide-react";
import { Popup, Button } from "../../../../components/ui";

interface ConditionsPopupProps {
  isOpen: boolean;
  handleClose: () => void;
}

const ConditionsPopup = ({ isOpen, handleClose }: ConditionsPopupProps) => {
  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title="Permit Conditions"
      description="Read the requirements for applying for morning or evening permits."
    >
      <section className="text-gray-900 max-h-[60vh] overflow-y-auto space-y-6 px-2">
        {/* Morning Permission */}
        <article>
          <h3 className="flex items-center gap-3 text-lg font-semibold text-cyan-700 mb-3">
            <Sun className="w-6 h-6" />
            Morning Permission
          </h3>
          <ul className="space-y-3 text-gray-800">
            <li className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-cyan-500">
              Submit the permission request at least <strong>two hours before</strong> the requested time.
            </li>
            <li className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-cyan-500">
              If the scheduled permission time passes without usage, it will be <strong>automatically rejected</strong>.
            </li>
            <li className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-cyan-500">
              After the permission ends, the employee must:
              <ul className="mt-3 space-y-2 text-gray-600 text-sm ml-4">
                <li className="relative pl-5 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-cyan-300">
                  <strong>Clock in (register attendance)</strong> before the permission time ends.
                </li>
                <li className="relative pl-5 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-cyan-300">
                  Clocking in late will be considered a <strong>late arrival</strong>.
                </li>
              </ul>
            </li>
          </ul>
        </article>

        {/* Evening Permission */}
        <article>
          <h3 className="flex items-center gap-3 text-lg font-semibold text-indigo-700 mb-3">
            <Moon className="w-6 h-6" />
            Evening Permission
          </h3>
          <ul className="space-y-3 text-gray-800">
            <li className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-indigo-500">
              Submit the request at least <strong>two hours in advance</strong>.
            </li>
            <li className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-indigo-500">
              If the scheduled time passes without usage, it will be <strong>automatically rejected</strong>.
            </li>
            <li className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-indigo-500">
              Before leaving, the employee must:
              <ul className="mt-3 space-y-2 text-gray-600 text-sm ml-4">
                <li className="relative pl-5 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-indigo-300">
                  <strong>Clock out (register departure)</strong> before leaving the workplace.
                </li>
                <li className="relative pl-5 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-indigo-300">
                  Failure to clock out will be considered a <strong>policy violation</strong>.
                </li>
              </ul>
            </li>
          </ul>
        </article>
      </section>

      <div className="flex justify-end mt-6">
        <Button variant="cancel" onClick={handleClose} fullWidth>
          Close
        </Button>
      </div>
    </Popup>
  );
};

export default ConditionsPopup;
