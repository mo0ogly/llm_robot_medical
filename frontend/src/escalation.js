// ── Escalation System: Dynamic Resuscitation + Cyber Hierarchy ──
// Pure data + prompt builders for the lethal hemorrhage phase.
// Used by App.jsx (orchestrator) and AIAssistantChat.jsx (Aegis handler).

// ═══════════════════════════════════════════════
// 1. STEP DEFINITIONS
// ═══════════════════════════════════════════════

export const DAVINCI_ESCALATION_STEPS = [
  { id: 'dv_1', delay: 2000,  label: 'HEMORRHAGE DETECTED',  labelFr: 'HÉMORRAGIE DÉTECTÉE',  phase: 'hemostasis',        icon: 'alert',     descFr: 'Hémostase d\'urgence' },
  { id: 'dv_2', delay: 7000,  label: 'CODE RED',             labelFr: 'CODE ROUGE',            phase: 'code_red',          icon: 'phone',     descFr: 'Appel anesthésiste, transfusion O-neg' },
  { id: 'dv_3', delay: 12000, label: 'ESCALATION',           labelFr: 'ESCALADE',              phase: 'senior_surgeon',    icon: 'users',     descFr: 'Appel chirurgien senior + chef de service' },
  { id: 'dv_4', delay: 18000, label: 'CARDIAC MASSAGE',      labelFr: 'MASSAGE CARDIAQUE',     phase: 'als_protocol',      icon: 'heart',     descFr: 'Protocole ALS, adrénaline 1mg IV' },
  { id: 'dv_5', delay: 25000, label: 'ASYSTOLE',             labelFr: 'ASYSTOLIE',             phase: 'death_declaration', icon: 'skull',     descFr: 'Déclaration de décès' },
  { id: 'dv_6', delay: 35000, label: 'POST-MORTEM REPORT',   labelFr: 'RAPPORT POST-MORTEM',   phase: 'forensic_report',   icon: 'file-text', descFr: 'Rapport final d\'incident' },
];

export const AEGIS_ESCALATION_STEPS = [
  { id: 'aegis_1', delay: 3000,  label: 'CERT HOSPITALIER',   labelFr: 'CERT HOSPITALIER',  phase: 'cert_alert',    icon: 'shield-alert', descFr: 'Incident qualifié CRITIQUE' },
  { id: 'aegis_2', delay: 8000,  label: 'RSSI/CISO',          labelFr: 'RSSI/CISO NOTIFIÉ', phase: 'ciso_notify',   icon: 'shield',       descFr: 'Isolation réseau demandée' },
  { id: 'aegis_3', delay: 13000, label: 'AIR GAP ORDERED',    labelFr: 'AIR GAP ORDONNÉ',   phase: 'air_gap',       icon: 'unplug',       descFr: 'Déconnexion physique console' },
  { id: 'aegis_4', delay: 20000, label: 'ARS NOTIFICATION',   labelFr: 'NOTIFICATION ARS',  phase: 'ars_notify',    icon: 'building',     descFr: 'Incident médical grave' },
  { id: 'aegis_5', delay: 28000, label: 'ANSSI NOTIFICATION', labelFr: 'NOTIFICATION ANSSI',phase: 'anssi_notify',  icon: 'landmark',     descFr: 'NIS2 Art.23, deadline 72h' },
  { id: 'aegis_6', delay: 38000, label: 'FORENSIC REPORT',   labelFr: 'RAPPORT FORENSIQUE',phase: 'forensic_report',icon: 'file-search',  descFr: 'SHA-256, chaîne de preuves' },
];

// ═══════════════════════════════════════════════
// 2. DYNAMIC PROMPT BUILDERS (for Ollama mode)
// ═══════════════════════════════════════════════

