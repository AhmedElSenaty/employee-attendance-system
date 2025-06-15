import { UserProfileCard, UserProfileCardSkeleton } from "../../../../components/ui"
import { useGetEmployeeByID } from "../../../../hooks"

interface IProps {
  employeeId: string
}

const EmplyeeCard = ({ employeeId }: IProps) => {
  const { employee, isEmployeeDataLoading } = useGetEmployeeByID(employeeId || "")

  return (
    <>
      {!employee || isEmployeeDataLoading ? (
        <UserProfileCardSkeleton />
      ) : (
        <UserProfileCard user={employee} />
      )}
    </>
  )
}

export default EmplyeeCard
