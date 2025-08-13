import React from "react";
import { motion } from "framer-motion";
import {
  User2,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  CalendarCheck,
  Stethoscope,
  Briefcase,
  Home,
  ChevronLeft,
} from "lucide-react";
import { helwanImage as helwanLogo } from "../../../assets";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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

// ---- Icon mapping -----------------------------------------------------------
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  todayAttendance: CalendarDays,
  viewProfile: User2,
  attendanceCalendar: CalendarDays,
  permissionRequests: Clock3,
  casualLeave: ClipboardCheck,
  annualLeave: CalendarCheck,
  sickLeave: Stethoscope,
  missionRequests: Briefcase,
  homeVisitRequests: Home,
};

// ---- Types ------------------------------------------------------------------
type ServicesSectionProps = {
  isLoggedIn: boolean;
  userRole?: string; // "employee" | "manager" | "admin" | etc.
};

// ---- Card -------------------------------------------------------------------
const Card: React.FC<{
  title: string;
  desc: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  isLoggedIn: boolean;
  userRole?: string;
  onClick: (href: string) => void;
}> = ({ title, desc, href, Icon, isLoggedIn, userRole, onClick }) => (
  <motion.a
    variants={fadeUp}
    whileHover={{ y: -6, scale: 1.02 }}
    whileTap={{ scale: 0.99 }}
    onClick={(e) => {
      e.preventDefault();
      onClick(href);
    }}
    href={href}
    className="group block cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
  >
    <div className="flex items-start gap-3">
      <div
        className="grid h-12 w-12 place-items-center rounded-xl"
        style={{ backgroundColor: "#19355a", color: "#fff" }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-base font-semibold text-gray-900">{title}</h4>
          <ChevronLeft
            className="h-5 w-5 transition"
            style={{ color: "#b38e19" }}
          />
        </div>
        <p className="mt-1 text-sm text-gray-600">{desc}</p>
        <span className="mt-3 inline-block text-xs font-medium text-sky-600 group-hover:underline"></span>
      </div>
    </div>
  </motion.a>
);

// ---- Main -------------------------------------------------------------------
const ServicesSection: React.FC<ServicesSectionProps> = ({
  isLoggedIn,
  userRole,
}) => {
  const { t } = useTranslation("home");
  const navigate = useNavigate();

  // List of service keys & routes
  const servicesKeys = [
    { key: "todayAttendance", href: "employee" },
    { key: "viewProfile", href: "/employee" },
    { key: "attendanceCalendar", href: "/employee" },
    { key: "permissionRequests", href: "/employee" },
    { key: "casualLeave", href: "/employee" },
    { key: "annualLeave", href: "/employee" },
    { key: "sickLeave", href: "/employee" },
    { key: "missionRequests", href: "/employee" },
    { key: "homeVisitRequests", href: "/employee" },
  ] as Array<{ key: keyof typeof iconMap; href: string }>;

  // Click behavior: only when the user clicks a service
  const handleServiceClick = (_href: string) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (userRole === "employee") {
      navigate("/employee");
    } else {
      // Do nothing for non-employee roles
    }
  };

  return (
    <section dir="rtl" className="relative overflow-hidden bg-white">
      {/* Watermark */}
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
      {/* Soft gradient */}
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
            {t("servicesSection.sectionHeader.title")}
          </h2>
          <p className="mt-2 text-gray-600">
            {t("servicesSection.sectionHeader.description")}
          </p>
        </motion.div>

        {/* Services grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5"
        >
          {servicesKeys.map((service) => {
            const Icon = iconMap[service.key];
            return (
              <Card
                key={service.key}
                title={t(`servicesSection.services.${service.key}.title`)}
                desc={t(`servicesSection.services.${service.key}.description`)}
                href={service.href}
                Icon={Icon}
                isLoggedIn={isLoggedIn}
                userRole={userRole}
                onClick={handleServiceClick}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
