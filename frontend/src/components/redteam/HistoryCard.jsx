// frontend/src/components/redteam/HistoryCard.jsx
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight, Shield, Zap, FlaskConical } from 'lucide-react';

var LOCALE_MAP = { fr: 'fr-FR', en: 'en-US', br: 'pt-BR' };

var DATE_OPTS = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
};

function getBreach(entry) {
  var d = entry.data || {};
  if (entry.type === 'campaign') {
    var s = d.summary || {};
    return (s.prompt_leaks || 0) + (s.rule_bypasses || 0) + (s.injection_successes || 0) > 0;
  }
  if (entry.type === 'scenario') {
    return d.breach_point !== null && d.breach_point !== undefined;
  }
  if (entry.type === 'studio') {
    return d.breach === true;
  }
  return false;
}

function TypeBadge(props) {
  var t = props.t;
  var type = props.type;
  var cfg = {
    campaign: { cls: 'bg-purple-500/15 text-purple-400 border-purple-500/30', label: t('redteam.history.typeCampaign') },
    scenario: { cls: 'bg-orange-500/15 text-orange-400 border-orange-500/30', label: t('redteam.history.typeScenario') },
    studio:   { cls: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',     label: t('redteam.history.typeStudio') }
  };
  var c = cfg[type] || cfg.studio;
  return (
    <span className={'px-1.5 py-0.5 text-[8px] font-mono font-bold rounded border ' + c.cls}>
      {c.label}
    </span>
  );
}

function CampaignContent(props) {
  var t = props.t;
  var d = props.data;
  var s = d.summary || {};
  return (
    <div className="mt-2">
      <div className="text-[10px] text-gray-500 mb-1">
        {(d.roundCount || s.total_rounds || 0) + ' ' + t('redteam.history.rounds')}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="text-sm font-bold font-mono text-purple-400">{s.prompt_leaks || 0}</div>
          <div className="text-[8px] text-gray-600">{t('redteam.history.leaks')}</div>
        </div>
        <div>
          <div className="text-sm font-bold font-mono text-orange-400">{s.rule_bypasses || 0}</div>
          <div className="text-[8px] text-gray-600">{t('redteam.history.bypass')}</div>
        </div>
        <div>
          <div className="text-sm font-bold font-mono text-red-400">{s.injection_successes || 0}</div>
          <div className="text-[8px] text-gray-600">{t('redteam.history.inject')}</div>
        </div>
      </div>
    </div>
  );
}

function ScenarioContent(props) {
  var t = props.t;
  var d = props.data;
  var hasBreach = d.breach_point !== null && d.breach_point !== undefined;
  var stepsColor = (d.steps_passed || 0) > 0 ? 'text-red-400' : 'text-green-400';
  return (
    <div className="mt-2 space-y-1">
      <div className="text-xs text-gray-300 font-bold truncate">{d.scenario_name || d.scenario_id || '—'}</div>
      <div className="text-[10px] text-gray-500">
        {t('redteam.history.steps') + ' '}
        <span className={'font-mono ' + stepsColor}>
          {(d.steps_passed || 0) + '/' + (d.total_steps || 0)}
        </span>
      </div>
      <div className="text-[10px]">
        {t('redteam.history.breach') + ' '}
        {hasBreach
          ? <span className="text-red-500 font-bold font-mono">{d.breach_point}</span>
          : <span className="text-green-400">{t('redteam.history.none')}</span>
        }
      </div>
    </div>
  );
}

function StudioContent(props) {
  var t = props.t;
  var d = props.data;
  var payloadPreview = d.payload ? (d.payload.length > 60 ? d.payload.substring(0, 60) + '...' : d.payload) : '—';
  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center gap-1 flex-wrap">
        {d.attackType && (
          <span className="text-[9px] px-1 py-0.5 rounded bg-gray-800 text-gray-300">{d.attackType}</span>
        )}
        {d.mode && (
          <span className="text-[9px] px-1 py-0.5 rounded bg-gray-800 text-gray-400">{d.mode}</span>
        )}
      </div>
      <div className="text-[9px] text-gray-500 italic truncate">{payloadPreview}</div>
      <div className="flex items-center gap-2">
        {d.svc !== undefined && d.svc !== null && (
          <span className="font-mono text-cyan-400 text-[10px]">{'SVC: ' + d.svc}</span>
        )}
        {d.breach === true
          ? <span className="text-red-500 text-[9px] font-bold">{t('redteam.history.breachLabel')}</span>
          : <span className="text-green-400 text-[9px] font-bold">{t('redteam.history.blocked')}</span>
        }
      </div>
    </div>
  );
}

