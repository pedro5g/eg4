import { Badge } from "@/components/ui/badge";
import { STATUS_MAP } from "./index";
import { CircleCheckBig, CirclePause, Loader, LockKeyhole } from "lucide-react";

export const STATUS_ICON_MAP = {
  ACTIVE: <CircleCheckBig className="text-green-500" />,
  INACTIVE: <CirclePause className="text-sky-500" />,
  BLOCKED: <LockKeyhole className="text-red-500" />,
  PENDING: <Loader />,
};

export const STATUS_OPTIONS = [
  {
    title: (
      <Badge variant="outline" className="text-muted-foreground px-4">
        {STATUS_MAP["ACTIVE"]}
        {STATUS_ICON_MAP["ACTIVE"]}
      </Badge>
    ),
    value: "ACTIVE",
  },
  {
    title: (
      <Badge variant="outline" className="text-muted-foreground px-4">
        {STATUS_MAP["INACTIVE"]}
        {STATUS_ICON_MAP["INACTIVE"]}
      </Badge>
    ),
    value: "INACTIVE",
  },
  {
    title: (
      <Badge variant="outline" className="text-muted-foreground px-4">
        {STATUS_MAP["BLOCKED"]}
        {STATUS_ICON_MAP["BLOCKED"]}
      </Badge>
    ),
    value: "BLOCKED",
  },
  {
    title: (
      <Badge variant="outline" className="text-muted-foreground px-4">
        {STATUS_MAP["PENDING"]}
        {STATUS_ICON_MAP["PENDING"]}
      </Badge>
    ),
    value: "PENDING",
  },
];
