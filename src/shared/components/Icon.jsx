import {
  User,
  Mail,
  IdCard,
  ShieldCheck,
  Lock,
  Phone,
  MapPin,
  Calendar,
  AtSign,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";

export const ICONS = {
  user: User,
  mail: Mail,
  id: IdCard,
  shield: ShieldCheck,
  lock: Lock,
  phone: Phone,
  location: MapPin,
  calendar: Calendar,
  at: AtSign,
  eye: Eye,
  "eye-off": EyeOff,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  check: Check,
};

export function Icon({ name }) {
  const LucideIcon = ICONS[name];
  if (!LucideIcon) return null;
  return <LucideIcon strokeWidth={1.8} aria-hidden="true" />;
}