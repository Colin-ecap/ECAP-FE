import { SortableIcon } from '@/components/table/sortable-header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DEFAULT_FILTERS_KEYS, SPECIFIC_PAGE_FILTER_KEYS } from '@/constants/filter';
import { routes } from '@/constants/routes';
import { hasPermission } from '@/lib/permissions';
import type { AcademicYear, TeacherCompliance, TrackLearningPeriod, User } from '@/types';
import { getCompletionStatus, getUserName } from '@/utils';
import Link from 'next/link';
import { CompletionStatusForTable } from '../statuses';
interface TeachersTableProps {
  assignments: TeacherCompliance[];
  currentLearningPeriod?: TrackLearningPeriod;
  currentAcademicYear?: AcademicYear;
  user: User;
}

export const TeachersTable = ({
  assignments = [],
  currentLearningPeriod,
  currentAcademicYear,
  user,
}: TeachersTableProps) => {
  const getPath = (assignment: TeacherCompliance) =>
    `${routes.compliance.teacher.replace(
      ':id',
      assignment.teacher_id.toString()
    )}?${DEFAULT_FILTERS_KEYS.LEARNING_PERIOD_ID}=${
      currentLearningPeriod?.id
    }&${DEFAULT_FILTERS_KEYS.TEACHER_ID}=${assignment.teacher_id}&${
      SPECIFIC_PAGE_FILTER_KEYS.COMPLIANCE.ADMIN.ACADEMY_ID
    }=${assignment.academy_id}&${
      SPECIFIC_PAGE_FILTER_KEYS.COMPLIANCE.ACADEMY_ID
    }=${assignment.academy_id}&${DEFAULT_FILTERS_KEYS.ACADEMIC_YEAR}=${currentAcademicYear?.id}`;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="lg:max-w-44 max-w-28 truncate" title="Teacher Name">
            Teacher Name
            <SortableIcon<TeacherCompliance> name="teacher_name" />
          </TableHead>
          <TableHead className="lg:max-w-44 max-w-28 truncate" title="Academy">
            Academy
            {hasPermission(user, 'sorting', 'sort:academy') && (
              <SortableIcon<TeacherCompliance> name="academy_name" />
            )}
          </TableHead>
          <TableHead className="lg:max-w-44 max-w-28 truncate" title="Students">
            Students
            <SortableIcon<TeacherCompliance> name="student_count" />
          </TableHead>
          <TableHead className="lg:max-w-44 max-w-28 truncate" title="Flagged Samples">
            Flagged Samples
            <SortableIcon<TeacherCompliance> name="flagged_count" />
          </TableHead>
          <TableHead className="lg:max-w-44 max-w-28 truncate" title="Completed Samples">
            Completed Samples
            <SortableIcon<TeacherCompliance> name="completed_count" />
          </TableHead>
          <TableHead className="lg:max-w-44 max-w-28 truncate" title="Incomplete Samples">
            Incomplete Samples
            <SortableIcon<TeacherCompliance> name="incompleted_count" />
          </TableHead>
          <TableHead className="lg:max-w-44 max-w-28 truncate" title="Completion">
            Completion
            <SortableIcon<TeacherCompliance> name="is_complated" />
          </TableHead>
          <TableHead className="lg:max-w-44 max-w-28 truncate" title="Progress">
            Progress
            <SortableIcon<TeacherCompliance> name="completion_percentage" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments.map((assignment) => (
          <TableRow key={`${assignment.teacher_id}-${assignment.academy_id}`}>
            <Link className="contents" href={getPath(assignment)}>
              <TableCell className="lg:max-w-44 max-w-28 truncate">
                {assignment.teacher_name}
              </TableCell>
              <TableCell>{assignment.academy_name}</TableCell>
              <TableCell>{assignment.student_count}</TableCell>
              <TableCell>{assignment.flagged_count}</TableCell>
              <TableCell>{assignment.completed_count}</TableCell>
              <TableCell>{assignment.incompleted_count}</TableCell>
              <TableCell>
                <CompletionStatusForTable
                  variant={getCompletionStatus(assignment.is_complated, currentLearningPeriod)}
                />
              </TableCell>
              <TableCell className="text-center">
                {Number(assignment.completion_percentage).toFixed(2)}%
              </TableCell>
            </Link>
          </TableRow>
        ))}
        {assignments.length === 0 && (
          <TableRow className="h-80">
            <TableCell colSpan={8} className="text-center">
              No teachers found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
