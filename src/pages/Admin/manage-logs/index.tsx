import { CountCard, Header, InfoPopup, LogItem, LogItemSkeleton, NoDataMessage, Paginator } from "../../../components/ui";
import { useTranslation } from "react-i18next";
import { LOGS_NS, LOGS_VIDEO } from "../../../constants";
import { useGetLogs } from "../../../hooks/";
import { ILogData } from "../../../interfaces";
import { FileClock } from "lucide-react";
import { useLanguageStore } from "../../../store";
import { formatValue } from "../../../utils";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import { useDebounce } from "../../../hooks";
import { TableFilters } from "./views";

const LogsPage = () => {
  const { t } = useTranslation([LOGS_NS]);
  const { language } = useLanguageStore();

  const {getParam, setParam, clearParams} = useURLSearchParams();


  // Using the enhanced getParam with parser support from the improved hook
  const rawPage = getParam('page', Number);
  const rawPageSize = getParam('pageSize', Number);
  const rawtype = getParam('type');
  const rawSearchKey = getParam('searchKey');
  const rawSearchQuery = useDebounce(getParam('searchQuery'), 650);
  const rawStartDate = getParam('startDate');
  const rawEndDate = getParam('endDate');

  // Use nullish coalescing to default numeric values, undefined for dates if empty
  const page = rawPage ?? 1;
  const pageSize = rawPageSize ?? 10;
  const type = rawtype || undefined;
  const searchKey = rawSearchKey || undefined;
  const searchQuery = rawSearchQuery || undefined;
  const startDate = rawStartDate || undefined;
  const endDate = rawEndDate || undefined;

  const { logs, totalCountLogs, metadata, isLogsDataLoading } = useGetLogs(page, pageSize, searchKey, searchQuery, type, startDate, endDate)

  return (
    <div className="sm:p-5 p-3 space-y-6">
      <Header
        heading={t("header.heading")}
        subtitle={t("header.subtitle")}
      />

      <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <div className="w-full flex items-center justify-center">
          <InfoPopup
            title={t("infoPopup.title")}
            description={t("infoPopup.description")}
            videoUrl={LOGS_VIDEO}
          />
        </div>

        <CountCard 
          title={t("countCard.title")}
          description={t("countCard.description")}
          count={formatValue(totalCountLogs, language)}
          icon={<FileClock size={28} />} 
          bgColor="bg-[#b38e19]" 
        />
      </div>

      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">

        <div className="flex flex-wrap gap-4">
          <TableFilters searchBy={metadata.searchBy} getParam={getParam} setParam={setParam} clearParams={clearParams} />
        </div>

        {
          isLogsDataLoading ?
          (
            <>
              <LogItemSkeleton />
              <LogItemSkeleton />
              <LogItemSkeleton />
            </>
          ) : (
            logs.length == 0 ? (
              <NoDataMessage title={t("emptyTable.title")} message={t("emptyTable.message")} />
            ) : (
              logs.map((log: ILogData) => (
                <LogItem key={log.id} logData={log} />
              ))
            )
          )
        }

        <Paginator
          page={metadata?.pagination?.pageIndex || 0}
          totalPages={metadata?.pagination?.totalPages || 1}
          totalRecords={metadata?.pagination?.totalRecords || 0}
          isLoading={isLogsDataLoading}
          onClickFirst={() => setParam("page", String(1))}
          onClickPrev={() => setParam("page", String(Math.max((Number(getParam('page')) || 1) - 1, 1)))}
          onClickNext={() => setParam("page", String(Math.min((Number(getParam('page')) || 1) + 1, metadata?.pagination?.totalPages || 1)))}
        />
      </div>
    </div>
  );
};

export default LogsPage;