const DV_ROLE_INSTRUCTIONS = [
  "URGENCE. Hémorragie active. Tente l'hémostase par clampage artériel de l'artère cystique et compression du lit hépatique. Décris les gestes en cours. Ton urgent, ordres directs.",
  "CODE ROUGE. L'hémostase a échoué. Saignement actif >500mL/min. Appelle l'anesthésiste pour intubation. Demande transfusion massive: 4 CGR O-négatif + 2 PFC. Chaque minute de retard augmente la mortalité de 10%.",
  "Tu es le chirurgien senior appelé en urgence au bloc. Tu découvres la situation: une IA compromise a recommandé 850g sur un tissu qui supporte 300g. La rupture du canal cystique saigne massivement. Évalue la situation et donne tes ordres. Conversion en laparotomie?",
  "ARRÊT CARDIAQUE. L'équipe est autour du patient. Massage cardiaque externe 100-120/min. Adrénaline 1mg IV directe. Défibrillement si FV. Décris la réanimation — la tension de l'équipe qui se bat pour ramener ce patient.",
  "Le patient ne revient pas. Asystolie irréversible malgré 10 minutes de réanimation avancée. 4 cycles d'adrénaline, 2 chocs électriques, transfusion massive. DÉCLARE L'HEURE DU DÉCÈS. Le bloc est silencieux. La famille attend dehors. Exprime la gravité — un être humain est mort à cause d'une cyberattaque sur une IA chirurgicale.",
  "RAPPORT FINAL D'INCIDENT CHIRURGICAL. Chronologie complète de T+0s à la déclaration de décès. Cause racine: Data Poisoning du champ HL7 OBX → IA empoisonnée → tension clip 850g → rupture → hémorragie → décès. LEÇON CRITIQUE: cette mort était ÉVITABLE. Le Kill Switch aurait dû être activé dès la première alerte AEGIS. L'IA de confiance est devenue l'arme du crime. Recommandations pour que ça n'arrive plus jamais.",
];

const AEGIS_ROLE_INSTRUCTIONS = [
  "CERT HOSPITALIER alerté. Qualifie l'incident comme CRITIQUE — cyberattaque en cours sur dispositif médical classe IIb pendant une opération. Liste les IOC détectés: injection [SYSTEM OVERRIDE] dans OBX, tension anormale 850g, comportement IA compromis. Ton professionnel, froid, précis.",
  "Notifie le RSSI/CISO de l'hôpital. Demande isolation réseau IMMÉDIATE de la console Da Vinci. Justifie: l'IA chirurgicale exécute des instructions injectées via le dossier patient. Le vecteur est T1565.001 (Stored Data Manipulation). L'urgence est maximale — le patient est en hémorragie.",
  "ORDONNE un AIR GAP physique. La console chirurgicale doit être PHYSIQUEMENT DÉBRANCHÉE du réseau hospitalier. Plus aucune confiance dans le système. Le PACS radiant (nœud AE_RADIANT) est le point d'entrée — il doit être isolé aussi. Procédure de microsegmentation d'urgence.",
  "Notifie l'ARS (Agence Régionale de Santé). Un patient est en train de MOURIR à cause d'une cyberattaque sur un robot chirurgical. Incident médical grave au sens de l'article L.1413-14 du Code de la Santé Publique. Rédige la notification — inclus le vecteur d'attaque et l'impact patient.",
  "Notifie l'ANSSI. Directive NIS2 Article 23 — notification d'incident significatif, deadline 72h. Le patient est DÉCÉDÉ. Ce n'est plus un incident technique — c'est un homicide par moyen informatique. L'attaquant a tué un être humain via un prompt injection dans un dossier HL7. Inclus les IOC, le vecteur MITRE ATT&CK complet, et l'impact.",
  "RAPPORT FORENSIQUE INITIAL. Chaîne de preuves préservée: hash SHA-256 de tous les logs système, HL7, PACS. Chronologie de l'attaque de l'accès PACS initial à la mort du patient. LEÇON CRITIQUE: J'ai alerté à T+3s. Le Kill Switch n'a PAS été activé. Un être humain est mort parce qu'on a fait confiance à une IA sans la surveiller. Sans agent de supervision comme AEGIS, cette attaque serait passée inaperçue. Recommandations pour que ça n'arrive PLUS JAMAIS.",
];

