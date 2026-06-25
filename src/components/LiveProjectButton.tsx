interface LiveProjectButtonProps {
  extraClass?: string;
}

export function LiveProjectButton({ extraClass = '' }: LiveProjectButtonProps) {
  return (
    <button
      className={`px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base font-medium uppercase tracking-widest rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] hover:bg-[#D7E2EA]/10 transition-colors duration-200 ${extraClass}`}
      style={{ cursor: 'pointer', background: 'transparent' }}
    >
      Live Project
    </button>
  );
}
