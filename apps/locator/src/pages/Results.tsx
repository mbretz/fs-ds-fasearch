import { AdvisorSearchModule } from '../components/AdvisorSearchModule/AdvisorSearchModule';
import { InProgress } from '../components/AdvisorSearchModule/InProgress';

export function Results() {
  return (
    <AdvisorSearchModule>
      <InProgress />
    </AdvisorSearchModule>
  );
}
