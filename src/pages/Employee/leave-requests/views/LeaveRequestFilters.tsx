import { Calendar, RefreshCcw } from "lucide-react";
import { Button, Field, Input, Label, SelectBox, Tooltip } from "../../../../components/ui";
import { LeaveRequestStatusType } from "../../../../enums";

interface LeaveRequestFiltersProps {
  getParam: (key: string) => string | number | null;
  setParam: (key: string, value: string) => void;
  clearParams: () => void;
}

const LeaveRequestFilters = ({
  getParam,
  setParam,
  clearParams,
}: LeaveRequestFiltersProps) => {

  
  return (
    <div className="flex flex-wrap items-end gap-4">
      <Field className="flex flex-col space-y-2 w-fit">
        <Label>Page Size</Label>
        <SelectBox
          value={getParam("pageSize") ?? 5}
          onChange={(e) =>
            setParam("pageSize", String(e.target.value ? parseInt(e.target.value) : 10))
          }
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </SelectBox>
      </Field>

      <Field className="flex flex-col space-y-2">
        <Label>Start Date</Label>
        <Input
          type="date"
          icon={<Calendar />}
          value={getParam("startDate") ?? ""}
          onChange={(e) => setParam("startDate", e.target.value)}
        />
      </Field>

      <Field className="flex flex-col space-y-2">
        <Label>End Date</Label>
        <Input
          type="date"
          icon={<Calendar />}
          value={getParam("endDate") ?? ""}
          onChange={(e) => setParam("endDate", e.target.value)}
        />
      </Field>

      <Field className="flex flex-col space-y-2">
        <Label>Leave Status</Label>
        <SelectBox
          onChange={(e) => setParam("status", e.target.value)}
          defaultValue=""
        >
          <option
            value=""
            selected={getParam("status") == null}
            disabled
          >
            Select leave status
          </option>
          {Object.values(LeaveRequestStatusType)
            .filter((v) => typeof v === "number")
            .map((statusValue) => (
              <option key={statusValue} value={statusValue}>
                {LeaveRequestStatusType[statusValue as number]}
              </option>
            ))}
        </SelectBox>
      </Field>

      <Tooltip content="Reset All">
        <Button onClick={clearParams} icon={<RefreshCcw />} />
      </Tooltip>
    </div>
  );
};

export default LeaveRequestFilters;
