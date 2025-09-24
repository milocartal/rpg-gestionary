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
    defaultOpen: false,
    links: [
      {
        title: "Personnages",
        href: "/characters",
        icon: ReceiptText,
      },
      {
        title: "Compagnons",
        href: "/companions",
        icon: Origami,
      },
    ],
  },
];

const universesManagerLinks: GroupedNavLink[] = [
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
    ],
  },
  {
    groupTitle: "Administration de l'univers",
    defaultOpen: false,
    links: [
      {
        title: "Utilisateurs",
        href: "/users",
        icon: UsersRound,
      },
      {
        title: "Evenements",
        href: "/events",
        icon: Newspaper,
      },
    ],
  },
];

const adminLinks: GroupedNavLink = {
  groupTitle: "Administration",
  defaultOpen: false,
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

export {
  universesDefaultLinks,
  universesManagerLinks,
  universesMasterLinks,
  adminLinks,
  legalsLinks,
};
