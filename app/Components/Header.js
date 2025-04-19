"use client";
import React from 'react';
import Link from 'next/link';
import styles from '../Styles/Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/">
        <h1>Recipe Finder</h1>
      </Link>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/Favorites">Favorites</Link>
      </nav>
    </header>
  );
}
