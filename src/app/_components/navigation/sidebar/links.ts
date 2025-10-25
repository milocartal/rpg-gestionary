import {
  Binary,
  Blocks,
  BookMarked,
  FileClock,
  FileKey,
  Landmark,
  Mouse,
  Newspaper,
  NotebookTabs,
  Origami,
  PawPrint,
  ReceiptText,
  Scale,
  ScrollText,
  Transgender,
  UsersRound,
  VenetianMask,
} from "lucide-react";
import type { GroupedNavLink } from "./type";

const universesDefaultLinks: GroupedNavLink[] = [
  {
    groupTitle: "Détails de l'univers",
    defaultOpen: true,
    links: [
      {
        title: "Contexte",
        href: "/context",
        icon: ScrollText,
      },
      {
        title: "Histoires",
        href: "/stories",
        icon: BookMarked,
      },
      {
        title: "Populations",
        href: "/populations",
        icon: VenetianMask,
      },
      {
        title: "Espèces",
        href: "/species",
        icon: PawPrint,
      },
      {
        title: "Classes",
        href: "/classes",
        icon: Landmark,
      },
    ],
  },
  {
    groupTitle: "Mes personnages",
    defaultOpen: true,
    links: [
      {
        title: "Personnages",
        href: "/characters",
        icon: ReceiptText,
      },
      {
        title: "Familiers",
        href: "/pets",
        icon: Origami,
      },
    ],
  },
];

const universesMasterLinks: GroupedNavLink[] = [
  {
    groupTitle: "Détails de l'univers",
    defaultOpen: true,
    links: [
      {
        title: "Contexte",
        href: "/context",
        icon: ScrollText,
      },
      {
        title: "Histoires",
        href: "/stories",
        icon: BookMarked,
      },
      {
        title: "Populations",
        href: "/populations",
        icon: VenetianMask,
      },
      {
        title: "Espèces",
        href: "/species",
        icon: PawPrint,
      },
      {
        title: "Attributs",
        href: "/attributes",
        icon: Binary,
      },
      {
        title: "Compétences",
        href: "/skills",
        icon: Blocks,
      },
      {
        title: "Classes",
        href: "/classes",
        icon: Landmark,
      },
      {
        title: "Genres",
        href: "/genders",
        icon: Transgender,
      },
      {
        title: "Objects",
        href: "/items",
        icon: Origami,
      },
      {
        title: "Personnages",
        href: "/characters",
        icon: ReceiptText,
      },
      {
        title: "Familiers",
        href: "/pets",
        icon: Origami,
      },
    ],
  },
  {
    groupTitle: "Administration de l'univers",
    defaultOpen: true,
    links: [
      {
        title: "Membres",
        href: "/members",
        icon: UsersRound,
      },
      {
        title: "Événements",
        href: "/events",
        icon: Newspaper,
      },
      {
        title: "PNJs",
        href: "/npcs",
        icon: ReceiptText,
      },
    ],
  },
];

const adminLinks: GroupedNavLink = {
  groupTitle: "Administration",
  defaultOpen: true,
  links: [
    {
      title: "Utilisateurs",
      href: "/admin/users",
      icon: UsersRound,
    },
    {
      title: "Univers",
      href: "/admin/univers",
      icon: BookMarked,
    },
    {
      title: "Logs",
      href: "/admin/logs",
      icon: FileClock,
    },
    {
      title: "Contacts",
      href: "/admin/contacts",
      icon: NotebookTabs,
    },
  ],
};

const legalsLinks: GroupedNavLink = {
  groupTitle: "Documents légaux",
  defaultOpen: true,
  links: [
    {
      title: "Mentions légales",
      label: "",
      icon: Scale,
      href: "/mentions-legales",
    },
    {
      title: "CGU",
      label: "",
      icon: Mouse,
      href: "/cgu",
    },
    {
      title: "Politique de confidentialité",
      label: "",
      icon: FileKey,
      href: "/politique-confidentialite",
    },
  ],
};

export { universesDefaultLinks, universesMasterLinks, adminLinks, legalsLinks };
