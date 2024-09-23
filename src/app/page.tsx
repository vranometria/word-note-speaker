"use client";
import Link from 'next/link';
import { bindClasses } from './util';

export default function Home() {
  return (
    <div className="page-root">
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            <a className={"common-button"}>
              <Link href="/register">Register Question</Link>
            </a>
            <a className={"common-button"}>
              <Link href="/tags">Edit Tags</Link>
            </a>
            <a className={bindClasses("common-button","mt-10")}>
              <Link href="/questions">Training Start</Link>
            </a>
          </main>
    </div>
  );
}