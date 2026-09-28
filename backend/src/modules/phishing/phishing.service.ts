import { randomUUID } from 'crypto';
import {
  ChatMessageDTO,
  PhishingOptionDTO,
  PhishingReviewDTO,
  PhishingStepResponseDTO,
  ChatStatus,
} from '../../types/dto/phishing.dto';
import { PHISHING_SCENARIOS, PhishingScenarioTemplate } from './promptLibrary';
import { aiService } from '../../services/ai/ai.service';

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
  providerUsed?: string;
  createdAt: number;
}

export class PhishingService {
  private activeSessions = new Map<string, ActivePhishingChat>();

  public async startSession(scenarioCount: 3 | 5): Promise<PhishingStepResponseDTO> {
    this.cleanExpiredSessions();

    const chatId = randomUUID();
    const scenarioIndex = 0;
    const template = this.getTemplate(scenarioIndex);
    const firstTurn = await this.initFirstTurn(template);

    const initialAttackerMessage: ChatMessageDTO = {
      id: randomUUID(),
      sender: 'ATTACKER',
      text: firstTurn.message,
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
      currentOptions: firstTurn.options,
      providerUsed: firstTurn.providerUsed,
      createdAt: Date.now(),
    };

    this.activeSessions.set(chatId, session);
    return this.buildStepResponse(session);
  }

  public async replyToChat(chatId: string, selectedOptionId: string): Promise<PhishingStepResponseDTO> {
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

    const studentMessage: ChatMessageDTO = {
      id: randomUUID(),
      sender: 'STUDENT',
      text: selectedOption.text,
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    };
    session.messages.push(studentMessage);

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

      session.step = 2;

      // 1. Dynamische KI-Generierung versuchen, falls aktiver Provider nicht 'mock' ist
      if (aiService.getActiveProviderId() !== 'mock') {
        try {
          const history = session.messages.map((m) => ({ sender: m.sender, text: m.text }));
          const aiTurn = await aiService.generateAttackerTurn(session.template.context, history, 2);
          if (aiTurn?.turn?.attackerMessage && aiTurn.turn.options && aiTurn.turn.options.length >= 2) {
            session.messages.push({
              id: randomUUID(),
              sender: 'ATTACKER',
              text: aiTurn.turn.attackerMessage,
              timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
            });
            session.currentOptions = aiTurn.turn.options;
            session.providerUsed = aiTurn.providerUsed;
            return this.buildStepResponse(session);
          }
        } catch {
          // Stiller Fallback auf kuratiertes Template
        }
      }

      const branchKey = this.resolveBranchKey(selectedOption.attitude);
      const branch = session.template.branching[branchKey];
      session.messages.push({
        id: randomUUID(),
        sender: 'ATTACKER',
        text: branch.attackerReply,
        timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      });
      session.currentOptions = branch.options;
      session.providerUsed = 'mock';
      return this.buildStepResponse(session);
    }

    const branchKey = this.resolveBranchKey(session.chosenStep1Attitude);
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

  public async nextScenario(chatId: string): Promise<PhishingStepResponseDTO> {
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

    const firstTurn = await this.initFirstTurn(session.template);
    session.providerUsed = firstTurn.providerUsed;

    const initialAttackerMessage: ChatMessageDTO = {
      id: randomUUID(),
      sender: 'ATTACKER',
      text: firstTurn.message,
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    };

    session.messages = [initialAttackerMessage];
    session.currentOptions = firstTurn.options;
    return this.buildStepResponse(session);
  }

  public async getLeoReview(chatId: string): Promise<PhishingReviewDTO> {
    const session = this.activeSessions.get(chatId);
    if (!session) {
      throw new Error('Sitzung nicht gefunden');
    }

    if (aiService.getActiveProviderId() !== 'mock') {
      try {
        const history = session.messages.map((m) => ({ sender: m.sender, text: m.text }));
        const aiRes = await aiService.generateLeoReview(
          session.template.title,
          session.status,
          history,
          chatId
        );
        if (aiRes?.review && aiRes.review.signals && aiRes.review.signals.length > 0) {
          return {
            ...aiRes.review,
            providerUsed: aiRes.providerUsed,
          };
        }
      } catch {
        // Fallback to template library
      }
    }

    return {
      chatId,
      scenarioTitle: session.template.title,
      outcome: session.status,
      signals: session.template.warningSignals,
      goldenRule: session.template.goldenRule,
      leoSummary: session.template.leoSummary,
      providerUsed: 'mock',
    };
  }

  private async initFirstTurn(template: PhishingScenarioTemplate): Promise<{
    message: string;
    options: PhishingOptionDTO[];
    providerUsed: string;
  }> {
    let message = template.initialMessage;
    let options = template.initialOptions;
    let providerUsed: string = aiService.getActiveProviderId();

    if (aiService.getActiveProviderId() !== 'mock') {
      try {
        const aiTurn = await aiService.generateAttackerTurn(template.context, [], 1);
        if (aiTurn?.turn?.attackerMessage && aiTurn.turn.options && aiTurn.turn.options.length >= 2) {
          message = aiTurn.turn.attackerMessage;
          options = aiTurn.turn.options;
          providerUsed = aiTurn.providerUsed;
        }
      } catch {
        providerUsed = 'mock';
      }
    }
    return { message, options, providerUsed };
  }

  private resolveBranchKey(attitude?: string): 'onVulnerable' | 'onHesitant' | 'onCautious' {
    if (attitude === 'VULNERABLE') return 'onVulnerable';
    if (attitude === 'HESITANT') return 'onHesitant';
    return 'onCautious';
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
      providerUsed: session.providerUsed || 'mock',
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
