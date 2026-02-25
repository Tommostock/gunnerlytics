import type { Player } from "@/types";

interface TransferHistoryProps {
  player: Player;
}

export function TransferHistory({ player }: TransferHistoryProps) {
  const { arsenalCareer } = player;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-semibold text-surface-900 dark:text-surface-100">
            Signed from {arsenalCareer.signedFrom}
          </div>
          <div className="text-xs text-surface-500">
            {arsenalCareer.startYear} &middot; {arsenalCareer.transferFeeIn}
          </div>
        </div>
      </div>

      {arsenalCareer.soldTo && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-surface-900 dark:text-surface-100">
              Left for {arsenalCareer.soldTo}
            </div>
            <div className="text-xs text-surface-500">
              {arsenalCareer.endYear} &middot;{" "}
              {arsenalCareer.transferFeeOut || "Free"}
            </div>
          </div>
        </div>
      )}

      {!arsenalCareer.soldTo && !arsenalCareer.endYear && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-arsenal-red/5 border border-arsenal-red/20">
          <div className="w-8 h-8 rounded-full bg-arsenal-red flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm font-semibold text-arsenal-red">
            Currently at Arsenal
          </div>
        </div>
      )}

      {!arsenalCareer.soldTo && arsenalCareer.endYear && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
          <div className="w-8 h-8 rounded-full bg-surface-400 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-surface-900 dark:text-surface-100">
              Retired at Arsenal
            </div>
            <div className="text-xs text-surface-500">{arsenalCareer.endYear}</div>
          </div>
        </div>
      )}
    </div>
  );
}
