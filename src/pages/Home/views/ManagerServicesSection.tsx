import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileBarChart2,
  Users,
  UserCog,
  UserRoundPlus,
  UserPlus,
  Building2,
  CalendarSearch,
  Calendar,
  TicketsPlane,
  Moon,
  FileText,
  Briefcase,
  Clock,
  Coffee,
  Thermometer,
  Venus,
  MapPinHouse,
  ClipboardList,
  Archive,
  BarChart2,
  FileEdit,
  ChevronLeft,
} from "lucide-react";
import { helwanImage as helwanLogo } from "../../../assets";

// ---- Animation presets ------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// ---- Card component ---------------------------------------------------------
const Card: React.FC<{
  title: string;
  desc?: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = ({ title, desc, href, Icon }) => (
  <motion.a
    variants={fadeUp}
    whileHover={{ y: -6, scale: 1.02 }}
    whileTap={{ scale: 0.99 }}
    href={href}
    className="group block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
  >
    <div className="flex items-start gap-3">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-sky-500/15 to-emerald-500/15 text-sky-600">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-base font-semibold text-gray-900">{title}</h4>
          <ChevronLeft className="h-5 w-5 text-gray-300 group-hover:text-sky-500 transition" />
        </div>
        {desc ? <p className="mt-1 text-sm text-gray-600">{desc}</p> : null}
        <span className="mt-3 inline-block text-xs font-medium text-sky-600 group-hover:underline">
          انقر للمتابعة
        </span>
      </div>
    </div>
  </motion.a>
);

// ---- Main component ---------------------------------------------------------
const ManagerServicesSection: React.FC = () => {
  const candidates = [
    {
      title: "لوحة التحكم",
      desc: "نظرة عامة سريعة على مؤشرات القسم.",
      href: "/manager",
      Icon: LayoutDashboard,
    },
    {
      title: "جميع التقارير",
      desc: "تصدير وقراءة تقارير النظام.",
      href: "/manager/allReports",
      Icon: FileBarChart2,
    },

    // Manage Users
    {
      title: "إدارة المديرين",
      href: "/manager/manage-managers",
      Icon: UserCog,
      permAll: ["View Manager"],
    },
    {
      title: "إضافة مدير",
      href: "/manager/add-manager",
      Icon: UserPlus,
      permAll: ["Add Manager"],
    },
    {
      title: "إدارة الموظفين",
      href: "/manager/manage-employees",
      Icon: Users,
      permAll: ["View Employee"],
    },
    {
      title: "إضافة موظف",
      href: "/manager/add-employee",
      Icon: UserRoundPlus,
      permAll: ["Add Employee"],
    },

    // Structure
    {
      title: "الأقسام الفرعية",
      href: "/manager/manage-sub-departments",
      Icon: Building2,
      permAll: ["View SubDepartments"],
    },

    // Attendance
    {
      title: "تفاصيل الحضور",
      href: "/manager/manage-attendance",
      Icon: CalendarSearch,
      permAll: ["View Attendances"],
    },
    {
      title: "ملخص الحضور",
      href: "/manager/manage-attendance/overview",
      Icon: Calendar,
      permAll: ["View Attendances"],
    },
    {
      title: "إجازات الحضور",
      href: "/manager/manage-attendance/vacations",
      Icon: TicketsPlane,
      permAll: ["View Attendances"],
    },

    // Overtime
    {
      title: "العمل الإضافي",
      href: "/manager/work-overtime",
      Icon: Moon,
      permAny: ["Export Overtime report Excel", "Export Overtime report PDF"],
    },

    // Requests
    {
      title: "طلبات الإجازة",
      href: "/manager/leave-requests",
      Icon: FileText,
      permAll: ["View Requests"],
    },
    {
      title: "طلبات المأمورية",
      href: "/manager/mission-requests",
      Icon: Briefcase,
      permAll: ["View Requests"],
    },
    {
      title: "طلبات الإذن",
      href: "/manager/ordinary-requests",
      Icon: Clock,
      permAll: ["View Requests"],
    },
    {
      title: "طلبات الإجازة العارضة",
      href: "/manager/casual-requests",
      Icon: Coffee,
      permAll: ["View Requests"],
    },
    {
      title: "طلبات الإجازة المرضية",
      href: "/manager/sick-requests",
      Icon: Thermometer,
      permAll: ["View Requests"],
    },
    {
      title: "الطلبات العامة",
      href: "/manager/genaric-requests",
      Icon: Venus,
      permAll: ["View Requests"],
    },
    {
      title: "طلبات الزيارة المنزلية",
      href: "/manager/home-visit-requests",
      Icon: MapPinHouse,
      permAll: ["View Requests"],
    },

    // Summaries
    {
      title: "دفتر توفير الإجازات",
      href: "/manager/vacation-saver",
      Icon: ClipboardList,
      permAll: ["see vacations summary"],
    },
    {
      title: "كل الطلبات",
      href: "/manager/all-requests",
      Icon: Archive,
      permAll: ["see vacations summary"],
    },
    {
      title: "ملخص الطلبات",
      href: "/manager/requestsSummary",
      Icon: BarChart2,
      permAll: ["see vacations summary"],
    },

    // Adjustments
    {
      title: "تسوية رصيد الإجازات",
      href: "/manager/change-vacation-requests",
      Icon: FileEdit,
      permAll: ["Manage Vacation Adjustment"],
    },
  ] as Array<{
    title: string;
    desc?: string;
    href: string;
    Icon: any;
  }>;

  return (
    <section dir="rtl" className="relative overflow-hidden bg-white">
      {/* Watermark using Helwan University logo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-5"
        style={{
          backgroundImage: `url(${helwanLogo})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left -10% top -10%",
          backgroundSize: "700px",
        }}
      />

      {/* Soft gradient veil */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-50 via-white to-white" />

      <div className="container mx-auto px-6 lg:px-12 py-14">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-8 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            خدمات المدير
          </h2>
          <p className="mt-2 text-gray-600">
            اختصارات سريعة لإدارة الأقسام، الموظفين، الحضور والطلبات.
          </p>
        </motion.div>

        {/* Services grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {candidates.map((s) => (
            <Card
              key={s.title}
              title={s.title}
              desc={s.desc}
              href={s.href}
              Icon={s.Icon}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ManagerServicesSection;
