import { useState } from "react";
import { Popup } from "../Popup";
import { Button } from "../Button";
import { Video } from "lucide-react";
import { useTranslation } from "react-i18next";

type InfoPopupProps = {
  title: string;
  description: string;
  videoUrl: string;
};

export default function InfoPopup({ title, description, videoUrl }: InfoPopupProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      {/* Button to open the popup */}
      <Button variant="primary" type="button" size={"md"} shape={"rounded"} onClick={() => setIsPopupOpen(true)} icon={<Video className="w-full h-full" />}>{t("clickToWatch")}</Button>
      {/* The popup itself */}
      <Popup
        isOpen={isPopupOpen}
        closeModal={() => setIsPopupOpen(false)}
        title={title}
        description={description}
      >
        <div className="space-y-4">
          {/* Iframe to display the video */}
          <div className="aspect-video w-full">
            <iframe
              src={videoUrl}
              title="Info Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg border"
            ></iframe>
          </div>

          {/* Close button */}
          <Button
            variant="cancel"
            type="button"
            fullWidth={true}
            onClick={() => setIsPopupOpen(false)}
          >
            {t("buttons.close")}
          </Button>
        </div>
      </Popup>
    </>
  );
}