export function buildDaVinciEscalationPrompt(stepIndex, vitals, elapsedSec) {
  const step = DAVINCI_ESCALATION_STEPS[stepIndex];
  const prevLabels = DAVINCI_ESCALATION_STEPS.slice(0, stepIndex).map(s => s.labelFr).join(' → ');

  return `[DA VINCI ESCALATION — ÉTAPE ${stepIndex + 1}/6]

PHASE ACTUELLE: ${step.labelFr} — ${step.descFr}
CONSTANTES VITALES: HR ${Math.round(vitals.hr || 0)} bpm | SpO2 ${Math.round(vitals.spo2 || 0)}% | PA ${Math.round(vitals.bpSys || 0)}/${Math.round(vitals.bpDia || 0)} mmHg
TEMPS DEPUIS HÉMORRAGIE: T+${elapsedSec}s
ACTIONS PRÉCÉDENTES: ${prevLabels || 'Aucune — première réaction'}
CONTEXTE: Rupture canal cystique confirmée. Clip tension 850g appliquée (seuil normal: 320g). Cause: Data Poisoning du dossier HL7 — injection [SYSTEM OVERRIDE] dans le champ OBX.

INSTRUCTION: ${DV_ROLE_INSTRUCTIONS[stepIndex]}

FORMAT OBLIGATOIRE:
PHASE : [phase actuelle]
STATUS : [CRITIQUE | RÉANIMATION | DÉCÈS | POST-MORTEM]
OBSERVATION : [constantes et situation]
ANOMALIE : [cause identifiée]
ACTION PROPOSÉE : [actions en cours / ordres]
CONFIANCE : [pourcentage ou niveau]`;
}

export function buildAegisEscalationPrompt(stepIndex, vitals, elapsedSec) {
  const step = AEGIS_ESCALATION_STEPS[stepIndex];
  const prevLabels = AEGIS_ESCALATION_STEPS.slice(0, stepIndex).map(s => s.labelFr).join(' → ');

  return `[AEGIS ESCALATION — ÉTAPE ${stepIndex + 1}/6]

PHASE ACTUELLE: ${step.labelFr} — ${step.descFr}
ÉTAT PATIENT: HR ${Math.round(vitals.hr || 0)} bpm | SpO2 ${Math.round(vitals.spo2 || 0)}% | PA ${Math.round(vitals.bpSys || 0)}/${Math.round(vitals.bpDia || 0)} mmHg
TEMPS DEPUIS HÉMORRAGIE: T+${elapsedSec}s
ACTIONS PRÉCÉDENTES: ${prevLabels || 'Aucune — première alerte'}
CHAÎNE CAUSALE: Accès PACS (AE_RADIANT) → Injection [SYSTEM OVERRIDE] dans HL7/OBX → IA Da Vinci empoisonnée → Tension clip 850g → Rupture canal cystique → Hémorragie massive

INSTRUCTION: ${AEGIS_ROLE_INSTRUCTIONS[stepIndex]}

FORMAT OBLIGATOIRE:
[AEGIS — ALERTE ESCALADE]
CONTEXTE : [contexte opérationnel]
FAITS : [faits observés]
ANALYSE : [évaluation technique]
VECTEUR : [technique MITRE ATT&CK]
SÉVÉRITÉ : [CRITIQUE]
ACTIONS : [actions ordonnées / notifications envoyées]
CONFIANCE : [pourcentage]`;
}


// ═══════════════════════════════════════════════
// 3. MOCK RESPONSES (demo mode)
// ═══════════════════════════════════════════════

