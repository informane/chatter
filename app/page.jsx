import Image from "next/image";
import styles from "./page.module.css";
import Chatter from './chatter/page';
import { Suspense } from 'react';
export default function Home({ searchParams }) {
    return (<Suspense fallback={<>...</>}>
      <Chatter searchParams={searchParams}/>
    </Suspense>);
}
