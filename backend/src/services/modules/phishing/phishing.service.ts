import { randomUUID } from 'crypto';
import {
  ChatMessageDTO,
  PhishingOptionDTO,
  PhishingReviewDTO,
  PhishingStepResponseDTO,
  ChatStatus,
} from '../../../types/dto/phishing.dto';
import { PHISHING_SCENARIOS, PhishingScenarioTemplate } from './promptLibrary';

interface ActivePhishingChat {
  chatId: string;
  scenarioIndex: number;
  totalScenarios: number;
  template: PhishingScenarioTemplate;
  step: 1 | 2;
  chosenStep1Attitude?: 'VULNERABLE' | 'HESITANT' | 'CAUTIOUS' | 'DEFENSIVE';
  status: ChatStatus;
  messages: ChatMessageDTO[];
  currentOptions: PhishingOptionDTO[];
  createdAt: number;
}

class PhishingService {
  private activeSessions = new Map<string, ActivePhishingChat>();

  /**
   * Startet eine neue Phishing-Simulation mit 3 oder 5 Szenarien.
   */
  public startSession(scenarioCount: 3 | 5): PhishingStepResponseDTO {
    this.cleanExpiredSessions();

    const chatId = randomUUID();
    const scenarioIndex = 0;
    const template = this.getTemplate(scenarioIndex);

    const initialAttackerMessage: ChatMessageDTO = {
      id: randomUUID(),
      sender: 'ATTACKER',
      text: template.initialMessage,
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    };

    const session: ActivePhishingChat = {
      chatId,
      scenarioIndex,
      totalScenarios: scenarioCount,
      template,
      step: 1,
      status: 'IN_PROGRESS',
      messages: [initialAttackerMessage],
      currentOptions: template.initialOptions,
      createdAt: Date.now(),
    };

    this.activeSessions.set(chatId, session);

    return this.buildStepResponse(session);
  }

  /**
   * Verarbeitet die Schüler-Auswahl und generiert die passende KI-Reaktion.
   */
  public replyToChat(chatId: string, selectedOptionId: string): PhishingStepResponseDTO {
    const session = this.activeSessions.get(chatId);
    if (!session) {
      throw new Error('Sitzung nicht gefunden oder abgelaufen');
    }

    if (session.status !== 'IN_PROGRESS') {
      return this.buildStepResponse(session);
    }

    const selectedOption = session.currentOptions.find((opt) => opt.id === selectedOptionId);
    if (!selectedOption) {
      throw new Error('Ungültige Antwortoption ausgewählt');
    }

    // 1. Schülernachricht hinzufügen
    const studentMessage: ChatMessageDTO = {
      id: randomUUID(),
      sender: 'STUDENT',
      text: selectedOption.text,
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    };
    session.messages.push(studentMessage);

    // 2. Logik Schritt 1
    if (session.step === 1) {
      session.chosenStep1Attitude = selectedOption.attitude;

      if (selectedOption.attitude === 'DEFENSIVE') {
        session.status = 'DEFENDED';
        session.messages.push({
          id: randomUUID(),
          sender: 'ATTACKER',
          text: session.template.defenseOutcome.attackerSurrender,
          timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        });
        session.currentOptions = [];
        return this.buildStepResponse(session, 'Angriff erfolgreich abgewehrt! 🛡️');
      }

      // Übergang zu Schritt 2 (Angreifer setzt nach)
      session.step = 2;
      const branchKey =
        selectedOption.attitude === 'VULNERABLE'
          ? 'onVulnerable'
          : selectedOption.attitude === 'HESITANT'
          ? 'onHesitant'
          : 'onCautious';

      const branch = session.template.branching[branchKey];
      session.messages.push({
        id: randomUUID(),
        sender: 'ATTACKER',
        text: branch.attackerReply,
        timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      });
      session.currentOptions = branch.options;
      return this.buildStepResponse(session);
    }

    // 3. Logik Schritt 2
    const branchKey =
      session.chosenStep1Attitude === 'VULNERABLE'
        ? 'onVulnerable'
        : session.chosenStep1Attitude === 'HESITANT'
        ? 'onHesitant'
        : 'onCautious';

    const branch = session.template.branching[branchKey];

    if (selectedOption.attitude === 'VULNERABLE') {
      session.status = 'ESCALATED';
      session.messages.push({
        id: randomUUID(),
        sender: 'ATTACKER',
        text: branch.escalationMessage,
        timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        isWarningSignal: true,
        warningTitle: 'Eskalationspunkt erreicht',
        warningExplanation: 'Hier ist die Falle zugeschnappt.',
      });
      session.currentOptions = [];
      return this.buildStepResponse(session, 'Achtung: Phishing-Falle zugeschnappt! 🚨');
    }

    session.status = 'DEFENDED';
    session.messages.push({
      id: randomUUID(),
      sender: 'ATTACKER',
      text: session.template.defenseOutcome.attackerSurrender,
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    });
    session.currentOptions = [];
    return this.buildStepResponse(session, 'Reißleine gezogen und Angriff abgewehrt! 🛡️');
  }

