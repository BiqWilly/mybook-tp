export default function AvailabilityBadge({ status }) {
  let colorClass = "";
  switch (status) {
    case "Available": colorClass = "bg-green-500"; break;
    case "Require Queue": colorClass = "bg-amber-400"; break;
    case "Unavailable": colorClass = "bg-red-600"; break;
    default: colorClass = "bg-gray-400";
  }
  return <span className={`inline-block w-3 h-3 rounded-full ${colorClass}`}></span>;
}