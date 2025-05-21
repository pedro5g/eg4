import {
  ChevronRight,
  Download,
  File,
  FilePlus,
  Folder,
  FolderOpen,
  Trash,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  SidebarMenuButton,
  sidebarMenuButtonVariants,
  SidebarMenuItem,
  SidebarMenuSub,
} from "../ui/sidebar";
import { TreeNode } from "@/api/types";
import { Csv, ImageIcon, PDF, TextIcon } from "../icons";
import { cn } from "@/lib/utils";
import { useConfirmDeleteFiles } from "../modals/confirm-delete-file";
import { useUploadClientFileModal } from "../modals/upload-client-file-modal";

const iconResolve = (extension: string) => {
  if (extension === "pdf") return <PDF />;
  if (extension === "txt") return <TextIcon />;
  if (["cvs", "xlsx"].includes(extension)) return <Csv />;
  if (["svg", "jpeg", "png", "jpg", "webp", "gif"].includes(extension))
    return <ImageIcon />;

  return <File />;
};

const fileNameResolver = (filename: string) => {
  if (filename.length < 15) return filename;
  const [name, ext] = filename.split(".");

  return name.substring(0, 8).concat("...", ext);
};

export const FileTree = ({
  item,
  clientId,
}: {
  item: TreeNode;
  clientId: string;
}) => {
  const { alert } = useConfirmDeleteFiles();
  const { onOpen } = useUploadClientFileModal();

  if (item.type === "file") {
    const [_, extension] = item.name.split(".");
    return (
      <SidebarMenuButton asChild className="data-[active=true]:bg-transparent">
        <div className="inline-flex items-center justify-between group">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              sidebarMenuButtonVariants({
                variant: "default",
                size: "default",
              }),
              "w-[150px] truncate"
            )}>
            {iconResolve(extension)}
            {fileNameResolver(item.name)}
          </a>
          <div className="flex items-center gap-2 [&_svg]:size-4 [&_svg]:text-zinc-600">
            <a
              className="hidden group-hover:block text-sm transition-transform cursor-pointer"
              download={item.name}
              href={`${item.url}?download=true`}>
              <Download />
            </a>
            <button
              onClick={() => alert(item.id, item.clientId)}
              className="hidden group-hover:block text-sm transition-transform">
              <Trash />
            </button>
          </div>
        </div>
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuItem className="list-none">
      <Collapsible className="group/collapsible [&[data-state=open]>div>button:first-child>svg:first-child]:rotate-90">
        <div
          className={cn(
            sidebarMenuButtonVariants({
              variant: "default",
              size: "default",
            }),
            "inline-flex group items-center justify-between "
          )}>
          <CollapsibleTrigger
            className="data-[state='open']:[&>svg[data-folder='close']]:hidden data-[state='closed']:[&>svg[data-folder='open']]:hidden"
            asChild>
            <button className="[&_svg]:size-4 inline-flex items-center gap-2">
              <ChevronRight className="transition-transform" />
              <Folder data-folder={"close"} />
              <FolderOpen data-folder={"open"} />
              {item.name}
            </button>
          </CollapsibleTrigger>
          <button
            onClick={() => onOpen(clientId, "/" + item.path)}
            className="hidden group-hover:block z-20">
            <FilePlus className="size-4" />
          </button>
        </div>

        <CollapsibleContent className="gap-1">
          <SidebarMenuSub>
            {item.children?.map((subItem, index) => (
              <FileTree key={index} item={subItem} clientId={clientId} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};
