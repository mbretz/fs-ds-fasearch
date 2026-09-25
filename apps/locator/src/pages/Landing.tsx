import { AdvisorSearchModule } from '../components/AdvisorSearchModule/AdvisorSearchModule';
import { Start } from '../components/AdvisorSearchModule/Start';
import { HowItWorks } from '../components/HowItWorks/HowItWorks';
import { InvestmentServices } from '../components/InvestmentServices/InvestmentServices';

export function Landing() {
  return (
    <>
      <AdvisorSearchModule>
        <Start />
      </AdvisorSearchModule>
      <HowItWorks />
      <InvestmentServices />
    </>
  );
}
