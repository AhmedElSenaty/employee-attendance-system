import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react"; // swap with your icon library
import { useTranslation } from "react-i18next";
import { Button } from "../Button";
import { useNavigate } from "react-router";

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const handleGoBack = () => {
    navigate(-1);
  };

  // Determine direction
  const isRTL = i18n.dir() === "rtl";

  return (
    <Button
      onClick={handleGoBack}
      icon={isRTL ? <ArrowRight className="w-full h-full" /> : <ArrowLeft className="w-full h-full" />}
      shape="rounded"
      variant="secondary"
      size={"sm"}
    />
  );
};

export default BackButton;
