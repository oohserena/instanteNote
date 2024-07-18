"use client";

import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { menu } from "@/app/data/menu";
import { BiPlus, BiListUl, BiCog, BiHome } from "react-icons/bi";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { user } = useUser();
  const currentRoute = usePathname();

  function getIcon(icon: string) {
    switch (icon) {
      case "list":
        return <BiListUl />;
      case "plus":
        return <BiPlus />;
      case "cog":
        return <BiCog />;
      default:
        return <BiHome />;
    }
  }
  return user ? (
    <div className="bg-white border border-gray-100 py-2 flex flex-shrink-0 flex-row justify-around md:justify-start md:flex-col md:h-full md:w-32 z-10">
      {menu.map((item, index) => (
        <Link
          href={item.route}
          key={index}
          className="flex flex-row items-center relative hover:bg-green-50 px-4 py-2 cursor-pointer group"
        >
          <div className="flex flex-row items-center">
            {currentRoute === item.route && (
              <div className="absolute hidden md:block h-full w-2 bg-green-600 rounded-full -left-1"></div>
            )}
            {currentRoute === item.route && (
              <div className="absolute block md:hidden h-2 w-full bg-green-600 rounded-full -top-3 left-0"></div>
            )}
            <span className="text-gray-500 text-xl group-hover:text-green-600">
              {getIcon(item.icon)}
            </span>
            <span className="ml-2 text-gray-500 group-hover:text-green-600">
              {item.text}
            </span>
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <div className="md:w-32"></div>
  );
}