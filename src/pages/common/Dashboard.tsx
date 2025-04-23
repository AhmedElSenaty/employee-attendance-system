import { Calendar, Check, X } from "lucide-react";
import { BarChart, DoughnutChart, Graph, GraphSkeleton } from "../../components/ui/chart";
import { StatCard, StatCardSkeleton } from "../../components/ui/StatCard";
import { Header } from "../../components/ui/Header";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { Field, Input, Label, SelectBox, SelectBoxSkeleton } from "../../components/ui/Forms";
import { useTranslation } from "react-i18next";
import { useFiltersHook } from "../../hooks/useFiltersHook";
import { useGetDepartmentsList } from "../../hooks/useDepartmentHook";
import { useGetAttendanceOverview, useGetDepartmentAttendanceOverview, useGetLatestAttendance } from "../../hooks/useAttendanceHook";
import { AttendanceCardData } from "../../interfaces";
import { AttendanceCard, AttendanceCardSkeleton } from "../../components/ui/AttendanceCard";
import { useSelector } from "react-redux";
import { RootState } from "../../context/store";
import { formatValue } from "../../utils";

export const DashboardPage = () => {
  const { t } = useTranslation(["common", "dashboard"]);
  const { language } = useSelector((state: RootState) => state.language);

  const { startDate, endDate, searchByDepartmentId, setFilters } = useFiltersHook();
  const { departmentsList, isDepartmentsLoading } = useGetDepartmentsList();

  const { attendanceOverviewDtos, dailyAttendanceDto, isAttendanceOverviewLoading } = useGetAttendanceOverview()

  const { departmentAttendanceOverview, isDepartmentAttendanceOverviewLoading } = useGetDepartmentAttendanceOverview(startDate || "", endDate || "", Number(searchByDepartmentId || 0))
  const data = {
    labels: [
      t("departmentOverview.graph.attendance", { ns: "dashboard" }), 
      t("departmentOverview.graph.absent", { ns: "dashboard" })
    ],
    datasets: [
      {
        label: "Attendance Overview",
        data: [departmentAttendanceOverview?.totalAttendance, departmentAttendanceOverview?.totalAbsence],
        backgroundColor: ["#19355a", "#b38e19"],
        hoverOffset: 8,
      },
    ],
  };

  const { latestAttendance, islatestAttendanceLoading } = useGetLatestAttendance()

  const barData = {
    labels: t("attendanceOverview.graph.months", {
      ns: "dashboard",
      returnObjects: true,
    }) as string[],
    datasets: [
      {
        label: t("attendanceOverview.graph.attendance", { ns: "dashboard" }),
        data: attendanceOverviewDtos?.map((item) => item.attendance),
        backgroundColor: "#19355a",
        hoverOffset: 8,
      },
      {
        label: t("attendanceOverview.graph.absent", { ns: "dashboard" }),
        data: attendanceOverviewDtos?.map((item) => item.absence),
        backgroundColor: "#b38e19",
        hoverOffset: 8,
      },
    ],
  };
  

  return (
    <div className="sm:p-5 p-3 space-y-5">
      <Header
        heading={t("header.heading", { ns: "dashboard" })}
        subtitle={t("header.subtitle", { ns: "dashboard" })}
      />

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Main content */}
        <div className="w-full lg:w-2/3 flex flex-col gap-5">
          <SectionHeader
            title={t("attendanceOverview.sectionHeader.title", { ns: "dashboard" })}
            description={t("attendanceOverview.sectionHeader.description", { ns: "dashboard" })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isAttendanceOverviewLoading ?
            (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  icon={<Check />}
                  amount={formatValue(dailyAttendanceDto?.totalComplete || 0, language)}
                  description={t("attendanceOverview.statCards.completedAttendance.description", { ns: "dashboard" })}
                  note={t("attendanceOverview.statCards.completedAttendance.note", { ns: "dashboard" })}
                  iconColor="text-white"
                  iconBg="bg-emerald-700"
                  cardBg="bg-emerald-50"
                />

                <StatCard
                  icon={<X />}
                  amount={formatValue(dailyAttendanceDto?.noCheckInOrOut || 0, language)}
                  description={t("attendanceOverview.statCards.noCheck.description", { ns: "dashboard" })}
                  note={t("attendanceOverview.statCards.noCheck.note", { ns: "dashboard" })}
                  iconColor="text-white"
                  iconBg="bg-red-700"
                  cardBg="bg-red-50"
                />

                <StatCard
                  icon={<Calendar />}
                  amount={formatValue(dailyAttendanceDto?.onlyCheckedIn || 0, language)}
                  description={t("attendanceOverview.statCards.onlyCheckIn.description", { ns: "dashboard" })}
                  note={t("attendanceOverview.statCards.onlyCheckIn.note", { ns: "dashboard" })}
                  iconColor="text-white"
                  iconBg="bg-yellow-600"
                  cardBg="bg-yellow-50"
                />

                <StatCard
                  icon={<Calendar />}
                  amount={formatValue(dailyAttendanceDto?.onlyCheckedOut || 0, language)}
                  description={t("attendanceOverview.statCards.onlyCheckOut.description", { ns: "dashboard" })}
                  note={t("attendanceOverview.statCards.onlyCheckOut.note", { ns: "dashboard" })}
                  iconColor="text-white"
                  iconBg="bg-indigo-700"
                  cardBg="bg-indigo-50"
                />

              </>
            )

            }
          </div>

          <div>
            {
              isAttendanceOverviewLoading ? (
                <GraphSkeleton />
              ) : (
                <Graph
                  title={t("attendanceOverview.graph.title", { ns: "dashboard" })}
                  description={t("attendanceOverview.graph.description", { ns: "dashboard" })}
                  width="w-full"
                  height="h-fit"
                >
                  <BarChart datasetIdKey="employees-bar" data={barData} height={300} />
                </Graph>
              )
            }
          </div>
        </div>

        {/* Sidebar section */}
        <div className="w-full lg:w-1/3 flex flex-col gap-5">
          <SectionHeader
            title={t("departmentOverview.sectionHeader.title", { ns: "dashboard" })}
            description={t("departmentOverview.sectionHeader.description", { ns: "dashboard" })}
          />

          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <Field className="flex-1 flex flex-col">
              <Label>{t("dateAndTime.startDate")}</Label>
              <Input
                type="date"
                icon={<Calendar />}
                value={startDate ?? ""}
                onChange={(e) => setFilters({ startDate: e.target.value })}
              />
            </Field>

            <span className="text-lg font-bold text-gray-800 capitalize text-center sm:text-left">
              {t("dateAndTime.to")}
            </span>

            <Field className="flex-1 flex flex-col">
              <Label>{t("dateAndTime.endDate")}</Label>
              <Input
                type="date"
                icon={<Calendar />}
                value={endDate ?? ""}
                onChange={(e) => setFilters({ endDate: e.target.value })}
              />
            </Field>
          </div>

          <Field className="space-y-3 w-full flex flex-col">
            <Label size="md">
              {t("departmentOverview.selectDepartment", { ns: "dashboard" })}
            </Label>
            {isDepartmentsLoading ? (
              <SelectBoxSkeleton />
            ) : (
              <SelectBox
                onChange={(e) =>
                  setFilters({
                    searchBySubDeptartmentId: undefined,
                    searchByDepartmentId: Number(e.target.value) || undefined,
                  })
                }
                value={searchByDepartmentId || ""}
              >
                <option value="">
                  {t("departmentOverview.selectDefult", { ns: "dashboard" })}
                </option>
                {departmentsList?.map((department, idx) => (
                  <option key={idx} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </SelectBox>
            )}
          </Field>

          {
              isDepartmentAttendanceOverviewLoading ? (
                <GraphSkeleton />
              ) : (
                <Graph
                  title={t("departmentOverview.graph.title", { ns: "dashboard" })}
                  description={t("departmentOverview.graph.description", { ns: "dashboard" })}
                  width="w-full"
                  height="h-fit"
                >
                  <DoughnutChart datasetIdKey="attendance" data={data} height={175} />
                </Graph>
              )
            }

          {/* Responsive attendance card list */}
          <div className="flex flex-wrap gap-5 max-h-96 overflow-y-auto">
            {
              islatestAttendanceLoading ? (
                [...Array(3)].map((_, index) => <AttendanceCardSkeleton key={index} />)
              ) : (
                latestAttendance.map(
                  (
                    { employeeName, profileImage, departmentName, subDepartmentName, checkIn, checkOut }: AttendanceCardData,
                    index
                  ) => (
                    <AttendanceCard
                      key={index}
                      avatarUrl={profileImage || "/images/default-user-image.webp"}
                      name={employeeName}
                      role={departmentName}
                      type={subDepartmentName}
                      loginTime={checkIn}
                      logoutTime={checkOut}
                      bgColor={
                        checkIn && !checkOut
                          ? "bg-green-50" // Checked in only
                          : !checkIn && checkOut
                          ? "bg-red-50" // Checked out only
                          : "bg-gray-50" // Both or neither
                      }
                    />
                  )
                )
              )
            }
          </div>
        </div>
      </div>

    </div>
  );
};

