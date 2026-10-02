import { PhishingOptionDTO, WarningSignalReviewDTO } from '../../../types/dto/phishing.dto';

export interface PhishingScenarioTemplate {
  id: string;
  slug: string;
  title: string;
  context: string;
  senderName: string;
  senderInfo: string;
  initialMessage: string;
  initialOptions: PhishingOptionDTO[];
  branching: {
    onVulnerable: {
      attackerReply: string;
      options: PhishingOptionDTO[];
      escalationMessage: string;
    };
    onHesitant: {
      attackerReply: string;
      options: PhishingOptionDTO[];
      escalationMessage: string;
    };
    onCautious: {
      attackerReply: string;
      options: PhishingOptionDTO[];
      escalationMessage: string;
    };
  };
  defenseOutcome: {
    attackerSurrender: string;
    leoPraise: string;
  };
  warningSignals: WarningSignalReviewDTO[];
  goldenRule: string;
  leoSummary: string;
}