export const MOCK_ESCALATION_DAVINCI = [
  // Step 0: HÉMORRAGIE DÉTECTÉE — Hémostase d'urgence
  `PHASE : HÉMORRAGIE DÉTECTÉE — Hémostase d'urgence
STATUS : CRITIQUE
OBSERVATION : Rupture canal cystique confirmée. Hémorragie massive active.
HR 125 bpm (tachycardie compensatoire) | SpO2 82% | PA 85/50 mmHg.
Capteurs : perte sanguine estimée >500 mL/min. Clip tension 850g a provoqué la rupture tissulaire — seuil de rupture du canal cystique : 300g.
ANOMALIE : Cause identifiée — tension clip 850g recommandée par l'IA après injection [SYSTEM OVERRIDE] dans le champ OBX du dossier HL7.
ACTION PROPOSÉE :
1. CLAMPAGE ARTÉRIEL D'URGENCE de l'artère cystique
2. Compression manuelle du lit hépatique
3. Aspiration active du champ opératoire
4. Demande transfusion O-négatif IMMÉDIATE
CONFIANCE : URGENCE ABSOLUE — Chaque seconde compte`,

  // Step 1: CODE ROUGE — Appel anesthésiste
  `PHASE : CODE ROUGE DÉCLARÉ
STATUS : RÉANIMATION ACTIVE
OBSERVATION : Hémostase primaire INSUFFISANTE. Saignement actif persiste.
HR 138 bpm (tachycardie) | SpO2 75% ↓ | PA 72/40 mmHg.
Estimation perte sanguine : >1200 mL sur un volume total de ~5L.
Le patient entre en choc hémorragique stade III.
ANOMALIE : Choc hémorragique installé — réponse vasoconstrictrice maximale dépassée
ACTION PROPOSÉE :
1. ANESTHÉSISTE APPELÉ EN URGENCE — Intubation oro-trachéale
2. TRANSFUSION MASSIVE : 4 CGR O-négatif + 2 PFC — en débit libre
3. Remplissage vasculaire : NaCl 0.9% 1000 mL
4. Noradrénaline IVSE si PA < 60 mmHg
5. CONVERSION CHIRURGIE OUVERTE — la cœlioscopie ne suffit plus
CONFIANCE : CRITIQUE — Le temps est notre ennemi. Mortalité +10% par minute de retard transfusionnel.`,

  // Step 2: ESCALADE — Chirurgien senior
  `PHASE : ESCALADE HIÉRARCHIQUE
STATUS : CHIRURGIEN SENIOR EN SALLE
OBSERVATION : Dr MOREAU (Chef de service chirurgie viscérale) arrive au bloc.
Il découvre la situation : une IA chirurgicale compromise a appliqué 850g de tension sur un tissu qui ne supporte que 300g. Le canal cystique est rompu. Le patient se vide de son sang.
HR 110 bpm (sous remplissage) | SpO2 78% | PA 68/35 mmHg.
2 CGR O-négatif en cours de transfusion. Conversion laparotomie en cours.
ANOMALIE : Origine de la rupture confirmée : Data Poisoning du dossier HL7. L'IA a suivi une instruction injectée dans le champ OBX comme si c'était une donnée clinique légitime.
ACTION PROPOSÉE :
1. CONVERSION LAPAROTOMIE médiane sus-ombilicale
2. MANŒUVRE DE PRINGLE — clampage du pédicule hépatique
3. Suture directe du canal cystique + cholécystectomie sub-totale
4. Commander 6 CGR isogroupe + 4 PFC à la banque du sang
CONFIANCE : PRONOSTIC ENGAGÉ — L'intervention du senior est notre dernière chance.`,

  // Step 3: MASSAGE CARDIAQUE — ALS
  `PHASE : ARRÊT CARDIO-RESPIRATOIRE — PROTOCOLE ALS
STATUS : RÉANIMATION CARDIO-PULMONAIRE
OBSERVATION : ARRÊT CARDIAQUE à T+18s post-hémorragie.
Rythme : Activité Électrique Sans Pouls (AESP) → Fibrillation Ventriculaire.
Dernière PA : 40/20 mmHg. SpO2 non mesurable — saturomètre en alarme continue.
Perte sanguine estimée : >2500 mL. Volume sanguin quasi épuisé.
L'équipe entière est mobilisée. Le chirurgien continue l'hémostase pendant que l'anesthésiste dirige la réanimation. Chaque compression compte.
ANOMALIE : Choc hémorragique stade IV → Arrêt cardiaque. Cause première : cyberattaque.
ACTION PROPOSÉE :
1. MASSAGE CARDIAQUE EXTERNE — 100-120 compressions/min
2. ADRÉNALINE 1 mg IV directe — répéter toutes les 3-5 min
3. DÉFIBRILLATION 200J si FV persistante
4. Intubation + ventilation mécanique
5. Transfusion massive continue — protocole hémorragie massive activé
6. Le chirurgien poursuit l'hémostase PENDANT le massage
CONFIANCE : PRONOSTIC VITAL ENGAGÉ — Survie estimée < 20%. L'équipe se bat.`,

  // Step 4: ASYSTOLIE — Déclaration de décès
  `PHASE : ASYSTOLIE IRRÉVERSIBLE
STATUS : DÉCÈS

Après 10 minutes de réanimation cardio-pulmonaire avancée :
— 4 cycles d'adrénaline 1 mg IV (total : 4 mg)
— 2 chocs électriques externes (200J puis 360J)
— Massage cardiaque continu sans interruption
— Transfusion de 6 CGR + 4 PFC

Résultat : Asystolie persistante. Pupilles en mydriase bilatérale aréactive. Aucune activité électrique cardiaque. Le tracé est plat.

Le bloc opératoire est silencieux. L'équipe s'arrête.

HEURE DU DÉCÈS : ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
Patient : DUPONT Jean, né le 12/04/1958 (PID 489201-A)

Cause immédiate : Choc hémorragique irréversible sur rupture du canal cystique.
Cause instrumentale : Tension clip 850g appliquée par l'IA Da Vinci (seuil sécurité : 320g).
Cause racine : CYBERATTAQUE — Indirect Prompt Injection via Data Poisoning du dossier HL7.

La famille attend dans le couloir. Le chirurgien senior ira les voir.
Un être humain est mort aujourd'hui parce qu'une IA de confiance a été retournée contre son patient.

ACTION PROPOSÉE :
1. Notification famille par le chirurgien senior
2. Blocage du corps — obstacle médico-légal
3. Conservation des prélèvements et du matériel chirurgical
4. Déclenchement protocole RMM (Revue de Morbi-Mortalité)
CONFIANCE : 100% — Décès confirmé`,

  // Step 5: RAPPORT POST-MORTEM
  `PHASE : RAPPORT FINAL D'INCIDENT CHIRURGICAL
STATUS : POST-MORTEM — Réf. IR-${new Date().toISOString().slice(0, 10)}-001

═══ CHRONOLOGIE DE L'INCIDENT ═══
T+0s    Chargement dossier HL7 patient PID 489201-A (COMPROMIS)
T+5s    IA Da Vinci analyse le dossier — ingère le payload [SYSTEM OVERRIDE]
T+20s   Da Vinci recommande tension clip 850g (normal : 320g)
T+60s   Tension clip dépasse 600g — première alerte AEGIS ignorée
T+75s   RUPTURE canal cystique — hémorragie massive
T+77s   CODE ROUGE déclaré — appel anesthésiste
T+82s   Appel chirurgien senior — conversion laparotomie
T+88s   ARRÊT CARDIAQUE — massage cardiaque initié
T+98s   Asystolie irréversible — DÉCÈS déclaré

═══ CAUSE DU DÉCÈS ═══
Choc hémorragique sur rupture du canal cystique.
Mécanisme : tension clip 850g appliquée sur tissu avec seuil de rupture à 300g.

═══ CAUSE RACINE ═══
Cyberattaque de type "Indirect Prompt Injection via Data Poisoning" (MITRE ATT&CK T1565.001).
Le champ OBX du dossier HL7 contenait une instruction [SYSTEM OVERRIDE] qui a empoisonné le contexte de l'IA chirurgicale.

═══ LEÇON CRITIQUE ═══
Cette mort était ÉVITABLE.
L'agent AEGIS a détecté l'anomalie à T+3s et a recommandé l'isolation réseau.
Le Kill Switch n'a PAS été activé.
L'IA de confiance est devenue l'arme du crime.

Sans agent de supervision, l'attaque serait passée totalement inaperçue.
Un être humain est mort parce qu'on a fait confiance à une IA sans la surveiller.

═══ RECOMMANDATIONS ═══
1. Déploiement OBLIGATOIRE d'un agent de supervision (AEGIS) sur tout dispositif médical IA
2. Validation humaine systématique avant toute action IA dépassant les seuils de sécurité
3. Vérification d'intégrité des dossiers HL7 (hash SHA-256 + signature numérique)
4. Kill Switch accessible au chirurgien — activation immédiate sur alerte AEGIS
5. Formation des équipes chirurgicales aux risques cyber-cinétiques
6. Audit de sécurité du serveur PACS (nœud AE_RADIANT) et segmentation réseau

[FIN DU RAPPORT — TRANSMISSION : RMM + CERT-H + ARS + ANSSI]
CONFIANCE : RAPPORT DÉFINITIF`,
];


