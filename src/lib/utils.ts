import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// generate unique id
export const generateUniqueId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 7);
  return timestamp + randomPart;
}

// creation time covert to date and time
export function formatDate(timestamp: number) {
  const dateObj = new Date(timestamp);

  // Components of the date
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours() % 12 || 12; // 12-hour format
  const minutes = dateObj.getMinutes();
  const amPm = dateObj.getHours() >= 12 ? 'pm' : 'am';

  // Format the date and time as you wish
  const formattedDate = `${day} ${month} ${year}  ${hours}:${minutes.toString().padStart(2, '0')} ${amPm}`;

  return formattedDate;
}