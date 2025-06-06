import { useState } from "react";
import { Popup } from "../Popup";
import { Button } from "../Button";
import { Video } from "lucide-react";
import { Tooltip } from "../Tooltip";

type InfoPopupProps = {
  title: string;
  description: string;
  videoUrl: string;
};

export default function InfoPopup({ title, description, videoUrl }: InfoPopupProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      {/* Button to open the popup */}
      <Tooltip content="Click to learn how to use this page">
        <Button variant="primary" type="button" size={"md"} shape={"rounded"} onClick={() => setIsPopupOpen(true)} icon={<Video className="w-full h-full" />} />
      </Tooltip>
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
            Close
          </Button>
        </div>
      </Popup>
    </>
  );
}
