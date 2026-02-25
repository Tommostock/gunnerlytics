interface ManagerHistoryProps {
  managers: string[];
  captain: boolean;
  captainYears?: string;
}

export function ManagerHistory({ managers, captain, captainYears }: ManagerHistoryProps) {
  return (
    <div className="space-y-3">
      {captain && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-arsenal-gold/10 border border-arsenal-gold/30">
          <span className="text-lg">©</span>
          <div>
            <div className="text-sm font-bold text-arsenal-gold">Club Captain</div>
            {captainYears && (
              <div className="text-xs text-surface-500">{captainYears}</div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="text-xs text-surface-500 uppercase font-medium">
          Played Under
        </div>
        <div className="flex flex-wrap gap-2">
          {managers.map((m) => (
            <span
              key={m}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-100 dark:bg-surface-900 text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-800"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
