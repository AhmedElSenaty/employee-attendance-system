import {
  Header,
  SectionHeader,
  Paginator,
  InfoPopup,
} from "../../../components/ui/";
import { useTranslation } from "react-i18next";

import { useDebounce } from "../../../hooks/";
import { ENTITY_VIDEO } from "../../../constants";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";

import {
  useGetMyOrdinaryDeductions,
  useGetOrdinaryDeductions,
} from "../../../hooks/request.hook";
import DeductionTable from "./views/DeductionTable";
import MyOrdinaryDeductionsFilter from "./views/MyOrdinaryDeductionsFilter";

const MyManageOrdinaryDeductionsPage = () => {
  const { t } = useTranslation("ordinaryDeduction");

  const { getParam, setParam, clearParams } = useURLSearchParams();

  const rawPage = getParam("page", Number);
  const rawPageSize = getParam("pageSize", Number);
  const rawSearchKey = getParam("searchKey");
  const rawSearchQuery = useDebounce(getParam("searchQuery"), 650);
  const rawStartDate = getParam("startDate");
  const rawEndDate = getParam("endDate");

  // Use nullish coalescing to default numeric values, undefined for dates if empty
  const page = rawPage ?? 1;
  const pageSize = rawPageSize ?? 10;
  const searchKey = rawSearchKey || undefined;
  const searchQuery = rawSearchQuery || undefined;
  const startDate = rawStartDate || undefined;
  const endDate = rawEndDate || undefined;

  const {
    requests,
    metadata,
    isLoading: isEntitiesDataLoading,
  } = useGetMyOrdinaryDeductions(
    page,
    pageSize,
    startDate,
    endDate,
    searchKey,
    searchQuery
  );

  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="w-full flex items-center justify-center">
            <InfoPopup
              title={t("infoPopup.title")}
              description={t("infoPopup.description")}
              videoUrl={ENTITY_VIDEO}
            />
          </div>
        </div>

        {/* Right Column: Filters & Table */}
        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader
            title={t("sectionsHeader.entitiesList.title")}
            description={t("sectionsHeader.entitiesList.description")}
          />

          {/* Filters */}
          <MyOrdinaryDeductionsFilter
            searchBy={metadata.searchBy}
            getParam={getParam}
            setParam={setParam}
            clearParams={clearParams}
          />

          <DeductionTable
            requests={requests}
            isLoading={isEntitiesDataLoading}
          />

          {/* Pagination Component */}
          <Paginator
            page={metadata?.pagination?.pageIndex || 0}
            totalPages={metadata?.pagination?.totalPages || 1}
            totalRecords={metadata?.pagination?.totalRecords || 0}
            isLoading={isEntitiesDataLoading}
            onClickFirst={() => setParam("page", String(1))}
            onClickPrev={() =>
              setParam(
                "page",
                String(Math.max((Number(getParam("page")) || 1) - 1, 1))
              )
            }
            onClickNext={() =>
              setParam(
                "page",
                String(
                  Math.min(
                    (Number(getParam("page")) || 1) + 1,
                    metadata?.pagination?.totalPages || 1
                  )
                )
              )
            }
          />
        </div>
      </div>
    </>
  );
};

export default MyManageOrdinaryDeductionsPage;