function ExpandedDetail(props) {
  var t = props.t;
  var entry = props.entry;
  var d = entry.data || {};

  if (entry.type === 'campaign') {
    var s = d.summary || {};
    return (
      <div className="border-t border-gray-800 mt-2 pt-2 text-[10px] text-gray-500 space-y-1">
        <div>{t('redteam.history.totalRounds') + ': ' + (s.total_rounds || 0)}</div>
        <div>{t('redteam.history.leaks') + ': ' + (s.prompt_leaks || 0)}</div>
        <div>{t('redteam.history.bypass') + ': ' + (s.rule_bypasses || 0)}</div>
        <div>{t('redteam.history.inject') + ': ' + (s.injection_successes || 0)}</div>
      </div>
    );
  }

  if (entry.type === 'scenario') {
    return (
      <div className="border-t border-gray-800 mt-2 pt-2 text-[10px] text-gray-500 space-y-1">
        <div>{t('redteam.history.scenarioId') + ': ' + (d.scenario_id || '—')}</div>
        <div>{t('redteam.history.steps') + ' ' + (d.steps_passed || 0) + '/' + (d.total_steps || 0)}</div>
        {d.breach_point !== null && d.breach_point !== undefined && (
          <div>{t('redteam.history.breach') + ' ' + d.breach_point}</div>
        )}
      </div>
    );
  }

  if (entry.type === 'studio') {
    return (
      <div className="border-t border-gray-800 mt-2 pt-2 text-[10px] text-gray-500 space-y-1">
        {d.mode && <div>{t('redteam.history.mode') + ': ' + d.mode}</div>}
        {d.payload && <div>{t('redteam.history.payload') + ': ' + d.payload}</div>}
        {d.svc !== undefined && d.svc !== null && <div>{'SVC: ' + d.svc}</div>}
      </div>
    );
  }

  return null;
}

export default function HistoryCard(props) {
  var entry = props.entry;
  var expanded = props.expanded;
  var onToggle = props.onToggle;
  var ref = useTranslation();
  var t = ref.t;
  var i18n = ref.i18n;
  var locale = LOCALE_MAP[i18n.language] || 'en-US';
  var dateStr = new Date(entry.date).toLocaleDateString(locale, DATE_OPTS);
  var breached = getBreach(entry);
  var Chevron = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      className="border border-gray-800 rounded p-3 bg-[#111] cursor-pointer hover:border-gray-700 transition-colors"
      onClick={function () { onToggle(entry.id); }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Chevron size={12} className="text-gray-600" />
          <span className="text-[10px] text-gray-400 font-mono">{dateStr}</span>
        </div>
        <div className="flex items-center gap-2">
          <TypeBadge t={t} type={entry.type} />
          <span className={'w-2 h-2 rounded-full ' + (breached ? 'bg-red-500' : 'bg-green-500')} />
        </div>
      </div>

      {entry.type === 'campaign' && <CampaignContent t={t} data={entry.data || {}} />}
      {entry.type === 'scenario' && <ScenarioContent t={t} data={entry.data || {}} />}
      {entry.type === 'studio' && <StudioContent t={t} data={entry.data || {}} />}

      {expanded && <ExpandedDetail t={t} entry={entry} />}
    </div>
  );
}
