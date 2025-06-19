import {
  Checkbox,
  CheckboxSkeleton,
  Field,
  Label,
  LabelSkeleton,
  Button,
  ButtonSkeleton
} from '../../../../components/ui';
import { Dispatch, SetStateAction } from 'react';
import { ListChecks } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../../../../store/language.store';

interface WorkingDaysCheckboxesProps {
  checkedDays: number[];
  setCheckedDays: Dispatch<SetStateAction<number[]>>;
  isLoading?: boolean;
}

// Static working days data
const STATIC_WORKING_DAYS = [
  { dayId: 1, dayEnglishName: "Sunday", dayArabicName: "الأحد" },
  { dayId: 2, dayEnglishName: "Monday", dayArabicName: "الإثنين" },
  { dayId: 3, dayEnglishName: "Tuesday", dayArabicName: "الثلاثاء" },
  { dayId: 4, dayEnglishName: "Wednesday", dayArabicName: "الأربعاء" },
  { dayId: 5, dayEnglishName: "Thursday", dayArabicName: "الخميس" },
  { dayId: 6, dayEnglishName: "Friday", dayArabicName: "الجمعة" },
  { dayId: 7, dayEnglishName: "Saturday", dayArabicName: "السبت" },
];

const WorkingDaysCheckboxes = ({ checkedDays, setCheckedDays, isLoading }: WorkingDaysCheckboxesProps) => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const allDayIDs = STATIC_WORKING_DAYS.map((day) => day.dayId);

  const toggleSelectAll = () => {
    if (checkedDays.length === allDayIDs.length) {
      setCheckedDays([]);
    } else {
      setCheckedDays(allDayIDs);
    }
  };

  const handleCheckboxChange = (dayId: number) => {
    setCheckedDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((id) => id !== dayId)
        : [...prev, dayId]
    );
  };

  const renderCheckboxes = STATIC_WORKING_DAYS.map(({ dayId, dayEnglishName, dayArabicName }) => (
    <Field key={dayId} className="flex items-center space-x-2">
      <Checkbox
        checked={checkedDays.includes(dayId)}
        onChange={() => handleCheckboxChange(dayId)}
      />
      <Label>{language === 'ar' ? dayArabicName : dayEnglishName}</Label>
    </Field>
  ));

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <Field key={i} className="flex items-center space-x-2">
                <CheckboxSkeleton />
                <LabelSkeleton />
              </Field>
            ))
          ) : (
            renderCheckboxes
          )}
        </div>
      </div>
      <div className="mt-auto flex justify-end">
        {isLoading ? (
          <div className="w-36">
            <ButtonSkeleton fullWidth={false} />
          </div>
        ) : (
          <Button
            onClick={toggleSelectAll}
            type="button"
            variant="secondary"
            fullWidth={false}
            size="md"
            icon={<ListChecks className="w-full h-full" />}
          >
            {checkedDays.length === allDayIDs.length
              ? t('deselectAll')
              : t('selectAll')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default WorkingDaysCheckboxes;
