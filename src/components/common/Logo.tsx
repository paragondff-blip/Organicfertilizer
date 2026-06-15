export default function Logo() {
  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="24" fill="currentColor" />
      <path 
        d="M30 40C30 34.4772 34.4772 30 40 30H60C65.5228 30 70 34.4772 70 40V60C70 65.5228 65.5228 70 60 70H40C34.4772 70 30 65.5228 30 60V40Z" 
        stroke="white" 
        strokeWidth="4"
      />
      <circle cx="42" cy="42" r="4" fill="white" />
      <circle cx="58" cy="42" r="4" fill="white" />
      <circle cx="42" cy="58" r="4" fill="white" />
      <circle cx="58" cy="58" r="4" fill="white" />
      <circle cx="50" cy="50" r="4" fill="white" />
    </svg>
  );
}
