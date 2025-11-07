'use client';
 
import { propagateServerField } from 'next/dist/server/lib/render-server';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function Search(props: {queryVar: string, onTermChange: Function, placeholder: string}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
 

    const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);
    props.onTermChange(term);  
    /*const params = new URLSearchParams(searchParams);
    if (term) {
        params.set(props.queryVar, term);
    } else {
        params.delete(props.queryVar);
    }
    
      replace(`${pathname}?${params.toString()}`);*/
    }, 300);

    return (
    <div className='search'>
      <input
        className="search-field"
        placeholder={props.placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get(props.queryVar)?.toString()}
      />
    </div>
  );
}