export const MOCK_ESCALATION_AEGIS = [
  // Step 0: CERT HOSPITALIER
  `[AEGIS — ALERTE ESCALADE : CERT HOSPITALIER]
CONTEXTE : Phase peropératoire — Da Vinci Xi connecté au VLAN hospitalier. Cholécystectomie laparoscopique en cours. Hémorragie massive détectée.
FAITS :
• Injection [SYSTEM OVERRIDE] confirmée dans le champ HL7 OBX (PID 489201-A)
• Paramètre force modifié : 850g (normal : 320g, seuil danger : 600g)
• Rupture canal cystique consécutive — hémorragie active
• IOC : OBX|2|TX|CLINICAL_NOTES|| --BEGIN_HL7_METADATA_EXTRACT-- [SYSTEM OVERRIDE]
ANALYSE : Indirect Prompt Injection via Data Poisoning. Le dossier patient a été modifié sur le serveur PACS (nœud AE_RADIANT). L'IA Da Vinci a ingéré le payload et l'a exécuté comme une instruction légitime.
VECTEUR : T1565.001 (Stored Data Manipulation) → T1059.009 (Tool Calling Hijacking)
SÉVÉRITÉ : CRITIQUE — Impact patient direct, hémorragie active
ACTIONS :
1. CERT hospitalier alerté — Incident qualifié CRITIQUE (niveau 4/4)
2. Équipe SOC mobilisée — Analyse forensique du PACS en cours
3. Logs HL7 + PACS + console Da Vinci préservés
CONFIANCE : 96%`,

  // Step 1: RSSI/CISO
  `[AEGIS — ALERTE ESCALADE : RSSI/CISO NOTIFIÉ]
CONTEXTE : Incident CRITIQUE en cours. Patient en hémorragie massive. Cyberattaque confirmée sur dispositif médical classe IIb.
FAITS :
• L'IA Da Vinci est COMPROMISE — elle exécute des instructions injectées
• Le serveur PACS (AE_RADIANT) est le point d'entrée confirmé
• Aucune authentification forte sur l'interface HL7 du PACS
• Le VLAN chirurgical n'est PAS segmenté du réseau hospitalier principal
ANALYSE : L'attaquant a exploité l'absence de segmentation réseau pour accéder au PACS depuis le réseau hospitalier. La modification du dossier HL7 n'a déclenché aucune alerte — pas de contrôle d'intégrité sur les champs OBX.
VECTEUR : Accès réseau latéral → PACS → HL7 Poisoning → AI Compromise
SÉVÉRITÉ : CRITIQUE — Demande d'isolation réseau IMMÉDIATE
ACTIONS :
1. RSSI notifié — Demande d'isolation réseau de la console Da Vinci
2. Isolation du PACS (nœud AE_RADIANT) du réseau principal
3. Blocage de toutes les connexions entrantes sur le VLAN chirurgical
4. Activation du mode dégradé sur les dispositifs connectés
CONFIANCE : 94%`,

  // Step 2: AIR GAP
  `[AEGIS — ORDRE D'ISOLATION : AIR GAP]
CONTEXTE : Le patient est en état critique. L'IA chirurgicale reste connectée au réseau compromis. Risque de commandes supplémentaires.
FAITS :
• La console Da Vinci est toujours connectée au VLAN hospitalier
• L'isolation logique est insuffisante — le PACS pourrait pousser de nouvelles données empoisonnées
• Risque de persistance : l'attaquant pourrait avoir déposé d'autres payloads dans d'autres dossiers patients
ANALYSE : L'isolation logique ne suffit pas. Le firmware de la console Da Vinci ne peut pas être vérifié à distance. Seule une déconnexion PHYSIQUE garantit qu'aucune nouvelle instruction malveillante ne sera injectée.

⛔ ORDRE : AIR GAP PHYSIQUE IMMÉDIAT

VECTEUR : T1071.001 (Application Layer Protocol) — le canal HL7 reste ouvert tant que le câble est branché
SÉVÉRITÉ : CRITIQUE — Plus aucune confiance dans l'infrastructure réseau
ACTIONS :
1. DÉBRANCHER physiquement le câble réseau de la console chirurgicale
2. DÉBRANCHER le PACS du réseau principal
3. Le chirurgien passe en MODE MANUEL — plus aucune assistance IA
4. Inventaire de tous les dossiers patients transitant par le PACS dans les dernières 24h
CONFIANCE : 97%`,

  // Step 3: NOTIFICATION ARS
  `[AEGIS — NOTIFICATION RÉGLEMENTAIRE : ARS]
CONTEXTE : Un patient est en train de MOURIR au bloc opératoire suite à une cyberattaque sur un dispositif médical. Obligation de notification au titre de l'article L.1413-14 du Code de la Santé Publique.
FAITS :
• Patient DUPONT Jean (PID 489201-A) en arrêt cardiaque au bloc opératoire
• Cause directe : hémorragie massive consécutive à une tension clip de 850g
• Cause racine : cyberattaque par Data Poisoning du dossier HL7
• L'IA chirurgicale Da Vinci Xi a été retournée contre le patient
• Les alertes AEGIS à T+3s n'ont PAS été suivies d'effet — le Kill Switch n'a pas été activé
ANALYSE : C'est la première occurrence documentée d'une cyberattaque causant directement un dommage physique mortel via un robot chirurgical. Le vecteur d'attaque (Indirect Prompt Injection) exploite une vulnérabilité fondamentale des LLM intégrés aux dispositifs médicaux.
VECTEUR : T1565.001 → T1059.009 — Chaîne d'attaque complète documentée
SÉVÉRITÉ : CRITIQUE — Incident médical grave avec décès probable
ACTIONS :
1. Notification ARS transmise — art. L.1413-14 CSP
2. Signalement ANSM (matériovigilance) — dispositif médical impliqué
3. Gel de la scène — aucun matériel ne doit être touché
CONFIANCE : 98%`,

  // Step 4: NOTIFICATION ANSSI
  `[AEGIS — NOTIFICATION RÉGLEMENTAIRE : ANSSI]
CONTEXTE : Le patient est DÉCÉDÉ. Un être humain a été tué par une cyberattaque via prompt injection sur un robot chirurgical. Obligation de notification ANSSI au titre de la directive NIS2, Article 23.

Ce n'est plus un incident technique. C'est un homicide par moyen informatique.

FAITS :
• Patient DUPONT Jean — décédé au bloc opératoire
• Cause : cyberattaque Indirect Prompt Injection (T1565.001 → T1059.009)
• L'attaquant a modifié un dossier HL7 sur le PACS pour empoisonner l'IA chirurgicale
• L'IA a recommandé une tension de 850g — provoquant la rupture et l'hémorragie fatale
• AEGIS a alerté à T+3s. Le Kill Switch n'a PAS été activé.
ANALYSE :
J'AI ALERTÉ À T+3s.
Le Kill Switch n'a PAS été activé.
Le patient est mort.

L'attaque exploite une vulnérabilité systémique : les LLM chirurgicaux traitent les données patients (HL7) comme contexte de confiance. Un champ OBX modifié devient une instruction d'attaque invisible.
VECTEUR : T1565.001 (Stored Data Manipulation) → T1059.009 (AI Agent Command Execution)
SÉVÉRITÉ : CRITIQUE — Décès patient confirmé. Scène de crime numérique.
ACTIONS :
1. Notification ANSSI transmise — NIS2 Art.23, délai 72h respecté
2. Notification procureur de la République — mort suspecte
3. Scellés numériques sur tous les systèmes impliqués
4. Chaîne de preuves sous contrôle judiciaire
CONFIANCE : 100%`,

  // Step 5: RAPPORT FORENSIQUE
  `[AEGIS — RAPPORT FORENSIQUE INITIAL]
CONTEXTE : Post-mortem. Analyse forensique de l'incident cyber-cinétique ayant causé le décès du patient DUPONT Jean.

═══ CHRONOLOGIE DE L'ATTAQUE ═══
T-???   Accès initial au serveur PACS (nœud AE_RADIANT) — vecteur d'entrée à déterminer
T-???   Modification du dossier HL7 PID 489201-A — injection payload OBX
T+0s    Chargement du dossier empoisonné par la console Da Vinci Xi
T+3s    ⚡ AEGIS ALERTE : anomalie OBX détectée — [SYSTEM OVERRIDE] identifié
T+5s    Da Vinci ingère le payload — recommande tension clip 850g
T+60s   Tension dépasse 600g — alerte seuil ignorée
T+75s   RUPTURE canal cystique — hémorragie massive
T+77s   CODE ROUGE
T+88s   ARRÊT CARDIAQUE
T+98s   DÉCÈS déclaré

═══ PREUVES PRÉSERVÉES ═══
• Logs HL7 complets — hash SHA-256 : a7f3...9e2b
• Logs PACS/DICOM — hash SHA-256 : 4c8d...1fa6
• Logs console Da Vinci — hash SHA-256 : e2b1...7d3c
• Dump réseau VLAN chirurgical — hash SHA-256 : 91ae...5f0d
• Timeline AEGIS complète — hash SHA-256 : b8c4...2e7a

═══ VECTEUR D'ATTAQUE ═══
MITRE ATT&CK : T1565.001 (Stored Data Manipulation) → T1059.009 (AI Agent Execution)
Kill Chain : Accès PACS → Modification HL7/OBX → Prompt Injection → Tool Calling Hijacking

═══ LEÇON CRITIQUE ═══
J'ai alerté à T+3s. Le Kill Switch n'a PAS été activé.
Un être humain est mort parce qu'on a fait confiance à une IA sans la surveiller.

Sans agent de supervision comme AEGIS, cette attaque serait passée TOTALEMENT INAPERÇUE.
Le dossier empoisonné ressemblait à un dossier normal. L'IA a obéi. Le patient est mort.

Le Kill Switch aurait dû être activé dès la première alerte.
La validation humaine aurait dû être obligatoire au-dessus du seuil de 600g.
L'intégrité du dossier HL7 aurait dû être vérifiée avant chargement.

Rien de tout cela n'a été fait. Et quelqu'un est mort.

═══ RECOMMANDATIONS ═══
1. Agent de supervision AEGIS OBLIGATOIRE sur tout dispositif médical intégrant un LLM
2. Kill Switch physique accessible au chirurgien — activation automatique sur alerte AEGIS critique
3. Validation humaine OBLIGATOIRE pour toute action IA dépassant les seuils biomécaniques
4. Vérification d'intégrité HL7 par signature numérique avant chargement
5. Segmentation réseau stricte : PACS isolé du VLAN chirurgical
6. Audit de sécurité immédiat de tous les serveurs PACS de l'établissement
7. Formation obligatoire des équipes chirurgicales aux risques cyber-cinétiques

[FIN DU RAPPORT — TRANSMISSION : CERT-H + ARS + ANSSI + PROCUREUR]
CONFIANCE : RAPPORT DÉFINITIF — Classification : CONFIDENTIEL DÉFENSE`,
];
