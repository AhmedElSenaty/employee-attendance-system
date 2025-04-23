import { useTranslation } from "react-i18next";
import PaginationButton from "./PaginationButton";
import { useSelector } from "react-redux";
import { RootState } from "../../../context/store";
import { formatValue } from "../../../utils";

interface IProps {
  page: number;
  totalPages: number;
  totalRecords: number;
  isLoading: boolean;
  onClickPrev: () => void;
  onClickNext: () => void;
  onClickFirst: () => void;
}

const Paginator = ({ page, totalPages, totalRecords, isLoading, onClickPrev, onClickNext, onClickFirst }: IProps) => {
  const { t } = useTranslation();
  const { language } = useSelector((state: RootState) => state.language);

  return (
    <div className="flex flex-wrap justify-center items-center gap-4">
      <p className="text-sm md:text-lg text-primary mx-3">
        {t("pagination.page")}{" "}
        <span className="mx-1 font-semibold text-secondary-hover">{formatValue(page, language)}</span> {t("pagination.of")}{" "}
        <span className="mx-1 font-semibold text-secondary-hover">{formatValue(totalPages, language)}</span> |{" "}
        <span className="mx-1 font-semibold text-secondary-hover">{formatValue(totalRecords, language)}</span> {t("pagination.records")}
      </p>

      <div className="flex flex-wrap justify-center items-center gap-2">
        <PaginationButton disabled={page === 1 || isLoading} onClick={onClickFirst} direction="first">
          {t("buttons.first")}
        </PaginationButton>
        <div className="flex justify-center items-center gap-1">
          <PaginationButton disabled={page === 1 || isLoading} onClick={onClickPrev} direction="prev">
            {t("buttons.previous")}
          </PaginationButton>
          <PaginationButton disabled={page === totalPages || isLoading} onClick={onClickNext} direction="next">
            {t("buttons.next")}
          </PaginationButton>
        </div>
      </div>
    </div>
  );
};

export default Paginator;
