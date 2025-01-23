'use client';

import Link from "next/link";
import React from "react";

interface IActiveLink {
  path: string;
  text: string;
}

const ActiveLink = ({ path, text }: IActiveLink) => {
  return (
    <Link className="mr-2" href={path}>
      {text +5}
    </Link>
  );
};

export default ActiveLink;
