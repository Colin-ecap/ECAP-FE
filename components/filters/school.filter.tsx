import { DEFAULT_FILTERS_KEYS } from '@/constants/filter';
import type { School } from '@/types';
import { BaseFilter } from './base';

interface SchoolFilterProps {
  availableSchools: School[];
  slug?: string;
}

export function SchoolFilter({
  availableSchools = [],
  slug = DEFAULT_FILTERS_KEYS.SCHOOL_ID,
}: SchoolFilterProps) {
  return (
    <BaseFilter
      label="School"
      defaultPlaceholder="All Schools"
      slug={slug}
      options={availableSchools.map((school) => ({
        label: school.name,
        value: school.id.toString(),
      }))}
      withBothOption
    />
  );
}