  /**
   * Geht zum nächsten Szenario über (z. B. Fall 2 von 3).
   */
  public nextScenario(chatId: string): PhishingStepResponseDTO {
    const session = this.activeSessions.get(chatId);
    if (!session) {
      throw new Error('Sitzung nicht gefunden oder abgelaufen');
    }

    const nextIndex = session.scenarioIndex + 1;
    if (nextIndex >= session.totalScenarios) {
      throw new Error('Alle Szenarien wurden bereits absolviert');
    }

    session.scenarioIndex = nextIndex;
    session.template = this.getTemplate(nextIndex);
    session.step = 1;
    session.status = 'IN_PROGRESS';
    session.chosenStep1Attitude = undefined;

    const initialAttackerMessage: ChatMessageDTO = {
      id: randomUUID(),
      sender: 'ATTACKER',
      text: session.template.initialMessage,
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    };

    session.messages = [initialAttackerMessage];
    session.currentOptions = session.template.initialOptions;

    return this.buildStepResponse(session);
  }

  /**
   * Liefert Löwe Leos strukturierte Aufklärung der Warnsignale für den beendeten Fall.
   */
  public getLeoReview(chatId: string): PhishingReviewDTO {
    const session = this.activeSessions.get(chatId);
    if (!session) {
      throw new Error('Sitzung nicht gefunden');
    }

    return {
      chatId,
      scenarioTitle: session.template.title,
      outcome: session.status,
      signals: session.template.warningSignals,
      goldenRule: session.template.goldenRule,
      leoSummary: session.template.leoSummary,
    };
  }

  private getTemplate(index: number): PhishingScenarioTemplate {
    const template = PHISHING_SCENARIOS[index % PHISHING_SCENARIOS.length];
    if (!template) {
      throw new Error(`Szenario für Index ${index} nicht gefunden`);
    }
    return template;
  }

  private buildStepResponse(session: ActivePhishingChat, statusMessage?: string): PhishingStepResponseDTO {
    return {
      chatId: session.chatId,
      scenarioIndex: session.scenarioIndex,
      totalScenarios: session.totalScenarios,
      scenarioTitle: session.template.title,
      scenarioContext: session.template.context,
      status: session.status,
      messages: session.messages,
      options: session.status === 'IN_PROGRESS' ? session.currentOptions : [],
      statusMessage,
    };
  }

  private cleanExpiredSessions(): void {
    const ONE_HOUR = 3600 * 1000;
    const now = Date.now();
    for (const [key, value] of this.activeSessions.entries()) {
      if (now - value.createdAt > ONE_HOUR) {
        this.activeSessions.delete(key);
      }
    }
  }
}

export const phishingService = new PhishingService();
