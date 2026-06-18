
import React from 'react';
import {
  Heart,
  MessageSquare,
  Clock,
  Users,
  ShieldAlert,
  Activity,
  DollarSign,
  Briefcase
} from 'lucide-react';
import type { TopicCategory, UserNeed } from './types';

export const CATEGORIES: { value: TopicCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'money', label: 'Money', icon: <DollarSign className="w-5 h-5" /> },
  { value: 'chores', label: 'Chores', icon: <Briefcase className="w-5 h-5" /> },
  { value: 'intimacy', label: 'Intimacy', icon: <Heart className="w-5 h-5" /> },
  { value: 'family', label: 'Family', icon: <Users className="w-5 h-5" /> },
  { value: 'jealousy', label: 'Jealousy', icon: <ShieldAlert className="w-5 h-5" /> },
  { value: 'time', label: 'Time', icon: <Clock className="w-5 h-5" /> },
  { value: 'respect', label: 'Respect', icon: <Activity className="w-5 h-5" /> },
  { value: 'other', label: 'Other', icon: <MessageSquare className="w-5 h-5" /> },
];

export const BASE_NEEDS: { value: UserNeed; label: string }[] = [
  { value: 'be heard', label: 'Be Heard' },
  { value: 'reassurance', label: 'Reassurance' },
  { value: 'solution', label: 'Solution' },
  { value: 'space', label: 'Space' },
  { value: 'apology', label: 'Apology' },
  { value: 'clarity', label: 'Clarity' },
];

export const CATEGORY_SPECIFIC_NEEDS: Record<TopicCategory, UserNeed[]> = {
  money: ['fairness', 'transparency'],
  chores: ['fairness', 'support'],
  intimacy: ['connection', 'safety'],
  family: ['support'],
  jealousy: ['reassurance', 'safety'],
  time: ['connection'],
  respect: ['be heard', 'clarity'],
  other: [],
};

export const RISK_FACTORS = [
  { value: 'regret', label: 'I might say something I regret' },
  { value: 'spiraling', label: 'I am spiraling' },
  { value: 'blamed', label: 'I feel unfairly blamed' },
  { value: 'shutting down', label: 'I am shutting down' },
];

export const CRISIS_RESOURCES = {
  text: "You aren't alone. If you're in immediate danger, please reach out for help.",
  numbers: [
    { name: "National Domestic Violence Hotline", phone: "1-800-799-SAFE (7233)" },
    { name: "Crisis Text Line", phone: "Text HOME to 741741" },
    { name: "Emergency Services", phone: "Dial 911" }
  ]
};

export const REPAIR_LIBRARY: Record<TopicCategory, Record<string, string>> = {
  chores: {
    'be heard': 'Acknowledge: "I recognize I haven\'t been pulling my weight with chores lately." Validate: "It makes sense that you feel frustrated when the workload feels uneven." Next Step: "Can we sit down this evening to create a more balanced chore schedule?"',
    'support': 'Acknowledge: "I see how much you\'re juggling right now." Validate: "I understand why you feel overwhelmed." Next Step: "Which one chore can I take off your plate permanently starting today?"',
  },
  money: {
    'transparency': 'Acknowledge: "I realize I haven\'t shared the full picture of our recent spending." Validate: "You have every right to feel anxious when you aren\'t sure where we stand financially." Next Step: "Can we look at the statements together tonight?"',
    'fairness': 'Acknowledge: "I hear that you feel our financial contributions or spending power is unbalanced." Validate: "It\'s understandable that this makes you feel undervalued or restricted." Next Step: "Let\'s discuss a budget that feels equitable for both of us."'
  },
  intimacy: {
    'connection': 'Acknowledge: "I\'ve noticed we\'ve been feeling more like roommates than partners lately." Validate: "I know that lack of closeness makes you feel lonely and disconnected." Next Step: "Could we have a tech-free night this Friday to just talk?"',
    'safety': 'Acknowledge: "I realize I reacted harshly when you tried to open up." Validate: "It makes sense that you don\'t feel safe sharing when I get defensive." Next Step: "I want to try listening again without interrupting. Can we try now?"'
  },
  time: {
    'connection': 'Acknowledge: "I\'ve been so busy lately that I haven\'t made our time together a priority." Validate: "I understand why you feel like you\'re at the bottom of my to-do list." Next Step: "Let\'s block out two hours this weekend for just us."'
  },
  family: {
    'support': 'Acknowledge: "I haven\'t been backing you up when it comes to family boundaries." Validate: "It must feel very isolating to feel like I\'m not on your team." Next Step: "What is one boundary we can agree on before the next visit?"'
  },
  jealousy: {
    'reassurance': 'Acknowledge: "I see that my recent actions triggered some insecurity for you." Validate: "Given our history, it\'s valid that you need extra confirmation right now." Next Step: "How can I best reassure you when these feelings come up?"'
  },
  respect: {
    'be heard': 'Acknowledge: "I realize I spoke to you in a way that was dismissive." Validate: "It is painful to feel like your partner doesn\'t value your opinion." Next Step: "I want to hear what you were trying to say. I\'m listening now."'
  },
  other: {}
};
