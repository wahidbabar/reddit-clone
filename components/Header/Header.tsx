import React from "react";

import Image from "next/image";
import {
  HomeIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  BellIcon,
  PlusIcon,
  SparklesIcon,
  VideoCameraIcon,
  GlobeAsiaAustraliaIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

function Header() {
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 z-50 flex bg-white py-2 px-4 shadow-sm">
      <div className="relative h-10 w-20 flex-shrink-0 cursor-pointer">
        <Link href="/">
          <Image
            src="/Reddit-Logo.png"
            alt="Reddit Logo"
            width={80}
            height={80}
            objectFit="contain"
          />
        </Link>
      </div>

      <div className="flex items-center mx-7 xl:min-w-[300px]">
        <HomeIcon className="h-5 w-5" />
        <p className="hidden ml-2 flex-1 lg:inline">Home</p>
        <ChevronDownIcon className="h-5 w-5" />
      </div>

      {/* Search Box */}
      <form className="flex flex-1 items-center space-x-2 bg-gray-100 rounded-sm px-3 py-1 border-gray-200">
        <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
        <input
          className="flex-1 bg-transparent outline-none"
          type="text"
          placeholder="Search Reddit"
        />
        <button hidden type="submit" />
      </form>

      <div className="mx-5 space-x-2 items-center hidden lg:inline-flex text-gray-500">
        <SparklesIcon className="icon" />
        <GlobeAsiaAustraliaIcon className="icon" />
        <VideoCameraIcon className="icon" />
        <hr className="h-10 border border-gray-100" />
        <ChatBubbleOvalLeftEllipsisIcon className="icon" />
        <BellIcon className="icon" />
        <PlusIcon className="icon" />
        <MegaphoneIcon className="icon" />
      </div>
      <div className="ml-5 flex items-center lg:hidden">
        <Bars3Icon className="icon" />
      </div>

      {/* Sign in/ Sign out button */}
      {session ? (
        <div
          onClick={() => signOut()}
          className="hidden lg:flex items-start space-x-2 border cursor-pointer border-gray-100 p-2"
        >
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image
              className="object-fit"
              src="https:links.papareact.com/23l"
              alt=""
              width={80}
              height={80}
            />
          </div>

          <div className="flex-1 text-xs">
            <p className="truncate">{session.user?.name}</p>
            <p className="text-gray-400">1 Karma</p>
          </div>
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        </div>
      ) : (
        <div
          onClick={() => signIn()}
          className="hidden lg:flex items-start space-x-2 border border-gray-100 p-2 cursor-pointer"
        >
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image
              className="object-fit"
              src="https:links.papareact.com/23l"
              alt=""
              width={80}
              height={80}
            />
          </div>
          <p className="text-gray-400">Sign In</p>
        </div>
      )}
    </div>
  );
}

export default Header;
