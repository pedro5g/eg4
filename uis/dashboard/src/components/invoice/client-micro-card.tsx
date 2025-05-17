import { formatPhone, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface ClientMicroCardProps {
  name: string;
  email: string | null;
  phone: string | null;
  areaCode: string | null;
  type: string | null;
  address: string;
}

export const ClientMicroCard = ({
  name,
  address,
  email,
  areaCode,
  phone,
  type,
}: ClientMicroCardProps) => {
  return (
    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 animate-in transition-all duration-200 ease-in">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-blue-100 text-blue-700">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-blue-700">{name}</h3>
            {type && (
              <Badge variant="outline" className="bg-blue-100">
                {
                  {
                    J: "Pessoa Jurídica",
                    F: "Pessoa Física",
                  }[type]
                }
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground mt-1">{address}</div>
          <div className="flex items-center gap-4 mt-1 text-sm">
            {email && <span className="text-muted-foreground">{email}</span>}
            {phone && areaCode && (
              <span className="text-muted-foreground">
                {formatPhone(areaCode + phone)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
