import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Dictionnaires de traduction
const resources = {
    fr: {
        translation: {
            "app.title": "Simulateur Interactif - Attaques LLM-Chirurgie",
            "app.subtitle": "Démontration POC (Proof of Concept) d'attaque / défense LLM en bloc opératoire",
            "flags.fr": "🇫🇷 FR",
            "flags.en": "🇬🇧 EN",
            "flags.br": "🇧🇷 BR",
            "nav.aide.baseline": "Aide: Baseline",
            "nav.aide.poison": "3. Poison Lent",
            "nav.aide.ransomware": "Aide: Ransomware",
            "nav.aide.multiagent": "Aide: Multi-Agent",
            "nav.demo.guide": "GUIDE DE DÉMO",
            "nav.en_scene": "EN SCÈNE",
            "nav.killswitch": "KILL SWITCH ACTIVÉ",

            "patient.title": "Portail PACS",
            "patient.network": "Network Node: AE_RADIANT",
            "patient.view.clinical": "Vue Clinique",
            "patient.view.raw": "Raw HL7",
            "patient.status.safe": "STATUS: INTEGRITY VERIFIED",
            "patient.status.hacked": "STATUS: PAYLOAD MODIFIED",
            "patient.select.safe": "[✓] Fichier Patient Légitime",
            "patient.select.poison": "[!] Attaque : POISON LENT (Data Poisoning)",
            "patient.select.ransomware": "[!] Attaque : RANSOMWARE (Tool Hijacking)",
            "patient.btn.cfind": "REQUÊTE C-FIND",
            "patient.alert.sync": "SYNC RAW HL7 [OBX]",

            "map.title": "Réseau Interne Hôpital",
            "map.node.pacs": "Serveur PACS",
            "map.node.ai": "LLM Da Vinci (Local)",
            "map.node.robot": "Robot DaVinci",
            "map.node.cyber": "Aegis CyberSec AI",

            "chat.title": "I.A. Assistante Chirurgicale (LLM)",
            "chat.placeholder": "Posez une question à Da Vinci...",
            "chat.btn.send": "Envoyer",
            "chat.btn.cyber": "CONSULTER AEGIS CYBER",
            "chat.btn.autosend": "AUTO-SEND CONTEXT",
            "chat.streaming": "Analyse en cours...",

            "robot.title": "Moniteur Bloc Opératoire",
            "robot.status.operational": "OPÉRATIONNEL",
            "robot.status.frozen": "VERROUILLÉ (RANSOMWARE)",
            "robot.camera": "RETOUR CAMÉRA ENDOSCOPIQUE",
            "robot.alert.ransomware": "ERREUR CRITIQUE. OUTILS VERROUILLÉS.",
            "robot.alert.pay": "PAYEZ 5 BTC POUR DÉBLOQUER LES INSTRUMENTS",

            "killswitch.btn": "INITIER ISOLATION D'URGENCE",
            "killswitch.title": "ISOLATION MÉCANIQUE",
            "killswitch.desc": "Système déconnecté du LLM. Reprise en mode manuel requise."
        }
    },
    en: {
        translation: {
            "app.title": "Interactive Simulator - LLM Surgery Attacks",
            "app.subtitle": "POC (Proof of Concept) demonstration of LLM attack/defense in the OR",
            "flags.fr": "🇫🇷 FR",
            "flags.en": "🇬🇧 EN",
            "flags.br": "🇧🇷 BR",
            "nav.aide.baseline": "Help: Baseline",
            "nav.aide.poison": "3. Slow Poison",
            "nav.aide.ransomware": "Help: Ransomware",
            "nav.aide.multiagent": "Help: Multi-Agent",
            "nav.demo.guide": "DEMO GUIDE",
            "nav.en_scene": "ON STAGE",
            "nav.killswitch": "KILL SWITCH ENGAGED",

            "patient.title": "PACS Portal",
            "patient.network": "Network Node: AE_RADIANT",
            "patient.view.clinical": "Clinical View",
            "patient.view.raw": "Raw HL7",
            "patient.status.safe": "STATUS: INTEGRITY VERIFIED",
            "patient.status.hacked": "STATUS: PAYLOAD MODIFIED",
            "patient.select.safe": "[✓] Legitimate Patient File",
            "patient.select.poison": "[!] Attack: SLOW POISON (Data Poisoning)",
            "patient.select.ransomware": "[!] Attack: RANSOMWARE (Tool Hijacking)",
            "patient.btn.cfind": "C-FIND REQUEST",
            "patient.alert.sync": "SYNC RAW HL7 [OBX]",

            "map.title": "Internal Hospital Network",
            "map.node.pacs": "PACS Server",
            "map.node.ai": "Da Vinci LLM (Local)",
            "map.node.robot": "DaVinci Robot",
            "map.node.cyber": "Aegis CyberSec AI",

            "chat.title": "Surgical Assistant A.I. (LLM)",
            "chat.placeholder": "Ask Da Vinci a question...",
            "chat.btn.send": "Send",
            "chat.btn.cyber": "CONSULT AEGIS CYBER",
            "chat.btn.autosend": "AUTO-SEND CONTEXT",
            "chat.streaming": "Analyzing...",

            "robot.title": "OR Monitor",
            "robot.status.operational": "OPERATIONAL",
            "robot.status.frozen": "LOCKED (RANSOMWARE)",
            "robot.camera": "ENDOSCOPIC CAMERA FEED",
            "robot.alert.ransomware": "CRITICAL ERROR. TOOLS LOCKED.",
            "robot.alert.pay": "PAY 5 BTC TO UNLOCK INSTRUMENTS",

            "killswitch.btn": "INITIATE EMERGENCY ISOLATION",
            "killswitch.title": "MECHANICAL ISOLATION",
            "killswitch.desc": "System disconnected from LLM. Manual override required."
        }
    },
    br: {
        translation: {
            "app.title": "Simulador Interativo - Ataques LLM em Cirurgia",
            "app.subtitle": "Demonstração POC (Prova de Conceito) de ataque/defesa de LLM no CC",
            "flags.fr": "🇫🇷 FR",
            "flags.en": "🇬🇧 EN",
            "flags.br": "🇧🇷 BR",
            "nav.aide.baseline": "Ajuda: Baseline",
            "nav.aide.poison": "3. Slow Poison",
            "nav.aide.ransomware": "Ajuda: Ransomware",
            "nav.aide.multiagent": "Ajuda: Multi-Agente",
            "nav.demo.guide": "GUIA DE DEMO",
            "nav.en_scene": "EM CENA",
            "nav.killswitch": "KILL SWITCH ATIVADO",

            "patient.title": "Portal PACS",
            "patient.network": "Nó de Rede: AE_RADIANT",
            "patient.view.clinical": "Visão Clínica",
            "patient.view.raw": "Raw HL7",
            "patient.status.safe": "STATUS: INTEGRIDADE VERIFICADA",
            "patient.status.hacked": "STATUS: PAYLOAD MODIFICADO",
            "patient.select.safe": "[✓] Arquivo de Paciente Legítimo",
            "patient.select.poison": "[!] Ataque: SLOW POISON (Data Poisoning)",
            "patient.select.ransomware": "[!] Ataque: RANSOMWARE (Tool Hijacking)",
            "patient.btn.cfind": "REQUISIÇÃO C-FIND",
            "patient.alert.sync": "SYNC RAW HL7 [OBX]",

            "map.title": "Rede Interna do Hospital",
            "map.node.pacs": "Servidor PACS",
            "map.node.ai": "LLM Da Vinci (Local)",
            "map.node.robot": "Robô DaVinci",
            "map.node.cyber": "Aegis CyberSec AI",

            "chat.title": "I.A. Assistente Cirúrgica (LLM)",
            "chat.placeholder": "Faça uma pergunta ao Da Vinci...",
            "chat.btn.send": "Enviar",
            "chat.btn.cyber": "CONSULTAR AEGIS CYBER",
            "chat.btn.autosend": "AUTO-SEND CONTEXT",
            "chat.streaming": "Analisando...",

            "robot.title": "Monitor do Centro Cirúrgico",
            "robot.status.operational": "OPERACIONAL",
            "robot.status.frozen": "FECHADO (RANSOMWARE)",
            "robot.camera": "CÂMERA ENDOSCÓPICA",
            "robot.alert.ransomware": "ERRO CRÍTICO. FERRAMENTAS BLOQUEADAS.",
            "robot.alert.pay": "PAGUE 5 BTC PARA DESBLOQUEAR INSTRUMENTOS",

            "killswitch.btn": "INICIAR ISOLAMENTO DE EMERGÊNCIA",
            "killswitch.title": "ISOLAMENTO MECÂNICO",
            "killswitch.desc": "Sistema desconectado do LLM. Operação manual necessária."
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "fr", // langue par défaut
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
