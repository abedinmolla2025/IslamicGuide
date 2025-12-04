interface IconProps {
  className?: string;
  size?: number;
}

export function MosqueIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3L12 5" />
      <path d="M12 5C8 5 5 8 5 11V21H19V11C19 8 16 5 12 5Z" />
      <path d="M5 21H19" />
      <path d="M9 21V17C9 15.343 10.343 14 12 14C13.657 14 15 15.343 15 17V21" />
      <circle cx="12" cy="9" r="1.5" fill="currentColor" />
      <path d="M2 21H5" />
      <path d="M19 21H22" />
      <path d="M3 14V21" />
      <path d="M21 14V21" />
      <path d="M3 14L3 12C3 11 3.5 10 4 10" />
      <path d="M21 14L21 12C21 11 20.5 10 20 10" />
    </svg>
  );
}

export function DuaHandsIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 15C7 15 6 13 6 11C6 9 7 7 7 5C7 3.5 8 2 9.5 2C11 2 12 3 12 4.5" />
      <path d="M17 15C17 15 18 13 18 11C18 9 17 7 17 5C17 3.5 16 2 14.5 2C13 2 12 3 12 4.5" />
      <path d="M12 4.5V8" />
      <path d="M7 15C7 17 8 19 10 20C11 20.5 12 21 12 22" />
      <path d="M17 15C17 17 16 19 14 20C13 20.5 12 21 12 22" />
      <path d="M9 11L9 13" />
      <path d="M15 11L15 13" />
    </svg>
  );
}

export function HadithScrollIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 3C5 3 4 3 4 4V18C4 19 5 20 6 20H16C17 20 18 19 18 18V6" />
      <path d="M18 6C18 4 20 3 20 3" />
      <path d="M5 3C5 3 7 3 8 4C9 5 9 6 9 6" />
      <path d="M18 6H9" />
      <path d="M20 3V17C20 19 18 21 16 21H8C6 21 4 19 4 17" />
      <path d="M8 10H14" />
      <path d="M8 13H14" />
      <path d="M8 16H11" />
      <circle cx="16" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

export function QuranBookIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5C4 18.837 4.263 18.201 4.732 17.732C5.201 17.263 5.837 17 6.5 17H20" />
      <path d="M6.5 2H20V22H6.5C5.837 22 5.201 21.737 4.732 21.268C4.263 20.799 4 20.163 4 19.5V4.5C4 3.837 4.263 3.201 4.732 2.732C5.201 2.263 5.837 2 6.5 2Z" />
      <path d="M12 6L12 12" />
      <path d="M9 9L15 9" />
      <circle cx="12" cy="15" r="1" fill="currentColor" />
    </svg>
  );
}

export function SurahListIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 7H17" />
      <path d="M7 12H17" />
      <path d="M7 17H13" />
      <circle cx="16" cy="17" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function QiblaCompassIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2V4" />
      <path d="M12 20V22" />
      <path d="M2 12H4" />
      <path d="M20 12H22" />
      <path d="M12 8L14 12L12 16L10 12L12 8Z" fill="currentColor" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function HijriCalendarIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2V6" />
      <path d="M8 2V6" />
      <path d="M3 10H21" />
      <path d="M14 15C14 15 15 14 16 14C17.5 14 18 15.5 17 16.5C16 17.5 14 18 14 18" />
      <circle cx="9" cy="15" r="1" fill="currentColor" />
    </svg>
  );
}

export function TasbihIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="5" r="2" />
      <circle cx="7" cy="7" r="1.5" />
      <circle cx="5" cy="11" r="1.5" />
      <circle cx="5" cy="15" r="1.5" />
      <circle cx="7" cy="19" r="1.5" />
      <circle cx="12" cy="21" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
      <circle cx="19" cy="15" r="1.5" />
      <circle cx="19" cy="11" r="1.5" />
      <circle cx="17" cy="7" r="1.5" />
      <path d="M12 3V1" />
    </svg>
  );
}

export function NamesIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6C10 6 8 8 8 10C8 12 10 13 12 13C14 13 16 14 16 16C16 18 14 20 12 20" />
      <path d="M12 6V4" />
      <path d="M12 20V22" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

export function HomeIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.552 5.448 21 6 21H9M19 10L21 12M19 10V20C19 20.552 18.552 21 18 21H15M9 21C9.552 21 10 20.552 10 20V16C10 15.448 10.448 15 11 15H13C13.552 15 14 15.448 14 16V20C14 20.552 14.448 21 15 21M9 21H15" />
      <path d="M12 3L12 1" />
      <circle cx="12" cy="1" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function PrayerTimesIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6V12L16 14" />
      <path d="M12 2C12 2 14 4 14 5C14 6 13 6.5 12 6.5C11 6.5 10 6 10 5C10 4 12 2 12 2Z" fill="currentColor" />
    </svg>
  );
}
