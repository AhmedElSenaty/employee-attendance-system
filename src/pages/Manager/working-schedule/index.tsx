import React, { useState } from "react";
import { Edit, Save, X, Clock, Coffee, Plane, CheckCircle } from "lucide-react";
import {
  Header,
  SectionHeader,
  Button,
  Input,
  SelectBox,
  Table,
  TableCell,
  TableRow,
  Badge,
  Alert,
  NormalSpinner,
} from "../../../components/ui";
import { useTranslation } from "react-i18next";
import { EmployeeWorkingSchedule } from "../../../interfaces/workingDays.interfaces";
// import {
//   useGetEmployeeSchedule,
//   useUpdateEmployeeSchedule,
//   useDeleteEmployeeSchedule,
// } from "../../../hooks/workingSchedule.hooks";

const WorkingSchedulePage = () => {
  const { t } = useTranslation(["common", "workingSchedule"]);

  // State for managing schedules
  const [schedules, setSchedules] = useState<EmployeeWorkingSchedule[]>([
    {
      startDate: "2025-01-01",
      endDate: "2025-06-01",
      "1": "1", // Monday - Work
      "2": "1", // Tuesday - Work
      "3": "1", // Wednesday - Work
      "4": "1", // Thursday - Work
      "5": "2", // Friday - Rest
      "6": "3", // Saturday - Vacation
      "7": "3", // Sunday - Vacation
    },
    {
      startDate: "2025-06-02",
      endDate: "2025-12-31",
      "1": "1", // Monday - Work
      "2": "1", // Tuesday - Work
      "3": "1", // Wednesday - Work
      "4": "1", // Thursday - Work
      "5": "1", // Friday - Work
      "6": "2", // Saturday - Rest
      "7": "2", // Sunday - Rest
    },
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);

  // Demo API simulation
  const simulateApiCall = async (delay: number = 1000) => {
    setIsLoadingSchedule(true);
    await new Promise((resolve) => setTimeout(resolve, delay));
    setIsLoadingSchedule(false);
  };

  // Demo employees data
  const employees = [
    { id: "1", name: "Ahmed Mohamed", department: "Information Technology" },
    { id: "2", name: "Fatima Ali", department: "Human Resources" },
    { id: "3", name: "Mohamed Hassan", department: "Finance" },
  ];

  // Schedule type options
  const scheduleTypes = [
    {
      value: "1",
      label: t("work"),
      icon: Clock,
      color: "bg-green-100 text-green-800",
    },
    {
      value: "2",
      label: t("rest"),
      icon: Coffee,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "3",
      label: t("vacation"),
      icon: Plane,
      color: "bg-blue-100 text-blue-800",
    },
  ];

  // Day names
  const dayNames = [
    { id: "1", name: t("monday") },
    { id: "2", name: t("tuesday") },
    { id: "3", name: t("wednesday") },
    { id: "4", name: t("thursday") },
    { id: "5", name: t("friday") },
    { id: "6", name: t("saturday") },
    { id: "7", name: t("sunday") },
  ];

  const handleEditSchedule = (index: number) => {
    setIsEditing(index);
  };

  const handleSaveSchedule = async () => {
    try {
      if (!selectedEmployee) {
        setErrorMessage(t("pleaseSelectEmployee"));
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }

      // Simulate API call
      await simulateApiCall(1000);

      setIsEditing(null);
      setShowSuccess(true);
      setErrorMessage("");
      setTimeout(() => setShowSuccess(false), 3000);
    } catch {
      setErrorMessage(t("failedToUpdateSchedule"));
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
  };

  const handleScheduleChange = (index: number, day: string, value: string) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index] = {
      ...updatedSchedules[index],
      [day]: value,
    };
    setSchedules(updatedSchedules);
  };

  const handleDateChange = (
    index: number,
    field: "startDate" | "endDate",
    value: string
  ) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index] = {
      ...updatedSchedules[index],
      [field]: value,
    };
    setSchedules(updatedSchedules);
  };

  const getScheduleTypeInfo = (type: string) => {
    return scheduleTypes.find((t) => t.value === type) || scheduleTypes[0];
  };

  return (
    <div className="px-6 py-8 min-h-screen">
      <Header
        heading={t("workingSchedule")}
        subtitle={t("manageEmployeeWorkingSchedules")}
      />

      {/* Success/Error Alerts */}
      {showSuccess && (
        <Alert
          type="success"
          icon={<CheckCircle className="w-6 h-6" />}
          title={t("success")}
          description={t("scheduleUpdatedSuccessfully")}
        />
      )}

      {showError && (
        <Alert
          type="error"
          icon={<X className="w-6 h-6" />}
          title={t("error")}
          description={errorMessage || t("failedToUpdateSchedule")}
        />
      )}

      {/* Employee Selection */}
      <div className="mb-6">
        <SectionHeader
          title={t("selectEmployee")}
          description={t("chooseEmployeeToManageSchedule")}
        />
        <div className="mt-4">
          <SelectBox
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">{t("selectEmployee")}</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </SelectBox>
        </div>

        {isLoadingSchedule && (
          <div className="mt-4 flex justify-center">
            <NormalSpinner />
          </div>
        )}
      </div>

      {/* Schedule Legend */}
      <div className="mb-6">
        <SectionHeader
          title={t("scheduleTypes")}
          description={t("scheduleTypeLegend")}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {scheduleTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <div
                key={type.value}
                className={`flex items-center gap-3 p-3 rounded-lg ${type.color}`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{type.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schedules Table */}
      <div className="mb-6">
        <SectionHeader
          title={t("workingSchedules")}
          description={t("manageEmployeeSchedules")}
        />

        <div className="mt-4 overflow-x-auto">
          {schedules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {selectedEmployee
                ? t("noSchedulesFound")
                : t("selectEmployeeToViewSchedules")}
            </div>
          ) : (
            <Table
              columns={[
                t("startDate"),
                t("endDate"),
                ...dayNames.map((day) => day.name),
                t("actions"),
              ]}
            >
              {schedules.map((schedule, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {isEditing === index ? (
                      <Input
                        type="date"
                        value={schedule.startDate}
                        onChange={(e) =>
                          handleDateChange(index, "startDate", e.target.value)
                        }
                        className="w-full"
                      />
                    ) : (
                      <span>{schedule.startDate}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing === index ? (
                      <Input
                        type="date"
                        value={schedule.endDate}
                        onChange={(e) =>
                          handleDateChange(index, "endDate", e.target.value)
                        }
                        className="w-full"
                      />
                    ) : (
                      <span>{schedule.endDate}</span>
                    )}
                  </TableCell>
                  {dayNames.map((day) => {
                    const scheduleType = getScheduleTypeInfo(
                      schedule[
                        day.id as keyof EmployeeWorkingSchedule
                      ] as string
                    );
                    const IconComponent = scheduleType.icon;

                    return (
                      <TableCell key={day.id}>
                        {isEditing === index ? (
                          <SelectBox
                            value={
                              schedule[
                                day.id as keyof EmployeeWorkingSchedule
                              ] as string
                            }
                            onChange={(e) =>
                              handleScheduleChange(
                                index,
                                day.id,
                                e.target.value
                              )
                            }
                          >
                            {scheduleTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </SelectBox>
                        ) : (
                          <Badge
                            className={`${scheduleType.color} flex items-center gap-2`}
                          >
                            <IconComponent className="w-4 h-4" />
                            {scheduleType.label}
                          </Badge>
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    {isEditing === index ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={handleSaveSchedule}
                          className="flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          {t("save")}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={handleCancelEdit}
                          className="flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          {t("cancel")}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditSchedule(index)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        {t("edit")}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkingSchedulePage;
